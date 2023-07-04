import Dalai from "dalai";
import express from "express";
import cors from "cors";

const dalai = new Dalai();
const app = express();

app.use(
  cors({
    origin: "*",
  })
);

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

  const prompt = `Below is an instruction that describes a task, paired with an input that provides further context. Write a response that appropriately completes the request.

  ### Instruction:
  >${message}
  
  ### Response:`;

  let stream = false;
  await dalai.request(
    {
      prompt,
      model: "llama.13B",
      n_predict: 50,
      skip_end: true,
    },
    (token: string) => {
      process.stdout.write(token);
      if (token.trim().includes("Response:")) {
        stream = true;
        return;
      }
      if (stream) {
        res.write(token);
      }
    }
  );
  res.end();
});

app.listen(4000, () => {
  console.log("Server is running on http://localhost:4000");
});
