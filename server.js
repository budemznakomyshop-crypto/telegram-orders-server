const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fetch = require("node-fetch");

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post("/order", async (req, res) => {
  console.log("=== /order incoming ===");
  console.log("Headers:", req.headers);
  console.log("Raw body (req.body):", req.body);

  const {
    name: nameTop,
    phone: phoneTop,
    email: emailTop,
    address: addressTop,
    comment: commentTop,
    product: productTop,

    customer,
    items,
    total,

    deliveryType,      // "delivery" | "pickup"
    selectedCafe       // "rizhskiy" | "maly"
  } = req.body || {};

  const name = customer?.name ?? nameTop;
  const phone = customer?.phone ?? phoneTop;
  const email = customer?.email ?? emailTop;
  const address = customer?.address ?? addressTop;
  const comment = customer?.comment ?? commentTop;

  const product = (() => {
    if (productTop) return productTop;
    if (Array.isArray(items) && items.length > 0) {
      try {
        return items
          .map(
            (i) =>
              `${i.name} x${i.quantity} — ${Number(i.price) * Number(i.quantity)} ₽`
          )
          .join("\n");
      } catch (e) {
        return undefined;
      }
    }
    return undefined;
  })();

  const safe = (v) => {
    try {
      if (v === undefined || v === null) return "-";
      if (typeof v === "string") {
        const t = v.trim();
        return t.length > 0 ? t : "-";
      }
      const s = String(v);
      return s.trim().length > 0 ? s : "-";
    } catch (e) {
      return "-";
    }
  };

  // карта адресов для самовывоза
  const cafeMap = {
    rizhskiy: "Рижский проспект, 2",
    maly: "Малый проспект П.С., 60/19"
  };

  // определяем финальный адрес
  const finalAddress =
    deliveryType === "pickup"
      ? (cafeMap[selectedCafe] || "-")
      : safe(address);

  const message =
`Новый заказ:
Имя: ${safe(name)}
Телефон: ${safe(phone)}
Email: ${safe(email)}
Способ: ${deliveryType === "pickup" ? "Самовывоз" : "Доставка"}
Адрес: ${finalAddress}
Комментарий: ${safe(comment)}
Продукт: ${safe(product)}`;

  console.log("BOT_TOKEN:", BOT_TOKEN ? "present" : "MISSING");
  console.log("CHAT_ID:", CHAT_ID ? CHAT_ID : "MISSING");
  console.log("Message text preview:", message);

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message
        })
      }
    );

    const data = await response.json();
    console.log("Response from Telegram:", data);

    if (!response.ok) {
      throw new Error(JSON.stringify(data));
    }

    res.send({ success: true });
  } catch (err) {
    console.error("Telegram error:", err);
    res.status(500).send({ success: false, error: err.message });
  }
});

app.get("/", (req, res) => res.send("Server is working"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// второй app.get удалён — он был дубликатом и вызывал ошибку "Identifier already declared"
