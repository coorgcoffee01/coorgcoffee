import nodemailer from 'nodemailer';

function getSmtpConfig() {
  const host = process.env.SMTP_HOST || 'smtp.hostinger.com';
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const user = process.env.SMTP_USER || 'support@coorgcoffees.in';
  const pass = process.env.SMTP_PASS || '';
  const from = process.env.FROM_EMAIL || '"Coorg Coffee" <support@coorgcoffees.in>';

  return { host, port, user, pass, from };
}

function buildWelcomeEmailHtml(recipientEmail: string, couponCode = 'WELCOME10'): string {
  const brandGold = '#C89B3C';
  const brandDark = '#1C1612';
  const brandCard = '#251E17';
  const textLight = '#E8D9C5';
  const textMuted = '#B8A895';
  const logoUrl = 'https://coorgcoffees.in/coorg-logo-circle.png';
  const shopUrl = 'https://coorgcoffees.in/shop';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Coorg Coffee</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0F0C0A; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: ${textLight};">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0F0C0A; padding: 30px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: ${brandDark}; border: 1px solid #3A2F25; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
          
          <!-- Header Banner with Logo -->
          <tr>
            <td align="center" style="padding: 36px 20px 24px; border-bottom: 1px solid #2D241C; background: linear-gradient(180deg, #241D17 0%, ${brandDark} 100%);">
              <img src="${logoUrl}" alt="Coorg Coffee Emblem" width="80" height="80" style="display: block; border-radius: 50%; border: 2px solid ${brandGold}; background-color: #FFFFFF; padding: 2px; margin-bottom: 12px;" />
              <h1 style="margin: 0; font-size: 26px; font-weight: 800; letter-spacing: 2px; color: #FFFFFF; text-transform: uppercase;">COORG COFFEE</h1>
              <p style="margin: 4px 0 0; font-size: 11px; letter-spacing: 3px; color: ${brandGold}; text-transform: uppercase; font-weight: 700;">FROM THE LAND OF MIST &amp; HONEY</p>
            </td>
          </tr>

          <!-- Email Content Body -->
          <tr>
            <td style="padding: 32px 28px;">
              <h2 style="margin: 0 0 14px; font-size: 20px; color: #FFFFFF; font-weight: 700;">Welcome to the Coorg Coffee Family! ☕</h2>
              <p style="margin: 0 0 20px; font-size: 14px; line-height: 1.6; color: ${textLight};">
                Thank you for subscribing to our harvest releases. We are delighted to share the generational heritage of shade-grown, single-origin coffee from our generational estates in Madikeri, Karnataka.
              </p>

              <!-- Welcome Coupon Gift Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: ${brandCard}; border: 1px solid #45372B; border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td align="center" style="padding: 22px;">
                    <div style="font-size: 11px; font-weight: 800; letter-spacing: 1.5px; color: ${brandGold}; text-transform: uppercase; margin-bottom: 6px;">YOUR EXCLUSIVE WELCOME GIFT</div>
                    <div style="font-size: 14px; color: ${textLight}; margin-bottom: 12px;">Enjoy 10% off your first order:</div>
                    <div style="display: inline-block; background-color: ${brandGold}; color: #000000; font-weight: 900; font-size: 22px; padding: 10px 28px; border-radius: 6px; letter-spacing: 3px;">
                      ${couponCode}
                    </div>
                    <div style="font-size: 11px; color: ${textMuted}; margin-top: 10px;">Apply at checkout • Valid on all single-origin powders and roasted beans</div>
                  </td>
                </tr>
              </table>

              <!-- Highlights -->
              <p style="margin: 0 0 10px; font-size: 13px; font-weight: 700; color: #FFFFFF; text-transform: uppercase; letter-spacing: 1px;">Why Coffee Lovers Choose Coorg Coffee:</p>
              <ul style="margin: 0 0 24px; padding-left: 20px; font-size: 13px; line-height: 1.8; color: ${textMuted};">
                <li><strong style="color: ${textLight};">4,000 ft High Altitude:</strong> Slow-ripened cherries with rich, low-acid chocolate profiles.</li>
                <li><strong style="color: ${textLight};">Fresh Drum Roasting:</strong> Small-batch roasted upon order to retain peak aroma.</li>
                <li><strong style="color: ${textLight};">Aroma Valve Pouches:</strong> Degassing one-way valve packaging keeps ground coffee ultra-fresh.</li>
              </ul>

              <!-- CTA Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <a href="${shopUrl}" target="_blank" style="display: inline-block; background-color: ${brandGold}; color: #000000; font-weight: 800; font-size: 13px; letter-spacing: 2px; text-transform: uppercase; text-decoration: none; padding: 14px 36px; border-radius: 50px; box-shadow: 0 4px 15px rgba(200, 155, 60, 0.3);">
                      SHOP FRESH HARVEST &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 28px; background-color: #14100C; border-top: 1px solid #281F17; text-align: center;">
              <p style="margin: 0 0 6px; font-size: 11px; color: ${textMuted};">
                Direct Estate Dispatch &bull; Madikeri, Coorg District, Karnataka - 571201
              </p>
              <p style="margin: 0 0 8px; font-size: 11px; color: ${textMuted};">
                Estate Helpline: <strong>+91 94834 72070 | +91 90718 70722</strong> &bull; support@coorgcoffees.in
              </p>
              <p style="margin: 0; font-size: 10px; color: #736456;">
                You received this email because you subscribed at coorgcoffees.in.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export async function handleSendWelcomeEmail(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body: { email?: string; couponCode?: string } = {};
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON request body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const recipient = (body.email || '').trim().toLowerCase();
  if (!recipient || !recipient.includes('@')) {
    return new Response(JSON.stringify({ error: 'Valid email is required.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { host, port, user, pass, from } = getSmtpConfig();

  if (!pass) {
    console.warn('SMTP_PASS is not yet configured. Please set SMTP_PASS in .env to dispatch via Hostinger / Gmail.');
    return new Response(
      JSON.stringify({
        success: false,
        warning: 'SMTP_PASS not configured in .env. Enter your Hostinger/Gmail email password in .env to send real emails.',
        recipient,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
    });

    const html = buildWelcomeEmailHtml(recipient, body.couponCode || 'WELCOME10');

    const info = await transporter.sendMail({
      from,
      to: recipient,
      subject: '☕ Welcome to Coorg Coffee — Fresh Harvest & 10% Off Inside!',
      html,
    });

    return new Response(
      JSON.stringify({
        success: true,
        messageId: info.messageId,
        recipient,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('SMTP Email Error:', error);
    return new Response(
      JSON.stringify({
        error: error?.message || 'Failed to dispatch email via SMTP server.',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

function buildOrderConfirmedEmailHtml(order: any): string {
  const brandGold = '#C89B3C';
  const brandDark = '#1C1612';
  const brandCard = '#251E17';
  const textLight = '#E8D9C5';
  const textMuted = '#B8A895';
  const logoUrl = 'https://coorgcoffees.in/coorg-logo-circle.png';
  const shopUrl = 'https://coorgcoffees.in/shop';

  const orderNumber = order.orderNumber || 'CC-2026';
  const customerName = order.shippingAddress?.fullName || 'Valued Customer';
  const customerPhone = order.guestPhone || order.shippingAddress?.phone || '';
  const grandTotal = order.grandTotal || 0;
  const subtotal = order.subtotal || grandTotal;
  const shippingFee = order.shippingFee || 0;

  const items: any[] = Array.isArray(order.items) ? order.items : [];
  const itemsRows = items
    .map(
      (item) => `
      <tr style="border-bottom: 1px solid #3A2F25;">
        <td style="padding: 14px 10px; color: #FFFFFF; font-size: 14px; font-weight: 600;">
          ${item.productName || 'Coorg Coffee'}
          <div style="font-size: 11px; color: ${brandGold}; font-weight: normal; margin-top: 3px;">
            ${item.variantLabel || ''} ${item.grindOption ? '• ' + item.grindOption : ''}
          </div>
        </td>
        <td style="padding: 14px 10px; color: ${textLight}; font-size: 13px; text-align: center;">
          x${item.quantity || 1}
        </td>
        <td style="padding: 14px 10px; color: #FFFFFF; font-size: 14px; font-weight: 700; text-align: right;">
          ₹${item.lineTotal || item.unitPrice || 0}
        </td>
      </tr>
    `
    )
    .join('');

  const shipping = order.shippingAddress || {};

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmed - Coorg Coffee</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0F0C0A; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: ${textLight};">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0F0C0A; padding: 30px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: ${brandDark}; border: 1px solid #3A2F25; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
          <tr>
            <td align="center" style="padding: 32px 20px 20px; border-bottom: 1px solid #2D241C; background: linear-gradient(180deg, #241D17 0%, ${brandDark} 100%);">
              <img src="${logoUrl}" alt="Coorg Coffee Emblem" width="80" height="80" style="display: block; border-radius: 50%; border: 2px solid ${brandGold}; background-color: #FFFFFF; padding: 2px; margin-bottom: 12px;" />
              <h1 style="margin: 0; font-size: 26px; font-weight: 800; letter-spacing: 2px; color: #FFFFFF; text-transform: uppercase;">COORG COFFEE</h1>
              <p style="margin: 4px 0 0; font-size: 11px; letter-spacing: 3px; color: ${brandGold}; text-transform: uppercase; font-weight: 700;">PURE ESTATE HARVEST • MADIKERI</p>
            </td>
          </tr>

          <tr>
            <td style="padding: 24px 28px 12px; text-align: center;">
              <div style="display: inline-block; background-color: #1a3a24; border: 1px solid #2e7d32; border-radius: 20px; padding: 6px 16px; margin-bottom: 12px;">
                <span style="color: #4ade80; font-size: 12px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase;">✓ ORDER CONFIRMED</span>
              </div>
              <h2 style="margin: 0 0 10px; font-size: 22px; color: #FFFFFF; font-weight: 700;">Thank You for Your Order, ${customerName}! ☕</h2>
              <p style="margin: 0; font-size: 14px; line-height: 1.6; color: ${textLight};">
                Your order <strong style="color: ${brandGold};">#${orderNumber}</strong> has been confirmed. Our generational estate roastery in Madikeri, Coorg is preparing your freshly roasted harvest.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding: 16px 28px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: ${brandCard}; border: 1px solid #3A2F25; border-radius: 8px; overflow: hidden;">
                <thead>
                  <tr style="background-color: #1E1712; border-bottom: 1px solid #3A2F25;">
                    <th align="left" style="padding: 10px 10px; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: ${brandGold};">Item</th>
                    <th align="center" style="padding: 10px 10px; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: ${brandGold};">Qty</th>
                    <th align="right" style="padding: 10px 10px; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: ${brandGold};">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsRows}
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="2" style="padding: 10px 10px 4px; font-size: 12px; color: ${textMuted}; text-align: right;">Subtotal:</td>
                    <td style="padding: 10px 10px 4px; font-size: 12px; color: #FFFFFF; text-align: right; font-weight: 600;">₹${subtotal}</td>
                  </tr>
                  <tr>
                    <td colspan="2" style="padding: 4px 10px; font-size: 12px; color: ${textMuted}; text-align: right;">Shipping:</td>
                    <td style="padding: 4px 10px; font-size: 12px; color: ${shippingFee === 0 ? '#4ade80' : '#FFFFFF'}; text-align: right; font-weight: 600;">${shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</td>
                  </tr>
                  <tr style="border-top: 1px solid #45372B;">
                    <td colspan="2" style="padding: 12px 10px; font-size: 15px; color: #FFFFFF; text-align: right; font-weight: 800;">Grand Total:</td>
                    <td style="padding: 12px 10px; font-size: 18px; color: ${brandGold}; text-align: right; font-weight: 900;">₹${grandTotal}</td>
                  </tr>
                </tfoot>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding: 8px 28px 20px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: ${brandCard}; border: 1px solid #3A2F25; border-radius: 8px; padding: 16px;">
                <tr>
                  <td>
                    <div style="font-size: 11px; font-weight: 800; letter-spacing: 1.5px; color: ${brandGold}; text-transform: uppercase; margin-bottom: 6px;">
                      DELIVERY ADDRESS
                    </div>
                    <div style="font-size: 14px; font-weight: 700; color: #FFFFFF; margin-bottom: 4px;">
                      ${shipping.fullName || customerName}
                    </div>
                    <div style="font-size: 13px; color: ${textLight}; line-height: 1.5;">
                      ${shipping.line1 || ''}${shipping.line2 ? ', ' + shipping.line2 : ''}<br>
                      ${shipping.city || ''}, ${shipping.state || 'Karnataka'} - ${shipping.pincode || ''}<br>
                      ${customerPhone ? 'Phone: ' + customerPhone : ''}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding: 10px 28px 28px; text-align: center;">
              <p style="margin: 0 0 16px; font-size: 13px; line-height: 1.6; color: ${textMuted};">
                Our beans are shade-grown at 4,000 ft elevation in Madikeri, slow-roasted, and sealed in one-way degassing valve pouches to maintain peak freshness.
              </p>
              <div style="background-color: #16120E; border: 1px dashed #45372B; border-radius: 8px; padding: 14px; font-size: 12px; color: ${textLight};">
                <span style="color: ${brandGold}; font-weight: bold;">Estate Manager Direct Desk:</span><br>
                📞 +91 94834 72070 / +91 90718 70722<br>
                ✉️ <a href="mailto:support@coorgcoffees.in" style="color: ${brandGold}; text-decoration: none;">support@coorgcoffees.in</a>
              </div>
              <div style="margin-top: 20px;">
                <a href="${shopUrl}" style="display: inline-block; background-color: ${brandGold}; color: #000000; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; padding: 12px 28px; border-radius: 25px; text-decoration: none;">
                  SHOP MORE BLENDS
                </a>
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding: 20px; background-color: #120E0B; border-top: 1px solid #2D241C; text-align: center; font-size: 11px; color: #7A6F62;">
              <p style="margin: 0 0 6px;">Coorg Coffee Estate • Madikeri, Kodagu, Karnataka 571201</p>
              <p style="margin: 0;">© ${new Date().getFullYear()} Coorg Coffee. Hand-crafted with pride in the Western Ghats.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export async function handleSendOrderConfirmationEmail(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body: { order?: any } = {};
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const order = body.order;
  if (!order) {
    return new Response(JSON.stringify({ error: 'Order data required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const recipient = (order.guestEmail || order.shippingAddress?.email || '').trim().toLowerCase();
  if (!recipient || !recipient.includes('@')) {
    return new Response(JSON.stringify({ error: 'Valid customer email is required.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { host, port, user, pass, from } = getSmtpConfig();
  const orderNumber = order.orderNumber || 'CC-2026';

  if (!pass) {
    console.warn(`SMTP_PASS not configured in .env. Simulated order confirmation email for #${orderNumber} to ${recipient}`);
    return new Response(
      JSON.stringify({
        success: true,
        simulated: true,
        recipient,
        orderNumber,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    const html = buildOrderConfirmedEmailHtml(order);

    const info = await transporter.sendMail({
      from,
      to: recipient,
      subject: `☕ Order Confirmed! (#${orderNumber}) - Coorg Coffee`,
      html,
    });

    return new Response(
      JSON.stringify({
        success: true,
        messageId: info.messageId,
        recipient,
        orderNumber,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('SMTP Order Confirmation Email Error:', error);
    return new Response(
      JSON.stringify({
        error: error?.message || 'Failed to dispatch order confirmation email via SMTP server.',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

