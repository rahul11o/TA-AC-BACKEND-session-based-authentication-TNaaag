let mongoose = require("mongoose");

let commentSchema = new mongoose.Schema(
  {
    content: String,
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    articleId: { type: mongoose.Schema.Types.ObjectId, ref: "Article" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);
