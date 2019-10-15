'use strict';

var app = app || {};

(function (myApp) {

  myApp.gameList = [];
  myApp.widgets = {};
  myApp.eventHandlers = {};
  myApp.tools = {
    tempAlert: tempAlert
  };

  myApp.initWidgets = initWidgets;
  myApp.initEventHandlers = initEventHandlers;
  myApp.addGameHandler = addGameHandler;
  myApp.terminateGameHandler = terminateGameHandler;
  myApp.deleteGameHandler = deleteGameHandler;
  myApp.buildNewGameComponent = buildNewGameComponent;
  myApp.buildGameListComponent = buildGameListComponent;
  myApp.pullAndRefreshListItems = pullAndRefreshListItems;
  myApp.fetchGames = fetchGames;

  console.debug('Starting to build myApp');
  console.debug('What is myApp.appSockets:', myApp.appSockets);

  myApp.appSockets.initSockets();

  myApp.initWidgets();

  myApp.initEventHandlers();

  myApp.buildNewGameComponent();

  myApp.buildGameListComponent();


  ////////////////////////////////////////////

  function initWidgets() {
    this.widgets.gameCreationContainer = document.getElementById('game-creation');
    this.widgets.gameListContainer = document.getElementById('game-list-container');
  }

  function initEventHandlers() {

    this.eventHandlers.addGame = myApp.addGameHandler.bind(this);

    this.eventHandlers.terminateGame = myApp.terminateGameHandler.bind(this);

    this.eventHandlers.deleteGame = myApp.deleteGameHandler.bind(this);

  }

  /**
   *  Adds a new game object to the current gameList and notifies the server
   */
  function addGameHandler(title, event) {
    console.log('appFront.eventHandlers.addGame:', title);
    var self = this;

    var newGame = {
      id: getNextFakeId(),
      title: title,
      created_at: new Date().toString(),
      is_finished: false
    };

    this.gameList.push(newGame);

    this.gameListComponent.refreshListItems();

    this.appSockets.emitGameAdded(title);

    // get next negative id in order to have a unique id until sync
    function getNextFakeId() {
      var id = 0;

      if (self.gameList && Array.isArray(self.gameList)) {
        var id = self.gameList.reduce(function (prevId, curGame) {
          var minId = curGame.id < prevId ? curGame.id : prevId;
          return minId;
        }, 0);
      }
      return id - 1;
    }
  }

  function terminateGameHandler(gameId, event) {
    console.log('appFront.eventHandlers.terminateGame:', gameId);

    // update local
    if (this.gameList && Array.isArray(this.gameList)) {
      var item = this.gameList.find(function (game) {
        return game.id === gameId;
      });

      item.is_finished = true;

      this.gameListComponent.refreshListItems();

      // update remote
      this.appSockets.emitGameTerminated(gameId);

    }

  }

  function deleteGameHandler(gameId, event) {
    console.log('appFront.eventHandlers.deleteGame:', gameId);

    if (this.gameList && Array.isArray(this.gameList)) {
      var itemIdx = this.gameList.findIndex(function (game) {
        return game.id === gameId;
      });

      this.gameList.splice(itemIdx, 1);

      this.gameListComponent.refreshListItems();

      this.appSockets.emitGameDeleted(gameId);
    }

  }

  /**
   * Create a component for adding new games
   */
  function buildNewGameComponent() {
    this.newGameComponent.build(this.widgets.gameCreationContainer, this.eventHandlers);
  }

  /**
   * Fetches remote games and rebuilds component list
   */
  function buildGameListComponent() {

    this.gameList = this.fetchGames()
      .then(
        function () {
          this.gameListComponent.build(this.widgets.gameListContainer, this.eventHandlers);
        }.bind(this)
      );
  }

  /**
   * Fetches remote games and refreshes component list
   */
  function pullAndRefreshListItems() {
    this.fetchGames().then(function () {
      this.gameListComponent.refreshListItems();
    }.bind(this));
  }


  /**
   * Fetches list of non-deleted games from the remote endpoint.
   * Sets the myApp.gameList
   */
  function fetchGames() {
    var self = this;

    //return fakeGameFetch().then(function (result) {
    return myApp.httpService.getAllGames().then(function (result) {
      if (result && result.data) {
        self.gameList = result.data || [];
        return self.gameList;
      }
    }).catch(function (err) {
      console.error(err);
      tempAlert('Impossible d\'aller chercher les parties sur le serveur. <br>Il y a un problème de connection. Reessayer plus tard, svp!', 3000);
    });

  }

  /**
   * Show auto-hiding alert box
   * merci
   * https://stackoverflow.com/questions/15466802/how-can-i-auto-hide-alert-box-after-it-showing-it
   * @param {*} msg 
   * @param {*} duration 
   */
  function tempAlert(msg, duration) {
    var el = document.createElement("div");
    el.setAttribute('class', 'alert-box');
    el.innerHTML = msg;
    setTimeout(function () {
      el.parentNode.removeChild(el);
    }, duration);

    document.body.appendChild(el);
  }

  /**
   * for testing
   */
  function fakeGameFetch() {
    // simulate latency
    var promise = new Promise(function (resolve, reject) {
      setTimeout(function () {
        var games = [
          {
            "id": 380,
            "title": "Test2",
            "team1": "toto",
            "team2": "tata",
            "points_team1": null,
            "points_team2": null,
            "is_finished": false,
            "created_at": "2019-10-11T11:10:20.714Z",
            "finished_at": null,
            "deleted_at": null
          },
          {
            "id": 381,
            "title": "Test3",
            "team1": "titi",
            "team2": "tutu",
            "points_team1": null,
            "points_team2": null,
            "is_finished": true,
            "created_at": "2019-10-11T11:10:22.714Z",
            "finished_at": "2019-10-12T11:10:37.714Z",
            "deleted_at": null
          },
          {
            "id": 382,
            "title": "Test4",
            "is_finished": false,
            "created_at": "2019-10-11T11:10:23.714Z",
          },
          {
            "id": 383,
            "title": "Test5",
            "is_finished": false,
            "created_at": "2019-10-11T11:11:37.714Z",
          },
          {
            "id": 384,
            "title": "Test6",
            "is_finished": false,
            "created_at": "2019-10-11T11:10:37.714Z",
          },
          {
            "id": 385,
            "title": "Test7",
            "is_finished": false,
            "created_at": "2019-10-11T11:10:37.714Z",
          }
        ];

        return resolve({
          data: games
        });

      }, 200);
    });

    return promise;
  }

})(app);

