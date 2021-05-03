const stripe = require('stripe')('pk_live_51Img78K5ZALgdbfFCDxjFQ8p0ZdoaozqL4qKqkJYRir3pGzcrlRBGvdqoq8ERRLVhhK7Y78q3PDpLhsH7pNss30U00RkPCgolE');
const express = require('express');
const app = express();
app.use(express.static('.'));

const YOUR_DOMAIN = 'https://dlightning.io';

app.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Your Cup of Tea',
            images: ['https://i.imgur.com/EHyR2nP.png'],
          },
          unit_amount: 2000,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${YOUR_DOMAIN}/success.html`,
    cancel_url: `${YOUR_DOMAIN}/cancel.html`,
  });

  res.json({ id: session.id });
});

app.listen(4242, () => console.log('Running on port 4242'));