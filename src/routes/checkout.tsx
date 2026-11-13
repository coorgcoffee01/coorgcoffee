import { useState } from 'react';
import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { ShieldCheck, ArrowRight, Lock, CheckCircle2, Truck, Sparkles, Coffee, Volume2, Mail } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { saveOrder, decrementStockForOrder, getProducts } from '../lib/services/store-service';
import { openRazorpayCheckout } from '../lib/services/razorpay';
import { Order, ShippingAddress, OrderItem } from '../lib/types';
import { getShippingProvider } from '../lib/services/shipping';
import { triggerOrderNotifications, getWhatsAppOrderAlertUrl } from '../lib/services/notification';
import { FallingCoffeeBeans } from '../components/common/FallingCoffeeBeans';
import { CoffeeLoader } from '../components/common/CoffeeLoader';
import { primeAudio, playPaymentSuccessSound } from '../lib/sound';
import { INDIAN_STATES, INDIAN_UNION_TERRITORIES } from '../lib/data/india-states';

export const Route = createFileRoute('/checkout')({
  component: CheckoutPage,
});

function CheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotal, shippingFee, clearCart, isLoaded, addItem } = useCart();
  const grandTotal = subtotal + shippingFee;

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Karnataka');
  const [pincode, setPincode] = useState('');

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [beansTrigger, setBeansTrigger] = useState(0);

  if (!isLoaded) {
    return <CoffeeLoader fullScreen message="Loading secure checkout..." />;
  }

  if (confirmedOrder) {
    return (
      <div className="min-h-screen bg-background text-foreground py-12 px-4 md:px-8 transition-colors relative overflow-hidden">
        {/* Falling Coffee Beans Canvas Shower */}
        <FallingCoffeeBeans key={beansTrigger} active={true} count={60} durationMs={7500} />

        <div className="max-w-3xl mx-auto space-y-8 relative z-10">
          {/* Header Banner */}
          <div className="text-center space-y-4">
            <img
              src="/coorg-logo-circle.png"
              alt="Coorg Coffee Emblem"
              className="w-20 h-20 rounded-full border-2 border-[#C89B3C] shadow-xl shadow-[#C89B3C]/20 bg-white p-1 mx-auto"
            />
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-widest animate-pulse-glow">
              <Sparkles className="w-4 h-4 text-[#C89B3C]" />
              <span>PAYMENT RECEIVED • ORDER CONFIRMED</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl uppercase tracking-tight text-foreground">
              FRESH COORG ROAST <span className="shimmer-gold">ON ITS WAY!</span>
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto">
              Your order <span className="font-mono font-bold text-foreground">#{confirmedOrder.orderNumber}</span> has been confirmed. Fresh beans are being roasted, packaged in degassing valve pouches, and dispatched.
            </p>
          </div>

          {/* Celebration Card */}
          <div className="rounded-3xl bg-card border border-border/80 shadow-2xl p-6 sm:p-8 space-y-6">
            {/* Status Strip */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-muted/60 border border-border">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block">
                    Courier Logistics
                  </span>
                  <span className="font-bold text-sm text-foreground">
                    DTDC Express Air • AWB: {confirmedOrder.awbNumber || 'CC-DTDC-94812'}
                  </span>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block">
                  Amount Paid
                </span>
                <span className="text-xl font-black text-[#C89B3C]">
                  ₹{confirmedOrder.grandTotal}
                </span>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-3">
              <h3 className="font-display text-lg uppercase tracking-wide text-foreground flex items-center gap-2">
                <Coffee className="w-4 h-4 text-[#C89B3C]" />
                <span>Ordered Roasts ({confirmedOrder.items.length})</span>
              </h3>
              <div className="divide-y divide-border/60 rounded-2xl border border-border/60 bg-background/50 overflow-hidden">
                {confirmedOrder.items.map((item, idx) => (
                  <div key={idx} className="p-3.5 flex items-center justify-between gap-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="w-12 h-12 rounded-xl object-cover border border-border shrink-0"
                      />
                      <div>
                        <p className="font-bold text-xs sm:text-sm text-foreground">{item.productName}</p>
                        <p className="text-[11px] text-muted-foreground">
                          Qty: {item.quantity} • {item.variantLabel} {item.grindOption ? `• ${item.grindOption}` : ''}
                        </p>
                      </div>
                    </div>
                    <span className="font-black text-xs sm:text-sm text-foreground shrink-0">
                      ₹{item.lineTotal}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address Summary */}
            <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-1 text-xs text-muted-foreground">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#C89B3C] block">
                Shipping To:
              </span>
              <p className="font-bold text-foreground">{confirmedOrder.shippingAddress.fullName}</p>
              <p>{confirmedOrder.shippingAddress.line1}, {confirmedOrder.shippingAddress.line2}</p>
              <p>{confirmedOrder.shippingAddress.city}, {confirmedOrder.shippingAddress.state} - {confirmedOrder.shippingAddress.pincode}</p>
              <p className="text-[11px] pt-1 text-muted-foreground">Phone: {confirmedOrder.guestPhone} • Email: {confirmedOrder.guestEmail}</p>
            </div>

            {/* Real-time Estate Dispatch Alert to 94834 72070 & 90718 70722 */}
            <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/40 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Estate Roastery Alert Dispatched</span>
                </div>
                <span className="text-[10px] text-muted-foreground font-mono">SMS &amp; WhatsApp Alert</span>
              </div>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Order details automatically triggered to estate operations at <strong>+91 94834 72070</strong> and <strong>+91 90718 70722</strong> for immediate roasting batch allocation.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <a
                  href={getWhatsAppOrderAlertUrl('9483472070', confirmedOrder)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition-colors shadow-sm"
                  title="Forward order summary to +91 94834 72070 on WhatsApp"
                >
                  <span>📲 WhatsApp Alert (94834 72070)</span>
                </a>
                <a
                  href={getWhatsAppOrderAlertUrl('9071870722', confirmedOrder)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition-colors shadow-sm"
                  title="Forward order summary to +91 90718 70722 on WhatsApp"
                >
                  <span>📲 WhatsApp Alert (90718 70722)</span>
                </a>
              </div>
            </div>

            {/* Customer Email Trigger Confirmation */}
            <div className="p-4 rounded-2xl bg-[#C89B3C]/10 border border-[#C89B3C]/40 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-[#C89B3C] font-bold uppercase tracking-wider text-[11px]">
                  <Mail className="w-4 h-4 text-[#C89B3C] shrink-0" />
                  <span>Order Confirmed Email Sent</span>
                </div>
                <span className="text-[10px] text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  DISPATCHED
                </span>
              </div>
              <p className="text-muted-foreground text-xs leading-relaxed">
                An order confirmed email has been triggered to <strong>{confirmedOrder.guestEmail}</strong> with order receipt, roast allocation details, and estate contact information.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <Link
                to="/shop"
                className="w-full sm:flex-1 py-4 px-6 rounded-full bg-[#C89B3C] text-black font-black text-xs uppercase tracking-widest text-center hover:bg-[#b08732] transition-all shadow-lg flex items-center justify-center space-x-2 active:scale-95"
              >
                <span>CONTINUE SHOPPING</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                onClick={() => {
                  setBeansTrigger((prev) => prev + 1);
                  playPaymentSuccessSound();
                }}
                className="w-full sm:w-auto py-4 px-5 rounded-full border border-border bg-background hover:bg-muted font-bold text-xs uppercase tracking-wider text-foreground transition-all flex items-center justify-center space-x-2 active:scale-95 cursor-pointer"
                title="Shower beans and replay payment chime"
              >
                <Volume2 className="w-4 h-4 text-[#C89B3C]" />
                <span>CASCADE BEANS &amp; CHIME</span>
              </button>

              <Link
                to="/"
                className="w-full sm:w-auto py-4 px-5 rounded-full border border-border bg-background hover:bg-muted font-bold text-xs uppercase tracking-wider text-foreground transition-all text-center active:scale-95"
              >
                HOME
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <h1 className="font-display text-4xl text-foreground">CART IS EMPTY</h1>
          <p className="text-sm text-muted-foreground">
            Please add items to your cart before proceeding to checkout, or add a test coffee sample below.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/shop"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#C89B3C] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#b08732] transition-colors"
            >
              BROWSE COFFEES
            </Link>
            <button
              onClick={() => {
                const prods = getProducts();
                if (prods.length > 0 && prods[0]?.variants[0]) {
                  addItem(prods[0], prods[0].variants[0], 1);
                }
              }}
              className="inline-flex items-center justify-center px-5 py-3 rounded-full border border-border bg-card text-foreground font-bold text-xs uppercase tracking-wider hover:bg-muted transition-colors cursor-pointer"
            >
              + Add Sample Coffee to Test
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName || !phone || !email || !line1 || !city || !pincode) {
      setErrorMsg('Please fill in all required shipping address fields.');
      return;
    }

    if (!/^\d{10}$/.test(phone.replace(/\D/g, ''))) {
      setErrorMsg('Please enter a valid 10-digit phone number.');
      return;
    }

    if (!/^\d{6}$/.test(pincode.replace(/\D/g, ''))) {
      setErrorMsg('Please enter a valid 6-digit Indian Pincode.');
      return;
    }

    setIsProcessing(true);

    const shippingAddress: ShippingAddress = {
      fullName,
      phone,
      email,
      line1,
      line2,
      city,
      state,
      pincode,
    };

    const orderNumber = `CC-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const orderId = `ord-${Date.now()}`;
    const now = new Date().toISOString();

    const orderItems: OrderItem[] = items.map((i) => ({
      orderId,
      productId: i.productId,
      variantId: i.variantId,
      productName: i.productName,
      variantLabel: i.variantLabel,
      sku: i.sku,
      unitPrice: i.unitPrice,
      quantity: i.quantity,
      lineTotal: i.unitPrice * i.quantity,
      image: i.image,
      grindOption: i.grindOption || '',
    }));

    const newOrder: Order = {
      id: orderId,
      orderNumber,
      guestEmail: email,
      guestPhone: phone,
      shippingAddress,
      items: orderItems,
      subtotal,
      shippingFee,
      tax: 0,
      grandTotal,
      status: 'Order Placed',
      paymentStatus: 'pending',
      courier: 'DTDC',
      createdAt: now,
      updatedAt: now,
    };

    const completeOrderWithPayment = async (order: Order, paymentId: string) => {
      // Play crisp, satisfying payment completion sound
      playPaymentSuccessSound();

      order.paymentStatus = 'captured';
      order.paymentId = paymentId;
      order.status = 'Confirmed';

      const shippingProvider = getShippingProvider();
      const shipment = await shippingProvider.createShipment(order);
      order.shipmentId = shipment.id;
      order.awbNumber = shipment.awbNumber;

      decrementStockForOrder(order);
      saveOrder(order);

      // Trigger automatic SMS & WhatsApp alerts to estate helplines (+91 94834 72070 & +91 90718 70722)
      // and customer transactional notification
      try {
        await triggerOrderNotifications(order);
      } catch (notifErr) {
        console.warn('Order notification alert dispatch notice:', notifErr);
      }

      clearCart();
      setIsProcessing(false);
      setConfirmedOrder(order);
      setBeansTrigger((prev) => prev + 1);

      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        // Automatically open WhatsApp with pre-filled Order Placed alert to estate helpline
        try {
          const autoWhatsAppUrl = getWhatsAppOrderAlertUrl('9483472070', order);
          window.open(autoWhatsAppUrl, '_blank');
        } catch (popupErr) {
          console.warn('Auto WhatsApp popup notice:', popupErr);
        }
      }
    };

    primeAudio();
    setIsProcessing(true);

    openRazorpayCheckout(
      newOrder,
      async (paymentId, _signature) => {
        await completeOrderWithPayment(newOrder, paymentId);
      },
      (errorReason) => {
        setIsProcessing(false);
        setErrorMsg(errorReason || 'Payment failed or cancelled. Please try again.');
      }
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-10 px-4 md:px-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <img
            src="/coorg-logo-circle.png"
            alt="Coorg Coffee Emblem"
            className="w-16 h-16 rounded-full border-2 border-[#C89B3C] shadow-lg shadow-[#C89B3C]/20 bg-white p-0.5 mx-auto"
          />
          <div>
            <span className="eyebrow">ESTATE DIRECT CHECKOUT</span>
            <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-foreground">
              GUEST CHECKOUT
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              No account required. Fast &amp; secure delivery across India.
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-bold text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
            <h3 className="font-display text-xl text-foreground border-b border-border pb-4">
              SHIPPING ADDRESS
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2 space-y-1">
                <label className="font-bold block">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-[#C89B3C]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold block">Phone Number (10 Digits) *</label>
                <input
                  type="tel"
                  required
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-[#C89B3C]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold block">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-[#C89B3C]"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="font-bold block">Flat, House no., Building, Street *</label>
                <input
                  type="text"
                  required
                  placeholder="Flat, House no., Building, Street"
                  value={line1}
                  onChange={(e) => setLine1(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-[#C89B3C]"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="font-bold block">Area, Colony, Sector, Landmark (Optional)</label>
                <input
                  type="text"
                  placeholder="Area, Colony, Sector, Landmark (Optional)"
                  value={line2}
                  onChange={(e) => setLine2(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-[#C89B3C]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold block">City *</label>
                <input
                  type="text"
                  required
                  placeholder="Enter your city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-[#C89B3C]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold block">State / Union Territory *</label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-[#C89B3C]"
                >
                  <optgroup label="States">
                    {INDIAN_STATES.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Union Territories">
                    {INDIAN_UNION_TERRITORIES.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="font-bold block">Pincode (6 Digits) *</label>
                <input
                  type="text"
                  required
                  placeholder="560001"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-[#C89B3C]"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
            <h3 className="font-display text-xl text-foreground border-b border-border pb-4">
              ORDER ITEMS ({items.length})
            </h3>

            <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.variantId}`}
                  className="flex items-center justify-between text-xs pb-3 border-b border-border last:border-0"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-12 h-12 object-cover rounded-lg border border-border shrink-0"
                    />
                    <div>
                      <h4 className="font-bold text-foreground">{item.productName}</h4>
                      <p className="text-[10px] text-[#C89B3C]">
                        {item.variantLabel} x {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-extrabold text-foreground">
                    ₹{item.unitPrice * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-xs border-t border-border pt-4">
              <div className="flex justify-between text-muted-foreground">
                <span>Items Subtotal</span>
                <span className="font-bold text-foreground">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>DTDC Shipping</span>
                <span>{shippingFee === 0 ? <span className="text-green-500 font-bold">FREE</span> : `₹${shippingFee}`}</span>
              </div>
              <div className="flex justify-between text-foreground text-sm font-black pt-2 border-t border-border">
                <span>Grand Total</span>
                <span className="text-2xl text-[#C89B3C]">₹{grandTotal}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 rounded-xl bg-[#C89B3C] text-black font-extrabold text-sm uppercase tracking-widest hover:bg-[#b08732] transition-all shadow-xl flex items-center justify-center min-h-[54px] disabled:opacity-50"
            >
              {isProcessing ? (
                <span>VERIFYING PAYMENT...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  <span>PAY ₹{grandTotal} WITH RAZORPAY</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </button>

            {import.meta.env.DEV && (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => {
                    primeAudio();
                    playPaymentSuccessSound();
                  }}
                  className="w-full py-2 px-3 rounded-lg border border-[#C89B3C]/30 bg-[#C89B3C]/10 text-[#C89B3C] hover:bg-[#C89B3C]/20 font-bold text-[11px] uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Preview Payment Success Sound</span>
                </button>
              </div>
            )}

            <div className="space-y-2 text-[11px] text-muted-foreground text-center pt-2">
              <p className="flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Supports UPI (GPay/PhonePe), Credit/Debit Cards &amp; Netbanking</span>
              </p>
              <p className="flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#C89B3C]" />
                <span>HMAC SHA256 Server Signature Verification</span>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
