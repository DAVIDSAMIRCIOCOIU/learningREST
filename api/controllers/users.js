const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.users_signup = (req, res, next) => {
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
                role: req.body.role
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
  };

exports.user_login = (req, res, next) => {
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
          // check if there were any errors when comparing (note this is note auth failed)
          if (err) {
            return res.status(401).json({
              message: "Auth failed",
            });
            // if auth successful result should be true
          } else if (result) {
            // call jwt to create a token and send it to the client, it could take a cb func but we assign it to a var to run it sync and pass the var to res
            const token = jwt.sign(
              {
                email: user[0].email,
                userId: user[0]._id, 
                role: user[0].role
              },
              process.env.JWT_KEY,
              {
                expiresIn: "1h",
              }
            );
            return res.status(200).json({
              message: "Auth successful",
              token: token,
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
  };

exports.user_delete = (req, res, next) => {
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
  };