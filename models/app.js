var mongoose = require('mongoose');

var appSchema = mongoose.Schema({
    appId: String,
    title: String,
    developer: String,
    url: String,
    icon: String,
    video: String,
    installs: Number,
    score: Number,
    reviews: Number,
    description: String,
    impressions: {type: Number, default: 0},
    installs: {type: Number, default: 0},
    priority: {type: Number, index: true}
});


/*
* Cleans the data scraped from google play and sets it to the doc fields.
* Also updates the priority of the doc based on the new values.
*/
appSchema.methods.setScrapedData = function(data) {
    //clean fields
    delete data["descriptionHTML"];
    data["installs"] = data["minInstalls"];
    delete data["minInstalls"];
    delete data["maxInstalls"];

    this.set(data);
    this.setPriority();
};

appSchema.methods.setPriority = function() {

    var installsScore = this.getInstallsScore();
    var ratingScore = this.getRatingScore();
    var priority;

    if (this.reviewsNonRepresentative()) {
        //consider only installs
        priority = 2.75 * installsScore;
    } else {

        if (this.highReviewRatio()) {
            //more weight to score than installs
            priority = 2 * ratingScore + 1 * installsScore;
        } else {
            //more weight to installs than score
            priority = 1 * ratingScore + 2 * installsScore;
        }
    }

    this.priority = priority + this.videoBoost();
};

/*
* Returns true if the amount of reviews is too low for the score to be
* considered representative of the app's quality.
*/
appSchema.methods.reviewsNonRepresentative = function() {
    return this.reviews < 50;
};

/*
* Give extra points to apps that have a video (no video probably means no
* love on app listing).
*/
appSchema.methods.videoBoost = function() {
    if (this.video) return 5;
    return 0;
};

/*
* Returns true if the amount of reviews is considered high in relatino to the
* amount of installs.
*/
appSchema.methods.highReviewRatio = function() {
    if (!this.reviews) return false;

    //avg seems to be 15~20
    return (this.installs / this.reviews ) < 10;
};

/*
* Normalizes the app's installs to a 0-10 score, giving a better score to the
* less installed apps.
*/
appSchema.methods.getInstallsScore = function() {
    //this abuses the fact that the scraper only gets round estimates
    switch (this.installs) {
        case 0: return 10;
        case 1: return 10;
        case 5: return 10;
        case 50: return 9.5;
        case 100: return 9;
        case 500: return 8;
        case 1000: return 7.5;
        case 5000: return 5;
        case 10000: return 2;
        case 50000: return 1;
        default: throw new Error("unexpected number: " + this.installs);
    }
};

/*
* Normalizes the app's score to 0-10.
*/
appSchema.methods.getRatingScore = function() {
    return this.score * 2;
};

module.exports = mongoose.model('App', appSchema);
