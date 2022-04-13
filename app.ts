require("dotenv").config();
import express from "express";
import App from "./service/ExpressApp";
import DB from "./service/DataBase";

const app = express();

async function startServer() {
  await App(app);
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Server is listing on Port ${port}`);
  });
}

startServer();
