const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Signup and signin
// No logout route as we are not storing the user session

// Create a new user
const User = require("../models/user");

router.post("/signup", (req, res, next) => {
  // check against user email for existence
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      // we have a user: user.find returns an empty array if there are no entries
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Mail exists",
        });
      } else {
        // CREATE USER
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
              password: hash,
            });
            user
              .save()
              .then((result) => {
                res.status(201).json({
                  message: "User Created",
                });
              })
              .catch((err) => {
                res.status(500).json({
                  error: err,
                });
              });
          }
        });
      }
    });
});

// query the db for fitting user by email
router.post("/login", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      // If no user
      if (user.length < 1) {
        // only return 401 "unauthorized" to prevent brute force attacks
        return res.status(401).json({
          message: "Auth failed",
        });
      }
      // else compare the pws
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        // check if there were any errors
        if (err) {
          return res.status(401).json({
            message: "Auth failed",
          });
          // if auth successful result should be true
        } else if (result) {
          // call jwt
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id,
            },
            process.env.JWT_KEY,
            {
              expiresIn: "1h",
            }
          );
          return res.status(200).json({
            message: "Auth successful",
            token: token
          });
          // auth failed, return error
        } else {
          res.status(401).json({
            message: "Auth failed",
          });
        }
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.delete("/:userId", (req, res, next) => {
  User.remove({ _id: req.params.userId })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "User deleted.",
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
