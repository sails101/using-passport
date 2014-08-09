/**
 * isAuthenticated
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next) {

  // Just to be crystal clear about what's going on, all this method does is
  // call the "verify" function of our strategy (you could do this manaully yourself-
  // just talk to your user Model)
  sails.passport.authenticate('local', function (err){
    if (err) return res.negotiate(err);

    // User is not allowed
    // (default res.forbidden() behavior can be overridden in `config/403.js`)
    if (!user) return res.forbidden('You are not permitted to perform this action.');


    console.log('checking isAuthenticated req.user:',req.user);

    // User is allowed, proceed to the next policy,
    // or if this is the last policy, the controller
    return next();

  })(req, res, function errorHandler(err){
    // This should never be called according to passport's docs and my best reading
    // of its source code.
    if (err) return res.negotiate(err);
    return res.notFound();
  });

};
