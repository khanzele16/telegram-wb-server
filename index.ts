import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "./server/models/User";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/prodamus", async (req, res) => {
  try {
    const { payment_status, order_id } = req.body;

    console.log("Поступил платеж", payment_status, order_id);

    if (payment_status !== "success") {
      return res.sendStatus(200);
    }

    const tgResp = await fetch(
      `https://api.telegram.org/bot${process.env.BOT_TOKEN}/createChatInviteLink`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: process.env.CHANNEL_ID,
          expire_date: Math.floor(Date.now() / 1000) + 86400, // 24 часа
        }),
      }
    );
    const tgData = await tgResp.json();

    if (!tgData.ok) {
      console.error("Ошибка Telegram API:", tgData);
      return res.sendStatus(500);
    }

    await User.findOneAndUpdate(
      { telegramId: order_id },
      {
        $set: {
          subscription: true,
          dateOfSubscription: new Date(),
          activePromocode: null,
        },
      },
      { upsert: true }
    );

    await fetch(
      `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: order_id,
          text: `✅ <b>Оплата получена!</b>\nКод заказа: <code>${order_id}</code>\n\nНажмите кнопку ниже, чтобы вступить в канал.`,
          parse_mode: "HTML",
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "🚀 Вступить в канал",
                  url: tgData.result.invite_link,
                },
              ],
            ],
          },
        }),
      }
    );

    res.sendStatus(200);
  } catch (err) {
    console.error("Ошибка при обработке оплаты:", err);
    res.sendStatus(500);
  }
});

mongoose
  .connect(process.env.MONGO_URL!)
  .then(() => console.log("MongoDB подключена"))
  .catch((err) => console.error("Ошибка MongoDB:", err));

app.listen(3000, () => console.log("Webhook-сервер запущен"));