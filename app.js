var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , socketio = require('socket.io')
  , api = require('./lib/api');

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'components')));
app.use(app.router);

if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('*', routes.index);

var server = http.createServer(app);
var io = socketio.listen(server);

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

io.sockets.on('connection', function(socket) {
  var bot = api.pandorabot('e281ba60ae3410c8');
  socket.on('message', function(data) {
    if(data.msg !== '') {
      bot.think(data.msg, function(err, response){
        if(err){
          console.error(err, data, response);
          socket.emit('message', { msg: 'Please say that again, I could not understand.' });
        }
        else
          socket.emit('message', { msg: response.result.that[0] });
      });
    }
  });
});
