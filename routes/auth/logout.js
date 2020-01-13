const express = require("express");
const router = express.Router();
const User = require("../../models/user");

router.get("/", (req, res, next) => {
  req.session.destroy(err => {
    if (err) {
      next(err);
    } else {
      res.clearCookie("connect.sid");
      res.redirect("/");
    }
  });
});

module.exports = router;