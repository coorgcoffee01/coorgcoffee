"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOrderConfirmationEmail = exports.onOrderCreated = exports.sendWelcomeEmail = exports.onSubscriberCreated = void 0;
const admin = __importStar(require("firebase-admin"));
const firestore_1 = require("firebase-functions/v2/firestore");
const https_1 = require("firebase-functions/v2/https");
const nodemailer = __importStar(require("nodemailer"));
admin.initializeApp();
const db = admin.firestore();
/**
 * Configure Nodemailer Transporter
 * Reads SMTP credentials from environment variables (Hostinger, Gmail, or custom SMTP)
 */
function getTransporter() {
    const host = process.env.SMTP_HOST || 'smtp.hostinger.com';
    const port = parseInt(process.env.SMTP_PORT || '465', 10);
    const user = process.env.SMTP_USER || 'support@coorgcoffees.in';
    const pass = process.env.SMTP_PASS || '';
    if (!pass) {
        console.warn('⚠️ SMTP_PASS is not configured in Cloud Functions. Emails will log to Firestore. Set SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS via functions/.env or Firebase Secrets.');
    }
    return nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: {
            user,
            pass,
        },
    });
}
const FROM_SENDER = process.env.FROM_EMAIL || '"Coorg Coffee" <support@coorgcoffees.in>';
/**
 * Generate Responsive HTML for Welcome Email
 */
function generateWelcomeEmailHtml(recipientEmail, couponCode = 'WELCOME10') {
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
        <!-- Main Card Container -->
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
/**
 * 1. Firestore Trigger: Triggered when a new subscriber document is created
 * Listening to 'subscribers/{subscriberId}'
 */
exports.onSubscriberCreated = (0, firestore_1.onDocumentCreated)('subscribers/{subscriberId}', async (event) => {
    const snap = event.data;
    if (!snap)
        return;
    const data = snap.data();
    const email = (data?.email || '').trim().toLowerCase();
    if (!email || !email.includes('@')) {
        console.warn('Invalid email on subscriber document:', event.params.subscriberId);
        return;
    }
    console.log(`Sending welcome email to new subscriber: ${email}`);
    const transporter = getTransporter();
    const html = generateWelcomeEmailHtml(email, data?.couponCode || 'WELCOME10');
    try {
        const info = await transporter.sendMail({
            from: FROM_SENDER,
            to: email,
            subject: '☕ Welcome to Coorg Coffee — Fresh Harvest & 10% Off Inside!',
            html,
        });
        console.log(`Email dispatched successfully! Message ID: ${info.messageId}`);
        // Update subscriber document with dispatch confirmation
        await snap.ref.update({
            welcomeEmailSent: true,
            welcomeEmailSentAt: admin.firestore.FieldValue.serverTimestamp(),
            messageId: info.messageId,
        });
        // Audit log into email_logs collection
        await db.collection('email_logs').add({
            recipient: email,
            templateType: 'welcome_subscription',
            subject: '☕ Welcome to Coorg Coffee — Fresh Harvest & 10% Off Inside!',
            sentAt: new Date().toISOString(),
            status: 'sent',
            messageId: info.messageId,
        });
    }
    catch (error) {
        console.error(`Failed to dispatch email to ${email}:`, error);
        await snap.ref.update({
            welcomeEmailSent: false,
            welcomeEmailError: error?.message || 'SMTP dispatch failure',
        });
        await db.collection('email_logs').add({
            recipient: email,
            templateType: 'welcome_subscription',
            subject: '☕ Welcome to Coorg Coffee — Fresh Harvest & 10% Off Inside!',
            sentAt: new Date().toISOString(),
            status: 'failed',
            error: error?.message || 'SMTP dispatch failure',
        });
    }
});
/**
 * 2. HTTPS Endpoint: Direct Callable/onRequest to trigger welcome email
 * POST https://<region>-<project>.cloudfunctions.net/sendWelcomeEmail
 * Body: { "email": "customer@gmail.com" }
 */
exports.sendWelcomeEmail = (0, https_1.onRequest)({ cors: true }, async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
        return;
    }
    const { email, couponCode } = req.body || {};
    const recipient = (email || '').trim().toLowerCase();
    if (!recipient || !recipient.includes('@')) {
        res.status(400).json({ error: 'Valid email is required.' });
        return;
    }
    const transporter = getTransporter();
    const html = generateWelcomeEmailHtml(recipient, couponCode || 'WELCOME10');
    try {
        const info = await transporter.sendMail({
            from: FROM_SENDER,
            to: recipient,
            subject: '☕ Welcome to Coorg Coffee — Fresh Harvest & 10% Off Inside!',
            html,
        });
        res.status(200).json({
            success: true,
            messageId: info.messageId,
            recipient,
        });
    }
    catch (error) {
        console.error('sendWelcomeEmail HTTP error:', error);
        res.status(500).json({
            error: error?.message || 'Failed to dispatch email via SMTP.',
        });
    }
});
/**
 * Generate Responsive HTML for Order Confirmed Email sent to the customer
 */
