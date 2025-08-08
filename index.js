const http = require("http");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const SECRET = "luiztools";

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.json({ message: " tudo ok " });
});

function verifyJWT(req, res, next) {
  const token = req.headers["x-access-token"];
  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(401).end();

    req.userId = decoded.userId;
    next();
  });
}

app.get("/clientes", verifyJWT, (req, res) => {
  console.log(req.userId + " acessou clientes");
  res.json([{ id: 1, nome: "Luiz" }]);
});

app.post("/login", (req, res) => {
  if (req.body.user === "Luiz" && req.body.password === "123") {
    const token = jwt.sign({ userId: 1 }, SECRET, { expiresIn: 300 });
    return res.json({ auth: true, token });
  }

  res.status(401).end();
});
app.post("/logout", (req, res) => {
  res.end();
});

const server = http.createServer(app);

server.listen(3000);
console.log("Servidor rodando na porta 3000");
