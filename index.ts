import express from "express";

const app = express();

app.use(express.json());

app.post("/prodamus", async (req, res) => {
  const paymentData = req;

  console.log("Пришло уведомление от Prodamus:", paymentData);

  //   if (paymentData.status === 'paid') {
  //     await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({
  //         chat_id: CHAT_ID,
  //         text: `✅ Оплата получена от ${paymentData.customer_email || 'неизвестного'}`
  //       })
  //     });
  //   }

  res.sendStatus(200);
});

app.listen(3000, () => console.log("Webhook-сервер запущен"));
