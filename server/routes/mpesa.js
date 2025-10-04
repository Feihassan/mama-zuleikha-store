import express from 'express';
import axios from 'axios';

const router = express.Router();

// M-Pesa STK Push
router.post('/stkpush', async (req, res) => {
  const { phone, amount } = req.body;

  try {
    // Get access token
    const auth = Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString('base64');
    
    const tokenResponse = await axios.get(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${auth}`
        }
      }
    );

    const token = tokenResponse.data.access_token;

    // STK Push request
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password = Buffer.from(
      `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString('base64');

    const stkResponse = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      {
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: amount,
        PartyA: phone,
        PartyB: process.env.MPESA_SHORTCODE,
        PhoneNumber: phone,
        CallBackURL: 'https://mydomain.com/api/mpesa/callback',
        AccountReference: 'MamaZulekha',
        TransactionDesc: 'Payment for order'
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    res.json(stkResponse.data);
  } catch (error) {
    console.error('M-Pesa STK Push Error:', error.message);
    console.error('Full error:', error.response?.data || error);
    res.status(500).json({ error: error.message });
  }
});

// M-Pesa callback
router.post('/callback', (req, res) => {
  console.log('M-Pesa Callback:', req.body);
  
  const { Body } = req.body;
  if (Body && Body.stkCallback) {
    const { ResultCode, ResultDesc, CheckoutRequestID } = Body.stkCallback;
    
    if (ResultCode === 0) {
      console.log(`Payment successful for CheckoutRequestID: ${CheckoutRequestID}`);
      // In a real app, update order status in database
    } else {
      console.log(`Payment failed: ${ResultDesc}`);
    }
  }
  
  res.json({ ResultCode: 0, ResultDesc: 'Success' });
});

export { router as mpesaRoutes };