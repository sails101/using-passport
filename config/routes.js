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


  '/': { view: 'homepage' },
  'get /login': { view: 'user/login' },
  'get /signup': { view: 'user/signup' },
  'post /login': 'UserController.login',
  'post /signup': 'UserController.signup',
  '/logout': 'UserController.logout'
};





/**
 * Normally these methods are added to the global HTTP IncomingMessage
 * prototype, which breaks encapsulation of Passport core.
 * This function is a patch to override this and also attach them to the local req/res.
 * This allows these methods to work for incoming socket requests.
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
