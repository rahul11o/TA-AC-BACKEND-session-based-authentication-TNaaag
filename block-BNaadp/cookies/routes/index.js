var express = require("express");
var router = express.Router();

//Cookies related stuff

router.use((req, res, next) => {
  console.log(req.cookies);
  res.cookie("name", "rahul");
  next();
});

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

module.exports = router;
