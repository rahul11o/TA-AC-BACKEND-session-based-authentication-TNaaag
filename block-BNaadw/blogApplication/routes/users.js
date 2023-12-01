var express = require("express");
var router = express.Router();
var User = require("../models/user");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});
// GET rendering regiteration form
router.get("/register", (req, res, next) => {
  try {
    res.render("register.ejs");
  } catch (error) {
    next(error);
  }
});

// GET saving registeration data/ user
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
    console.log(req.session);
    res.render("login.ejs");
  } catch (error) {
    next(error);
  }
});

//POST

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.redirect("/users/login");
    }
    let user = await User.findOne({ email });
    if (!user) {
      res.redirect("/users/login");
    }
    let result = await user.verifyPassword(password);
    if (!result) {
      return res.redirect("/users/login");
    }
    //Persist logged in user information
    req.session.userId = user._id;
    res.render("index.ejs", { msg: "Login Successful! Welcome." });
    // console.log(req.session);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
