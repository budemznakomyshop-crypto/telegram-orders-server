const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors"); // Чтобы фронтенд с другого домена мог отправлять запросы

const BOT_TOKEN = process.env.7792144070:AAHaqpO93IySeLKI6eSLJQCiR75Y2_6poGE; // токен бота Telegram
const CHAT_ID = process.env.@bztgorders;     // chat_id канала или группы

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Разрешаем CORS

// Endpoint для приёма заказов
app.post("/order", async (req, res) => {
  const { name, phone, email, address, comment, product } = req.body;

  // Формируем сообщение
  const message = Новый заказ:\n +
                  Имя: ${name}\n +
                  Телефон: ${phone}\n +
                  Email: ${email || "-" }\n +
                  Адрес: ${address || "-" }\n +
                  Комментарий: ${comment || "-" }\n +
                  Продукт: ${product};

  try {
    // Отправляем сообщение в Telegram
    const response = await fetch(https://api.telegram.org/bot${7792144070:AAHaqpO93IySeLKI6eSLJQCiR75Y2_6poGE}/sendMessage, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT_ID, text: message })
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(Telegram API error: ${text});
    }

    res.send({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, error: err.message });
  }
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(Server running on port ${PORT}));