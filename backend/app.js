const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
// const apiRouter = require("./apiRouter");
const postRouter = require("./Router/routerPost");
const authRouter = require("./Router/routerAuth");
const getRouter = require("./Router/routerGet");
const deleteRouter = require("./Router/routerDelete");
const websiteRouter = require("./Router/routerWebsite");

const app = express();

app.use(cors());
app.use(express.json());

// app.use("/test", apiRouter);
app.use("/auth/api/ngo/post", postRouter);
app.use("/auth/api/website", websiteRouter);
app.use("/auth/api/ngo/get", getRouter);
// app.use("/auth/api/ngo/update", apiRouter);
app.use("/auth/api/ngo/delete", deleteRouter);
app.use("/auth/api/ngo/login", authRouter);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5555;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
