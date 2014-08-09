/**
 * Module dependencies
 */

var passport = require('passport');
var PassportLocal = require('passport-local');

// For reference, to get the constructor:
// var PassportAuthenticator = require('passport').constructor;
// -or-
// var PassportAuthenticator = require('passport').Passport;
// -or-
// var PassportAuthenticator = require('passport').Authenticator;


/**
 * res.login([opts])
 *
 * @param {String} opts.successRedirect
 * @param {String} opts.failureRedirect
 *
 * @description :: Log the requesting user in using a passport strategy
 * @help        :: See http://links.sailsjs.org/docs/responses
 */

module.exports = function login(opts) {

  // Get access to `req` and `res`
  var req = this.req;
  var res = this.res;

  // Merge provided options into defaults
  var passportOpts = _.extend({
  }, opts || {});

  // The name of our strategy
  var STRATEGY = 'local';

  // Build our strategy and register it w/ passport
  // (unfortunately the direct pass-it-in-to-authenticate usage
  //  no longer works in the latest version of passport on npm)
  passport.use('local', function verify(username, password, verify_cb) {

    // Find the user by username.  If there is no user with the given
    // username, or the password is not correct, set the user to `false` to
    // indicate failure and set a flash message.  Otherwise, return the
    // authenticated `user`.
    User.findOne({
      username: username,
      password: password
    }, function(err, user) {
      // Send internal db errors back up (passes through back to our main app)
      if (err) return verify_cb(err);

      // Passport wants us to send `false` as the second argument to the "verify_cb"
      // to indicate that the authentication "failed".
      if (!user) return verify_cb(null, false, { message: 'Unknown username/password combo.' });

      // Otherwise, we pass back the user object itself to indicate success.
      return verify_cb(null, user);
    });
  });

  // Configure passport's login with our strategy
  var configuredLogin = passport.authenticate(STRATEGY, function (err, user, info){
    console.log('RUNNING THE PASSPORT thing');
    if (err) return res.negotiate(err);
    if (!user) return res.forbidden(info);
    req.logIn(user, function (err) {
      if (err) return res.negotiate(err);
      return res.ok('/');
    });
  });

  // {
  //   successRedirect: passportOpts.successRedirect ||'/success',
  //   failureRedirect: passportOpts.failureRedirect ||'/failure'
  // });



  // Run the configured login logic
  return configuredLogin(req, res, function afterwards (err) {
    if (err) return res.negotiate(err);
    return res.json({hellow:'world'});
    // return res.notFound();
  });
};
