;
(function () {
  'use strict';

  var sio = null;

  $('#connect').on('click', function (ev) {
    $('.title').text('‘(*>﹏<*)′');
    connect();
  });

  $('#start').on('click', function (ev) {
    start();
  });

  $('#disconnect').on('click', function (ev) {
    disconnect();
  });

  function connect() {
    sio = io('http://localhost:4000');
    sio.on('connect', function () {
      console.log('<connect> connected!');
    });
    sio.on('event', function (data) {
      console.log('<event> recieve: ' + data);
    });
    sio.on('disconnect', function (data) {
      console.log('<disconnect> ' + data);
    });

    // My own event
    sio.on('message', function (data) {
      $('.title').text(data.text);
      if (data.status === 'OK') {
        $('#start').show();
        $('#connect').hide();
      }
    });

    console.log(sio);
  }

  function start() {
    $('.title').slideUp();
    $('#disconnect').hide();
    $('#progress').show();
    sio.emit('start', {
      text: 'start'
    });

    sio.on('progress', function (data) {
      $('#progress').find('.bar').width(data.percent + '%');
      var text = data.percent === 100 ? 'Restart?' : data.percent + '%';
      $('#start').text(text);
      if (data.percent === 100) {
        $('#disconnect').show();
      }
    });
  }

  function disconnect() {
    sio.emit('client disconnect');
    sio.disconnect();
    $('#start').hide();
    $('#disconnect').hide();
    $('.title').slideDown().text('( T___T )/ ~Bye!');
  }

  function nativeConnect() {
    var ws = null;
    if (window.WebSocket) {
      ws = new WebSocket('ws://localhost:4000');
      console.log('readyState: ' + ws.readyState);
      ws.onopen = function () {
        console.log('<on open> connected!');
      };
      ws.onclose = function () {
        console.log('<on close> connection closed!');
      };
      ws.onerror = function () {
        console.log('<on error> connection failed!');
      };
      ws.onmessage = function (ev) {
        console.log('<on message> recieve: ' + ev.data);
      };
    } else {
      console.error('Your browser don\'t support WebSocket.');
    }
  }
})();
