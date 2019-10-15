'use strict';

const path = require('path'),
  express = require('express'),
  appCtrl = require(path.resolve('./server/api.controllers/app.api.controller'));



module.exports = function (app) {

  let router = express.Router();
  app.use('/', router);

  // Define error pages
  router.get('/server-error', appCtrl.renderServerError);

  // Define application route
  router.get('/', appCtrl.renderIndex);

};
