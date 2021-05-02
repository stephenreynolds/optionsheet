import cors from "cors";
import express from "express";
import morgan from "morgan";
import path from "path";
import config from "./config";

const app = express();

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("tiny"));

// Serve client application
app.use(express.static(path.join(__dirname, "public")));
app.get("/*", (req, res) => {
  res.sendFile(path.resolve("index.html"));
});

// Listen for requests
app.listen(config.port, config.host, () => {
  console.log(`Server listening on ${config.host}:${config.port}`);
});
