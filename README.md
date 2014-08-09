# using-passport

> a [training vessel](https://github.com/sails101) with [Sails](http://sailsjs.org)


For many Sails apps, Passport is overkill- it's quite easy to set up local authentication yourself using only `req.session`.

But in scenarios where you're doing authentication across multiple providers, Passport can make sense, and save you a lot of time.

This tutorial covers installing Passport in your Sails app, configuring it with the "Local" strategy, and then implementing basic login, logout,
and signup endpoints.

> Warning: There are a number of outstanding issues in various Passport "strategy" modules.
> In general, the strategy modules work great, and as open-source users, we must be tolerant
> of limited supporting docs, especially with smaller modules.  Fortunately, we also have the
> opportunity to help contribute to the Passport ecosystem by filling gaps in documentation and
> fixing these issues as we come across them.
>
> ~Mike


## Step 1: Add Passport as a dependency

> See [relevant](https://github.com/sails101/using-passport/commit/4a86cae8fbcc3d4281c391cc62f683a750fd34ec#diff-d41d8cd98f00b204e9800998ecf8427e) [commits](https://github.com/sails101/using-passport/commit/bdf3360a9b04ea52434b9766d472bd3aaa32a868)

```shell
$ npm install passport --save
```

We'll also want to add the dependency of the Passport strategy we're using.  In this case, that means installing `passport-local`:

```shell
$ npm install passport-local --save
```


## Step 2: Create `User.js` and `UserController.js`

> See [relevant commit](https://github.com/sails101/using-passport/commit/73cc32ac53baf0c305bd17a3259fae740c5706fc#diff-d41d8cd98f00b204e9800998ecf8427e)

We'll add a stub `login()`, `logout()`, and `signup()` action while we're at it.

```shell
$ sails generate api user login logout signup
```


Now let's build each of the API actions.

## Step 3: Login

> See [relevant commit](https://github.com/sails101/using-passport/commit/dba3e578924d90a7f4977b6d09f3104e745bdfc5)

So let's do the simplest possible thing w/ passport.  We'll try to log in the requesting user using the local strategy.

If the user login is successful, we'll redirect to `/secure`.  Otherwise, we'll redirect to the homepage.

```js
require('passport').authenticate('local', {
  successRedirect: '/secure',
  failureRedirect: '/'
})(req, res, function errorHandler(err) {
  if (err) return res.negotiate(err);
  return res.notFound();
});
```

> Notice that we passed in an anonymous function as the third argument to `.authenticate()`.
> This is so that we can handle any unexpected errors that might occur during authentication.

We could actually put the code above in our login action and it would work just fine. But instead, let's make things a little more reusable.

With that goal in mind, we'll start off by building a custom response that we can call as `res.login()`.

This will allow us to simplify our code in UserController to the following:

```js
return res.login({
  successRedirect: '/secure',
  failureRedirect: '/'
});
```

This affords us a handful of benefits:

1. Our controller action now has less code (see the section on [thin controllers]() in the conceptual docs on sailsjs.org)
2. Because Passport actually does the responding for us in its `authenticate` method, creating a custom response is a great way to signal this to other developers and our forgetful future-selves
3. Now our business logic in the controller action is not tied to any particular login strategy.  We could switch passport strategies (or even use a different module alogether) without changing any application logic.
4. We can now call res.login() from any policy, controller, or custom response.
5. We now have a way to pass configuration to our login, so it can be extended and reused in future code- even beyond this particular app.

> ##### Quick aside: Building a custom response
>
> TODO: Maybe pull this out into a separate tutorial? anyone want to help?
>
> Building a custom response is pretty easy.
>
> Start by creating an empty file in `api/responses/login.js`. (because the basename of the file is `login`, the function exported by this file will be available as `res.login()`)
>
> ```shell
> $ mkdir -p api/responses;touch api/responses/login.js
> ```
>
> In that file, add the following boilerplate which exports a function and gets access to the req and res objects.
>
> Custom responses don't receive `req` and `res` as arguments to make it simple to understand how you can exert complete control over their usage.
>
> ```js
> module.exports = function login() {
>
>   // Get access to `req` and `res`
>   var req = this.req;
>   var res = this.res;
>
>   // ...
>   // TODO: send a response of some kind here
> };
> ```
>
> So now we just `require('passport')` and call the `authenticate` method with our desired strategy:
>
> ```js
> require('passport').authenticate('local', {
>   successRedirect: '/secure',
>   failureRedirect: '/'
> })(req, res, function errorHandler(err) {
>   if (err) return res.negotiate(err);
>   return res.notFound();
> });
> ```
>
> Finally, we can make some improvements, like exposing passport's `successRedirect` and `failureRedirect` as options.
> See [`api/responses/login.js`]() in this repo for the completed version of this response w/ code comments.



## Step 5: Logout

TODO: ...

## Step 6: Signup

TODO: ...


## Step 7: Build a quick front-end

So we're about ready to start trying this stuff out.

We could test our API right now using cURL or POSTman, but it'd be more useful long-term to put something in our app.
> (TODO: maybe add a quick example of testing w/ POSTman later? Pull it out to a separate training-vessel?  Anyone want to help?)

So how should we do it?  A mobile app?  A website?  AJAX or Socket.io or tradtional web forms?

Fortunately, our login backend [doesn't care](https://www.youtube.com/watch?v=4r7wHMg5Yjg).

For familiarity/simplicity, we'll just do some stupid simple web forms.


TODO: ...



## Step 8: Configure Passport's middleware

Middleware is a simple concept, but it is overloaded to mean a lot of different things.  Be sure and check out the section on middleware in the conceptual docs on sailsjs.org a quick intro and some high-level analysis of what middleware means in the context of Sails.

If you look at the passport docs, you'll see something along the lines of:

```
app.use(passport.initialize());
app.use(passport.session());
```

What this means is that passport wants us to run some code before our app's routes and route blueprints.  Specifically, the code also needs to run after the session is established.

Fortunately in Sails, we don't really have to worry about all that- we just plug this sort of stuff in as policies and/or routes.

Since policies only apply to controllers, and we might want to protect some of our static assets or simple views as well, we'll use a route:

```js
// As the first route in `config/routes.js`...
//
// Run every incoming request through Passport
// (including HTTP AND sockets!)
'/*': function configurePassport(req, res, next) {
  require('passport').initialize()(req,res,function(err){
    if (err) return res.negotiate(err);
    require('passport').session()(req,res, function (err){
      if (err) return res.negotiate(err);
      next();
    });
  });
},
```

The code above works, but once again, we can do better.


> ##### Quick aside: Building a custom hook
>
> TODO: ...





## Conclusion


##### So what is Passport doing?

Passport does a lot of different things, and some of them in a few different ways.


##### Passport's methods

 Method                                         | What it does
 ---------------------------------------------- | ------------------------------------------------------------------------------------------------
 `req.authenticate(strgy,cb)(req,res,mysteryFn)`| Parses credentials from the session.  If you're not logged in, it parses credentials from the request, then calls the `verify()` fn you set up when configuring the strategy.  Finally it calls its callback (`cb`).
 `req.login()`                                  | Calls the `seralizeUser()` fn you set up when configuring passport and stuffs the user in the session.
 `req.logout()`                                 | Calls the `deseralizeUser()` fn you set up when configuring passport and rips the user out of the session.
 `req.logout()`                                 | Calls the `deseralizeUser()` fn you set up when configuring passport.



