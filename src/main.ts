import Dalai from "dalai";
import express from "express";

const MODEL = "7B";

const dalai = new Dalai();
const app = express();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/prompt", (req, res) => {
  const prompt = req.query.prompt;
  if (typeof prompt !== "string") {
    res.status(400).send("Missing prompt");
    return;
  }
  if (prompt.trim().length === 0) {
    res.status(400).send("Prompt is empty");
    return;
  }
  dalai.request({
    prompt,
    model: MODEL,
  });
});

app.listen(4000, () => {
  console.log("Server is running on http://localhost:4000");
});
