var sitemap = require('sitemap');
var App = require('../models/app.js');

var HOSTNAME = 'http://playmygame.herokuapp.com';

var sm = sitemap.createSitemap({
    hostname: HOSTNAME,
    cacheTime: 1000 * 60 * 24  //keep the sitemap cached for 24 hours
});


function sendSitemap(res){
    sm.toXML(function(xml){
        res.header('Content-Type', 'application/xml');
        res.send(xml);
    });
}

function appUrls() {

    function makeUrl(app) {
        return {
            url: '/show/' + app.appId + '/',
            changefreq: 'monthly',
            priority: 0.7
        };
    }

    return App.find().exec()
        .then(function(apps) {
            return apps.map(makeUrl);
        });
}

module.exports = function(req, res) {

    if (sm.isCacheValid()) {
        sendSitemap(res);
    } else {
        sm.urls = [];
        sm.add({url: '/about/', changefreq: 'monthly', priority: 0.9});
        sm.add({url: '/submit/', changefreq: 'monthly', priority: 0.5});

        appUrls().then(function(urls) {
            sm.urls = sm.urls.concat(urls);
            sendSitemap(res);
        });
    }
};
