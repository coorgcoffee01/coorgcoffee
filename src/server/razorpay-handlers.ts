import Razorpay from 'razorpay';
import crypto from 'node:crypto';

function getCredentials() {
  const key_id =
    process.env['RAZORPAY_KEY_ID'] ||
    process.env['VITE_RAZORPAY_KEY_ID'] ||
    '';
  const key_secret = process.env['RAZORPAY_KEY_SECRET'] || '';
  return { key_id, key_secret };
}

export async function handleCreateOrder(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { key_id, key_secret } = getCredentials();

  if (!key_id || !key_secret) {
    return new Response(
      JSON.stringify({ error: 'Razorpay credentials not configured on server' }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  let body: { amount?: number; currency?: string; receipt?: string };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON request body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const amount = Number(body.amount);
  if (isNaN(amount) || amount < 100) {
    return new Response(
      JSON.stringify({ error: 'Amount must be at least 100 paise (₹1.00)' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  const currency = body.currency || 'INR';
  const receipt = body.receipt || `rcpt_${Date.now()}`;

  try {
    const razorpay = new Razorpay({
      key_id,
      key_secret,
    });

    const order = await razorpay.orders.create({
      amount: Math.round(amount),
      currency,
      receipt,
    });

    return new Response(
      JSON.stringify({
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err: any) {
    console.error('Razorpay order creation error:', err);
    const status = err?.statusCode || 500;
    return new Response(
      JSON.stringify({
        error: err?.error?.description || err?.message || 'Failed to create Razorpay order',
      }),
      {
        status,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

export async function handleVerifyPayment(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { key_secret } = getCredentials();

  if (!key_secret) {
    return new Response(
      JSON.stringify({ error: 'Razorpay secret key not configured on server' }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  let body: {
    order_id?: string;
    payment_id?: string;
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
  };

  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON request body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const orderId = body.order_id || body.razorpay_order_id;
  const paymentId = body.payment_id || body.razorpay_payment_id;
  const signature = body.razorpay_signature;

  if (!orderId || !paymentId || !signature) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Missing required fields: order_id, payment_id, and razorpay_signature are required.',
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    const expectedSignature = crypto
      .createHmac('sha256', key_secret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    const expectedBuf = Buffer.from(expectedSignature, 'utf-8');
    const actualBuf = Buffer.from(signature, 'utf-8');

    const isValid =
      expectedBuf.length === actualBuf.length &&
      crypto.timingSafeEqual(expectedBuf, actualBuf);

    if (!isValid) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Payment verification failed: Signature mismatch.',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Payment verified successfully.',
        orderId,
        paymentId,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err: any) {
    console.error('Signature verification error:', err);
    return new Response(
      JSON.stringify({
        success: false,
        error: err?.message || 'Error verifying signature.',
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
