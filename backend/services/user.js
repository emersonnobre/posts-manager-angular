require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const response = require("../util/DTO/responseDTO");
const { OK, INTERNAL_ERROR, BAD_REQUEST, CREATED, UNAUTHORIZED, } = require("../util/enum/statusCode");

async function saveUser(email, password) {
    if (!email || !password) {
        return response(BAD_REQUEST, null, "Insert you e-mail and password");
    }

    const hash = await bcrypt.hash(password, 10);

    const userModel = new User({
        email: email,
        password: hash,
    });

    try {
        const result = await userModel.save();
        return response(CREATED, result, "User created");
    } catch (err) {
        return response(INTERNAL_ERROR, null, err);
    }
}

async function login(email, password) {
    if (!email || !password) {
        return response(BAD_REQUEST, null, "Insert you e-mail and password");
    }

    const userDb = await User.findOne({ email: email });

    if (!userDb) {
        return response(UNAUTHORIZED, null, "Authentication failed");
    }

    const passwordCheck = await bcrypt.compare(password, userDb.password);

    if (!passwordCheck) {
        return response(UNAUTHORIZED, null, "Authentication failed");
    }

    const token = jwt.sign({ email: email, id: userDb._id }, process.env.TOKEN_SECRET_API, { expiresIn: "1h" });
    const userId = userDb._id;
    const expiresIn = 3600; // seconds

    return response(OK, { userId, token, expiresIn }, "Login succeed!");
}

module.exports = {
    saveUser,
    login,
}