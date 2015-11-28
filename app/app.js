var http = require('http');
var express = require('express');
var socket = require('socket.io');

var app = express();
var server = http.Server(app);
var sio = socket(server);

app.use('/stat', express.static(__dirname + '/frontend'));
app.use('/com', express.static('bower_components'));

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

sio.on('connect', function (socket) {
  console.log('<WebSocket: ===> A user connected!');

  var isStarted = false;

  setTimeout(function () {
    socket.emit('message', {
      text: '└(*^__^*)┘',
      status: 'OK'
    });
  }, 800);

  socket.on('start', function (data) {
    var i = 1;
    var timer = null;

    if (isStarted) {
      return;
      console.log('<WebSocket: ===> Error: Already started!');
    }

    isStarted = true;
    console.log('<WebSocket: ===> Start!');

    timer = setInterval(function () {
      i += Math.round(Math.random() * 7);
      if (i >= 100) {
        i = 100;
        clearInterval(timer);
        isStarted = false;
      }
      socket.emit('progress', {
        percent: i
      });
      console.log('<WebSocket: ===> Percent: %s%', i);
    }, 300);
  });

  socket.on('client disconnect', function () {
    console.log('<WebSocket: ===> Connection is closed by user.');
  });
});

server.listen(4000, function () {
  var host = server.address();
  var address = host.address === '::' ? 'localhost' : host.address;
  console.log('NODE_ENV=' + process.env.NODE_ENV);
  console.log('Start <app> listening at http://%s:%s', address, host.port);
});
