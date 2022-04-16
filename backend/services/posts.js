const Post = require("../models/post");
const response = require("../util/DTO/responseDTO");
const { OK, INTERNAL_ERROR, NOT_FOUND, CREATED, BAD_REQUEST, UNAUTHORIZED, } = require("../util/enum/statusCode");

async function get(pageSize = 10, currentPage = 1) {
    try {
        const posts = await Post.find().skip(pageSize * (currentPage - 1)).limit(pageSize);
        const count = await Post.count();
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
    const postValidation = validatePost(title, content);
    if (!postValidation.valid) {
        return response(BAD_REQUEST, null, postValidation.message);
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

async function updatePost(title, content, imagePath, creator, postId) {
	const post = {
		title: title,
		content: content,
		imagePath: imagePath,
		creator: creator,
	};

    try {
        const result = await Post.updateOne({ _id: postId, creator: creator }, post);
        if (result.matchedCount == 0)
            return response(UNAUTHORIZED, null, "You have not permission to update this post!");
        return response(OK, null, "Update successful!");
    } catch(error) {
        return response(INTERNAL_ERROR, null, "Failed to update post");
    }
} 

async function deletePost(postId, creator) {
    try {
        const result = await Post.deleteOne({ _id: postId, creator: creator });
        if (result.deletedCount == 0)
            return response(UNAUTHORIZED, null, "You are not authorized to delete this post!");
        return response(OK, null, "Deleted!");
    } catch(error) {
        return response(INTERNAL_ERROR, null, "Failed to delete post");
    }
}

function validatePost(title, content) {
    if (!title)
        return { valid: false, message: "You must provide the posts title" };
    if (!content)
        return { valid: false, message: "You must provide the posts content" };
    return { valid: true, message: null };
}

module.exports = {
    get,
    getById,
    savePost,
    updatePost,
    deletePost,
}