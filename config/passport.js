module.exports = {

  passport: {

    // The identity of the model you'd like passport to use as `req.user`
    // Whenever a logged-in user sends a request to the server, passport
    // will deserialize (aka "inflate", "hydrate", etc.) a user object
    // and make it available to your code as `req.user`. This requires
    // doing a `.findOne()` each time a request is made to the server,
    // which, dependening on your setup/app/needs might be too inefficient
    // at scale to be practical.  See README.md for a workaround, as well as
    // ideas for other more efficient ways you can accomplish the same thing.
    userModelIdentity: 'user'
  }

};
