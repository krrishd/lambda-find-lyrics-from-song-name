process.env.NODE_CONFIG_DIR = process.env["LAMBDA_TASK_ROOT"];
var request = require('request');
var cheerio = require('cheerio');


module.exports = {
  handler: function(event, context, callback) {
    request.get('https://api.genius.com/search?q=' 
      + event.songName + 
      '&access_token=' + process.env.ACCESS_TOKEN, 
    function(err, res, body) {
      desiredSongURL = JSON.parse(body).response.hits.filter(function(a) {
        if (a.result.stats.pageviews) {
            return true;
        }
        return false;
      })[0].result.url;

      request.get(desiredSongURL, function(errS, resS, bodyS) {
        var $ = cheerio.load(bodyS);
        callback(null, $('.lyrics').text())
      });

      ;
    });
  }
}