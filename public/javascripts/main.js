var result = '';
if (!('webkitSpeechRecognition' in window)) {
  console.log('webkitSpeechRecognition not available, use fallback');
  // insert firefox/opera fallback solution here
} else {
  var recognition = new webkitSpeechRecognition();
  recognition.lang = 'en-US'; // English US, can be modified

  recognition.onstart = function() {
    recognizing = true;
  }

  recognition.onresult = function(event) {
    console.log(event);

    result = capitalize(event.results[0][0].transcript);
    $('#chatarea').append(domWrap(result));
  }

  recognition.onerror = function(event) {
    console.log('Error: ' + event.error);
  }

  recognition.onend = function() {
    recognizing = false;
    result = '';
  }
}

function record() {
  recognition.start();
}

function domWrap(s) {
  return '<div><strong>Me:</strong> ' + s + '</div>';
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}