function generateOrderConfirmedEmailHtml(order) {
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
    const items = Array.isArray(order.items) ? order.items : [];
    const itemsRows = items
        .map((item) => `
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
    `)
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
        <!-- Main Card Container -->
        <table role="presentation" width="100%" style="max-width: 600px; background-color: ${brandDark}; border: 1px solid #3A2F25; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
          
          <!-- Header Banner with Logo -->
          <tr>
            <td align="center" style="padding: 32px 20px 20px; border-bottom: 1px solid #2D241C; background: linear-gradient(180deg, #241D17 0%, ${brandDark} 100%);">
              <img src="${logoUrl}" alt="Coorg Coffee Emblem" width="80" height="80" style="display: block; border-radius: 50%; border: 2px solid ${brandGold}; background-color: #FFFFFF; padding: 2px; margin-bottom: 12px;" />
              <h1 style="margin: 0; font-size: 26px; font-weight: 800; letter-spacing: 2px; color: #FFFFFF; text-transform: uppercase;">COORG COFFEE</h1>
              <p style="margin: 4px 0 0; font-size: 11px; letter-spacing: 3px; color: ${brandGold}; text-transform: uppercase; font-weight: 700;">PURE ESTATE HARVEST • MADIKERI</p>
            </td>
          </tr>

          <!-- Confirmation Badge -->
          <tr>
            <td style="padding: 24px 28px 12px; text-align: center;">
              <div style="display: inline-block; background-color: #1a3a24; border: 1px solid #2e7d32; border-radius: 20px; padding: 6px 16px; margin-bottom: 12px;">
                <span style="color: #4ade80; font-size: 12px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase;">✓ ORDER CONFIRMED</span>
              </div>
              <h2 style="margin: 0 0 10px; font-size: 22px; color: #FFFFFF; font-weight: 700;">Thank You for Your Order, ${customerName}! ☕</h2>
              <p style="margin: 0; font-size: 14px; line-height: 1.6; color: ${textLight};">
                Your order <strong style="color: ${brandGold};">#${orderNumber}</strong> has been placed and confirmed. Our generational estate roastery in Madikeri, Coorg is preparing your freshly roasted harvest.
              </p>
            </td>
          </tr>

          <!-- Order Summary Items -->
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

          <!-- Delivery Address -->
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

          <!-- Estate Note & Support Help -->
          <tr>
            <td style="padding: 10px 28px 28px; text-align: center;">
              <p style="margin: 0 0 16px; font-size: 13px; line-height: 1.6; color: ${textMuted};">
                Our beans are shade-grown at 4,000 ft elevation in Madikeri, slow-roasted, and sealed in one-way degassing valve pouches to maintain peak freshness upon arrival.
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

          <!-- Footer -->
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
/**
 * 3. Firestore Trigger: Triggered when a customer makes an order
 * Listening to 'orders/{orderId}'
 * Dispatches:
 * 1) Short SMS alert to estate managers: +91 94834 72070 and +91 90718 70722
 * 2) Order Confirmed Email directly to the customer who placed the order
 */
exports.onOrderCreated = (0, firestore_1.onDocumentCreated)('orders/{orderId}', async (event) => {
    const snap = event.data;
    if (!snap)
        return;
    const order = snap.data();
    if (!order)
        return;
    const adminPhones = ['9483472070', '9071870722'];
    const orderNumber = order.orderNumber || event.params.orderId;
    const customerName = order.shippingAddress?.fullName || 'Customer';
    const customerPhone = order.guestPhone || order.shippingAddress?.phone || 'N/A';
    const customerEmail = (order.guestEmail || order.shippingAddress?.email || '').trim().toLowerCase();
    const grandTotal = order.grandTotal || 0;
    const city = order.shippingAddress?.city || 'Karnataka';
    // Short message as requested by user:
    const alertMessage = `Coorg Coffee: Order #${orderNumber} confirmed! Rs.${grandTotal}. ${customerName} (${customerPhone}), ${city}.`;
    console.log(`[Order Alert] New order #${orderNumber} received. Alerting ${adminPhones.join(', ')}`);
    // 1. Send SMS via Fast2SMS if API key is configured
    const fast2smsKey = process.env.FAST2SMS_API_KEY;
    if (fast2smsKey) {
        try {
            const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
                method: 'POST',
                headers: {
                    'authorization': fast2smsKey,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    route: 'q',
                    message: alertMessage,
                    language: 'english',
                    flash: 0,
                    numbers: adminPhones.join(','),
                }),
            });
            const resData = await response.json();
            console.log('[Fast2SMS Result]:', resData);
        }
        catch (err) {
            console.error('[Fast2SMS Error]:', err?.message || err);
        }
    }
    // 2. Persist audit alert in order_notifications collection
    try {
        await db.collection('order_notifications').add({
            orderId: event.params.orderId,
            orderNumber,
            type: 'ADMIN_ORDER_ALERT',
            recipients: adminPhones,
            message: alertMessage,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            dispatchedLive: Boolean(fast2smsKey),
        });
    }
    catch (err) {
        console.warn('Could not record order_notification in Firestore:', err);
    }
    // 3. Trigger Order Confirmed Email to the one who placed the order
    if (customerEmail && customerEmail.includes('@')) {
        console.log(`[Order Email] Triggering Order Confirmed email to: ${customerEmail}`);
        const transporter = getTransporter();
        const emailHtml = generateOrderConfirmedEmailHtml(order);
        try {
            const mailInfo = await transporter.sendMail({
                from: FROM_SENDER,
                to: customerEmail,
                subject: `☕ Order Confirmed! (#${orderNumber}) - Coorg Coffee`,
                html: emailHtml,
            });
            console.log(`[Order Email] Dispatched successfully! Message ID: ${mailInfo.messageId}`);
            await snap.ref.update({
                customerEmailSent: true,
                customerEmailSentAt: admin.firestore.FieldValue.serverTimestamp(),
                customerEmailMessageId: mailInfo.messageId,
            });
            await db.collection('email_logs').add({
                recipient: customerEmail,
                orderId: event.params.orderId,
                orderNumber,
                templateType: 'order_confirmed',
                subject: `☕ Order Confirmed! (#${orderNumber}) - Coorg Coffee`,
                sentAt: new Date().toISOString(),
                status: 'sent',
                messageId: mailInfo.messageId,
            });
        }
        catch (mailError) {
            console.error(`[Order Email] Failed to send email to ${customerEmail}:`, mailError);
            await snap.ref.update({
                customerEmailSent: false,
                customerEmailError: mailError?.message || 'SMTP dispatch failed',
            });
            await db.collection('email_logs').add({
                recipient: customerEmail,
                orderId: event.params.orderId,
                orderNumber,
                templateType: 'order_confirmed',
                subject: `☕ Order Confirmed! (#${orderNumber}) - Coorg Coffee`,
                sentAt: new Date().toISOString(),
                status: 'failed',
                error: mailError?.message || 'SMTP dispatch failed',
            });
        }
    }
    else {
        console.warn(`[Order Email] No valid customer email found on order #${orderNumber}`);
    }
});
/**
 * 4. HTTPS Endpoint: Direct Callable/onRequest to trigger Order Confirmed email
 * POST https://<region>-<project>.cloudfunctions.net/sendOrderConfirmationEmail
 * Body: { "order": { "orderNumber": "...", "guestEmail": "...", ... } }
 */
