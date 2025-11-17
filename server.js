const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch"); // npm i node-fetch

const BOT_TOKEN = process.env.BOT_TOKEN; // будем хранить токен в Railway
const CHAT_ID = process.env.CHAT_ID;     // chat_id канала

const app = express();
app.use(bodyParser.json());

app.post("/order", async (req, res) => {
  const { name, phone, product } = req.body;

  const message = Новый заказ:\nИмя: ${name}\nТелефон: ${phone}\nПродукт: ${product};

  try {
    await fetch(https://api.telegram.org/bot${BOT_TOKEN}/sendMessage, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT_ID, text: message })
    });
    res.send({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(Server running on port ${PORT}));