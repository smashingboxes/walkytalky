var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();


function scrape(url) {
  return new Promise((resolve, reject) => {
    request(url, function(error, response, html){
      if(!error){
        var $ = cheerio.load(html);

        console.log('no error');

        var $content = $('a.listingsTitle');

        console.log($content.length);

        let items = $content
          .get()
          .map(function (ele) {
            let $ele = $(ele);
            let $wrap = $ele.parent();
            let body = bodySplitter($wrap.html());
            let address = safeAddress(body)

            return {
              title: $ele.text(),
              body: body,
              address: address
            };
          });

        resolve(items);
      }
      reject(error);
    });
  });
}

function safeAddress(body) {
  return ((body[1]) ?
    (body[1].match(/.+\[/gi)) ? body[1].match(/.+\[/gi)[0].replace('[','') : ''
  : '').trim()
}

function bodySplitter(html) {
  return html.replace(/<br>/gi, '%%%')
    .replace(/<br\/>/gi, '%%%')
    .replace(/<br \/>/gi, '%%%')
    //.replace(/<strong>/gi, '%%%')
    //.replace(/<\/strong>/gi, '%%%')
    .replace(/\r/g, ' ')
    .replace(/\n/g, ' ')
    .split('%%%')
    .filter((item) => !!item)
    .map((item) => item.trim());
}

app.get('/scrape', function(req, res){



  res.send('hi');
})

//app.listen('8081');

console.log('Magic happens on port 8081');

scrape('http://www.neworleansonline.com/neworleans/cuisine/restaurants.php')
  .then((data) => {
    console.log( data );
  });

module.exports = app;
