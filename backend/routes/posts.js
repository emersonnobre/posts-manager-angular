const express = require("express");
const multer = require("multer");
const router = express.Router();
const postsService = require("../services/posts");

const authentication = require("../middlewares/authentication");

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

router.get("/", async (req, res) => {
	const response = await postsService.get(req.query.pageSize, req.query.currentPage);
	res.status(response.status).json(response);
});

router.get("/:id", async (req, res) => {
	Post.findById(req.params.id).then((post) => {
		if (!post) return res.status(NOT_FOUND).json({ message: "Post not found!" });
		res.status(OK).json(post);
	})
		.catch(() => {
			res.status(INTERNAL_ERROR).json({ message: "Failed to get the post" });
		});
});

router.post("/", authentication, multer({ storage: storage }).single("image"), async (req, res) => {
	const url = `${req.protocol}://${req.get("host")}`;
	const imagePath = `${url}/images/${req.file.filename}`;
	const response = await postsService.savePost(req.body.title, req.body.content, imagePath, req.userData.userId);
	res.status(response.status).json(response);
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
