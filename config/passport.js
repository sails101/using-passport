module.exports = {

  passport: {

    // The identity of the model you'd like passport to use as `req.user`
    // Whenever a logged-in user sends a request to the server, passport
    // will deserialize (aka "inflate", "hydrate", etc.) a user object
    // and make it available to your code as `req.user`.
    //
    // WARNING:
    // This default approach taken by passport requires doing a `.findOne()`
    // each time a request is made to the server, which, dependening on your
    // setup/app/needs might be too inefficient at scale to be practical.
    // See README.md for a workaround, as well as ideas for other more efficient ways
    // you can accomplish the same thing.
    //
    // Finally, keep in mind that this `userModelIdentity` config is JUST FOR
    // USE WITH THE DESERIALIZE METHOD IN PASSPORT-- your app-level code
    // (controllers, models, custom responses, policies, and so forth) should
    // still use your model as usual.
    userModelIdentity: 'user'

  }

};
