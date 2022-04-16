require("dotenv").config();
mongoose = require("mongoose");

module.exports = mongoose
    .connect(`mongodb+srv://emersonnobrer:${process.env.MONGO_URI}@cluster0.srcqf.mongodb.net/node-angular?retryWrites=true&w=majority`)
    .then(() => console.log("Connected to the db"))
    .catch(console.log);