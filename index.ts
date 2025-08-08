import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use((req, res, next) => {
  if (req.headers["content-type"]?.includes("application/json")) {
    express.json()(req, res, next);
  }
  else if (req.headers["content-type"]?.includes("application/x-www-form-urlencoded")) {
    express.urlencoded({ extended: true })(req, res, next);
  }
  else {
    next();
  }
});

app.post("/prodamus", async (req, res) => {
  if (req.body.payment_status === "success") {
    // await fetch(
    //   `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
    //   {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({
    //       chat_id: req.body.order_id,
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
    console.log(`${process.env.BOT_TOKEN}`)
  }

  res.sendStatus(200);
});

app.listen(3000, () => console.log("Webhook-сервер запущен"));
