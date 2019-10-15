/**
 * Rest Api to fetch game list
 */


'use strict';

const path = require('path'),
  gameDBCtrlInitializer = require(path.resolve('./server/db.controllers/game.db.controller'));


let gameDBCtrl = null;

function getList(req, res) {
  console.debug('GameApiController.getGames');

  gameDBCtrl.getGames()
    .then(games => {
      res.json(games);
    })
    .catch(err => {
      // tools.logError(err);
      console.error(err);
      res.status(400).send({
        // dont send error message to the user
        message: 'There was an server error'
      });
    });
}

function getById(req, res) {
  console.debug('GameApiController.getById', req.params);

  let gameId = Number.parseInt(req.params.gameId);

  gameDBCtrl.getGameById(gameId)
    .then(game => {
      res.json(game);
    })
    .catch(err => {
      // tools.logError(err);
      console.error(err);
      res.status(400).send({
        // dont send error message to the user
        message: 'There was an server error'
      });
    });
}

/**
 * Creates a new game.
 * Connected to route POST on /api/games/
 * Details: 
 * POST /api/games/ HTTP/1.1
 * HOST: my-server
 * Content-Type:application/json
 * Accept:application/json
    {
      "title": "toto",
      "team1": ""
       ...
    }
 * @param {*} req 
 * @param {*} res 
 */
function create(req, res) {
  console.debug('GameApiController.create');
  let title = req.body.title;
  if (!title) {
    res.status(400).send({
      message: 'There was an server error'
    });
  }

  gameDBCtrl.createGame(title)
    .then(result => {
      res.json("saved new game.");
    })
    .catch(err => {
      // tools.logError(err);
      console.error(err);
      res.status(400).send({
        // dont send specific error message to the user
        message: 'Oups, there was an server error.'
      });
    });
}


function terminate(req, res) {
  console.debug('GameApiController.terminate');
  let gameId = Number.parseInt(req.params.gameId);

  gameDBCtrl.finishGame(gameId)
    .then(result => {
      res.json(`Game with id: ${gameId} has been terminated.`);
    })
    .catch(err => {
      // tools.logError(err);
      console.error(err);
      res.status(400).send({
        // dont send specific error message to the user
        message: 'There was an server error'
      });
    });
}


function deleteItem(req, res) {
  console.debug('GameApiController.delete');
  let gameId = Number.parseInt(req.params.gameId);

  gameDBCtrl.deleteGame(gameId)
    .then(result => {
      res.json(`Game with id: ${gameId} has been soft-deleted.`);
    })
    .catch(err => {
      console.error(err);
      res.status(400).send({
        message: 'There was an server error'
      });
    });
}

// function update(req, res) {

//   if (!req.body.title) {
//     res.status(400).send({
//       message: 'Not a valid game object.'
//     });
//   }

//   gameDBCtrl.update(title)
//     .then(result => {
//       res.json("updated game.");
//     })
//     .catch(err => {
//       // tools.logError(err);
//       console.error(err);
//       res.status(400).send({
//         // dont send specific error message to the user
//         message: 'Oups, there was an server error.'
//       });
//     });
//   //finishGame
// }


let mod = {
  getList,
  getById,
  create,
  terminate,
  deleteItem
}

module.exports = function (dbConfig) {
  gameDBCtrl = gameDBCtrlInitializer(dbConfig);
  return mod;
};