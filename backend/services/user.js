const response = require("../util/DTO/responseDTO");
const statusCode = require("../util/enum/statusCode");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/user");

async function saveUser(user) {
    if (!user.email || !user.password)
        return response(statusCode.BAD_REQUEST, null, "Insert you e-mail and password")

    const hash = await bcrypt.hash(user.password, 10)

    const userModel = new User({
        email: user.email,
        password: hash,
    });

    try {
        const result = await userModel.save()
        return response(statusCode.CREATED, result, "User created")
    } catch (err) {
        return response(statusCode.INTERNAL_ERROR, null, err)
    }
}

async function login(email, password) {
    if (!email || !password) {
        return response(statusCode.BAD_REQUEST, null, "Insert you e-mail and password")
    }

    const userDb = await User.findOne({ email: email })

    if (!userDb) {
        return response(statusCode.UNAUTHORIZED, null, "Authentication failed")
    }

    const passwordCheck = await bcrypt.compare(password, userDb.password)

    if (!passwordCheck) {
        return response(statusCode.UNAUTHORIZED, null, "Authentication failed")
    }

    const token = jwt.sign({ email: email, id: userDb._id }, process.env.TOKEN_SECRET_API, { expiresIn: "1h" })

    return response(statusCode.OK, { token }, "Login succeed!")
}

module.exports = {
    saveUser,
    login,
}