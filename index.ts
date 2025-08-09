import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//req.body.order_id
app.post("/prodamus", async (req, res) => {
  if (req.body.payment_status === "success") {
    const response = await fetch(
      `https://api.telegram.org/bot${process.env.BOT_TOKEN}/createChatInviteLink`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: process.env.CHANNEL_ID,
          member_limit: 1,
          expire_date: Math.floor(Date.now() / 1000) + 86400, // 24 часа
        }),
      }
    ).then((response) => response.json());
    console.log(response.body);
    // await fetch(
    //   `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
    //   {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({
    //       chat_id: 6146035747,
    //       text: `✅ <b>Оплата получена!</b>\nКод заказа: <code>${req.body.order_id}</code>\n\nНажмите кнопку ниже, чтобы вступить в канал.`,
    //       parse_mode: "HTML",
    //       reply_markup: {
    //         inline_keyboard: [
    //           [
    //             {
    //               text: "🚀 Вступить в канал",
    //               url: `${process.env.CHANNEL_LINK}`,
    //             },
    //           ],
    //         ],
    //       },
    //     }),
    //   }
    // );
  }

  res.sendStatus(200);
});

mongoose.connect(process.env.MONGO_URL!);

app.listen(3000, () => console.log("Webhook-сервер запущен"));
