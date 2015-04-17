#!/usr/bin/env node

var mongoose = require('mongoose');
var gplay = require("google-play-scraper");
var App = require("../models/app.js");
var Promise = require("bluebird");

var MONGO_URI = process.env.MONGOLAB_URI || 'mongodb://localhost/playmygame';

mongoose.connect(MONGO_URI);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
    console.log("Connected to mongoose!");

    App.find().exec()
        .then(function(apps) {
            return Promise.map(apps, refresh);
        })
        .all(function() {
            mongoose.disconnect(function() {
                console.log("done");
            });
        });

});


function refresh(app) {
    console.log("Processing:", app.appId);
    return gplay(app.appId)
        .then(function(data) {
            if (data.minInstalls >= 100000 || !data.free) {
                return app.remove().then(function() {
                    throw new Error("App no longer valid, removed: " + app.appId);
                });
            }
            return data;
        })
        .then(function(data) {
            app.setScrapedData(data);
            return app.save();
        })
        .catch(function(e){
            console.log(app.appId, "failed");
            console.log(e);
        });
}