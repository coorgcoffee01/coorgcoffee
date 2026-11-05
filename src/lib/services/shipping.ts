import { Order, ShipmentRecord, TrackingPoint } from '../types';

export interface ShippingProvider {
  createShipment(order: Order): Promise<ShipmentRecord>;
  generateAWB(shipmentId: string): Promise<string>;
  getTrackingStatus(awbNumber: string): Promise<TrackingPoint[]>;
  cancelShipment(awbNumber: string): Promise<boolean>;
}

const env = import.meta.env as Record<string, string | undefined>;

export class MockShippingProvider implements ShippingProvider {
  async createShipment(order: Order): Promise<ShipmentRecord> {
    const awbNumber = `DTDC${Math.floor(100000000 + Math.random() * 900000000)}`;
    const now = new Date().toISOString();

    const initialHistory: TrackingPoint[] = [
      {
        status: 'Order Placed',
        timestamp: now,
        location: 'Coorg Estate Fulfilment Center, Madikeri',
        description: 'Shipment manifest created & ready for packaging.',
      },
      {
        status: 'Confirmed',
        timestamp: new Date(Date.now() + 1000 * 60 * 30).toISOString(),
        location: 'Coorg Estate Fulfilment Center, Madikeri',
        description: 'Order confirmed and allocated to roast batch.',
      },
    ];

    return {
      id: `ship-${Date.now()}`,
      orderId: order.id,
      courier: 'DTDC',
      awbNumber,
      status: 'Confirmed',
      trackingHistory: initialHistory,
      mode: 'mock',
      createdAt: now,
      updatedAt: now,
    };
  }

  async generateAWB(_shipmentId: string): Promise<string> {
    return `DTDC${Math.floor(100000000 + Math.random() * 900000000)}`;
  }

  async getTrackingStatus(_awbNumber: string): Promise<TrackingPoint[]> {
    const now = new Date().toISOString();
    return [
      {
        status: 'Order Placed',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
        location: 'Coorg Estate Fulfilment Hub, Karnataka',
        description: 'Order items packed in multi-layer valve pouches.',
      },
      {
        status: 'Shipped',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        location: 'DTDC Mysore Sorting Facility',
        description: 'Package scanned and dispatched via express air/surface corridor.',
      },
      {
        status: 'In Transit',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        location: 'DTDC Regional Hub',
        description: 'In transit to destination delivery branch.',
      },
      {
        status: 'Out for Delivery',
        timestamp: now,
        location: 'Local DTDC Express Depot',
        description: 'Out for delivery with DTDC executive.',
      },
    ];
  }

  async cancelShipment(awbNumber: string): Promise<boolean> {
    console.log(`[MockShippingProvider] Cancelled AWB ${awbNumber}`);
    return true;
  }
}

export class DtdcShippingProvider implements ShippingProvider {
  private apiBaseUrl: string;
  private apiKey: string;

  constructor() {
    this.apiBaseUrl = env['VITE_DTDC_API_BASE_URL'] || '';
    this.apiKey = env['VITE_DTDC_API_KEY'] || '';
  }

  async createShipment(order: Order): Promise<ShipmentRecord> {
    if (!this.apiKey || !this.apiBaseUrl) {
      console.warn('DTDC API credentials not configured. Falling back to MockShippingProvider.');
      return new MockShippingProvider().createShipment(order);
    }
    throw new Error('DTDC live API endpoint not configured.');
  }

  async generateAWB(shipmentId: string): Promise<string> {
    if (!this.apiKey) {
      return new MockShippingProvider().generateAWB(shipmentId);
    }
    throw new Error('DTDC live API endpoint not configured.');
  }

  async getTrackingStatus(awbNumber: string): Promise<TrackingPoint[]> {
    if (!this.apiKey) {
      return new MockShippingProvider().getTrackingStatus(awbNumber);
    }
    throw new Error('DTDC live API endpoint not configured.');
  }

  async cancelShipment(awbNumber: string): Promise<boolean> {
    if (!this.apiKey) {
      return new MockShippingProvider().cancelShipment(awbNumber);
    }
    throw new Error('DTDC live API endpoint not configured.');
  }
}

export const SHIPPING_MODE = (env['VITE_SHIPPING_MODE'] || 'mock') as 'mock' | 'live';

export function generateAWB(): string {
  return `DTDC${Math.floor(100000000 + Math.random() * 900000000)}`;
}

export function getShippingProvider(): ShippingProvider {
  return SHIPPING_MODE === 'live' ? new DtdcShippingProvider() : new MockShippingProvider();
}

