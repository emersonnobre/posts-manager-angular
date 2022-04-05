const express = require("express");
const multer = require("multer");

const router = express.Router();

const Post = require("../models/post");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) error = null;
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, `${name}-${Date.now()}.${ext}`);
  },
});

router.get("/api/posts", (req, res, next) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.currentPage;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
    .then((documents) => {
      fetchedPosts = documents;
      return Post.count();
    })
    .then((count) => {
      res.status(200).json({
        message: "Posts fetched successfully",
        posts: fetchedPosts,
        maxPosts: count,
      });
    })
    .catch(console.log);
});

router.get("/api/posts/:id", (req, res) => {
  Post.findById(req.params.id).then((post) => {
    if (!post) return res.status(404).json({ message: "Post not found!" });
    res.status(200).json(post);
  });
});

router.post(
  "/api/posts",
  multer({ storage: storage }).single("image"),
  (req, res) => {
    const url = `${req.protocol}://${req.get("host")}`;
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: `${url}/images/${req.file.filename}`,
    });
    post.save().then((createdPost) => {
      res.status(201).json({
        message: "Post added successfully",
        post: {
          ...post,
          id: createdPost._id,
        },
      });
    });
  }
);

router.put(
  "/api/posts/:id",
  multer({ storage: storage }).single("image"),
  (req, res) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = `${req.protocol}://${req.get("host")}`;
      imagePath = `${url}/images/${req.file.filename}`;
    }
    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath,
    });
    Post.updateOne({ _id: req.params.id }, post).then(() => {
      res.status(200).json({ message: "Update successful!" });
    });
  }
);

router.delete("/api/posts/:id", (req, res) => {
  Post.deleteOne({ _id: req.params.id })
    .then(() => res.status(204).json({ message: "Deleted!" }))
    .catch(console.log);
});

module.exports = router;
