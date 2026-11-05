import { Subscriber, BroadcastPayload } from '../types';
import { db } from '../firebase/config';
import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { emailService } from './email-service';

const LOCAL_SUBSCRIBERS_KEY = 'coorg_subscribers';

export class NewsletterService {
  /**
   * Get all active subscribers from LocalStorage & Firestore
   */
  async getSubscribers(): Promise<Subscriber[]> {
    const list: Subscriber[] = [];

    // Local Storage
    try {
      const localStr = localStorage.getItem(LOCAL_SUBSCRIBERS_KEY);
      if (localStr) {
        list.push(...JSON.parse(localStr));
      }
    } catch (e) {
      console.warn('Failed to parse local subscribers:', e);
    }

    // Firestore
    try {
      if (db) {
        const q = query(collection(db, 'subscribers'));
        const snapshot = await getDocs(q);
        snapshot.forEach((docSnap) => {
          const sub = docSnap.data() as Subscriber;
          if (!list.some((s) => s.email.toLowerCase() === sub.email.toLowerCase())) {
            list.push(sub);
          }
        });
      }
    } catch (err) {
      console.warn('Could not fetch subscribers from Firestore:', err);
    }

    return list;
  }

  /**
   * Subscribe a new user with their email address
   */
  async subscribe(emailInput: string): Promise<{ success: boolean; isNew: boolean; subscriber: Subscriber }> {
    const email = emailInput.trim().toLowerCase();

    if (!email || !email.includes('@')) {
      throw new Error('Please enter a valid email address.');
    }

    const existingSubscribers = await this.getSubscribers();
    const existing = existingSubscribers.find((s) => s.email.toLowerCase() === email);

    if (existing) {
      // Re-activate if was unsubscribed
      const updated: Subscriber = {
        ...existing,
        status: 'active',
        subscribedAt: new Date().toISOString(),
      };
      await this.saveSubscriber(updated);
      return { success: true, isNew: false, subscriber: updated };
    }

    // Create new subscriber
    const newSubscriber: Subscriber = {
      id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      email,
      subscribedAt: new Date().toISOString(),
      status: 'active',
      preferences: {
        welcomeSent: true,
        newProducts: true,
        priceDrops: true,
        siteActivity: true,
      },
    };

    await this.saveSubscriber(newSubscriber);

    // Dispatch real Welcome & Confirmation Email via Server API & Cloud Functions!
    try {
      if (typeof window !== 'undefined') {
        fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, couponCode: 'WELCOME10' }),
        }).catch((err) => console.warn('Email dispatch notice:', err));
      }

      await emailService.sendEmail('welcome_subscription', email, {
        templateType: 'welcome_subscription',
        subject: '☕ Welcome to Coorg Coffee — Fresh Harvest & 10% Off Inside!',
        title: 'Welcome to the Coorg Coffee Family!',
        message:
          'Thank you for subscribing to our harvest releases! As a welcome gift, use promo code WELCOME10 for 10% off your first order of pure single-origin Coorg coffee.',
        ctaText: 'SHOP FRESH COFFEE',
        ctaUrl: 'https://coorgcoffees.in/shop',
      });
    } catch (emailErr) {
      console.warn('Welcome email dispatch warning:', emailErr);
    }

    return { success: true, isNew: true, subscriber: newSubscriber };
  }

  /**
   * Save or update subscriber record in LocalStorage and Firestore
   */
  private async saveSubscriber(subscriber: Subscriber): Promise<void> {
    // 1. LocalStorage
    try {
      const existingStr = localStorage.getItem(LOCAL_SUBSCRIBERS_KEY);
      const list: Subscriber[] = existingStr ? JSON.parse(existingStr) : [];
      const index = list.findIndex((s) => s.email.toLowerCase() === subscriber.email.toLowerCase());
      if (index >= 0) {
        list[index] = subscriber;
      } else {
        list.unshift(subscriber);
      }
      localStorage.setItem(LOCAL_SUBSCRIBERS_KEY, JSON.stringify(list));
    } catch (e) {
      console.error('LocalStorage save error:', e);
    }

    // 2. Firestore
    try {
      if (db) {
        const docRef = doc(db, 'subscribers', subscriber.id || subscriber.email);
        await setDoc(docRef, subscriber, { merge: true });
      }
    } catch (err) {
      console.warn('Firestore subscriber save error:', err);
    }
  }

  /**
   * Send automated broadcast notification for New Products, Price Drops, or Site Announcements
   */
  async notifySubscribers(payload: BroadcastPayload): Promise<{ total: number; sent: number }> {
    const subscribers = await this.getSubscribers();
    const activeSubscribers = subscribers.filter((s) => s.status === 'active');

    const result = await emailService.broadcastToSubscribers(activeSubscribers, payload);

    return {
      total: activeSubscribers.length,
      sent: result.sentCount,
    };
  }
}

export const newsletterService = new NewsletterService();
