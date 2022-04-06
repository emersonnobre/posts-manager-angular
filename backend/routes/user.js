const express = require('express')
const router = express.Router()

const User = require('../models/user')
const userService = require('../services/user')

router.post('/signup', async (req, res) => {
    const result = await userService.saveUser({ email: req.body.email, password: req.body.password })

    res.status(result.status).json(result)
})

module.exports = router;