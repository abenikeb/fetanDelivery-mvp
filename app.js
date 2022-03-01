require("dotenv").config();
const express = require("express");

const app = express();

async function startServer() {
  port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Server is listing on port ${port}`);
  });
}

startServer();
