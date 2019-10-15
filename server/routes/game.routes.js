'use strict';

const path = require('path'),
  config = require(path.resolve('./server/config')),
  gameDBCtrlInitializer = require(path.resolve('./server/api.controllers/game.api.controller'));

const gameDBCtrl = gameDBCtrlInitializer(config.dbConfig);

module.exports = function (app) {


  app.route('/api/games')
    .get(gameDBCtrl.getList)
    .post(gameDBCtrl.create);

  app.route('/api/games/:gameId')
    .get(gameDBCtrl.getById)
    .put(gameDBCtrl.terminate)
    .delete(gameDBCtrl.deleteItem);

};
