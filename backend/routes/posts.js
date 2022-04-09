const express = require("express");
const multer = require("multer");

const router = express.Router();

const Post = require("../models/post");
const authentication = require("../middlewares/authentication");
const { NOT_FOUND, UNAUTHORIZED, OK, INTERNAL_ERROR, CREATED, } = require("../util/enum/statusCode");

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

router.get("/", (req, res) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.currentPage;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) 
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  postQuery
    .then(documents => {
      fetchedPosts = documents;
      return Post.count();
    })
    .then(count => {
      res.status(OK).json({
        message: "Posts fetched successfully",
        posts: fetchedPosts,
        maxPosts: count,
      });
    })
    .catch(() => {
      res.status(INTERNAL_ERROR).json({ message: "Failed to get posts" });
    });
});

router.get("/:id", (req, res) => {
  Post.findById(req.params.id).then((post) => {
    if (!post) return res.status(NOT_FOUND).json({ message: "Post not found!" });
    res.status(OK).json(post);
  })
  .catch(() => {
    res.status(INTERNAL_ERROR).json({ message: "Failed to get the post" });
  });
});

router.post("/", authentication, multer({ storage: storage }).single("image"), (req, res) => {
    const url = `${req.protocol}://${req.get("host")}`;
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: `${url}/images/${req.file.filename}`,
      creator: req.userData.userId,
    });
    post.save().then((createdPost) => {
      res.status(CREATED).json({
        message: "Post added successfully",
        post: {
          ...post,
          id: createdPost._id,
        },
      });
    })
    .catch(() => {
      res.status(INTERNAL_ERROR).json({ message: "Failed to add post" });
    });
  }
);

router.put("/:id", authentication, multer({ storage: storage }).single("image"), (req, res) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = `${req.protocol}://${req.get("host")}`;
      imagePath = `${url}/images/${req.file.filename}`;
    }
    const post = {
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath,
      creator: req.userData.id,
    };
    
    Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post).then(result => {
      if (result.nModified == 0)
        return res.status(UNAUTHORIZED).json({ message: "You are not authorized to update this post!" });
      res.status(OK).json({ message: "Update successful!" });
    })
    .catch(() => {
      res.status(INTERNAL_ERROR).json({ message: "Failed to update the post" });
    });;
  }
);

router.delete("/:id", authentication, (req, res) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.id })
    .then(result => {
      if (result.n == 0)
        return res.status(UNAUTHORIZED).json({ message: "You are not authorized to delete this post!" });
      res.status(OK).json({ message: "Deleted!" });
    })
    .catch(() => {
      res.status(INTERNAL_ERROR).json({ message: "Failed to delete the post" });
    });
});

module.exports = router;
