const express = require("express");
const router = express.Router();

const User = require("../../models/user");

// BCrypt to encrypt passwords
const bcrypt = require("bcryptjs");

router.get("/", (req, res) => {
  res.render("auth/login");
});

router.post("/", (req, res, next) => {
  const { username, password } = req.body;
  User.findOne({ username })
    .then(loggedUser => {
      if (!loggedUser)
        return res.render("auth/login", {
          message: "Invalid credentials"
        }); // User not found

      bcrypt.compare(password, loggedUser.password).then(exist => {
        if (!exist)
          return res.render("auth/login", {
            message: "Invalid credentials"
          }); // The password doesn't match

        // Log the user in
        req.session.user = loggedUser;
        res.render("content/private", { loggedUser });
      });
    })
    .catch(err => next(err));
});

module.exports = router;
