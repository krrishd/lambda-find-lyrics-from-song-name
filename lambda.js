'use strict';

process.env.NODE_CONFIG_DIR = process.env["LAMBDA_TASK_ROOT"];

let request = require('request');
let cheerio = require('cheerio');


module.exports = {
  handler: function(event, context, callback) {
    request.get('https://api.genius.com/search?q=' 
      + event.songName + 
      '&access_token=' + process.env.ACCESS_TOKEN, 
    (err, res, body) => {
      let desiredSongURL = JSON.parse(body)
        .response.hits.filter(a => {
          if (a.result.stats.pageviews) {
            return true;
          }
          return false;
        })[0].result.url;
      
      request.get(desiredSongURL, (errS, resS, bodyS) => {
        let $ = cheerio.load(bodyS);
        callback(null, $('.lyrics').text())
      });
    });
  }
}