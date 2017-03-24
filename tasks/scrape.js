const fs = require('fs');
const path = require('path');
const request = require('request');
const cheerio = require('cheerio');
const ENV = require('../env.json');

const TARGET_DOMAIN = 'www.neworleansonline.com';
const TARGET_ROOT = `http://${TARGET_DOMAIN}`;
const TARGETS = {
  'tours': '/neworleans/tours/tours.php',
  'restaurants': '/neworleans/cuisine/restaurants.php',
  'attractions': '/neworleans/attractions/attractions.php',
  'nightlife': '/neworleans/nightlife/nightlife.php'
};
const TARGET_KEYS = Object.keys(TARGETS);

var googleMapsClient = require('@google/maps').createClient({
  key: ENV.GOOGLE_MAPS_API_KEY
});

function scrape(url, outputname) {
  return new Promise((resolve, reject) => {
    request(url, (error, response, html) => {
      if(!error){
        const $ = cheerio.load(html);
        const $content = $('a.listingsTitle');

        let nextURL = $parseNextLink($, url, outputname);
        return $parseItems($, $content, outputname)
          .then((items) => {
            let data = {
              items,
              info: {
                next: nextURL
              }
            };
            console.log('items in this batch resolved', data.items.length);
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

function $parseItems($, $content, outputname) {
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
            category: outputname,
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

function $parseNextLink($, url, outputname) {
  let nextLink = $('img[src*="/images/main/nextPage.gif"]').first().parents('a');
  let nextLinkHref = (nextLink.length) ? nextLink.attr('href') : '';
  console.log('Found next link:', nextLinkHref);
  return nextLinkHref;
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

function resolveOutputName(name) {
  return path.join(__dirname, '/../data', `${name}.json`);
}

function executeScrape(urlroot, url, collection, outputname, finalCallback) {
  console.log(`New Scrape data: ${urlroot} - ${url} - ${outputname}`);
  return scrape(url, outputname)
    .then((data) => {
      console.log(`More data: ${!!data.info.next}`, collection.length, data.info);
      collection.push(data.items);
      if (data.info.next) {
        executeScrape(urlroot, `${urlroot}${data.info.next}`, collection, outputname, finalCallback);
      } else {
        writeScrapedData(outputname, collection);
        console.log(`Finished executeScrape ${outputname}`, !!finalCallback);
        finalCallback(outputname);
      }
    })
    .catch((err) => {
      console.log('error:', err);
    });
}

function writeScrapedData(name, data) {
  let filename = resolveOutputName(name);
  fs.writeFile(filename, JSON.stringify(data), (err) => {
    if (err) throw err;
    console.log(`It's saved!`, filename, name);
  });
}

function scrapeIterator(keyindex) {
  console.log(TARGET_KEYS, keyindex, TARGET_KEYS[keyindex]);
  let outputname = resolveOutputName(TARGET_KEYS[keyindex]);
  if (TARGET_KEYS[keyindex]) {
    console.log('starting: ', outputname);
    let targetURL = `${TARGET_ROOT}${TARGETS[TARGET_KEYS[keyindex]]}`;

    executeScrape(targetURL, targetURL, [], TARGET_KEYS[keyindex], () => {
      console.log('next scrape: ', keyindex + 1);
      scrapeIterator((keyindex + 1));
    })
  } else {
    console.timeEnd('scrape');
  }
}

console.time('scrape');
scrapeIterator(0);

