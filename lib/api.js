/**
 * Dependencies.
 */
var request = require('request')
  , crypto = require('crypto')
  , querystring = require('querystring')
  , uuid = require('node-uuid')
  , xml = require('xml2js');

/**
 * Utilities. TODO: I don't think these are really necessary...
 * These are just fancy way of saying strings[index] while checking for overflow.
 * Cleverbot already provides all 23 fields -- need to test if Jabberwacky does.
 */
var utils = {
  string_at_index: function(strings, index){
    if(strings.length > index){
      return strings[index];
    } else {
      return '';
    }
  }
};

/**
 * Cleverbot+Jabberwacky implementation.
 */
var _chatbot = function(url, end_index){
  this.url = url;
  this.end_index = end_index;
  this.vars = {
    start: 'y',
    icognoid: 'wsf',
    fno: '0',
    sub: 'Say',
    islearning: '1',
    cleanslate: 'false'
  };
};
_chatbot.prototype.think = function(thought, callback){
  this.vars.stimulus = thought;

  var query = querystring.stringify(this.vars);
  var check = crypto.createHash('md5').update(query.substring(9, this.end_index)).digest('hex');
  query += '&icognocheck=' + check;

  request({
    url: this.url + '/webservicemin',
    method: 'POST',
    body: query,
  }, (function(err, res, body){
    if(err){
      return callback(err, null);
    }
    body = body.split('\r');


    // this.vars.?? = utils.string_at_index(body, 0);
    this.vars.sessionid = utils.string_at_index(body, 1);
    this.vars.logurl = utils.string_at_index(body, 2);
    this.vars.vText8 = utils.string_at_index(body, 3);
    this.vars.vText7 = utils.string_at_index(body, 4);
    this.vars.vText6 = utils.string_at_index(body, 5);
    this.vars.vText5 = utils.string_at_index(body, 6);
    this.vars.vText4 = utils.string_at_index(body, 7);
    this.vars.vText3 = utils.string_at_index(body, 8);
    this.vars.vText2 = utils.string_at_index(body, 9);
    this.vars.prevref = utils.string_at_index(body, 10);
    // this.vars.?? = utils.string_at_index(body, 11);
    this.vars.emotionalhistory = utils.string_at_index(body, 12);
    this.vars.ttsLocMP3 = utils.string_at_index(body, 13);
    this.vars.ttsLocTXT = utils.string_at_index(body, 14);
    this.vars.ttsLocTXT3 = utils.string_at_index(body, 15);
    this.vars.ttsText = utils.string_at_index(body, 16);
    this.vars.lineRef = utils.string_at_index(body, 17);
    this.vars.lineURL = utils.string_at_index(body, 18);
    this.vars.linePOST = utils.string_at_index(body, 19);
    this.vars.lineChoices = utils.string_at_index(body, 20);
    this.vars.lineChoicesAbbrev = utils.string_at_index(body, 21);
    this.vars.typingData = utils.string_at_index(body, 22);
    this.vars.divert = utils.string_at_index(body, 23);

    callback(null, utils.string_at_index(body, 16));
  }).bind(this));
};

/**
 * Pandorabot implementation.
 */
var _pandorabot = function(botid){
  this.vars = {
    botid: botid,
    custid: uuid.v1()
  };
};
_pandorabot.prototype.think = function(thought, callback){
  this.vars.input = thought;

  request({
    url: 'http://www.pandorabots.com/pandora/talk-xml',
    method: 'GET',
    qs: this.vars,
  }, (function(err, res, body){
    if(err){
      return callback(err, null);
    }
    xml.parseString(body, function(err, result){
      if(err){
        return callback(err, null);
      }
      callback(null, result);
    });
  }).bind(this));
};

/**
 * Expose module.
 */
module.exports = {
  cleverbot: function(){return new _chatbot('http://www.cleverbot.com', 35);},
  jabberwacky: function(){return new _chatbot('http://www.jabberwacky.com', 29);},
  pandorabot: function(botid){return new _pandorabot(botid);}
};