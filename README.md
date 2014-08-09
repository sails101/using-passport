# using-passport

a [Sails](http://sailsjs.org) application


### Step 1: Add Passport as a dependency

```shell
$ npm install passport --save
```


### Step 2: Create `User.js` and `UserController.js`

We'll add a stub `login()`, `logout()`, and `signup()` action while we're at it.

```shell
$ sails generate api user login logout signup
```

Now let's build each of the actions.


### Step 3: Login

Our starting point in `api/controllers/UserController.js` is something like this:

```js
/**
 * `UserController.login()`
 */
login: function (req, res) {
  return res.json({
    todo: 'login() is not implemented yet!'
  });
},
```

```js
passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' });
```


app.post('/login', );
