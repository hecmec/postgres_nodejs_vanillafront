/**
 * Main entry point of the back end
 */

const path = require('path'),
  express = require('express'),
  bodyParser = require('body-parser'),
  // serveStatic = require('serve-static'),
  http = require('http'),
  socketio = require('socket.io'),

  config = require(path.resolve('./server/config')),
  gameDBCtrlInitializer = require(path.resolve('./server/db.controllers/game.db.controller'));

const gameDBCtrl = gameDBCtrlInitializer(config.dbConfig);

const app = express();
const httpSrv = http.createServer(app);
const io = socketio(httpSrv);

// morgan('combined', {
//   skip: function (req, res) { return res.statusCode < 400 }
// });


initWebSocketListeners(io);

initMiddleware(app);

// init routes
require(path.resolve('./server/routes/game.routes'))(app);
require(path.resolve('./server/routes/app.routes'))(app);

// Showing stack errors
app.set('showStackError', true);
app.set('port', process.env.PORT || 3001);


httpSrv.listen(3001, function () {
  console.log('Server is running.. on Port 3001');
});


function initMiddleware(app) {

  // Keep it before express.static
  // app.use(compress({
  //   filter: function (req, res) {
  //     return (/json|text|javascript|css|font|svg/).test(res.getHeader('Content-Type'));
  //   },
  //   level: 9
  // }));

  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
  // app.use(methodOverride());

  // Setting the app router and static folder
  app.use('/', express.static(path.resolve('./client')));
  // app.use('/node_modules', express.static(path.resolve('./node_modules')));

  // error handler
  app.use(function (err, req, res, next) {
    // If the error object doesn't exists
    if (!err) {
      return next();
    }

    console.error(err.stack)
    res.status(500).send('Something broke!')
  });
}

function initWebSocketListeners() {
  io.on('connection', function (socket) {
    console.log('a user connected');

    socket.on('disconnect', function () {
      console.log('user disconnected');
    });

    socket.on('game_added', addGame);

    socket.on('game_deleted', deleteGame);

    socket.on('game_terminated', terminatedGame);
  });

}

function addGame(title) {
  console.log('game_added: ' + title);
  gameDBCtrl.createGame(title).then(result => {
    io.emit('game_added', {
      success: true
    });
  }).catch(err => {
    console.error(err);
    io.emit('game_added', {
      success: false,
      msg: 'Impossible de sauvegarder la partie. Contactez votre admin ... '
    });
  });
}

function terminatedGame(gameId) {
  console.log('game_terminated: ' + gameId);
  gameDBCtrl.finishGame(gameId).then(result => {
    io.emit('game_terminated', {
      success: true
    });
  }).catch(err => {
    console.error(err);
    io.emit('game_terminated', {
      success: false,
      msg: 'Impossible de sauvegarder la partie. Contactez votre admin ... '
    });
  });
}

function deleteGame(gameId) {
  console.log('game_deleted: ' + gameId);
  gameDBCtrl.deleteGame(gameId).then(result => {
    io.emit('game_deleted', {
      success: true
    });
  }).catch(err => {
    console.error(err);
    io.emit('game_deleted', {
      success: false,
      msg: 'Impossible de supprimer la partie. Contactez votre admin ... '
    });
  });
}
