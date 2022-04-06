const response = require("../util/DTO/responseDTO");
const statusCode = require("../util/enum/statusCode");
const bcrypt = require('bcrypt')
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
    } catch(err) {
        return response(statusCode.INTERNAL_ERROR, null, err)
    }
}

module.exports = {
    saveUser,
}