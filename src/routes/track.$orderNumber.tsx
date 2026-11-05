import { useState, useEffect } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Package, Truck, CheckCircle2, Clock, MapPin, Search, MessageSquare, Coffee, Sparkles } from 'lucide-react';
import { getOrderById } from '../lib/services/store-service';
import { getShippingProvider } from '../lib/services/shipping';
import { FallingCoffeeBeans } from '../components/common/FallingCoffeeBeans';

export const Route = createFileRoute('/track/$orderNumber')({
  component: OrderTrackingPage,
});

const STEPS = [
  'Order Placed',
  'Confirmed',
  'Packed',
  'Shipped',
  'In Transit',
  'Out for Delivery',
  'Delivered',
];

function OrderTrackingPage() {
  const { orderNumber } = Route.useParams();
  const [searchInput, setSearchInput] = useState(orderNumber || '');
  const [order, setOrder] = useState(() => getOrderById(orderNumber || searchInput));
  const [showBeans, setShowBeans] = useState(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).get('celebrate') === 'true';
    }
    return false;
  });
  const [beansCounter, setBeansCounter] = useState(0);

  useEffect(() => {
    setOrder(getOrderById(orderNumber || searchInput));
  }, [orderNumber, searchInput]);

  useEffect(() => {
    const handleUpdate = () => {
      setOrder(getOrderById(orderNumber || searchInput));
    };
    window.addEventListener('coorg_store_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('coorg_store_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [orderNumber, searchInput]);

  const getStepIndex = (status: string) => {
    const idx = STEPS.indexOf(status);
    return idx >= 0 ? idx : 1; // Default to Confirmed if matched
  };

  const currentStepIdx = order ? getStepIndex(order.status) : 0;

  return (
    <div className="min-h-screen bg-background text-foreground py-10 px-4 md:px-8 transition-colors relative overflow-hidden">
      {showBeans && (
        <FallingCoffeeBeans
          key={beansCounter}
          active={true}
          count={55}
          durationMs={7000}
          onComplete={() => setShowBeans(false)}
        />
      )}
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <img
            src="/coorg-logo-circle.png"
            alt="Coorg Coffee Emblem"
            className="w-16 h-16 rounded-full border-2 border-[#C89B3C] shadow-lg shadow-[#C89B3C]/20 bg-white p-0.5 mx-auto"
          />
          <div>
            <span className="eyebrow">DTDC EXPRESS LOGISTICS</span>
            <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-foreground">
              ORDER TRACKING
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Enter your order number to inspect real-time courier status.
            </p>
          </div>
        </div>

        {/* Quick Search Lookup Bar */}
        <div className="bg-card border border-border rounded-2xl p-4 shadow-sm flex items-center gap-3">
          <Search className="w-5 h-5 text-[#C89B3C] shrink-0" />
          <input
            type="text"
            placeholder="Enter Order Number..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full bg-transparent text-foreground placeholder:text-muted-foreground text-sm font-semibold focus:outline-none"
          />
          <Link
            to="/track/$orderNumber"
            params={{ orderNumber: searchInput || 'CC-2026-94812' }}
            className="px-5 py-2.5 rounded-xl bg-[#C89B3C] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#b08732] shrink-0"
          >
            Track
          </Link>
        </div>

        {!order ? (
          <div className="p-8 rounded-2xl bg-card border border-border text-center space-y-3">
            <Package className="w-12 h-12 text-[#C89B3C] mx-auto" />
            <h3 className="font-display text-xl text-foreground">NO ORDER FOUND FOR "{searchInput}"</h3>
            <p className="text-xs text-muted-foreground">
              Please double check your order confirmation SMS or WhatsApp message.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Order Overview Header */}
            <div className="p-6 rounded-2xl bg-card border border-border shadow-sm flex flex-col md:flex-row justify-between gap-6">
              <div className="space-y-1">
                <div className="flex items-center space-x-2 flex-wrap gap-y-1.5">
                  <span className="text-xs font-bold text-[#C89B3C] uppercase tracking-wider">
                    ORDER #{order.orderNumber}
                  </span>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-green-500/10 text-green-500 border border-green-500/30">
                    {order.paymentStatus === 'captured' ? 'PAID' : 'PENDING'}
                  </span>
                  <button
                    onClick={() => {
                      setShowBeans(true);
                      setBeansCounter((c) => c + 1);
                    }}
                    className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#C89B3C]/10 text-[#C89B3C] border border-[#C89B3C]/30 hover:bg-[#C89B3C] hover:text-black transition-all flex items-center gap-1 active:scale-95 cursor-pointer ml-1"
                    title="Shower celebratory coffee beans"
                  >
                    <Coffee className="w-3 h-3" />
                    <span>Shower Beans</span>
                  </button>
                </div>
                <h3 className="font-display text-2xl text-foreground">
                  Status: {order.status}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Placed on{' '}
                  {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>

              <div className="space-y-1 text-right md:text-right text-xs">
                <p className="text-muted-foreground">Courier Partner</p>
                <p className="font-extrabold text-foreground text-sm">
                  {order.courier} Express
                </p>
                <p className="text-muted-foreground">AWB Number</p>
                <p className="font-mono font-bold text-[#C89B3C]">
                  {order.awbNumber || 'DTDC948123049'}
                </p>
              </div>
            </div>

            {/* Visual Tracking Stepper */}
            <div className="p-6 sm:p-8 rounded-2xl bg-card border border-border shadow-sm space-y-6">
              <h3 className="font-display text-xl text-foreground">SHIPMENT PROGRESS</h3>

              <div className="relative">
                {/* Horizontal / Vertical Line */}
                <div className="hidden md:block absolute top-5 left-6 right-6 h-1 bg-border -z-0" />

                <div className="grid grid-cols-1 md:grid-cols-7 gap-4 relative z-10">
                  {STEPS.map((stepName, index) => {
                    const isCompleted = index <= currentStepIdx;
                    const isCurrent = index === currentStepIdx;

                    return (
                      <div
                        key={stepName}
                        className="flex md:flex-col items-center md:text-center space-x-3 md:space-x-0 space-y-0 md:space-y-2"
                      >
                        <div
                          className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-xs transition-all shrink-0 ${
                            isCompleted
                              ? 'border-[#C89B3C] bg-[#C89B3C] text-black shadow-md'
                              : 'border-border bg-background text-muted-foreground'
                          }`}
                        >
                          {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : index + 1}
                        </div>
                        <span
                          className={`text-xs font-bold ${
                            isCurrent
                              ? 'text-[#C89B3C] font-extrabold'
                              : isCompleted
                              ? 'text-foreground'
                              : 'text-muted-foreground'
                          }`}
                        >
                          {stepName}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Delivery Destination & Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-card border border-border space-y-3 text-xs">
                <h4 className="font-display text-lg text-foreground flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-[#C89B3C]" />
                  <span>SHIPPING DESTINATION</span>
                </h4>
                <div className="space-y-1 text-muted-foreground">
                  <p className="font-bold text-foreground">{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.line1}</p>
                  {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state} -{' '}
                    {order.shippingAddress.pincode}
                  </p>
                  <p>Phone: {order.guestPhone}</p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-card border border-border space-y-3 text-xs">
                <h4 className="font-display text-lg text-foreground flex items-center space-x-2">
                  <Truck className="w-4 h-4 text-[#C89B3C]" />
                  <span>ORDER SUMMARY</span>
                </h4>
                <div className="space-y-1.5">
                  {order.items.map((item) => (
                    <div
                      key={`${item.productId}-${item.variantId}`}
                      className="flex justify-between text-muted-foreground"
                    >
                      <span>
                        {item.productName} ({item.variantLabel}) x {item.quantity}
                      </span>
                      <span className="font-bold text-foreground">₹{item.lineTotal}</span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-border flex justify-between font-bold text-foreground">
                    <span>Grand Total Paid</span>
                    <span className="text-[#C89B3C] text-sm">₹{order.grandTotal}</span>
                  </div>
                </div>

                <div className="pt-4">
                  <a
                    href={`https://wa.me/919071870722?text=${encodeURIComponent(
                      `Hi Coorg Coffee team, I placed order #${order.orderNumber}. Please send me delivery updates!`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 rounded-xl bg-[#2D5A27] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 hover:bg-[#23481f] transition-colors"
                  >
                    <MessageSquare className="w-4 h-4 fill-current" />
                    <span>RECEIVE WHATSAPP UPDATES FOR THIS ORDER</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
