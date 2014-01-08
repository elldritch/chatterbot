
// Web Speech API

var result = '';
var recognizing = false;
var voice = true;
if (!('webkitSpeechRecognition' in window)) {
  console.log('webkitSpeechRecognition not available, use fallback');
  // insert firefox/opera fallback solution here
} else {
  var recognition = new webkitSpeechRecognition();
  recognition.lang = 'en-US'; // English US, can be modified
  recognition.continuous = true;

  recognition.onstart = function() {
    recognizing = true;
    toggleIcon('#record', 'ion-ios7-mic', 'ion-ios7-mic-off', 'Stop Recording');
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
    toggleIcon('#record', 'ion-ios7-mic-off', 'ion-ios7-mic', 'Start Recording');
  }
}

// DOM Helpers

function toggleRecord() {
  if(recognizing)
    recognition.stop();
  else
    recognition.start();
}

function toggleVoice() {
  if(voice) {
    voice = false;
    toggleIcon('#voice', 'ion-volume-mute', 'ion-volume-medium', 'Turn on voice output');
  }
  else {
    voice = true;
    toggleIcon('#voice', 'ion-volume-medium', 'ion-volume-mute', 'Turn off voice output');
  }
}

function appendtoChat(s, bot) {
  if(bot) {
    var message = '<div class="message"><strong>Bot:</strong> ' + s + '</div>';
    if(voice) {
      var audio = new Audio();
      audio.src = 'http://tts-api.com/tts.mp3?q='+encodeURIComponent($('<div>'+s+'</div>').text());
      audio.play();
    }
    $('#status').text('');
  }
  else {
    var message = '<div class="message"><strong>Me:</strong> ' + s + '</div>';
    $('#status').text('thinking...');
  }
  $('#chatarea').append(message);
  var offset = $('#chatarea').outerHeight() - $('#chatbox').height();
  if(offset > 0)
    $('#chatbox').scrollTop(offset);
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function toggleIcon(id, remove, add, title) {
  $(id).removeClass(remove);
  $(id).addClass(add);
  $(id).attr('title', title);
}

// WebSockets

var socket = io.connect('http://localhost');
socket.on('message', function(data) {
  appendtoChat(data.msg, true);
});