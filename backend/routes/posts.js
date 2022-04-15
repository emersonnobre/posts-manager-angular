const express = require("express");
const router = express.Router();
const postController = require("../controllers/post");
const extractFile = require("../middlewares/file");
const authentication = require("../middlewares/authentication");

router.get("/", postController.get);

router.get("/:id", postController.getById);

router.post("/", authentication, extractFile, postController.savePost);

router.put("/:id", authentication, extractFile, postController.updatePost);

router.delete("/:id", authentication, postController.deletePost);

module.exports = router;
