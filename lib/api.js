var request = require('request')
  , crypto = require('crypto')
  , querystring = require('querystring');

// Utilities.
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

  request.post({
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

module.exports = {
  cleverbot: function(){return new _chatbot('http://www.cleverbot.com', 35);},
  jabberwacky: function(){return new _chatbot('http://www.jabberwacky.com', 29);}
};

// #################################################
// # Pandorabots impl
// #################################################


// class _Pandorabots(ChatterBot):

//     def __init__(self, botid):
//         self.botid = botid

//     def create_session(self):
//         return _PandorabotsSession(self)


// class _PandorabotsSession(ChatterBotSession):

//     def __init__(self, bot):
//         self.vars = {}
//         self.vars['botid'] = bot.botid
//         self.vars['custid'] = uuid.uuid1()

//     def think_thought(self, thought):
//         self.vars['input'] = thought.text
//         data = urllib.urlencode(self.vars)
//         url_response = urllib2.urlopen('http://www.pandorabots.com/pandora/talk-xml', data)
//         response = url_response.read()
//         response_dom = xml.dom.minidom.parseString(response)
//         response_thought = ChatterBotThought()
//         response_thought.text = response_dom.getElementsByTagName('that')[0].childNodes[0].data.strip()
//         return response_thought


// #################################################
// # Utils
// #################################################

// def _utils_string_at_index(strings, index):
//     if len(strings) > index:
//         return strings[index]
//     else:
//         return ''
