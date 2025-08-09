import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "./server/models/User";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//req.body.order_id
app.post("/prodamus", async (req, res) => {
  console.log("Поступил платеж");
  if (req.body.payment_status === "success") {
    const response = await fetch(
      `https://api.telegram.org/bot${process.env.BOT_TOKEN}/createChatInviteLink`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: process.env.CHANNEL_ID,
          member_limit: 1,
        }),
      }
    ).then((response) => response.json());
    await User.findOneAndUpdate(
      { telegramId: req.body.order_id },
      {
        $set: {
          subscription: true,
          dateOfSubscription: new Date(),
          activePromocode: null,
        },
      }
    );
    await fetch(
      `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: req.body.order_id,
          text: `✅ <b>Оплата получена!</b>\nКод заказа: <code>${req.body.order_id}</code>\n\nНажмите кнопку ниже, чтобы вступить в канал.`,
          parse_mode: "HTML",
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "🚀 Вступить в канал",
                  url: `${response.result.invite_link}`,
                },
              ],
            ],
          },
        }),
      }
    );
  }

  res.sendStatus(200);
});

mongoose.connect(process.env.MONGO_URL!);

app.listen(3000, () => console.log("Webhook-сервер запущен"));
