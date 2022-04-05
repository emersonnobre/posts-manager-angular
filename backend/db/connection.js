require("dotenv").config();
mongoose = require("mongoose");

module.exports = mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to the db"))
    .catch(console.log);