const Post = require("../models/post");
const response = require("../util/DTO/responseDTO");
const { OK, INTERNAL_ERROR, NOT_FOUND, CREATED, BAD_REQUEST, } = require("../util/enum/statusCode");

async function get(pageSize = 10, currentPage = 1) {
    try {
        const posts = await Post.find().skip(pageSize * (currentPage - 1)).limit(pageSize);
        const count = await Post.count();
        console.log(count, posts);
        return response(OK, { count, posts }, null);
    } catch(error) {
        return response(INTERNAL_ERROR, null, "Failed to get all posts");
    }
}

async function getById(id) {
    try {
        const post = await Post.findOne({ _id: id });
        if (!post) {
            return response(NOT_FOUND, null, "Post not found");
        }
        return response(OK, post, null);
    } catch(error) {
        return response(INTERNAL_ERROR, null, "Failed to get post");
    }
}

async function savePost(title, content, imagePath, creator) {
    if (!title || !content || !imagePath || !creator) {
        return response(BAD_REQUEST, null, "You must provide all fields of the post")
    }
	const post = new Post({
		title,
		content,
		imagePath,
		creator
	});
    try {
        const createdPost = await post.save();
        return response(CREATED, createdPost, null);
    } catch(error) {
        return response(INTERNAL_ERROR, null, "Failed to save post");
    }
}

module.exports = {
    get,
    getById,
    savePost,
}