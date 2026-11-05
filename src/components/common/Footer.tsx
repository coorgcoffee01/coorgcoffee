import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { MapPin, Phone, Mail, ShieldCheck, CheckCircle2, Coffee, Loader2 } from 'lucide-react';
import { newsletterService } from '../../lib/services/newsletter-service';
import { toast } from 'sonner';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || loading) return;

    setLoading(true);
    const userMail = email.trim();
    try {
      await newsletterService.subscribe(userMail);
      setSubscribed(true);
      toast.success('Subscribed successfully! Welcome email sent to your inbox ☕');
      setEmail('');
    } catch (err: any) {
      toast.error(err?.message || 'Subscription failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <footer className="bg-[#14100C] text-[#E8D9C5] border-t border-[#2D231A] transition-colors">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3.5">
              <img
                src="/coorg-logo-circle.png"
                alt="Coorg Coffee Emblem"
                className="w-12 h-12 rounded-full object-cover border-2 border-[#C89B3C] shadow-md shadow-[#C89B3C]/20 bg-white p-0.5 shrink-0"
              />
              <div className="flex flex-col">
                <span className="font-display text-2xl tracking-wider text-[#F4E6D4] leading-none">
                  COORG COFFEE
                </span>
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#C89B3C] font-bold mt-1">
                  PURE ESTATE HARVEST • MADIKERI
                </span>
              </div>
            </div>
            <p className="text-xs text-[#B5A490] leading-relaxed max-w-sm">
              Sourced directly from generational coffee estates in the misty hills of Coorg,
              Karnataka. Crafted for coffee lovers who demand zero compromise on aroma, purity, and heritage.
            </p>
            <div className="pt-2 flex items-center space-x-2 text-xs text-[#C89B3C] font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Pan-India Direct Estate Shipping</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#C89B3C]">
              EXPLORE
            </h4>
            <ul className="space-y-2 text-xs font-medium text-[#D1C2AF]">
              <li>
                <Link to="/" className="hover:text-[#C89B3C] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-[#C89B3C] transition-colors">
                  All Coffees &amp; Blends
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#C89B3C] transition-colors">
                  Our Story &amp; Origin
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#C89B3C] transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-[#C89B3C] transition-colors">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Policies */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#C89B3C]">
              POLICIES
            </h4>
            <ul className="space-y-2 text-xs font-medium text-[#D1C2AF]">
              <li>
                <Link to="/privacy-policy" className="hover:text-[#C89B3C] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-[#C89B3C] transition-colors">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link to="/shipping-policy" className="hover:text-[#C89B3C] transition-colors">
                  Shipping &amp; Refund Policy
                </Link>
              </li>
              <li>
                <Link to="/security-policy" className="hover:text-[#C89B3C] transition-colors">
                  Security Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#C89B3C]">
              ESTATE CONTACT
            </h4>
            <div className="space-y-2.5 text-xs text-[#D1C2AF]">
              <p className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-[#C89B3C] shrink-0 mt-0.5" />
                <span>Madikeri, Coorg District, Karnataka - 571201</span>
              </p>
              <p className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-[#C89B3C] shrink-0" />
                <span>94834 72070 | 90718 70722</span>
              </p>
              <p className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-[#C89B3C] shrink-0" />
                <span>support@coorgcoffee.in</span>
              </p>
            </div>

            {/* Newsletter form */}
            <div className="pt-2">
              <span className="text-[11px] font-bold text-[#E8D9C5] block mb-2">
                Subscribe for fresh harvest releases
              </span>
              {subscribed ? (
                <div className="space-y-1.5 animate-fadeIn">
                  <div className="flex items-center space-x-2 text-xs text-emerald-400 font-semibold bg-emerald-950/40 border border-emerald-800/50 px-3 py-2 rounded-lg">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Welcome! Check your inbox for your 10% coupon code.</span>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs rounded-lg bg-[#241D17] border border-[#3D3025] text-white placeholder-gray-400 focus:outline-none focus:border-[#C89B3C]"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-3 py-2 bg-[#C89B3C] text-black font-bold text-xs rounded-lg hover:bg-[#b08732] transition-colors shrink-0 disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Join'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-12 pt-6 border-t border-[#251D16] flex flex-col sm:flex-row items-center justify-between text-xs text-[#8E7E6E] gap-4">
          <p>© {new Date().getFullYear()} Coorg Coffee. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <span>Razorpay Verified Payments</span>
            <span>•</span>
            <span>DTDC Express Logistics</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
