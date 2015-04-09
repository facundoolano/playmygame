var mongoose = require('mongoose');

var appSchema = mongoose.Schema({
    appId: String,
    title: String,
    developer: String,
    url: String,
    icon: String,
    installs: Number,
    score: Number,
    reviews: Number,
    description: String,
    impressions: {type: Number, default: 0},
    installs: {type: Number, default: 0},
    priority: {type: Number, index: true}
});

//TODO call this automatically on save
appSchema.methods.setPriority = function() {

    var installsScore = this.getInstallsScore();
    var ratingScore = this.getRatingScore();

    if (this.reviewsNonRepresentative()) {
        //consider only installs
        this.priority = 3 * installsScore;
    } else {

        if (this.highReviewRatio()) {
            //more weight to score than installs
            this.priority = 2 * ratingScore + 1 * installsScore;
        } else {
            //more weight to installs than score
            this.priority = 1 * ratingScore + 2 * installsScore;
        }
    }
};

/*
* Returns true if the amount of reviews is too low for the score to be
* considered representative of the app's quality.
*/
appSchema.methods.reviewsNonRepresentative = function() {
    return this.reviews < 100;
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
        case 100: return 9.5;
        case 1000: return 8;
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
