const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// Esse é o token que você irá definir na plataforma da Meta
const VERIFY_TOKEN = "academiaIA123";

// Endpoint de verificação
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("✅ Webhook verificado!");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(400);
  }
});

// Apenas para testar se a URL está no ar
app.get("/", (req, res) => {
  res.send("Servidor do Webhook da Academia IA está online!");
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});