var api = require('../lib/api');

// var cbot = api.cleverbot();
// cbot.think('Hi', function(err, res){
//   if(err){
//     console.error('error', err);
//   }
//   console.log(res);
//   cbot.think('What about you?', function(err, res){
//     console.log(res);
//   });
// });

var pbot = api.pandorabot('b0dafd24ee35a477');
console.log(pbot.vars);
pbot.think('Hi', function(err, res){
  if(err){
    console.error('error', err);
  }
  console.log(res);
});

// var request = require('request');
// request('http://www.cleverbot.com/webservicemin?start=y', function(err, res, body){
//   console.log('r', body);
// });
// request('http://www.cleverbot.com/webservicemin?sub=Say&stimulus=Hello%21+Have+you+a+question+for+me%3F&islearning=1&start=y&icognoid=wsf&cleanslate=false&fno=0&icognocheck=81d7212476665bac07d6e0f357d2df44', function(err, res, body){
//   console.log('r2', body);
// });