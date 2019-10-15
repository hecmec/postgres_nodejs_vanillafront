
/**
 * Little test of our game controller
 * 
 * http://shouldjs.github.io/ : should.be.enough.for.test
 * 
 * https://mochajs.org/#asynchronous-code : do done() when done
 *
 * https://mochajs.org/#arrow-functions : mocha does not like it-lambdas
 *
 */

const path = require('path'),
  assert = require('assert'),
  should = require('should'),

  config = require(path.resolve('./server/config')),
  gameDBCtrlInitializer = require(path.resolve('./server/db.controllers/game.db.controller'));

const gameCtrl = gameDBCtrlInitializer(config.dbConfigTest);

describe('game.controller', function () {

  beforeEach('set db to initial state', function (done) {

    gameCtrl.prepareForTest()
      .then(() => {
        // console.log('prepareForTest done');
        done()
      })
      .catch(() => done());
  });


  describe('getGames', function () {

    it('should return an array of results with length > 0', function (done) {

      gameCtrl.getGames().then(result => {
        (result.length).should.be.above(0);
        done();
      }).catch((err) => {
        return done(err);
      });
    });
  });

  describe('getGameById', function () {
    it('should return a game with Title "Test1" for id 1', function (done) {
      getFirstGameId()
        .then(id => gameCtrl.getGameById(id))
        .then(result => {
          should.exist(result);
          should.equal(result.title, 'Test1')
          done();
        }).catch(err => {
          done(err)
        });
    });
  });


  describe('createGame', function () {
    it('should return an insert result for one row', function (done) {
      gameCtrl.createGame('test toto game').then(result => {
        should.exist(result);
        should.equal(result.command, 'INSERT')
        should.equal(result.rowCount, 1)
        done();
      }).catch(err => {
        done(err)
      });
    });
  });

  describe('finishGame', function () {
    // get the first game
    // mark it as finished
    // get it again an check if the flag was set
    it('should mark a given game as finished', function (done) {
      let gameId = 0;
      getFirstGameId()
        .then(id => {
          gameId = id;
          return gameCtrl.finishGame(gameId);
        })
        .then(() => gameCtrl.getGameById(gameId))
        .then(game => {
          should.exist(game);
          game.is_finished.should.be.true();

          done();
        }).catch(err => {
          done(err)
        });
    });
  });


  describe('deleteGame', function () {
    // get the first game
    // mark it as deleted
    // get it again an check if the flag was set
    it('should mark a given game as deleted', function (done) {
      let gameId = 0;
      getFirstGameId()
        .then(id => {
          gameId = id;
          return gameCtrl.deleteGame(gameId);
        })
        .then(() => gameCtrl.getGameById(gameId))
        .then(game => {
          should.exist(game);
          // console.log(game);
          should.notEqual(game.deleted_at, null);

          done();
        }).catch(err => {
          done(err)
        });
    });

    it('should not find a deleted game', function (done) {
      let gameId = 0;
      getFirstGameId()
        .then(id => {
          gameId = id;
          return gameCtrl.deleteGame(gameId);
        })
        .then(() => gameCtrl.getGames())
        .then(games => {
          should.exist(games);
          (games.length).should.be.above(0);
          games.should.not.containEql({ id: gameId });

          done();
        }).catch(err => {
          done(err)
        });
    });
  });


  describe('removeGame', function () {
    // get the first game
    // mark it as deleted
    // get it again an check if the flag was set
    it('should physically remove the entry from the db', function (done) {
      let gameId = 0;
      getFirstGameId()
        .then(id => {
          gameId = id;
          return gameCtrl.removeGame(gameId);
        })
        .then(() => gameCtrl.getGameById(gameId))
        .then(game => {
          should.not.exist(game);

          done();
        }).catch(err => {
          done(err)
        });
    });
  });




  function getFirstGameId() {
    return gameCtrl.getGames()
      .then((game) => {
        return game[0].id;
      });
  }


}); // end game.controller'








// describe('Hallo', () => {
//   describe('Leute', () => {
//     it('should return "Hallo Leute"', () => {
//       assert.equal(gameCtrl.hello(), 'Hallo Leute');
//     });
//   });

// });