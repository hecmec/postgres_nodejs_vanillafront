/**
 * Data access layer
 * no requests
 * 
 * Doc for pg
 * https://node-postgres.com/features/connecting
 * 
 */

const { Pool } = require('pg');

// pooling is cooler than clients

/**
 * use pool consturcot with config or by env variables
 */

// let pool = new Pool({
//   host: 'localhost',
//   port: 5432,
//   database: 'babyfoot',
//   user: 'babyfoot_user',
//   password: 'toto123',
// });
let pool = null;

/**  
 * Get all games in the db that are not soft-deleted
 */
function getGames() {
  console.debug('getGames');

  return pool
    .query('SELECT * FROM game WHERE deleted_at is null')
    .then(res => {
      // console.log(res.rows)
      return res.rows
    })
    .catch(e => {
      console.error(e)
      return []
    });
    //.then(() => client.end())
    // .finally(() => {
    //   client.end()
    // })
  
}

/**
 * Gets a game by id
 * otherwise returns null
 * @param {*} id 
 */
function getGameById(id) {
  console.debug('getGameById', id);

  return pool
    .query('SELECT * FROM game WHERE id = $1::integer', [id])
    .then(res => {
      if (res && res.rows && res.rows.length > 0) {
        // console.log(res.rows[0])
        return res.rows[0]
      } else {
        console.error(`No games with this id: ${id} in database.`)
        return null
      }
    })
    .catch(e => {
      console.error(e)
      return Promise.reject(e);
    });
}

/**
 * Creates a new game
 * @param {*} title: any title, defaults to empty
 * @param {*} team1: any team member listing, defaults to empty
 * @param {*} team2: any team member listing, defaults to empty
 */
function createGame(title = '', team1 = '', team2 = '') {
  console.debug('createGame', title);

  let queryStr = 'INSERT INTO game (title, team1, team2) values($1, $2, $3);'

  return pool
    .query(queryStr, [title, team1, team2])
    .then(res => {
      if (res) {
        console.log(res)
        return res;
      } else {
        console.error(`No result.`)
        return null;
      }
    })
    .catch(e => {
      console.error(e)
      return Promise.reject(e);
    });
}

/**
 * Declares a game as finished.
 * You can do this twice, its idempotent
 * There is no way to unfinish a game
 * @param {*} id 
 */
function finishGame(id) {
  console.debug('finishGame', id);

  let queryStr = 'UPDATE game SET is_finished = true WHERE id = $1;'

  return executeQuery(queryStr, [id]);

}

/**
 * Deletes (softly) a game.
 * Allows for history.
 * If you delete my win, I'll remember anyways
 * @param {*} id 
 */
function deleteGame(id) {
  console.debug('deleteGame', id);

  let queryStr = 'UPDATE game SET deleted_at = NOW() WHERE id = $1;'

  return executeQuery(queryStr, [id]);

}

/**
 * If you play too much, you might wanna clean up the mess
 * @param {*} id 
 */
function removeGame(id) {
  console.debug('removeGame', id);

  let queryStr = 'DELETE FROM game WHERE id = $1::integer;'

  return executeQuery(queryStr, [id]);

}

/**
 * Prepares a mini test set 
 * Ideally this shouldn't live here
 */
function prepareForTest() {
  console.debug('prepareForTest');

  let queryStr = ` TRUNCATE TABLE game;
  INSERT INTO game (title, team1, team2) values('Test1','toto', 'titi');
  INSERT INTO game (title, team1, team2) values('Test2','toto', 'tata');
  INSERT INTO game (title, team1, team2) values('Test3','titi', 'tutu');
  `;

  return executeQuery(queryStr);

}

/**
 * some base method to execute queries
 */
function executeQuery(queryStr, params) {

  return pool
    .query(queryStr, params)
    .then(res => {
      // do something other if needed
      return res;
    })
    .catch(e => {
      console.error(e)
      return Promise.reject(e);
    });
  
}



const mod = {
  getGames,
  getGameById,
  createGame,
  finishGame,
  deleteGame,
  removeGame,
  prepareForTest
};

module.exports = function (dbConfig) {
  pool = new Pool(dbConfig);

  return mod;
};

