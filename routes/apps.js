var express = require("express");
var router = express.Router();
var gplay = require("google-play-scraper");
var App = require("../models/app.js");
var winston = require('winston');

/* GET an application. */
router.get("/", function(req, res) {
    res.send("respond with a resource");
});

/* POST an application. */
router.post("/", function(req, res) {

    var id = req.body.appId;
    if (!id) return res.status(400).json("Google Play ID missing.");

    //TODO handle wrong app id
    gplay(id)
        .catch(function(){
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
    if (data.minInstalls >= 100000) raise("Your app has too many downloads. We don't want it.");

    return App.findOne({appId: data.appId}).exec().then(function(app) {
        if (app) raise("This app was already submitted.");

        return data;
    });
}

function saveApp(data) {
    //clean fields
    delete data["descriptionHTML"];
    data["installs"] = data["minInstalls"];
    delete data["minInstalls"];
    delete data["maxInstalls"];

    var app = new App(data);
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