const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth')

const UserController = require('../controllers/users');

// Signup and signin
// No logout route as we are not storing the user session

router.post("/signup", UserController.users_signup);

// query the db for fitting user by email and return a token if user found
router.post("/login", UserController.user_login);

router.delete("/:userId", checkAuth, UserController.user_delete);

module.exports = router;
