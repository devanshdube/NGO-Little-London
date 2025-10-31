const express = require("express");
const cors = require("cors");
// const apiRouter = require("./apiRouter");
const postRouter = require("./Router/routerPost");
const authRouter = require("./Router/routerAuth");
const getRouter = require("./Router/routerGet");

const app = express();

app.use(cors());
app.use(express.json());

// app.use("/test", apiRouter);
app.use("/auth/api/ngo/post", postRouter);
app.use("/auth/api/ngo/get", getRouter);
// app.use("/auth/api/ngo/update", apiRouter);
// app.use("/auth/api/ngo/delete", apiRouter);
app.use("/auth/api/ngo/login", authRouter);

const PORT = process.env.PORT || 5555;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
