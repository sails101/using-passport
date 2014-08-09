# using-passport

> a [training vessel](https://github.com/sails101) with [Sails](http://sailsjs.org)


### Step 1: Add Passport as a dependency

> See [relevant commit](https://github.com/sails101/using-passport/commit/4a86cae8fbcc3d4281c391cc62f683a750fd34ec#diff-d41d8cd98f00b204e9800998ecf8427e)

```shell
$ npm install passport --save
```


### Step 2: Create `User.js` and `UserController.js`

> See [relevant commit](https://github.com/sails101/using-passport/commit/73cc32ac53baf0c305bd17a3259fae740c5706fc#diff-d41d8cd98f00b204e9800998ecf8427e)

We'll add a stub `login()`, `logout()`, and `signup()` action while we're at it.

```shell
$ sails generate api user login logout signup
```

Now let's build each of the actions.


### Step 3: Login

> See [relevant commit]()
