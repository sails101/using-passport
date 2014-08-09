/**
 * Module dependencies
 */

var passport = require('passport');



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

  // Configure passport's login
  var configuredLogin = passport.authenticate('session', function (err, user, info){
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
