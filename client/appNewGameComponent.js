'use strict';

/**
 * Component that allows to add new Game
 */

var app = app || {};

(function (myApp) {

  myApp.newGameComponent = {
    widgets: {},
    textValue: '',

    build: build,
    initWidgets: initWidgets,
    newGameSubmitted: newGameSubmitted

  };

  function build(rootElement, eventHandlers) {
    var self = this;

    var gameHtml = `
    <form onsubmit="return false;">
      <input id="text-new-game" type="text" maxlength="90" autocomplete="off" placeholder="nouvelle partie ..."  />
      <button type="button" id="btn-new-game" onlick="app.eventHandlers.addGame()">Ajouter</button>
    </form>
    <div id="error-msg"></div>`;

    var newGameElement = document.createElement('div');
    newGameElement.innerHTML = gameHtml;
    rootElement.appendChild(newGameElement);

    this.initWidgets(rootElement);

    // hook click event
    if (self.widgets.btnNewGame) {
      self.widgets.btnNewGame.addEventListener('click', function (event) {
        self.newGameSubmitted(eventHandlers);
      });
    }

    // hook enter key to textbox
    if (this.widgets.textboxNewGame) {
      this.widgets.textboxNewGame.addEventListener('keyup', function (e) {
        e = e || event;
        // check cross-browser enter key
        if (e.key === 'Enter' || (e.keyCode || e.which || e.charCode || 0) === 13) {
          self.newGameSubmitted(eventHandlers);
          e.preventDefault();
        }
      });
    }

  }

  function initWidgets(rootElement) {
    this.widgets.textboxNewGame = rootElement.querySelector('#text-new-game');
    this.widgets.btnNewGame = rootElement.querySelector('#btn-new-game');
    this.widgets.errorMsg = rootElement.querySelector('#error-msg');
  }

  function newGameSubmitted(evtHandlers) {
    var self = this;

    self.widgets.errorMsg.style.display = "none";
    self.widgets.errorMsg.innerText;

    if (self.widgets.textboxNewGame) {
      self.textValue = self.widgets.textboxNewGame.value;

      var validationResult = validateInput(self.textValue);
      if (validationResult.ok) {
        evtHandlers.addGame(self.textValue, event);

        self.textValue = '';
        self.widgets.textboxNewGame.value = '';
      }
      else {
        self.widgets.errorMsg.innerText = validationResult.msg;
        self.widgets.errorMsg.style.display = "block";
      }

    }
  }


  function validateInput(textValue) {
    var msg = '';
    var result = true;

    if (!textValue || textValue.length === 0) {
      msg += ' Donnez à la nouvelle partie un titre ! ';
      result &= false;
    } else {
      if (textValue.length < 3) {
        msg += ' Le titre doit comporter au moins 3 caractères. ';
        result &= false;
      }
      if (textValue.length > 80) {
        msg += ' Le titre ne peut pas dépasser 80 caractères. ';
        result &= false;
      }
      if (textValue.search(/^[a-zA-ZéèàçÉÈÀÇäöüßÄÖÜ].*/ig)) {
        msg += ' Le titre doit commencer par une lettre. ';
        result &= false;
      }
    }

    return {
      msg: msg,
      ok: result
    }

  }

})(app);
