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
    installs: {type: Number, default: 0}
});

module.exports = mongoose.model('App', appSchema);
