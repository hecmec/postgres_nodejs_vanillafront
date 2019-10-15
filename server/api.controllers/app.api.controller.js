'use strict';

const path = require('path');


/**
 * Render the server error page
 */
exports.renderServerError = function (req, res) {
  console.log('AppApiController.renderServerError');
  
  res.status(500).render('client/error_500', {
    error: 'Oops! Something went wrong...'
  });
};

exports.renderIndex = function (req, res) {
  console.log('AppApiController.renderIndex');

  res.sendFile(path.resolve('./client/index.html'));
  // res.render('client/index');

};