'use strict';

/**
 * Kind of a component that handles the list of game widgets
 */

var app = app || {};

(function (myApp) {

myApp.gameListComponent = {
  widgets: {},
  eventHandlers: {},
  
  build: build,
  initWidgets: initWidgets,
  refreshListItems: refreshListItems
};

/**
 * Builds the game widget list
 * @param {*} gameList this is an array of games
 * @param {*} widgets this is an object with available widgets
 * @param {*} eventHandlers this is an object with available eventHandlers
 *  { deleteGame, terminateGame }
 */
function build(rootElement, eventHandlers) {
  var self = this;
  self.eventHandlers = eventHandlers;

  var listHtml = `
    <div id="game-list-header">
      <span id="title">Les parties</span>
      <span id="game-counter">0</span>
    </div>

    <div id="game-list" class="clearfix"></div>`;

  var listElement = document.createElement('div');
  listElement.innerHTML = listHtml;
  rootElement.appendChild(listElement);

  this.initWidgets(rootElement);

  this.refreshListItems();

};

function initWidgets(rootElement) {
  this.widgets.gameList = rootElement.querySelector('#game-list');
  this.widgets.openGameCounter = rootElement.querySelector('#game-counter');
}

function refreshListItems() {

  setOpenGameCounter(myApp.gameList, this.widgets.openGameCounter);

  clearNodeChildren(this.widgets.gameList);

  // shallow copy of the list
  var gameListVue = myApp.gameList.slice();

  // sort unfinished before finished
  // both groups ordered by creation datetime asc
  gameListVue.sort(function (g1, g2) {
    var comp = 0;
    if (!g1.is_finished && g2.is_finished) {
      comp = -1;
    } else if (g1.is_finished && !g2.is_finished) {
      comp = 1;
    } else {
      comp = new Date(g2.created_at).getTime() - new Date(g1.created_at).getTime();
    }
    return comp;
  });

  for (var game of gameListVue) {
    var gw = createGameWidget(game, this.eventHandlers);
    this.widgets.gameList.appendChild(gw);
  }
};

/**
 * Removes Children one by one
 * That seems to be faster than just setting container.innerHtml to empty ...
 */
function clearNodeChildren(node) {
  while (node.hasChildNodes()) {
    // TODO: how about dangling events?!
    node.removeChild(node.lastChild);
  }
};

/**
 * Creates one game element with game data and eventHandlers attached.
 * @param {*} game 
 * @param {*} eventHandlers this is an object with available eventHandlers
 *  { deleteGame, terminateGame }
 */
function createGameWidget(game, eventHandlers) {

  // conservative version without string interpolation
  // var template = '<div id="{{game-id}}"><input type="checkbox" /><span>{{game-title}}</span><input type="button" />x</div>';
  // var gameHtml = template
  //   .replace('{{game-id}}', game.id)
  //   .replace('{{game-title}}', game.title);

  var gameHtml = `
    <div id="game_${game.id}" class="game-item" data-id="${game.id}">
      <input class="chb-term" type="checkbox" ${game.is_finished ? 'disabled="disabled" checked="checked"' : ''} />
      <span>${game.title}</span>
      <input class="btn-del" type="button" value="x" />
    </div>`;


  var gameElementHolder = document.createElement('div');
  gameElementHolder.innerHTML = gameHtml;
  var gameElement = gameElementHolder.firstElementChild;
  
  // attach event handler only if game is not yet terminated
  if (!game.is_finished) {
    var chboxTerminate =  gameElement.querySelector('input[type=checkbox]');
    chboxTerminate.addEventListener('click', function (event) {
      var result = window.confirm("Voulez-vous terminer cette partie ?");
      if (result) {
        eventHandlers.terminateGame(game.id, event);
      } else {
        event.preventDefault();
      }
    });
  }
  

  var btnDelete = gameElement.querySelector('input[type=button]');
  if (btnDelete) {
    btnDelete.addEventListener('click', function (event) {
      var result = window.confirm("Voulez-vous supprimer cette partie ?");
      if (result) {
        eventHandlers.deleteGame(game.id, event);
      } else {
        event.preventDefault();
      }
    });
  }

  return gameElement;
}

/**
 * Gets the number of open games and sets the text label of the widget
 * @param {*} gameList 
 * @param {*} counterElement
 */
function setOpenGameCounter(gameList, counterElement) {
  var cnt = 0;
  if (gameList && Array.isArray(gameList)) {
    cnt = gameList.reduce(function (prev, curr) {
      return prev = curr.is_finished ? prev : prev + 1;
    }, 0);
  }
  
  counterElement.innerText = cnt;
}

})(app);