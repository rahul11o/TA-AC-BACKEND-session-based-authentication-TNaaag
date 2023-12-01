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

router.use(requireLogin);
//POST saving the comment into database

router.post("/:articleId", async (req, res, next) => {
  try {
    let articleId = req.params.articleId;
    req.body.articleId = articleId;
    let comment = await Comment.create(req.body);
    let article = await Article.findByIdAndUpdate(articleId, {
      $push: { comments: comment._id },
    });
    res.redirect("/articles/" + article.slug);
  } catch (error) {
    next(error);
  }
});

//GET  updating likes

router.get("/:commentId/likes", async (req, res, next) => {
  try {
    let commentId = req.params.commentId;
    let comment = await Comment.findById(commentId);
    let articleId = comment.articleId;
    let article = await Article.findById(articleId);
    // let article = Article.findByIdAndUpdate(articleId,{$pop:{comments :commentId}})
    await Comment.findByIdAndUpdate(commentId, { $inc: { likes: +1 } });
    res.redirect("/articles/" + article.slug);
  } catch (error) {
    next(error);
  }
});

//GET  updating dislikes

router.get("/:commentId/dislikes", async (req, res, next) => {
  try {
    let commentId = req.params.commentId;
    let comment = await Comment.findById(commentId);
    let articleId = comment.articleId;
    let article = await Article.findById(articleId);
    await Comment.findByIdAndUpdate(commentId, { $inc: { dislikes: +1 } });
    res.redirect("/articles/" + article.slug);
  } catch (error) {
    next(error);
  }
});

//GET   rendering form for editing comments

router.get("/:id/update", async (req, res, next) => {
  try {
    let id = req.params.id;
    let comment = await Comment.findById(id);
    res.render("comment.ejs", { comment });
  } catch (error) {}
});

//POST  Updating comments

router.post("/:commentId/update", async (req, res, next) => {
  try {
    let commentId = req.params.commentId;
    let comment = await Comment.findById(commentId);
    let articleId = comment.articleId;
    let article = await Article.findById(articleId);
    await Comment.findByIdAndUpdate(commentId, req.body);
    // let article = Article.findByIdAndUpdate(articleId,{$pop:{comments :commentId}})
    res.redirect("/articles/" + article.slug);
  } catch (error) {
    next(error);
  }
});

//POST  Deleting comments
router.get("/:commentId/delete", async (req, res, next) => {
  try {
    let commentId = req.params.commentId;
    let comment = await Comment.findById(commentId);
    let articleId = comment.articleId;
    let article = await Article.findById(articleId);
    await Comment.findByIdAndDelete(commentId);
    await Article.findByIdAndUpdate(articleId, {
      $pull: { comments: commentId },
    });

    res.redirect("/articles/" + article.slug);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
