import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Phone, Mail, MapPin, MessageSquare, CheckCircle2 } from 'lucide-react';
import { addCustomerQuery } from '../lib/services/store-service';

export const Route = createFileRoute('/contact')({
  component: ContactPage,
});

function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && message.trim()) {
      addCustomerQuery({
        name,
        phone,
        email,
        message,
      });
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 md:px-8 transition-colors">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <img
            src="/coorg-logo-circle.png"
            alt="Coorg Coffee Emblem"
            className="w-20 h-20 rounded-full border-2 border-[#C89B3C] shadow-xl shadow-[#C89B3C]/20 bg-white p-1 mx-auto"
          />
          <div>
            <span className="eyebrow">WE ARE HERE TO HELP</span>
            <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-foreground">
              CONTACT COORG COFFEE
            </h1>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto mt-2">
              Have a question about bulk orders, grind recommendations, or tracking? Reach out to our estate team directly.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Details */}
          <div className="lg:col-span-5 bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6 text-xs">
            <h3 className="font-display text-2xl text-foreground">ESTATE DESK</h3>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-xl bg-[#C89B3C]/10 text-[#C89B3C] border border-[#C89B3C]/30 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">ESTATE ADDRESS</h4>
                  <p className="text-muted-foreground mt-0.5">
                    Coorg Estate Fulfilment Center, Madikeri, Coorg District, Karnataka - 571201
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-xl bg-[#C89B3C]/10 text-[#C89B3C] border border-[#C89B3C]/30 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">PHONE &amp; WHATSAPP</h4>
                  <p className="text-muted-foreground mt-0.5">94834 72070 | 90718 70722</p>
                  <p className="text-[10px] text-[#2D5A27] dark:text-[#4ade80] font-bold">
                    Mon - Sat: 9:00 AM - 7:00 PM IST
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-xl bg-[#C89B3C]/10 text-[#C89B3C] border border-[#C89B3C]/30 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">EMAIL SUPPORT</h4>
                  <p className="text-muted-foreground mt-0.5">support@coorgcoffee.in</p>
                </div>
              </div>
            </div>

            <a
              href="https://wa.me/919071870722"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 bg-[#2D5A27] text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#23481f] transition-all min-h-[48px]"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              <span>CHAT ON WHATSAPP</span>
            </a>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7 bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-display text-2xl text-foreground">SEND A MESSAGE</h3>

            {submitted ? (
              <div className="p-6 rounded-xl bg-green-500/10 border border-green-500/30 text-green-500 text-xs font-bold text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 mx-auto" />
                <p>Thank you! Your message has been sent to our estate customer care team.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold block mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-3 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-[#C89B3C]"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1">Phone / WhatsApp Number</label>
                  <input
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-3 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-[#C89B3C]"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1">How can we help? *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Ask about grind size, bulk orders, or order status..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3.5 py-3 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-[#C89B3C]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-[#C89B3C] text-black font-extrabold uppercase tracking-widest hover:bg-[#b08732] transition-colors shadow-md min-h-[48px]"
                >
                  SUBMIT MESSAGE
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
