# using-passport

> a [training vessel](https://github.com/sails101) with [Sails](http://sailsjs.org)


For many Sails apps, Passport is overkill- it's quite easy to set up local authentication yourself using only `req.session`.

But in scenarios where you're doing authentication across multiple providers, Passport can make sense, and save you a lot of time.

This tutorial takes advantage of a quick passport hook I put together to eliminate some of the more confusing aspects of integration with Sails from user-space.  For an in-depth tutorial on how the hook ended up getting built, check out [ORIGINAL_PREHOOK_WALKTHROUGH.md](https://github.com/sails101/using-passport/blob/master/ORIGINAL_PREHOOK_WALKTHROUGH.md).


## Step 1: Install the passport hook

TODO: ...

## Step 2: Create `User.js` and `UserController.js`

We'll add a stub `login()`, `logout()`, and `signup()` action while we're at it.

```shell
$ sails generate api user login logout signup
```


Now let's build each of the API actions.

## Step 3: Login

If the user login is successful, we'll redirect to `/`.

```js
return res.login({
  successRedirect: '/'
});
```


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



