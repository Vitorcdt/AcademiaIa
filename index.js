const express = require("express");
const axios = require("axios");
const app = express();
const PORT = process.env.PORT || 3000;

const VERIFY_TOKEN = "academiaIA123";

// Para ler JSON
app.use(express.json());

// GET – Verificação do Webhook
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

// POST – Receber mensagens do WhatsApp
app.post("/webhook", async (req, res) => {
  const body = req.body;

  try {
    if (body.object) {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const message = changes?.value?.messages?.[0];

      if (message) {
        const phone_number = message.from;
        const text = message.text?.body || "";

        // Envia para o Make
        await axios.post("https://hook.us2.make.com/yaq8g9nf2h2xsytqfz21vesrd0wk7kv4", {
          from: phone_number,
          text: text
        });

        console.log("📤 Enviado para Make:", { phone_number, text });
      }
    }
    res.sendStatus(200);
  } catch (error) {
    console.error("❌ Erro ao processar webhook:", error.message);
    res.sendStatus(500);
  }
});

// Teste rápido
app.get("/", (req, res) => {
  res.send("Servidor da Academia IA está no ar 🚀");
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
