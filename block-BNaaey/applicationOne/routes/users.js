var express = require("express");
var router = express.Router();
var User = require("../models/user");

/* GET users listing. */
router.get("/", function (req, res, next) {
  console.log(req.session);
  res.render("user.ejs");
});

// rendering regsiteration form
router.get("/register", (req, res, next) => {
  try {
    res.render("register.ejs");
  } catch (error) {
    next(error);
  }
});

//capturing , hashing and saving to the database
router.post("/register", async (req, res, next) => {
  try {
    await User.create(req.body);
    res.redirect("/users/login");
  } catch (error) {
    next(error);
  }
});

//rendering login form
router.get("/login", (req, res, next) => {
  try {
    res.render("login.ejs");
  } catch (error) {
    next(error);
  }
});

// Verifying Login details
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    if (!email || !password) {
      return res.redirect("/users/login");
    }
    let user = await User.findOne({ email });
    if (!user) {
      return res.redirect("/users/login");
    }
    let result = await user.verifyPassword(password);
    console.log(result);
    if (!result) {
      return res.redirect("/users/login");
    }
    //persist logged in user information
    req.session.userId = user.id;
    res.redirect("/users");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
