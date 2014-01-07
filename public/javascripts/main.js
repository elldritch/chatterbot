
// Web Speech API

var result = '';
var recognizing = false;
if (!('webkitSpeechRecognition' in window)) {
  console.log('webkitSpeechRecognition not available, use fallback');
  // insert firefox/opera fallback solution here
} else {
  var recognition = new webkitSpeechRecognition();
  recognition.lang = 'en-US'; // English US, can be modified
  recognition.continuous = true;

  recognition.onstart = function() {
    recognizing = true;
    toggleIcon('ion-ios7-mic', 'ion-ios7-mic-off', 'Stop Recording');
  }

  recognition.onresult = function(event) {
    console.log(event);

    var index = event.results.length - 1;
    result = capitalize(event.results[index][0].transcript.trim());
    appendtoChat(result);
    socket.emit('message', { msg: result });
  }

  recognition.onerror = function(event) {
    console.log('Error: ' + event.error);
  }

  recognition.onend = function() {
    recognizing = false;
    result = '';
    toggleIcon('ion-ios7-mic-off', 'ion-ios7-mic', 'Record');
  }
}

function toggleVoice() {
  if(recognizing) {
    recognition.stop();
    return;
  }
  recognition.start();
}

function appendtoChat(s, bot) {
  if(bot)
    var message = '<div><strong>Bot:</strong> ' + s + '</div>';
  else
    var message = '<div><strong>Me:</strong> ' + s + '</div>';

  $('#chatarea').append(message);
  var offset = $('#chatarea').height() - $('#chatbox').height();
  if(offset > 0)
    $('#chatbox').scrollTop(offset);
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function toggleIcon(remove, add, title) {
  $('#record').removeClass(remove);
  $('#record').addClass(add);
  $('#record').attr('title', title);
}

// WebSockets

var socket = io.connect('http://localhost');
socket.on('message', function(data) {
  appendtoChat(data.msg, true);
});