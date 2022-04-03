const path = require("path");
const mongoose = require("mongoose");
const express = require("express");

const app = express();

const postRoutes = require("./routes/posts");

mongoose
  .connect(
    "mongodb+srv://emersonnobrer:56642202Egr.@cluster0.srcqf.mongodb.net/node-angular?retryWrites=true&w=majority"
  )
  .then(() => console.log("Connected to the db"))
  .catch(console.log);

app.use(express.json());
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use(postRoutes);

module.exports = app;
