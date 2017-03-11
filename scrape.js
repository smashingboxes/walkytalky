const fs = require('fs');
const path = require('path');
const request = require('request');
const cheerio = require('cheerio');
const ENV = require('./env.json');

const TARGET_ROOT = 'http://www.neworleansonline.com';
const TARGETS = [
  '/neworleans/cuisine/restaurants.php'
];

var googleMapsClient = require('@google/maps').createClient({
  key: ENV.GOOGLE_MAPS_API_KEY
});

function scrape(url) {
  return new Promise((resolve, reject) => {
    request(url, (error, response, html) => {
      if(!error){
        const $ = cheerio.load(html);
        const $content = $('a.listingsTitle');

        let url = $parseNextLink($);
        return $parseItems($, $content)
          .then((items) => {
            let data = {
              items,
              info: {
                next: url
              }
            };
            console.log('all items resolved', data.items.length);
            resolve(data);
          })
          .catch((err) => {
            reject(err);
            throw err;
          });
      }
      reject(error);
    });
  })
}

function $parseItems($, $content) {
  return Promise.all(
    ($content
      .get()
      .map((ele) => {
        let $ele = $(ele);
        let $wrap = $ele.parent();
        let body = bodySplitter($wrap.html());
        let bodyText = $wrap.text();
        let address = safeAddress(body);

        return geocodeAddress({
            title: $ele.text(),
            body: body,
            //bodyText: bodyText,
            address: address,
            location: { lat: 0, lng: 0 }
          })
          .then((item) => {
            return item;
          })
          .catch((item)=>{
            console.log('geocode error', item.title);
            return item;
          });
      }))
  );
}

function geocodeAddress(item) {
  return new Promise((resolve, reject) => {
    if (!item.address) {
      return resolve(item);
    }
    googleMapsClient.geocode({
        address: item.address
      }, (err, response) => {
        if (!err && response.json.results.length) {
          item.location.lat = response.json.results[0].geometry.location.lat;
          item.location.lng = response.json.results[0].geometry.location.lng;
          console.log(item.location);

          resolve(item);
        } else {
          reject(item);
        }
      });
  });
}

function $parseNextLink($) {
  let nextLink = $('[name="next25"]').first().parents('a');
  return (nextLink.length) ? nextLink.attr('href') : '';
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

function executeScrape(url, collection) {
  scrape(url)
    .then((data) => {
      console.log(`More data: ${!!data.info.next}`, collection.length);
      collection.push(data.items);
      if (data.info.next) {
        executeScrape(`${TARGET_ROOT}${data.info.next}`, collection);
      } else {
        writeScrapedData('restaurants', collection);
      }
    })
    .catch((err) => {
      console.log('error:', err);
    });
}

function writeScrapedData(name, data) {
  fs.writeFile(path.join('data', `${name}.json`), JSON.stringify(data), (err) => {
    if (err) throw err;
    console.log('It\'s saved!');
  });
}

executeScrape(`${TARGET_ROOT}${TARGETS[0]}`, []);