exports.sendOrderConfirmationEmail = (0, https_1.onRequest)({ cors: true }, async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
        return;
    }
    const { order } = req.body || {};
    if (!order) {
        res.status(400).json({ error: 'Order data is required in body.' });
        return;
    }
    const customerEmail = (order.guestEmail || order.shippingAddress?.email || '').trim().toLowerCase();
    if (!customerEmail || !customerEmail.includes('@')) {
        res.status(400).json({ error: 'Valid customer email is required.' });
        return;
    }
    const orderNumber = order.orderNumber || 'CC-2026';
    const transporter = getTransporter();
    const html = generateOrderConfirmedEmailHtml(order);
    try {
        const info = await transporter.sendMail({
            from: FROM_SENDER,
            to: customerEmail,
            subject: `☕ Order Confirmed! (#${orderNumber}) - Coorg Coffee`,
            html,
        });
        await db.collection('email_logs').add({
            recipient: customerEmail,
            orderNumber,
            templateType: 'order_confirmed',
            subject: `☕ Order Confirmed! (#${orderNumber}) - Coorg Coffee`,
            sentAt: new Date().toISOString(),
            status: 'sent',
            messageId: info.messageId,
        });
        res.status(200).json({
            success: true,
            messageId: info.messageId,
            recipient: customerEmail,
        });
    }
    catch (error) {
        console.error('sendOrderConfirmationEmail HTTP error:', error);
        res.status(500).json({
            error: error?.message || 'Failed to dispatch order confirmed email.',
        });
    }
});
//# sourceMappingURL=index.js.map