/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  /**
   * `UserController.login()`
   */
  login: function (req, res) {
    return res.login({
      successRedirect: '/success'
    });
  },


  /**
   * `UserController.logout()`
   */
  logout: function (req, res) {
    req.logout();
    return res.ok('Logged out successfully.');
  },


  /**
   * `UserController.signup()`
   */
  signup: function (req, res) {
    User.create(req.params.all()).exec(function (err, user) {
      if (err) return res.negotiate(err);
      req.login(user, function (err){
        if (err) return res.negotiate(err);
        return res.redirect('/welcome');
      });
    });
  }
};

