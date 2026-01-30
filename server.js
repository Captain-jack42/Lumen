// server.js
const express = require("express");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const port = Number(process.env.PORT) || 3000;
const host = "0.0.0.0";

app.prepare().then(() => {
  const server = express();
  server.get("/health", (req, res) => res.status(200).send("ok"));
  server.all("*", (req, res) => handle(req, res));
  server.listen(port, host, (err) => {
    if (err) {
      console.error("Server failed to start:", err);
      process.exit(1);
    }
    console.log(`> Ready on http://${host}:${port}`);
  });
}).catch((err) => {
  console.error("Error preparing Next app:", err);
  process.exit(1);
});
