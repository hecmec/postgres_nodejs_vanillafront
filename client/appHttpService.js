'use strict';

/**
 * Http service
 * //https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/send
 */

var app = app || {};

(function (myApp) {

  myApp.httpService = {
    getAllGames: getAllGames,
    getGameById: getGameById
  };

  var xmlHttp = new XMLHttpRequest();
  /**
   * Generic get service
   */
  function get(url) {

    return new Promise(function (resolve, reject) {

      xmlHttp.onreadystatechange = function () {
        try {
          var result = {
            data: null,
            status: null,
            statusText: null,
            headers: null
          }
          if (this.readyState === XMLHttpRequest.DONE) {
            if (this.status === 200) {
              console.log('Response received: %s', this.responseText.substr(0, 100));
              result.success = true;
              result.data = JSON.parse(this.responseText);
              result.status = this.status;
              result.statusText = this.statusText;
              result.headers = this.headers;
              result.xhrStatus = this.readyState;

              return resolve(result);

            } else {
              console.log('Response status: %d (%s)', this.status, this.statusText);
              return reject('Server Error, unable to get response.');

            }
          }

        } catch (err) {
          console.log('Server Error: ', err);
          return reject('Server Error, unable to get response.');

        }
      };

      xmlHttp.onerror = onHttpError;
      var async = true;
      xmlHttp.open("GET", url, async);
      xmlHttp.send();

    });
  }

  function onHttpError(event) {
    console.error("Une erreur " + event.target.status + " s'est produite au cours de la réception du document.");
  }

  function getHost() {
    return window.location.protocol + '//' + window.location.host;
  }

  function getAllGames() {
    return get(getHost() + '/api/games/');
  }

  function getGameById(id) {
    return get(getHost() + '/api/games/' + id);
  };

})(app);

