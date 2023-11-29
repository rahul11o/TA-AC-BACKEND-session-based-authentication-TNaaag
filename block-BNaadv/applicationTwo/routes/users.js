var express = require("express");
var router = express.Router();
var User = require("../models/user.js");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});
// GET rendering registeration form
router.get("/register", (req, res, next) => {
  try {
    res.render("register.ejs");
  } catch (error) {
    next(error);
  }
});

// POST saving registeration data into database
router.post("/register", async (req, res, next) => {
  try {
    await User.create(req.body);
    res.redirect("/users/login");
  } catch (error) {
    next(error);
  }
});

//GET rendering login form
router.get("/login", (req, res, next) => {
  try {
    res.render("login.ejs");
  } catch (error) {
    next(error);
  }
});

//POST veryfying login details

router.post("/login", async (req, res, next) => {
  try {
    console.log(req.body.email);
    const { email, password } = req.body;
    if (!email || !password) {
      res.redirect("/users/login");
    }
    let user = await User.findOne({ email });
    if (!user) {
      res.redirect("/users/login");
    }
    let result = await user.verifyPassword(password);
    if (result) {
      res.render("success.ejs");
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
