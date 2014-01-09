// WebSockets

var socket = io.connect();
socket.on('message', function(data) {
  appendtoChat(parse(data.msg), true);
});

// Web Speech API

var result = '';
var recognizing = false;
var voice = true;
var init = false;
var responding = false;

function make_recogniser(){
  var recognition = new webkitSpeechRecognition();
  recognition.lang = 'en-US';
  recognition.continuous = false;
  recognition.interimResults = true;

  recognition.onstart = function() {
    recognizing = true;
    toggleIcon('#record', 'ion-ios7-mic-off off', 'ion-ios7-mic', 'Stop Recording');
  };

  recognition.onresult = function(event) {
    if(!responding) {
      var interim = '';
      for(var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          result = parse(event.results[i][0].transcript);
          if(result !== '') {
            $('#status').text('');
            appendtoChat(result);
            socket.emit('message', { msg: result });
            responding = true;
          }
        }
        else
          interim += event.results[i][0].transcript;
      }
      if(!responding) {
        if(interim !== '')
          $('#status').text('typing: ' + interim);
        else
          $('#status').text('');
      }
    }
  };

  recognition.onerror = function(event) {
    console.log('Error: ' + event.error);
  };

  recognition.onend = function() {
    recognizing = false;
    result = '';
    toggleIcon('#record', 'ion-ios7-mic', 'ion-ios7-mic-off off', 'Start Recording');
    recognition.stop();
  };

  return recognition;
}

if (!('webkitSpeechRecognition' in window)) {
  $('#prompt').text('Your browser is not supported, please upgrade to Google Chrome version 25 or later');
} else {
  var recognition = make_recogniser();

  recognition.onstart = function() {
    if(!init) {
      init = true;
      $('#prompt').remove();
    }
    recognizing = true;
    toggleIcon('#record', 'ion-ios7-mic-off off', 'ion-ios7-mic', 'Stop Recording');
  };
}

// Audio API

var audio = new Audio();
audio.addEventListener('loadedmetadata', function(){
  audio.play();
});
audio.addEventListener('play', function(){
  responding = true;
  $('#status').text('speaking...');
});
audio.addEventListener('pause', function(){
  responding = false;
  $('#status').text('');
});
audio.addEventListener('ended', function(){
  responding = false;
  $('#status').text('');
});

// DOM Helpers

function toggleRecord() {
  if(recognizing){
    recognition.stop(); // This line doesn't seem to work. Throw away the instance instead.
    recognition = make_recogniser();
    recognizing = false;
    toggleIcon('#record', 'ion-ios7-mic', 'ion-ios7-mic-off off', 'Start Recording');
  }
  else {
    recognition.start();
  }
}

function toggleVoice() {
  if(voice) {
    voice = false;
    toggleIcon('#voice', 'ion-volume-medium', 'ion-volume-mute off', 'Turn on voice output');
    audio.pause();
  }
  else {
    voice = true;
    toggleIcon('#voice', 'ion-volume-mute off', 'ion-volume-medium', 'Turn off voice output');
  }
}

function appendtoChat(s, bot) {
  var message;
  if(bot) {
    message = '<div class="bot message"><strong>Chatterbot:</strong> ' + s + '</div>';
    if(voice)
      audio.src = 'http://tts-api.com/tts.mp3?q='+encodeURIComponent($('<div>'+s+'</div>').text());
    else
      responding = false;
    $('#status').text('');
  }
  else {
    message = '<div class="message"><strong>Me:</strong> ' + s + '</div>';
    $('#status').text('thinking...');
  }
  $('#chatarea').append(message);
  var offset = $('#chatarea').outerHeight() - $('#chatbox').height();
  if(offset > 0)
    $('#chatbox').scrollTop(offset);
}

function parse(s) {
  s = s.trim();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function toggleIcon(id, remove, add, title) {
  $(id).removeClass(remove);
  $(id).addClass(add);
  $(id).attr('title', title);
}