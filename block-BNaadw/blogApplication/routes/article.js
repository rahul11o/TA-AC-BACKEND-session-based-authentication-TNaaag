let express = require("express");
let Article = require("../models/article");
let Comment = require("../models/comment");

let router = express();
let requireLogin = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect("/users/login"); // Redirect to login page if not logged in
  }
  next(); // Continue to the next middleware if logged in
};

//GET  Retrieve articles
router.get("/", async (req, res, next) => {
  try {
    let article = await Article.find();
    return res.render("articleList.ejs", { article });
  } catch (error) {
    next(error);
  }
});

////GET  Retrieve article details

router.get("/:slug", async (req, res, next) => {
  try {
    let slug = req.params.slug;
    let article = await Article.findOne({ slug: slug }).populate("comments");
    return res.render("article.ejs", { article });
  } catch (error) {
    next(error);
  }
});

router.use(requireLogin);
//GET Rendering article form

router.get("/create", (req, res, next) => {
  try {
    console.log("kya hua");
    return res.render("articleForm.ejs");
  } catch (error) {
    next(error);
  }
});

//POST saving an article in the dataabse

router.post("/create", async (req, res, next) => {
  try {
    console.log("its here");
    await Article.create(req.body);
    res.redirect("/articles/");
  } catch (error) {
    next(error);
  }
});

// GET render update form

router.get("/:slug/update", async (req, res, next) => {
  try {
    let slug = req.params.slug;
    let article = await Article.findOne({ slug });
    // console.log(article);
    res.render("update.ejs", { article });
  } catch (error) {
    next(error);
  }
});
// GET save update data

router.post("/:slug/update", async (req, res, next) => {
  try {
    let slug = req.params.slug;
    let article = await Article.findOneAndUpdate({ slug }, req.body);
    res.redirect("/articles/" + article.slug);
  } catch (error) {
    next(error);
  }
});

// GET Delete an article

router.get("/:slug/delete", async (req, res, next) => {
  try {
    let slug = req.params.slug;
    let article = await Article.findOneAndDelete({ slug });
    let comment = await Comment.deleteMany({ articleId: article._id });
    console.log(comment, "deleted");
    res.redirect("/articles");
  } catch (error) {
    next(error);
  }
});

//GET  updating likes

router.get("/:slug/likes", async (req, res, next) => {
  try {
    let slug = req.params.slug;
    let article = await Article.findOneAndUpdate(
      { slug },
      { $inc: { likes: +1 } }
    );
    res.redirect("/articles/" + article.slug);
  } catch (error) {}
});

//GET  updating dislikes

router.get("/:slug/dislikes", async (req, res, next) => {
  try {
    let slug = req.params.slug;
    let article = await Article.findOneAndUpdate(
      { slug },
      { $inc: { dislikes: +1 } }
    );
    res.redirect("/articles/" + article.slug);
  } catch (error) {}
});

module.exports = router;
