const express = require("express");
const cors = require("cors");
const apiRouter = require("./apiRouter");

const app = express();
  
app.use(cors());
app.use(express.json());

app.use("/test", apiRouter);

const PORT = process.env.PORT || 5555;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
