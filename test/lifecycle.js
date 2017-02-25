/**
 * Module dependencies
 */

var sails = require('sails');



/**
 * Setup app for tests
 */
before(function (done) {
  sails.lift({
    hooks: { grunt: false },
    log: { level: 'error' },
  }, function (err) {
    return done(err);
  });
});


/**
 * Teardown app after tests
 */
after(function (done) {
  sails.lower(function (err) {
    return done(err);
  });
});
