require("dotenv").config();

const express = require("express");
const path = require("path");
const routes = require("./routes");

const app = express();
const HOST = process.env.HOST || "localhost";
const { API_VERSION } = require("./config/constants");
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(API_VERSION, routes);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.use(express.static(path.join(__dirname, "../public")));

app.use((req, res, next) => {
  if (req.path.startsWith(API_VERSION)) {
    return res.status(404).json({ error: "API endpoint not found" });
  }
  next();
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: `Something went wrong! ${err.message}` });
});

app.listen(PORT, HOST, () => {
  console.log(`Auth API server running on http://${HOST}:${PORT}`);
});
