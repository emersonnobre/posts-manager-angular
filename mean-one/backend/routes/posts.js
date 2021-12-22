const express = require("express");

const router = express.Router();

const Post = require("../models/post");

router.get("/api/posts", async (req, res, next) => {
  let posts;
  await Post.find()
    .then((documents) => (posts = documents))
    .catch(console.log);
  res.status(200).json({
    message: "Posts fetched successfully",
    posts: posts,
  });
});

router.get("/api/posts/:id", (req, res, next) => {
  Post.findById(req.params.id).then((post) => {
    if (!post) return res.status(404).json({ message: "Post not found!" });
    setTimeout(() => res.status(200).json(post), 2000);
  });
});

router.post("/api/posts", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });
  post.save().then((createdPost) => {
    res.status(201).json({
      message: "Post added successfully",
      postId: createdPost._id,
    });
  });
});

router.put("/api/posts/:id", (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
  });
  Post.updateOne({ _id: req.params.id }, post).then((result) => {
    console.log(result);
    res.status(200).json({ message: "Update successful!" });
  });
});

router.delete("/api/posts/:id", (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then(console.log).catch(console.log);
  res.status(204).json({ message: "Deleted!" });
});

module.exports = router;
