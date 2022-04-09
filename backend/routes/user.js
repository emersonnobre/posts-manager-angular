const express = require("express");
const router = express.Router();
const userService = require("../services/user");

router.post("/signup", async (req, res) => {
    const result = await userService.saveUser(req.body.email, req.body.password);

    res.status(result.status).json(result);
});

router.post("/login", async (req, res) => {
    const result = await userService.login(req.body.email, req.body.password);

    res.status(result.status).json(result);
});

module.exports = router;