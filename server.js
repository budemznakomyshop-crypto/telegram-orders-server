const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fetch = require("node-fetch");

// Токены из окружения Render
const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

const app = express();

app.use(bodyParser.json());
app.use(cors());

// Приём заказов
app.post("/order", async (req, res) => {
  const { name, phone, email, address, comment, product } = req.body;

  const message = Новый заказ:
Имя: ${name}
Телефон: ${phone}
Email: ${email || "-"}
Адрес: ${address || "-"}
Комментарий: ${comment || "-"}
Продукт: ${product};

  try {
    const response = await fetch(https://api.telegram.org/bot${BOT_TOKEN}/sendMessage, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(data));
    }

    res.send({ success: true });
  } catch (err) {
    console.error("Telegram error:", err);
    res.status(500).send({ success: false, error: err.message });
  }
});

// Проверка сервера (важно для Render)
app.get("/", (req, res) => {
  res.send("Server is working");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(Server running on port ${PORT}));