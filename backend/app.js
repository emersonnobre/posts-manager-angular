const express = require("express");
const path = require("path");
require("./db/connection");
require("dotenv").config();
const postRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");

const app = express();
const PORT = process.env.APP_PORT;

app.use(express.json());
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/posts", postRoutes);
app.use("/api/user", userRoutes);

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
