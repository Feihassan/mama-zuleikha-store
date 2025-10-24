import express from 'express';
import axios from 'axios';
import pool from '../db.js';

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

// M-Pesa transaction query
router.get('/query/:checkoutRequestId', async (req, res) => {
  const { checkoutRequestId } = req.params;

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

    // Query transaction status
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password = Buffer.from(
      `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString('base64');

    const queryResponse = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query',
      {
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    res.json(queryResponse.data);
  } catch (error) {
    console.error('M-Pesa Query Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// M-Pesa callback
router.post('/callback', async (req, res) => {
  console.log('M-Pesa Callback:', req.body);
  
  try {
    const { Body } = req.body;
    if (Body && Body.stkCallback) {
      const { ResultCode, ResultDesc, CheckoutRequestID } = Body.stkCallback;
      
      if (ResultCode === 0) {
        console.log(`Payment successful for CheckoutRequestID: ${CheckoutRequestID}`);
        
        // Update order status to 'paid'
        await pool.query(
          'UPDATE orders SET status = $1 WHERE mpesa_checkout_id = $2',
          ['paid', CheckoutRequestID]
        );
        
        console.log(`Order status updated to 'paid' for CheckoutRequestID: ${CheckoutRequestID}`);
      } else {
        console.log(`Payment failed: ${ResultDesc}`);
        
        // Update order status to 'failed'
        await pool.query(
          'UPDATE orders SET status = $1 WHERE mpesa_checkout_id = $2',
          ['failed', CheckoutRequestID]
        );
      }
    }
  } catch (error) {
    console.error('Error processing M-Pesa callback:', error);
  }
  
  res.json({ ResultCode: 0, ResultDesc: 'Success' });
});

export { router as mpesaRoutes };