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
  const { full_name, username, your_email, password, confirm_password }  = req.body;

  console.log(full_name, username, your_email, password, confirm_password);

  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Please enter both, username and password to sign up."
    });
    return;
  }
  
  if (password !== confirm_password) {
    console.log("Die Passwörter stimmen nicht überein.");
    res.render("auth/signup", {
      errorMessage: "Die Passwörter stimmen nicht überein."
    });
    return;
  }


  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  User.findOne({ username: username })
    .then(user => {
      if (user !== null) {
        res.render("auth/signup", {
          errorMessage: "The username already exists!"
        });
        return;
      }

      User.create({
        username,
        password: hashPass
      })
        .then(() => {
          successMessage = "Erfolgreich angemeldet";
          res.redirect("/?success" + successMessage);
        })
        .catch(error => {
          console.log(error);
        });
    })
    .catch(error => {
      next(error);
    });
});

module.exports = router;