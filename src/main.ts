import Dalai from "dalai";
import express from "express";

const dalai = new Dalai();

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(4000, () => {
  console.log("Server is running on http://localhost:4000");
});
