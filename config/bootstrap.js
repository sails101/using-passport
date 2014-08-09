/**
 * Module dependencies
 */

var Passport = require('passport').constructor;



/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function(cb) {

  // Create a passport instance to use
  sails.passport = new Passport();

  // Teach our Passport how to serialize/dehydrate a user object into an id
  sails.passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // Teach our Passport how to deserialize/hydrate an id back into a user object
  sails.passport.deserializeUser(function(id, done) {
    User.findOne(id, function(err, user) {
      done(err, user);
    });
  });

  // Build our strategy and register it w/ passport
  sails.passport.use('local', new (require('passport-local').Strategy)(function verify(username, password, verify_cb) {
    console.log('VERIFYING:',username,password);

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


  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  cb();
};
