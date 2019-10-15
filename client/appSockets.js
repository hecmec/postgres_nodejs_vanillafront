'use strict';

/**
 * real time communication
 * 
 */

var app = app || {};

(function (myApp) {

  myApp.appSockets = myApp.appSockets || {};

  /**
   * Attach events to websockets
   */
  myApp.appSockets.initSockets = function initSockets() {
    console.debug('Entering myApp.appSockets.initSockets');

    var socket = io();

    // attach listeners to game events
    socket.on('game_added', function (result) {
      console.log('socket.game_added', result.success);

      if (result && result.success) {
        myApp.pullAndRefreshListItems();
      } else {
        myApp.tools.tempAlert('Impossible de sauvegarder la partie sur le server.<br>Il y a un problème de connection. Reessayer plus tard, svp!', 3000);
      }

    });

    socket.on('game_deleted', function (result) {
      console.log('socket.game_deleted', result);

      if (result && result.success) {
        myApp.pullAndRefreshListItems();
      } else {
        myApp.tools.tempAlert('Impossible de sauvegarder la partie sur le server.<br>Il y a un problème de connection. Reessayer plus tard, svp!', 3000);
      }

    });

    socket.on('game_terminated', function (result) {
      console.log('socket.game_terminated', result);

      if (result && result.success) {
        myApp.pullAndRefreshListItems();
      } else {
        myApp.tools.tempAlert('Impossible de sauvegarder la partie sur le server.<br>Il y a un problème de connection. Reessayer plus tard, svp!', 3000);
      }

    });


    // attach emmiter events to appSockets
    this.emitGameAdded = function emitGameAdded(title) {
      console.log('appSockets.emitGameAdded', title);
      socket.emit('game_added', title);
    }

    this.emitGameDeleted = function emitGameDeleted(gameId) {
      console.log('appSockets.emitGameDeleted', gameId);
      socket.emit('game_deleted', gameId);
    }

    this.emitGameTerminated = function emitGameTerminated(gameId) {
      console.log('appSockets.emitGameTerminated', gameId);
      socket.emit('game_terminated', gameId);
    }

  }

})(app);