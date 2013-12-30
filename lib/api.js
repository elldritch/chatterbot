var request = require('request')
  , crypto = require('crypto')
  , querystring = require('querystring');

/**
 * Cleverbot+Jabberwacky implementation.
 */
var _chatbot = function(url, end_index){
  this.url = url;
  this.end_index = end_index;
  this.vars = {
    sub: 'Say',
    islearning: '1',
    start: 'y',
    icognoid: 'wsf',
    cleanslate: 'false',
    fno: '0'
  };
};
_chatbot.prototype.think = function(thought){
  this.vars.stimulus = thought;

  var query = querystring.stringify(this.vars);
  // console.log(query);
  // console.log(query.substring(9, this.end_index));
  var check = crypto.createHash('md5').update(query.substring(9, this.end_index)).digest('hex');
  query += '&icognocheck=' + check;

  console.info('[SENDING REQUEST]', this.url + '/webservicemin?' + query);

  request(this.url + '/webservicemin?' + query, (function(err, res, body){
    if(err){
      return console.error('[REQUEST ERROR]', err);
    }
    console.log(body, this);
  }).bind(this));
};

module.exports = {
  cleverbot: new _chatbot('http://www.cleverbot.com', 35),
  jabberwacky: new _chatbot('http://www.jabberwacky.com', 29)
};

//     def think_thought(self, thought):
//         self.vars['stimulus'] = thought.text
//         data = urllib.urlencode(self.vars)
//         data_to_digest = data[9:self.bot.endIndex]
//         data_digest = md5.new(data_to_digest).hexdigest()
//         data = data + '&icognocheck=' + data_digest
//         url_response = urllib2.urlopen(self.bot.url, data)
//         response = url_response.read()
//         response_values = response.split('\r')
//         #self.vars['??'] = _utils_string_at_index(response_values, 0)
//         self.vars['sessionid'] = _utils_string_at_index(response_values, 1)
//         self.vars['logurl'] = _utils_string_at_index(response_values, 2)
//         self.vars['vText8'] = _utils_string_at_index(response_values, 3)
//         self.vars['vText7'] = _utils_string_at_index(response_values, 4)
//         self.vars['vText6'] = _utils_string_at_index(response_values, 5)
//         self.vars['vText5'] = _utils_string_at_index(response_values, 6)
//         self.vars['vText4'] = _utils_string_at_index(response_values, 7)
//         self.vars['vText3'] = _utils_string_at_index(response_values, 8)
//         self.vars['vText2'] = _utils_string_at_index(response_values, 9)
//         self.vars['prevref'] = _utils_string_at_index(response_values, 10)
//         #self.vars['??'] = _utils_string_at_index(response_values, 11)
//         self.vars['emotionalhistory'] = _utils_string_at_index(response_values, 12)
//         self.vars['ttsLocMP3'] = _utils_string_at_index(response_values, 13)
//         self.vars['ttsLocTXT'] = _utils_string_at_index(response_values, 14)
//         self.vars['ttsLocTXT3'] = _utils_string_at_index(response_values, 15)
//         self.vars['ttsText'] = _utils_string_at_index(response_values, 16)
//         self.vars['lineRef'] = _utils_string_at_index(response_values, 17)
//         self.vars['lineURL'] = _utils_string_at_index(response_values, 18)
//         self.vars['linePOST'] = _utils_string_at_index(response_values, 19)
//         self.vars['lineChoices'] = _utils_string_at_index(response_values, 20)
//         self.vars['lineChoicesAbbrev'] = _utils_string_at_index(response_values, 21)
//         self.vars['typingData'] = _utils_string_at_index(response_values, 22)
//         self.vars['divert'] = _utils_string_at_index(response_values, 23)
//         response_thought = ChatterBotThought()
//         response_thought.text = _utils_string_at_index(response_values, 16)
//         return response_thought

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
