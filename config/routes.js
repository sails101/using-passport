/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `config/404.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {


  '/*': function configurePassport(req, res, next) {
    req = _extendReq(req);
    sails.passport.initialize()(req,res,function(err){
      if (err) return res.negotiate(err);
      sails.passport.session()(req,res, function (err){
        if (err) return res.negotiate(err);
        next();
      });
    });
  },

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': {
    view: 'homepage'
  },

  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  *  If a request to a URL doesn't match any of the custom routes above, it  *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/

};





/**
 * Monkey-patch to override what's happening in Passport core.
 * @param  {[type]} req [description]
 * @return {[type]}     [description]
 */
function _extendReq(req) {

  /**
   * Intiate a login session for `user`.
   *
   * Options:
   *   - `session`  Save login state in session, defaults to _true_
   *
   * Examples:
   *
   *     req.logIn(user, { session: false });
   *
   *     req.logIn(user, function(err) {
   *       if (err) { throw err; }
   *       // session saved
   *     });
   *
   * @param {User} user
   * @param {Object} options
   * @param {Function} done
   * @api public
   */
  req.login =
  req.logIn = function(user, options, done) {
    if (typeof options == 'function') {
      done = options;
      options = {};
    }
    options = options || {};

    var property = 'user';
    if (req._passport && req._passport.instance) {
      property = req._passport.instance._userProperty || 'user';
    }
    var session = (options.session === undefined) ? true : options.session;

    req[property] = user;
    if (!session) return done&&done();
    if (!req._passport) { throw new Error('passport.initialize() middleware not in use'); }
    if (typeof done != 'function') { throw new Error('req#login requires a callback function'); }

    req._passport.instance.serializeUser(user, req, function(err, obj) {
      if (err) {
        req[property] = null;
        return done(err);
      }
      req._passport.session.user = obj;
      done();
    });
  };

  /**
   * Terminate an existing login session.
   *
   * @api public
   */
  req.logout =
  req.logOut = function() {
    var property = 'user';
    if (req._passport && req._passport.instance) {
      property = req._passport.instance._userProperty || 'user';
    }

    req[property] = null;
    if (req._passport && req._passport.session) {
      delete req._passport.session.user;
    }
  };

  /**
   * Test if request is authenticated.
   *
   * @return {Boolean}
   * @api public
   */
  req.isAuthenticated = function() {
    var property = 'user';
    if (req._passport && req._passport.instance) {
      property = req._passport.instance._userProperty || 'user';
    }

    return (req[property]) ? true : false;
  };

  /**
   * Test if request is unauthenticated.
   *
   * @return {Boolean}
   * @api public
   */
  req.isUnauthenticated = function() {
    return !req.isAuthenticated();
  };

  return req;
}
