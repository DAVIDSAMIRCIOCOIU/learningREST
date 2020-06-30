const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { route } = require("./orders");
const bcrypt = require("bcrypt");

// Signup and signin
// No logout route as we are not storing the user session

// Create a new user
const User = require("../models/user");

route.post("/signup", (req, res, next) => {
  // we need to add a salt in order to prevent dictionary tables:
  // so we add a random string (salt), 10 is a good value
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({
        error: err,
      });
    } else {
      const user = new User({
        _id: new mongoose.Types.ObjectId(),
        email: req.body.email,
        password: hash
      });
      user.save()
      .then(result => {
          res.status(201).json({
              message: 'User Created'
          })
      })
      .catch(err => {
          res.status(500).json({
              error: err
          })
      });
    }
  });
});

module.exports = router;
