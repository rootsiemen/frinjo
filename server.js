// Production startup file for cPanel / CloudLinux Node.js hosting.
// cPanel injects process.env.PORT automatically — do not hardcode a port.
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const app = next({ dev: false, dir: __dirname });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Request handler error:", err);
      res.statusCode = 500;
      res.end("Internal Server Error");
    }
  }).listen(process.env.PORT || 3000, (err) => {
    if (err) throw err;
    console.log("> WebStore Pro ready");
  });
});
