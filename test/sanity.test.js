/* global sails:false */
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// (see http://eslint.org/docs/user-guide/configuring#specifying-globals)
//
// > It'd be great to have an eslint plugin that intelligently allowed for
// > globalized models, lodash, async, `sails`, based on your app's models
// > and config!  Please write one if you have time!
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

describe('sanity', function(){

  it('should have lifted',function (){
    if (sails.isLifted !== true){
      throw new Error('Expecting Sails app to be lifted!');
    }
  });//</it>

  it('should be able to communicate with localhost',function (done){
    sails.request('GET /some/pretend/endpoint', function (err) {
      if (err && err.status === 404) { return done(); }
      else if (err) { return done(err); }
      else { return done(); }
    });
  });//</it>

});

