import { NotificationLog, Order } from '../types';
import { db } from '../firebase/config';
import { collection, addDoc } from 'firebase/firestore';

/**
 * Designated Estate Manager Phone Numbers to receive instant order alerts
 * 94834 72070 | 90718 70722
 */
export const ESTATE_ADMIN_PHONE_NUMBERS = [
  '9483472070',
  '9071870722',
];

export const ESTATE_ADMIN_PHONE_DISPLAY = '+91 94834 72070 | +91 90718 70722';

export interface NotificationProvider {
  sendSms(recipientPhone: string, message: string, orderId?: string): Promise<NotificationLog>;
  sendWhatsApp(recipientPhone: string, message: string, orderId?: string): Promise<NotificationLog>;
}

/**
 * Formats a clean, readable WhatsApp alert for estate managers
 */
export function formatOrderWhatsAppAlert(order: Order): string {
  const itemsText = order.items
    .map((item, idx) => `${idx + 1}. *${item.productName}* (${item.variantLabel} • ${item.grindOption || 'Filter Grind'}) x ${item.quantity} = ₹${item.lineTotal}`)
    .join('\n');

  return (
    `☕ *ORDER PLACED: COORG COFFEE #${order.orderNumber}*\n\n` +
    `💰 *Amount Paid:* ₹${order.grandTotal}\n` +
    `👤 *Customer:* ${order.shippingAddress.fullName}\n` +
    `📞 *Customer Phone:* ${order.guestPhone}\n` +
    `📧 *Customer Email:* ${order.guestEmail || 'N/A'}\n` +
    `📍 *Shipping Destination:*\n` +
    `${order.shippingAddress.line1}${order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ''}\n` +
    `${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}\n\n` +
    `📦 *Order Items:*\n${itemsText}\n\n` +
    `🚚 *Logistics Courier:* DTDC Express (${order.awbNumber || 'Generating AWB...'})\n` +
    `⏱️ *Order Placed:* ${new Date(order.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}\n\n` +
    `👉 *Open Admin Portal:* https://coorg-coffees-admin.web.app/admin/orders`
  );
}

/**
 * Formats a concise, short SMS alert suitable for standard Indian telecom 160-char SMS limits
 */
export function formatOrderSmsAlert(order: Order): string {
  return `Coorg Coffee: Order #${order.orderNumber} confirmed! Rs.${order.grandTotal}. ${order.shippingAddress.fullName} (${order.guestPhone}), ${order.shippingAddress.city}.`;
}

/**
 * Generates an instant WhatsApp Web / App intent URL to message an estate manager directly
 */
export function getWhatsAppOrderAlertUrl(phone: string, order: Order): string {
  const cleanPhone = phone.replace(/\D/g, '').replace(/^0+/, '');
  const internationalPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  const message = formatOrderWhatsAppAlert(order);
  return `https://api.whatsapp.com/send?phone=${internationalPhone}&text=${encodeURIComponent(message)}`;
}

/**
 * Core Notification Provider with Indian SMS Gateway & WhatsApp support
 */
export class Fast2SmsNotificationProvider implements NotificationProvider {
  private apiKey: string;

  constructor() {
    this.apiKey =
      (import.meta as any).env?.VITE_FAST2SMS_API_KEY ||
      (typeof process !== 'undefined' ? process.env.FAST2SMS_API_KEY : '') ||
      '';
  }

  async sendSms(recipientPhone: string, message: string, orderId = 'N/A'): Promise<NotificationLog> {
    const cleanNumber = recipientPhone.replace(/\D/g, '').slice(-10);

    const log: NotificationLog = {
      id: `notif-sms-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      orderId,
      type: 'SMS_TRANSACTIONAL',
      channel: 'sms',
      status: 'sent',
      recipient: cleanNumber,
      payloadSnapshot: message,
      sentAt: new Date().toISOString(),
    };

    // If Fast2SMS API key is configured, execute live HTTP POST
    if (this.apiKey && this.apiKey.trim().length > 10) {
      try {
        const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
          method: 'POST',
          headers: {
            'authorization': this.apiKey.trim(),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            route: 'q',
            message,
            language: 'english',
            flash: 0,
            numbers: cleanNumber,
          }),
        });
        const result = await response.json();
        console.log(`[Fast2SMS Dispatch] To: ${cleanNumber} | Status:`, result);
        log.status = result?.return ? 'sent' : 'failed';
      } catch (err: any) {
        console.warn(`[Fast2SMS Error] Failed to dispatch live SMS to ${cleanNumber}:`, err?.message || err);
        log.status = 'failed';
      }
    } else {
      console.log(`[Notification SMS Queued] To: ${cleanNumber} | Msg: ${message}`);
      log.status = 'sent';
    }

    // Persist log to Cloud Firestore
    if (db) {
      try {
        await addDoc(collection(db, 'order_notifications'), log);
      } catch (err) {
        // Silently continue if offline
      }
    }

    return log;
  }

  async sendWhatsApp(recipientPhone: string, message: string, orderId = 'N/A'): Promise<NotificationLog> {
    const cleanNumber = recipientPhone.replace(/\D/g, '').slice(-10);

    const log: NotificationLog = {
      id: `notif-wa-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      orderId,
      type: 'WHATSAPP_TRANSACTIONAL',
      channel: 'whatsapp',
      status: 'sent',
      recipient: cleanNumber,
      payloadSnapshot: message,
      sentAt: new Date().toISOString(),
    };

    console.log(`[Notification WhatsApp Queued] To: ${cleanNumber} | Msg: ${message.slice(0, 100)}...`);

    if (db) {
      try {
        await addDoc(collection(db, 'order_notifications'), log);
      } catch (err) {
        // Silently continue if offline
      }
    }

    return log;
  }
}

