var express = require("express");
var router = express.Router();
var gplay = require("google-play-scraper");
var App = require("../models/app.js");
var winston = require("winston");
var url = require("url");
var qs = require("querystring");

/* GET an application. */
router.get("/", function(req, res) {

    App.count()
        .then(function(count) {

            var skip = (req.query.skip || 0) % count;

            return App.findOne().sort({priority: -1})
                .skip(skip).lean().exec();
        })
        .then(res.json.bind(res));

});

/* POST an application. */
router.post("/", function(req, res) {

    var id = req.body.appId;
    if (!id) return res.status(400).json("Google Play ID missing.");

    //check if it's a full url
    var appUrl = url.parse(id);
    if (appUrl.hostname) {
        id = qs.parse(appUrl.query).id;
        if (!id) return res.status(400).json("Invalid Google Play URL.");
    }

    //TODO handle wrong app id
    gplay(id)
        .catch(function() {
            raise("The given Google Play ID is invalid.");
        })
        .then(validateData)
        .then(saveApp)
        .then(function(data) {
            res.status(201).json(data);
        })
        .catch(function(e) {
            var status = e.status || 500;
            if (status >= 500) {
                winston.error(e);
            }
            res.status(status).json(e.message);
        });

});

function validateData(data) {
    if (data.minInstalls >= 100000) raise("Your game has too many downloads. We don't want it.");
    if (!data.free) raise("Only free games please.");

    return App.findOne({appId: data.appId}).exec().then(function(app) {
        if (app) raise("This game was already submitted.");

        return data;
    });
}

/*
* Creates a new App model, populates it with the scraped data and saves it.
*/
function saveApp(data) {
    var app = new App();
    app.setScrapedData(data);

    return app.save().then(function() {
        return app;
    });
}

//more reusable way to do this?
function raise(msg, status) {
    var status = status || 400;
    var error = new Error(msg);
    error.status = status;
    throw error;
}

module.exports = router;