import { EmailLog, BroadcastPayload, Subscriber } from '../types';
import { db } from '../firebase/config';
import { collection, addDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';

const LOCAL_EMAIL_LOGS_KEY = 'coorg_email_logs';

/**
 * Generate responsive inline HTML email template for Coorg Coffee notifications
 */
export function generateEmailHtml(payload: BroadcastPayload, recipientEmail: string): string {
  const brandGold = '#C89B3C';
  const brandDark = '#1C1612';
  const brandBg = '#0F0C0A';
  const brandCard = '#251E17';
  const textLight = '#E8D9C5';
  const textMuted = '#B8A895';

  let specificContentHtml = '';

  switch (payload.templateType) {
    case 'welcome_subscription':
      specificContentHtml = `
        <div style="background-color: ${brandCard}; padding: 20px; border-radius: 8px; border: 1px solid #3A2F25; margin-bottom: 24px; text-align: center;">
          <h3 style="color: ${brandGold}; margin-top: 0; font-size: 18px; text-transform: uppercase; letter-spacing: 1px;">🎁 Your Exclusive Welcome Gift</h3>
          <p style="color: ${textLight}; font-size: 14px; margin-bottom: 12px;">Use promo code at checkout for 10% off your first order:</p>
          <div style="display: inline-block; background: ${brandGold}; color: #000; font-weight: bold; font-size: 20px; padding: 10px 24px; border-radius: 6px; letter-spacing: 2px;">
            WELCOME10
          </div>
        </div>
        <p style="color: ${textLight}; font-size: 14px; line-height: 1.6;">
          You will now be the first to know when:
        </p>
        <ul style="color: ${textMuted}; font-size: 14px; line-height: 1.8; padding-left: 20px;">
          <li>✨ <strong>New Harvest Blends</strong> are roasted and launched</li>
          <li>📉 <strong>Price Drops & Flash Sales</strong> take effect</li>
          <li>⛰️ <strong>Estate Stories & Brewing Guides</strong> are published</li>
        </ul>
      `;
      break;

    case 'new_product_launch':
      specificContentHtml = `
        <div style="background-color: ${brandCard}; padding: 20px; border-radius: 8px; border: 1px solid #3A2F25; margin-bottom: 24px; text-align: center;">
          ${payload.productImage ? `<img src="${payload.productImage}" alt="${payload.productName || 'New Product'}" style="max-width: 100%; max-height: 240px; border-radius: 8px; margin-bottom: 16px; object-fit: cover;" />` : ''}
          <h3 style="color: ${brandGold}; margin: 0 0 8px 0; font-size: 20px;">${payload.productName || 'Fresh Coffee Release'}</h3>
          <p style="color: ${textLight}; font-size: 14px; margin-bottom: 16px;">${payload.message}</p>
          ${payload.newPrice ? `<div style="font-size: 22px; color: ${brandGold}; font-weight: bold; margin-bottom: 16px;">₹${payload.newPrice}</div>` : ''}
        </div>
      `;
      break;

    case 'price_drop_alert':
      specificContentHtml = `
        <div style="background-color: ${brandCard}; padding: 20px; border-radius: 8px; border: 1px solid #3A2F25; margin-bottom: 24px; text-align: center;">
          <div style="display: inline-block; background-color: #2D6A4F; color: #FFFFFF; font-size: 12px; font-weight: bold; padding: 4px 12px; border-radius: 20px; text-transform: uppercase; margin-bottom: 12px;">
            PRICE DROP ALERT 📉
          </div>
          ${payload.productImage ? `<img src="${payload.productImage}" alt="${payload.productName || 'Product'}" style="max-width: 100%; max-height: 200px; border-radius: 8px; margin-bottom: 16px; object-fit: cover;" />` : ''}
          <h3 style="color: ${textLight}; margin: 0 0 8px 0; font-size: 18px;">${payload.productName || 'Coorg Special Blend'}</h3>
          <div style="margin: 12px 0;">
            ${payload.originalPrice ? `<span style="color: #A09080; text-decoration: line-through; font-size: 16px; margin-right: 10px;">₹${payload.originalPrice}</span>` : ''}
            ${payload.newPrice ? `<span style="color: ${brandGold}; font-weight: bold; font-size: 24px;">₹${payload.newPrice}</span>` : ''}
          </div>
          <p style="color: ${textMuted}; font-size: 14px; margin-top: 8px;">${payload.message}</p>
        </div>
      `;
      break;

    case 'site_activity_announcement':
    default:
      specificContentHtml = `
        <div style="background-color: ${brandCard}; padding: 20px; border-radius: 8px; border: 1px solid #3A2F25; margin-bottom: 24px;">
          <p style="color: ${textLight}; font-size: 14px; line-height: 1.6; margin: 0;">${payload.message}</p>
        </div>
      `;
      break;
  }

  const ctaUrl = payload.ctaUrl || 'https://webtech-6dfba--staging-t9tcm2ki.web.app/shop';
  const ctaText = payload.ctaText || 'EXPLORE COORG COFFEE';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${payload.subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: ${brandBg}; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: ${brandBg}; padding: 30px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: ${brandDark}; border-radius: 12px; overflow: hidden; border: 1px solid #2F261E; max-width: 600px; width: 100%;">
          
          <!-- Header -->
          <tr>
            <td style="padding: 24px; text-align: center; background-color: #14100C; border-bottom: 2px solid ${brandGold};">
              <h1 style="color: ${textLight}; margin: 0; font-size: 24px; letter-spacing: 3px; font-weight: bold;">
                COORG COFFEE
              </h1>
              <p style="color: ${brandGold}; margin: 4px 0 0 0; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; font-weight: 600;">
                FROM THE LAND OF MIST & HONEY
              </p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 30px 24px;">
              <h2 style="color: ${textLight}; font-size: 20px; margin-top: 0; margin-bottom: 16px;">
                ${payload.title}
              </h2>
              
              ${specificContentHtml}

              <!-- CTA Button -->
              <div style="text-align: center; margin: 30px 0 20px 0;">
                <a href="${ctaUrl}" style="background-color: ${brandGold}; color: #12100E; font-weight: bold; font-size: 14px; text-decoration: none; padding: 14px 32px; border-radius: 30px; display: inline-block; letter-spacing: 1px; text-transform: uppercase;">
                  ${ctaText}
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 24px; background-color: #120E0B; text-align: center; border-top: 1px solid #292018;">
              <p style="color: ${textMuted}; font-size: 11px; margin: 0 0 8px 0;">
                Estate Contact: Madikeri, Coorg District, Karnataka - 571201 | support@coorgcoffee.in
              </p>
              <p style="color: #6E6152; font-size: 10px; margin: 0;">
                Sent to ${recipientEmail} because you subscribed to fresh harvest releases.
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

export class EmailService {
  /**
   * Dispatch an email log to subscriber and record entry
   */
  async sendEmail(
    templateType: EmailLog['templateType'],
    recipientEmail: string,
    payload: BroadcastPayload
  ): Promise<EmailLog> {
    const htmlBody = generateEmailHtml(payload, recipientEmail);
    const logId = `email-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    const log: EmailLog = {
      id: logId,
      templateType,
      recipientEmail,
      subject: payload.subject,
      status: 'sent',
      sentAt: new Date().toISOString(),
      previewSnippet: payload.message.substring(0, 120),
      metadata: {
        title: payload.title,
        productName: payload.productName,
        htmlLength: htmlBody.length,
      },
    };

    console.log(`[EmailService DISPATCH] To: ${recipientEmail} | Subject: "${payload.subject}"`);

    // 1. Save log to Firestore if db exists
    try {
      if (db) {
        await addDoc(collection(db, 'email_logs'), {
          ...log,
          htmlSnapshot: htmlBody,
        });
      }
    } catch (err) {
      console.warn('Firestore email log save skipped:', err);
    }

    // 2. Persist in Local Storage for offline / quick UI retrieval
    this.saveToLocalStorage(log);

    return log;
  }

  /**
   * Broadcast email to a list of subscribers
   */
  async broadcastToSubscribers(
    subscribers: Subscriber[],
    payload: BroadcastPayload
  ): Promise<{ sentCount: number; logs: EmailLog[] }> {
    const logs: EmailLog[] = [];
    const activeSubscribers = subscribers.filter((s) => s.status === 'active');

    for (const sub of activeSubscribers) {
      const log = await this.sendEmail(payload.templateType, sub.email, payload);
      logs.push(log);
    }

    return {
      sentCount: logs.length,
      logs,
    };
  }

  private saveToLocalStorage(log: EmailLog) {
    try {
      const existingStr = localStorage.getItem(LOCAL_EMAIL_LOGS_KEY);
      const existing: EmailLog[] = existingStr ? JSON.parse(existingStr) : [];
      const updated = [log, ...existing].slice(0, 100); // keep last 100 logs
      localStorage.setItem(LOCAL_EMAIL_LOGS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to update local email logs:', e);
    }
  }

  /**
   * Get recent email dispatch logs from localStorage & Firestore
   */
  async getEmailLogs(): Promise<EmailLog[]> {
    const logs: EmailLog[] = [];

    // Local Storage logs
    try {
      const localStr = localStorage.getItem(LOCAL_EMAIL_LOGS_KEY);
      if (localStr) {
        logs.push(...JSON.parse(localStr));
      }
    } catch {
      // ignore
    }

    // Firestore logs
    try {
      if (db) {
        const q = query(collection(db, 'email_logs'), orderBy('sentAt', 'desc'), limit(50));
        const snapshot = await getDocs(q);
        snapshot.forEach((doc) => {
          const data = doc.data() as EmailLog;
          if (!logs.some((l) => l.id === data.id)) {
            logs.push(data);
          }
        });
      }
    } catch (err) {
      console.warn('Could not fetch email logs from Firestore:', err);
    }

    // Sort by sentAt descending
    return logs.sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
  }
}

export const emailService = new EmailService();
