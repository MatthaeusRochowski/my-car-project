const express = require("express");
const router = express.Router();
const User = require("../../models/user");

// BCrypt to encrypt passwords
const bcrypt = require("bcryptjs");
const bcryptSalt = 10;

// Get Signup page
router.get("/", (req, res, next) => {
  //console.log('entered signup route');
  res.render("auth/signup");
});

// Create new user
router.post("/", (req, res, next) => {
  console.log("post: /signup");
  const { full_name, username, your_email, password, confirm_password } = req.body;

  console.log(full_name, username, your_email, password, confirm_password);

  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Please enter both, username and password to sign up."
    });
    return;
  }

  if (password !== confirm_password) {
    console.log("The password does not match");
    res.render("auth/signup", {
      errorMessage: "The password does not match."
    });
    return;
  }

  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  User.findOne({ username })
    .then(user => {
      if (user)
        return res.render("auth/signup", {
          errorMessage: "The username already exists!"
        });

      bcrypt
        .genSalt()
        .then(salt => bcrypt.hash(password, salt))
        .then(hash => User.create({ username: username, password: hash }))
        .then(newUser => {
          console.log(newUser);
          req.session.user = newUser; // add newUser to session
          return res.render("index", {
            message: `Thank you for sign up!`
          });
        });
    })
    .catch(error => {
      next(error);
    });
});

module.exports = router;
