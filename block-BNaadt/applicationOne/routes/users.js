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
    let err = req.flash("error")[0];
    res.render("register.ejs", { err });
  } catch (error) {
    next(error);
  }
});

//capturing , hashing and saving to the database
router.post("/register", async (req, res, next) => {
  try {
    if (req.body.password.length < 4) {
      req.flash("error", "password needs to be  atleast of 4 character");
      return res.redirect("/users/register");
    }
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      req.flash("error", `${email} is already registered`);
      return res.redirect("/users/register");
    }

    await User.create(req.body);
    res.redirect("/users/login");
  } catch (error) {
    next(error);
  }
});

//rendering login form
router.get("/login", (req, res, next) => {
  try {
    console.log(req.session);
    let err = req.flash("error")[0];
    res.render("login.ejs", { err });
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
      req.flash("error", `Email/Password required`);
      return res.redirect("/users/login");
    }
    let user = await User.findOne({ email });
    if (!user) {
      req.flash("error", `${email} is not registered with us`);
      return res.redirect("/users/login");
    }
    let result = await user.verifyPassword(password);
    console.log(result);
    if (!result) {
      req.flash("error", `Invalid Password`);
      return res.redirect("/users/login");
    }
    //persist logged in user information
    req.session.userId = user.id;
    res.redirect("/users");
  } catch (error) {
    next(error);
  }
});

router.get("/logout", (req, res, next) => {
  req.session.destroy();
  res.clearCookie("connect.sid");
  res.redirect("/users/login");
});

module.exports = router;
