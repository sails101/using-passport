/**
 * res.unauthorized()
 *
 * @description :: Redirect the user to the homepage.
 * @help        :: See http://links.sailsjs.org/docs/responses
 */

module.exports = function unauthorized (opts) {

  // Get access to `req` and `res`
  var req = this.req;
  var res = this.res;

  return res.redirect('/');

};
