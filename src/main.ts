import Dalai from "dalai";
import express from "express";

const dalai = new Dalai();
const app = express();

app.get("/chat", async (req, res) => {
  const { message } = req.query;
  if (typeof message !== "string") {
    res.status(400).send("Missing prompt");
    return;
  }
  if (message.trim().length === 0) {
    res.status(400).send("Prompt is empty");
    return;
  }
  res.setHeader("Content-Type", "text/plain");
  await dalai.request(
    {
      prompt: message,
      model: "llama.7B",
    },
    (token: string) => {
      res.write(token);
    }
  );
  res.end();
});

app.listen(4000, () => {
  console.log("Server is running on http://localhost:4000");
});
