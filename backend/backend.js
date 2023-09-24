const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3001;

const apiUrl = "https://random-word-api.herokuapp.com/word";

const getWord = async () => {
  const res = await fetch(apiUrl);
  const data = await res.json();
  return data[0];
};

app.use(cors());

app.get("/", (req, res) => {
  res.json({ message: "Running!" });
});

app.get("/getWord", async (req, res) => {
  const word = await getWord();
  res.json({ word: word });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
