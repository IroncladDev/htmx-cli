const express = require("express");

const app = express();

app.use(express.static("public"));

app.post("/htmx", (req, res) => {
  res.send(`<h1 style="color: red">Hello HTMX</h1>`);
});

app.listen(3000, () => {
  console.log(`Listening on port 3000`);
});
