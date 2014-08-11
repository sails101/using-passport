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
/**
 * `UserController.login()`
 */
login: function (req, res) {
  return res.login({
    successRedirect: '/'
  });
},
```

## Step 5: Logout

```
/**
 * `UserController.logout()`
 */
logout: function (req, res) {
  req.logout();
  return res.ok('Logged out successfully.');
},
```

## Step 6: Signup

```js
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
```


#### Now what?

So we're about ready to start trying this stuff out.

We could test our API right now using cURL or POSTman, but it'd be more useful long-term to put something in our app.  So how should we do it?  Build a quick front-end?  What kind? A mobile app?  A website?  AJAX or Socket.io or tradtional web forms?  Fortunately, our login backend [doesn't care](https://www.youtube.com/watch?v=4r7wHMg5Yjg).

For familiarity/simplicity, we'll just do some simple web forms.


## Step 7: Create some views

Let's create an empty directory at `views/user/`, then create two files: `user/login.ejs` and `user/signup.ejs`. These will be our forms.

## Step 8: Custom URLs

Next, let's set up some friendly URLs as custom routes in our `config/routes.js` file:

```
module.exports.routes = {
  '/': { view: 'homepage' },
  'get /login': { view: 'user/login' },
  'get /signup': { view: 'user/signup' },
  '/welcome': { view: 'user/welcome' },
  'post /login': 'UserController.login',
  'post /signup': 'UserController.signup',
  '/logout': 'UserController.logout'
}
```

And now since we've mapped everything out, we can disable blueprint routing so that the only URLs exposed in our application are those in our `routes.js` file and the routes created by static middleware serving stuff in our `assets/` directory.

_(Note that is optional- I'm doing it here to be explicit and make it clear that there's no magic going on)_

To disable blueprint routing, change your `config/blueprints.js` file to look like this:

```js
module.exports.blueprints = {
  actions: false,
  rest: false,
  shortcuts: false
};
```

## Step 9: Make the views talk to the backend

Now that we have a backend with nice-looking routes, and we have our views hooked up to them, let's set up those HTML forms to communicate with the backend.  As you probably know, this could just as easily be done w/ AJAX or WebSockets/Socket.io (using sails.io.js.)


#### Login Form

`user/login.ejs` should POST a username and password to `/login`.

```html
<h1>Login</h1>
<form action="/login" method="post">

  <label for="username">Username</label>
  <input name="username" type="text"/>
  <br/>

  <label for="password">Password</label>
  <input name="password" type="password"/>
  <br/>

  <input type="submit"/>
</form>

```



#### Signup Form

`user/signup.ejs` should POST a username and password to `/signup`.

```html
<h1>Signup</h1>
<form action="/signup" method="post">

  <label for="username">Choose a Username</label>
  <input name="username" type="text"/>
  <br/>

  <label for="password">Choose a Password</label>
  <input name="password" type="password"/>
  <br/>

  <input type="submit"/>
</form>
```


#### Welcome Page

This is really just gravy, but as a final step, let's set up a welcome page for newly signed-up users at `user/signup.ejs`. We can really put whatever we want here, but let's just give folks a link to get back to the home page and a link to logout (e.g. `<a href="/logout">Log out</a>`).  See the files at `views/user/*.ejs` in this repo for examples.