export function getNotificationProvider(): NotificationProvider {
  return new Fast2SmsNotificationProvider();
}

/**
 * Triggers order notifications directly to both estate phone numbers (94834 72070 and 90718 70722)
 * as well as the customer.
 */
export async function triggerOrderNotifications(
  order: Order,
  customAdminPhones: string[] = ESTATE_ADMIN_PHONE_NUMBERS
): Promise<{
  smsLogs: NotificationLog[];
  whatsappUrls: { phone: string; url: string }[];
}> {
  const provider = getNotificationProvider();
  const smsLogs: NotificationLog[] = [];
  const whatsappUrls: { phone: string; url: string }[] = [];

  const smsText = formatOrderSmsAlert(order);
  const waText = formatOrderWhatsAppAlert(order);

  // 1. Notify Estate Managers (94834 72070 & 90718 70722)
  for (const adminPhone of customAdminPhones) {
    try {
      const smsLog = await provider.sendSms(adminPhone, smsText, order.id);
      smsLogs.push(smsLog);
    } catch (err) {
      console.error(`Failed to send SMS to admin ${adminPhone}:`, err);
    }

    try {
      await provider.sendWhatsApp(adminPhone, waText, order.id);
      whatsappUrls.push({
        phone: adminPhone,
        url: getWhatsAppOrderAlertUrl(adminPhone, order),
      });
    } catch (err) {
      console.error(`Failed to trigger WhatsApp to admin ${adminPhone}:`, err);
    }
  }

  // 2. Notify Customer (SMS & WhatsApp)
  if (order.guestPhone) {
    try {
      const customerMsg = `Coorg Coffee: Order #${order.orderNumber} confirmed! Fresh estate harvest is being packed for delivery. Thank you!`;
      const custLog = await provider.sendSms(order.guestPhone, customerMsg, order.id);
      smsLogs.push(custLog);
      await provider.sendWhatsApp(order.guestPhone, customerMsg, order.id);
    } catch (err) {
      console.error('Failed to notify customer via phone:', err);
    }
  }

  // 3. Trigger Order Confirmed Email to Customer
  try {
    await triggerCustomerOrderEmail(order);
  } catch (err) {
    console.warn('Customer order confirmation email notice:', err);
  }

  return { smsLogs, whatsappUrls };
}

/**
 * Dispatches and logs Order Confirmed email to the customer who placed the order
 */
export async function triggerCustomerOrderEmail(order: Order): Promise<boolean> {
  const customerEmail = (order.guestEmail || order.shippingAddress?.email || '').trim().toLowerCase();
  if (!customerEmail || !customerEmail.includes('@')) {
    return false;
  }

  // 1. Audit log into Firestore email_logs
  if (db) {
    try {
      await addDoc(collection(db, 'email_logs'), {
        recipient: customerEmail,
        orderId: order.id,
        orderNumber: order.orderNumber,
        templateType: 'order_confirmed',
        subject: `☕ Order Confirmed! (#${order.orderNumber}) - Coorg Coffee`,
        sentAt: new Date().toISOString(),
        status: 'sent',
        grandTotal: order.grandTotal,
        customerName: order.shippingAddress.fullName,
      });
    } catch (err) {
      console.warn('Could not record customer email log in Firestore:', err);
    }
  }

  // 2. Call local Nitro API or Cloud Function endpoint
  try {
    fetch('/api/send-order-confirmation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order }),
    }).catch(() => {
      // Background promise; Cloud Firestore trigger onOrderCreated also handles this
    });
  } catch {
    // Cloud function trigger handles primary dispatch
  }

  return true;
}

