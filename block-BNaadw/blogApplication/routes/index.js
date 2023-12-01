var express = require("express");
const session = require("express-session");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  console.log(req.session);
  res.render("index.ejs", { msg: null });
});

module.exports = router;
