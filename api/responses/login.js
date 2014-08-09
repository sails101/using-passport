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
  opts = _.extend({
    // Default place to redirect upon successful login
    successRedirect: '/success',

    // These are the "default username/password fields" in passport-local
    // (see the "Parameters" section here: http://passportjs.org/guide/username-password/)
    usernameField: 'username',
    passwordField: 'password'
    // Under the covers, Passport is just doing:
    // `req.param(opts.usernameField)`
    // `req.param(opts.passwordField)`
  }, opts || {});


  // Build our strategy and register it w/ passport
  sails.passport.use('local', new (require('passport-local').Strategy)({
    usernameField: opts.usernameField,
    passwordField: opts.passwordField
  }, function verify(username, password, verify_cb) {

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
  }));


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

