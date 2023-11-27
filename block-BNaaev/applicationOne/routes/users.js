var express = require("express");
var router = express.Router();
var User = require("../models/user");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

// rendering regsiteration form
router.get("/register", (req, res, next) => {
  try {
    res.render("register.ejs");
  } catch (error) {
    next(error);
  }
});

//capturing and saving to the database
router.post("/register", async (req, res, next) => {
  try {
    await User.create(req.body);
    res.send("user registered");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
