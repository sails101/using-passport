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

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  cb();
};
