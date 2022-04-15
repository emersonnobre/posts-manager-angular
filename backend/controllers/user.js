const userService = require("../services/user");

async function signup(req, res) {
    const result = await userService.saveUser(req.body.email, req.body.password);

    res.status(result.status).json(result);
}

async function login(req, res) {
    const result = await userService.login(req.body.email, req.body.password);

    res.status(result.status).json(result);
}

module.exports = { signup, login, };