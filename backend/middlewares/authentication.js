const jwt = require("jsonwebtoken");
require("dotenv").config();

const { UNAUTHORIZED } = require("../util/enum/statusCode");
const response = require("../util/DTO/responseDTO");

function authentication(req, res, next) {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET_API);
        req.userData = { email: decodedToken.email, userId: decodedToken.id };
        next();
    } catch(error) {
        res.status(UNAUTHORIZED).json(response(UNAUTHORIZED, null, "Auth failed"));
    }
}

module.exports = authentication;