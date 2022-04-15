const postsService = require("../services/posts");

async function get(req, res) {
	const response = await postsService.get(req.query.pageSize, req.query.currentPage);
	res.status(response.status).json(response);
}

async function getById(req, res) {
	const response =  await postsService.getById(req.params.id);
	res.status(response.status).json(response);
}

async function savePost(req, res) {
	const url = `${req.protocol}://${req.get("host")}`;
	const imagePath = `${url}/images/${req.file.filename}`;
	const response = await postsService.savePost(req.body.title, req.body.content, imagePath, req.userData.userId);
	res.status(response.status).json(response);
}

async function updatePost(req, res) {
	let imagePath = req.body.imagePath;
	if (req.file) {
		const url = `${req.protocol}://${req.get("host")}`;
		imagePath = `${url}/images/${req.file.filename}`;
	}
	const response = await postsService.updatePost(req.body.title, req.body.content, imagePath, req.userData.userId, req.params.id);
	res.status(response.status).json(response);
}

async function deletePost(req, res) {
	const response = await postsService.deletePost(req.params.id, req.userData.userId);
	res.status(response.status).json(response);
}

module.exports = {
    get,
    getById,
    savePost,
    updatePost,
    deletePost,
};