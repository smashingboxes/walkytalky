var express = require('express');
var app     = express();

app.get('/scrape', function(req, res){
  res.send('hi');
})

app.listen('8081');
console.log('Magic happens on port 8081');

module.exports = app;
