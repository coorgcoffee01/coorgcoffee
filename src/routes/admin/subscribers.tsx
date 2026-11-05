import React, { useState, useEffect } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import {
  Mail,
  Send,
  Users,
  CheckCircle2,
  AlertCircle,
  TrendingDown,
  Sparkles,
  Search,
  Plus,
  RefreshCw,
  Eye,
  FileText,
  Clock,
  ChevronRight,
  Loader2,
  Tag,
  Gift,
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { newsletterService } from '../../lib/services/newsletter-service';
import { emailService, generateEmailHtml } from '../../lib/services/email-service';
import { getProducts } from '../../lib/services/store-service';
import { Subscriber, EmailLog, BroadcastPayload, EmailTemplateType } from '../../lib/types';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/subscribers')({
  component: AdminSubscribersPage,
});

function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'list' | 'broadcast' | 'logs'>('list');

  // Broadcast Form State
  const [templateType, setTemplateType] = useState<EmailTemplateType>('new_product_launch');
  const [subject, setSubject] = useState('☕ Exciting New Harvest Release: Fresh Single-Origin Coorg Coffee!');
  const [title, setTitle] = useState('Fresh Harvest Arrived at Coorg Coffee');
  const [message, setMessage] = useState(
    'We are thrilled to present our newest estate roast, handpicked in Madikeri and roasted to perfection. Taste the authentic notes of dark chocolate and wilderness honey.'
  );
  const [selectedProductId, setSelectedProductId] = useState('');
  const [originalPrice, setOriginalPrice] = useState<number | ''>('');
  const [newPrice, setNewPrice] = useState<number | ''>('');
  const [ctaText, setCtaText] = useState('SHOP NEW RELEASE');
  const [ctaUrl, setCtaUrl] = useState('https://webtech-6dfba--staging-t9tcm2ki.web.app/shop');
  const [sendingBroadcast, setSendingBroadcast] = useState(false);
  const [previewModal, setPreviewModal] = useState<string | null>(null);

  // New Subscriber Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmail, setNewEmail] = useState('');

  const products = getProducts();

  const loadData = async () => {
    setLoading(true);
    try {
      const subs = await newsletterService.getSubscribers();
      const logs = await emailService.getEmailLogs();
      setSubscribers(subs);
      setEmailLogs(logs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Update default broadcast fields when template changes
  const handleTemplateChange = (type: EmailTemplateType) => {
    setTemplateType(type);
    if (type === 'new_product_launch') {
      setSubject('🚀 New Coffee Launch: Fresh Single-Origin Estate Roast!');
      setTitle('Fresh Harvest Arrived at Coorg Coffee');
      setMessage(
        'We are thrilled to present our newest estate roast, handpicked in Madikeri and roasted to perfection. Experience pure rich aroma and smooth body.'
      );
      setCtaText('SHOP NEW PRODUCT');
    } else if (type === 'price_drop_alert') {
      setSubject('📉 Price Drop Alert: Special Savings on Premium Coorg Coffee!');
      setTitle('Price Lowered on Customer Favorites');
      setMessage(
        'Great news for coffee lovers! We have reduced prices on our premium roasts for a limited time. Stock up on authentic estate harvests today.'
      );
      setCtaText('CLAIM DISCOUNT');
    } else if (type === 'site_activity_announcement') {
      setSubject('📢 Coorg Coffee Update: Seasonal Harvest & Estate Announcement');
      setTitle('Estate Update & Seasonal Harvest Announcement');
      setMessage(
        'Direct from the mist-covered hills of Madikeri, Karnataka: Our latest harvest batch has been processed and is now ready for order across India.'
      );
      setCtaText('EXPLORE HARVEST');
    } else if (type === 'welcome_subscription') {
      setSubject('☕ Welcome to Coorg Coffee — 10% Off Your First Order!');
      setTitle('Welcome to the Coorg Coffee Family!');
      setMessage(
        'Thank you for subscribing to our harvest releases! As a welcome gift, use promo code WELCOME10 for 10% off your first order.'
      );
      setCtaText('USE CODE WELCOME10');
    }
  };

  const handleProductSelect = (productId: string) => {
    setSelectedProductId(productId);
    const p = products.find((prod) => prod.id === productId);
    if (p) {
      const mainVar = p.variants[0];
      if (mainVar) {
        if (templateType === 'price_drop_alert') {
          setOriginalPrice(mainVar.price);
          setNewPrice(mainVar.salePrice || Math.round(mainVar.price * 0.85));
        } else {
          setNewPrice(mainVar.price);
        }
      }
    }
  };

  const handleAddSubscriber = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;
    try {
      await newsletterService.subscribe(newEmail);
      toast.success(`Subscribed ${newEmail} & sent Welcome Email!`);
      setNewEmail('');
      setShowAddModal(false);
      loadData();
    } catch (err: any) {
      toast.error(err?.message || 'Error subscribing email');
    }
  };

  const handleSendBroadcast = async () => {
    const activeSubscribers = subscribers.filter((s) => s.status === 'active');
    if (activeSubscribers.length === 0) {
      toast.error('No active subscribers found to broadcast to!');
      return;
    }

    setSendingBroadcast(true);
    try {
      const selectedProduct = products.find((p) => p.id === selectedProductId);

      const payload: BroadcastPayload = {
        templateType,
        subject,
        title,
        message,
        productName: selectedProduct?.name,
        productSlug: selectedProduct?.slug,
        productImage: selectedProduct?.images[0],
        originalPrice: typeof originalPrice === 'number' ? originalPrice : undefined,
        newPrice: typeof newPrice === 'number' ? newPrice : undefined,
        ctaText,
        ctaUrl,
      };

      const res = await newsletterService.notifySubscribers(payload);
      toast.success(`Successfully broadcasted "${subject}" to ${res.sent} active subscriber(s)!`);
      loadData();
      setActiveTab('logs');
    } catch (e: any) {
      toast.error(e?.message || 'Failed to send broadcast');
    } finally {
      setSendingBroadcast(false);
    }
  };

  const selectedProdObj = products.find((p) => p.id === selectedProductId);
  const currentHtmlPreview = generateEmailHtml(
    {
      templateType,
      subject,
      title,
      message,
      productName: selectedProdObj?.name,
      productImage: selectedProdObj?.images[0],
      originalPrice: typeof originalPrice === 'number' ? originalPrice : undefined,
      newPrice: typeof newPrice === 'number' ? newPrice : undefined,
      ctaText,
      ctaUrl,
    },
    'subscriber@example.com'
  );

  const filteredSubscribers = subscribers.filter((s) =>
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout
      activeModule="subscribers"
      title="Subscribers & Email Marketing"
      subtitle="Manage newsletter subscribers, trigger automated notifications, and send email broadcasts"
    >
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#1C1612] border border-[#3D3025] p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs text-[#B5A490] font-bold uppercase tracking-wider">Total Subscribers</p>
            <h3 className="text-2xl font-bold text-white mt-1">{subscribers.length}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#C89B3C]/10 border border-[#C89B3C]/30 flex items-center justify-center text-[#C89B3C]">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#1C1612] border border-[#3D3025] p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs text-[#B5A490] font-bold uppercase tracking-wider">Active Recipients</p>
            <h3 className="text-2xl font-bold text-emerald-400 mt-1">
              {subscribers.filter((s) => s.status === 'active').length}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#1C1612] border border-[#3D3025] p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs text-[#B5A490] font-bold uppercase tracking-wider">Emails Dispatched</p>
            <h3 className="text-2xl font-bold text-blue-400 mt-1">{emailLogs.length}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Mail className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#1C1612] border border-[#3D3025] p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs text-[#B5A490] font-bold uppercase tracking-wider">Welcome Offer</p>
            <h3 className="text-xl font-bold text-[#C89B3C] mt-1">WELCOME10</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Gift className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Tab Controls */}
      <div className="flex items-center justify-between border-b border-[#3D3025] pb-3">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'list'
                ? 'bg-[#C89B3C] text-black shadow-md'
                : 'bg-[#241D17] text-[#B5A490] border border-[#3D3025] hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Subscriber List ({subscribers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('broadcast')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'broadcast'
                ? 'bg-[#C89B3C] text-black shadow-md'
                : 'bg-[#241D17] text-[#B5A490] border border-[#3D3025] hover:text-white'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Send Email Broadcast</span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'logs'
                ? 'bg-[#C89B3C] text-black shadow-md'
                : 'bg-[#241D17] text-[#B5A490] border border-[#3D3025] hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Email History ({emailLogs.length})</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={loadData}
            className="p-2 rounded-xl bg-[#241D17] border border-[#3D3025] text-[#B5A490] hover:text-white"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {activeTab === 'list' && (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-2 rounded-xl bg-[#C89B3C] text-black font-bold text-xs hover:bg-[#b08732] transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Subscriber</span>
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: SUBSCRIBER LIST */}
      {activeTab === 'list' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search by subscriber email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-[#1C1612] border border-[#3D3025] text-white focus:outline-none focus:border-[#C89B3C]"
              />
            </div>
            <p className="text-xs text-[#B5A490]">Showing {filteredSubscribers.length} email records</p>
          </div>

          <div className="bg-[#1C1612] border border-[#3D3025] rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#241D17] text-[#C89B3C] font-bold uppercase tracking-wider text-[10px] border-b border-[#3D3025]">
                  <tr>
                    <th className="px-6 py-3.5">Subscriber Email</th>
                    <th className="px-6 py-3.5">Subscribed Date</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5">Notification Preferences</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2D231A]">
                  {filteredSubscribers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-gray-500 text-xs">
                        No subscribers found. Enter an email in the website footer or click "Add Subscriber" to test.
                      </td>
                    </tr>
                  ) : (
                    filteredSubscribers.map((sub) => (
                      <tr key={sub.id} className="hover:bg-[#241D17]/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-white flex items-center gap-2">
                          <Mail className="w-4 h-4 text-[#C89B3C]" />
                          <span>{sub.email}</span>
                        </td>
                        <td className="px-6 py-4 text-[#B5A490]">
                          {new Date(sub.subscribedAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                              sub.status === 'active'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                : 'bg-red-500/10 text-red-400 border border-red-500/30'
                            }`}
                          >
                            {sub.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            <span className="px-2 py-0.5 rounded bg-[#2A211B] text-[10px] text-[#C89B3C]">
                              🚀 New Products
                            </span>
                            <span className="px-2 py-0.5 rounded bg-[#2A211B] text-[10px] text-emerald-400">
                              📉 Price Drops
                            </span>
                            <span className="px-2 py-0.5 rounded bg-[#2A211B] text-[10px] text-blue-400">
                              📢 Site News
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => {
                              setActiveTab('broadcast');
                              setSubject(`Special Coffee Offer for ${sub.email}`);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-[#241D17] border border-[#3D3025] text-white hover:border-[#C89B3C] text-[11px] font-semibold transition-colors"
                          >
                            Send Email
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BROADCAST CREATOR */}
      {activeTab === 'broadcast' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Form Controls */}
          <div className="bg-[#1C1612] border border-[#3D3025] p-6 rounded-2xl space-y-5">
            <h3 className="font-display text-lg text-white font-bold flex items-center gap-2">
              <Send className="w-5 h-5 text-[#C89B3C]" />
              <span>Compose Email Broadcast</span>
            </h3>

            {/* Template Selector */}
            <div>
              <label className="text-xs font-bold text-[#C89B3C] uppercase tracking-wider block mb-2">
                Notification Type &amp; Trigger
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleTemplateChange('new_product_launch')}
                  className={`p-3 rounded-xl border text-left text-xs transition-all ${
                    templateType === 'new_product_launch'
                      ? 'bg-[#C89B3C]/10 border-[#C89B3C] text-white font-bold'
                      : 'bg-[#241D17] border-[#3D3025] text-[#B5A490] hover:text-white'
                  }`}
                >
                  <div className="font-bold flex items-center gap-1.5 text-[#C89B3C]">
                    <Sparkles className="w-4 h-4" /> 🚀 New Product Launch
                  </div>
                  <div className="text-[10px] text-gray-400 mt-1">Announce fresh coffee roasts & SKUs</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleTemplateChange('price_drop_alert')}
                  className={`p-3 rounded-xl border text-left text-xs transition-all ${
                    templateType === 'price_drop_alert'
                      ? 'bg-emerald-500/10 border-emerald-500 text-white font-bold'
                      : 'bg-[#241D17] border-[#3D3025] text-[#B5A490] hover:text-white'
                  }`}
                >
                  <div className="font-bold flex items-center gap-1.5 text-emerald-400">
                    <TrendingDown className="w-4 h-4" /> 📉 Price Drop Alert
                  </div>
                  <div className="text-[10px] text-gray-400 mt-1">Notify savings & price cuts</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleTemplateChange('site_activity_announcement')}
                  className={`p-3 rounded-xl border text-left text-xs transition-all ${
                    templateType === 'site_activity_announcement'
                      ? 'bg-blue-500/10 border-blue-500 text-white font-bold'
                      : 'bg-[#241D17] border-[#3D3025] text-[#B5A490] hover:text-white'
                  }`}
                >
                  <div className="font-bold flex items-center gap-1.5 text-blue-400">
                    <Mail className="w-4 h-4" /> 📢 Estate News
                  </div>
                  <div className="text-[10px] text-gray-400 mt-1">Harvest releases & store updates</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleTemplateChange('welcome_subscription')}
                  className={`p-3 rounded-xl border text-left text-xs transition-all ${
                    templateType === 'welcome_subscription'
                      ? 'bg-amber-500/10 border-amber-500 text-white font-bold'
                      : 'bg-[#241D17] border-[#3D3025] text-[#B5A490] hover:text-white'
                  }`}
                >
                  <div className="font-bold flex items-center gap-1.5 text-amber-400">
                    <Gift className="w-4 h-4" /> ☕ Welcome Gift
                  </div>
                  <div className="text-[10px] text-gray-400 mt-1">Send WELCOME10 coupon email</div>
                </button>
              </div>
            </div>

            {/* Subject Input */}
            <div>
              <label className="text-xs font-bold text-white block mb-1.5">Email Subject Line</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#241D17] border border-[#3D3025] text-white focus:outline-none focus:border-[#C89B3C]"
              />
            </div>

            {/* Email Title Header */}
            <div>
              <label className="text-xs font-bold text-white block mb-1.5">Headline Title inside Email</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#241D17] border border-[#3D3025] text-white focus:outline-none focus:border-[#C89B3C]"
              />
            </div>

            {/* Message Body */}
            <div>
              <label className="text-xs font-bold text-white block mb-1.5">Main Content / Message</label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#241D17] border border-[#3D3025] text-white focus:outline-none focus:border-[#C89B3C]"
              />
            </div>

            {/* Product Selector (If Applicable) */}
            <div>
              <label className="text-xs font-bold text-white block mb-1.5">Attach Product (Optional)</label>
              <select
                value={selectedProductId}
                onChange={(e) => handleProductSelect(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#241D17] border border-[#3D3025] text-white focus:outline-none focus:border-[#C89B3C]"
              >
                <option value="">-- No specific product attached --</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.tagline})
                  </option>
                ))}
              </select>
            </div>

            {/* Price Inputs if Price Drop or Product attached */}
            {(templateType === 'price_drop_alert' || selectedProductId) && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 block mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 599"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#241D17] border border-[#3D3025] text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#C89B3C] block mb-1">New Offer Price (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 499"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#241D17] border border-[#3D3025] text-white"
                  />
                </div>
              </div>
            )}

            {/* CTA Button Text & URL */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-white block mb-1">CTA Button Text</label>
                <input
                  type="text"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#241D17] border border-[#3D3025] text-white"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-white block mb-1">CTA Destination URL</label>
                <input
                  type="text"
                  value={ctaUrl}
                  onChange={(e) => setCtaUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#241D17] border border-[#3D3025] text-white"
                />
              </div>
            </div>

            {/* Send Broadcast Action */}
            <div className="pt-4 border-t border-[#3D3025] flex items-center justify-between">
              <span className="text-xs text-[#B5A490]">
                Recipients: <strong className="text-white">{subscribers.filter((s) => s.status === 'active').length} active subscribers</strong>
              </span>
              <button
                type="button"
                onClick={handleSendBroadcast}
                disabled={sendingBroadcast}
                className="px-5 py-3 rounded-xl bg-[#C89B3C] text-black font-bold text-xs hover:bg-[#b08732] transition-colors flex items-center gap-2 shadow-lg shadow-[#C89B3C]/20 disabled:opacity-50"
              >
                {sendingBroadcast ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Broadcasting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Broadcast Now</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Live HTML Preview */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C89B3C] flex items-center gap-1.5">
                <Eye className="w-4 h-4" /> Live Email Preview
              </span>
              <span className="text-[10px] text-gray-400">Renders exact subscriber HTML template</span>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden border-4 border-[#251E17] shadow-2xl min-h-[500px] flex flex-col">
              <iframe
                title="Email Preview"
                srcDoc={currentHtmlPreview}
                className="w-full flex-1 border-0 min-h-[550px]"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DISPATCH LOGS */}
      {activeTab === 'logs' && (
        <div className="space-y-4">
          <div className="bg-[#1C1612] border border-[#3D3025] rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#241D17] text-[#C89B3C] font-bold uppercase tracking-wider text-[10px] border-b border-[#3D3025]">
                  <tr>
                    <th className="px-6 py-3.5">Log ID / Type</th>
                    <th className="px-6 py-3.5">Recipient Email</th>
                    <th className="px-6 py-3.5">Subject</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5">Sent Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2D231A]">
                  {emailLogs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-gray-500 text-xs">
                        No email logs recorded yet. Send a test email or subscribe via footer.
                      </td>
                    </tr>
                  ) : (
                    emailLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-[#241D17]/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-white">{log.templateType}</div>
                          <div className="text-[10px] text-gray-400 font-mono mt-0.5">{log.id}</div>
                        </td>
                        <td className="px-6 py-4 font-semibold text-[#C89B3C]">{log.recipientEmail}</td>
                        <td className="px-6 py-4 text-white max-w-xs truncate">{log.subject}</td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            {log.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[#B5A490]">
                          {new Date(log.sentAt).toLocaleString([], {
                            dateStyle: 'short',
                            timeStyle: 'medium',
                          })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add Subscriber Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1C1612] border border-[#3D3025] p-6 rounded-2xl max-w-md w-full space-y-4 animate-in zoom-in-95">
            <h3 className="font-display text-lg text-white font-bold flex items-center gap-2">
              <Mail className="w-5 h-5 text-[#C89B3C]" />
              <span>Add Subscriber Manually</span>
            </h3>
            <p className="text-xs text-[#B5A490]">
              Adding a subscriber will store their email in Firestore/LocalStorage and trigger an immediate Welcome Email.
            </p>
            <form onSubmit={handleAddSubscriber} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-white block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="subscriber@example.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#241D17] border border-[#3D3025] text-white focus:outline-none focus:border-[#C89B3C]"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#241D17] border border-[#3D3025] text-[#B5A490] hover:text-white text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#C89B3C] text-black text-xs font-bold hover:bg-[#b08732]"
                >
                  Subscribe &amp; Send Welcome
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
