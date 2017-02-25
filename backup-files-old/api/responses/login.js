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

  // Just to be crystal clear about what's going on, all this method does is
  // call the "verify" function of our strategy (you could do this manaully yourself-
  // just talk to your user Model)
  sails.passport.authenticate('local', function afterVerifyingCredentials(err, user){
    // console.log('req.user:',req.user);
    // console.log('user from call to authenticate:',user);
    if (err) return res.negotiate(err);
    if (!user) return res.badRequest('Invalid username/password combination.');

    // Passport attaches the `req.login` function to the HTTP IncomingRequest prototype.
    // Unfortunately, because of how it's attached to req, it can be confusing or even
    // problematic. I'm naming it explicitly and reiterating what it does here so I don't
    // forget.
    //
    // Just to be crystal clear about what's going on, all this method does is call the
    // "serialize"/persistence logic we defined in "serializeUser" to stick the user in
    // the session store. You could do exactly the same thing yourself, e.g.:
    // `User.req.session.me = user;`
    var passportLogin = req.login;
    return passportLogin(user, function (err) {
      if (err) return res.negotiate(err);
      return res.redirect(opts.successRedirect);
    });

  })(req,res);
};

