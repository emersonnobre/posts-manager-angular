const jwt = require("jsonwebtoken");
require("dotenv").config();

const { UNAUTHORIZED } = require("../util/enum/statusCode");
const response = require("../util/DTO/responseDTO");

function authentication(req, res, next) {
    try {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, process.env.TOKEN_SECRET_API);
        req.user = jwt.decode(token);
        next();
    } catch(error) {
        res.status(UNAUTHORIZED).json(response(UNAUTHORIZED, null, "Auth failed"));
    }
}

module.exports = authentication;