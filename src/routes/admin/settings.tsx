import React, { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Settings, Save, CheckCircle2, Shield, DollarSign, Bell, Truck, Smartphone, Send, ExternalLink } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { getStoreSettings, saveStoreSettings, addSystemNotification } from '../../lib/services/store-service';
import { StoreSettings } from '../../lib/types';
import { useAuth } from '../../context/AuthContext';
import { ESTATE_ADMIN_PHONE_NUMBERS, getNotificationProvider } from '../../lib/services/notification';

export const Route = createFileRoute('/admin/settings')({
  component: AdminSettingsPage,
});

function AdminSettingsPage() {
  const { admin } = useAuth();
  const [settings, setSettings] = useState<StoreSettings>(getStoreSettings());
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [testAlertSending, setTestAlertSending] = useState(false);
  const [testAlertFeedback, setTestAlertFeedback] = useState<string | null>(null);

  const handleSendTestOrderAlert = async () => {
    setTestAlertSending(true);
    setTestAlertFeedback(null);
    try {
      const phones = settings.adminAlertPhones && settings.adminAlertPhones.length > 0
        ? settings.adminAlertPhones
        : ESTATE_ADMIN_PHONE_NUMBERS;

      const provider = getNotificationProvider();
      const testMsg = `Coorg Coffee Alert: Test Order #CC-2026-TEST for Rs.1299. Customer: Test Buyer (9876543210). Items: 100% Arabica Powder x1. Alert dispatched to Estate Operations.`;

      for (const phone of phones) {
        await provider.sendSms(phone, testMsg, 'test-order-sample');
      }

      addSystemNotification({
        title: 'SMS & WhatsApp Order Alert Test',
        message: `Dispatched test order notifications to: ${phones.join(', ')}`,
        category: 'order',
        severity: 'success',
      });

      setTestAlertFeedback(`✓ Test order alert triggered successfully to: ${phones.join(' and ')}`);
      setTimeout(() => setTestAlertFeedback(null), 6000);
    } catch (e: any) {
      setTestAlertFeedback(`⚠️ Error sending test alert: ${e?.message || e}`);
    } finally {
      setTestAlertSending(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoreSettings(settings, admin?.name);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <AdminLayout
      activeModule="settings"
      title="STORE CONFIGURATION &amp; SETTINGS"
      subtitle="Manage store metadata, GST rates, shipping charges, Razorpay credentials, and notification channels."
    >
      <form onSubmit={handleSave} className="space-y-8 text-xs">
        {savedSuccess && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>Store configuration settings saved and synchronized to Firestore!</span>
          </div>
        )}

        {/* Store Metadata */}
        <div className="p-6 rounded-2xl bg-[#1C1612] border border-[#3D3025] space-y-4">
          <h3 className="font-display text-xl text-white font-bold flex items-center space-x-2">
            <Settings className="w-5 h-5 text-[#C89B3C]" />
            <span>STORE &amp; ESTATE PROFILE</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 font-bold mb-1">Store Name *</label>
              <input
                type="text"
                required
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-[#241D17] border border-[#3D3025] text-white"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-bold mb-1">Support Email *</label>
              <input
                type="email"
                required
                value={settings.supportEmail}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-[#241D17] border border-[#3D3025] text-white"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-bold mb-1">Support Phone *</label>
              <input
                type="text"
                required
                value={settings.supportPhone}
                onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-[#241D17] border border-[#3D3025] text-white"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-bold mb-1">Estate Base Address</label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-[#241D17] border border-[#3D3025] text-white"
              />
            </div>
          </div>
        </div>

        {/* Tax & Shipping Charges */}
        <div className="p-6 rounded-2xl bg-[#1C1612] border border-[#3D3025] space-y-4">
          <h3 className="font-display text-xl text-white font-bold flex items-center space-x-2">
            <Truck className="w-5 h-5 text-[#C89B3C]" />
            <span>TAX &amp; SHIPPING RULES</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-300 font-bold mb-1">GST Tax Percentage (%)</label>
              <input
                type="number"
                value={settings.gstPercentage}
                onChange={(e) => setSettings({ ...settings, gstPercentage: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl bg-[#241D17] border border-[#3D3025] text-white"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-bold mb-1">Free Shipping Threshold (₹)</label>
              <input
                type="number"
                value={settings.freeShippingThreshold}
                onChange={(e) => setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl bg-[#241D17] border border-[#3D3025] text-white"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-bold mb-1">Flat Shipping Fee (₹)</label>
              <input
                type="number"
                value={settings.flatShippingFee}
                onChange={(e) => setSettings({ ...settings, flatShippingFee: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl bg-[#241D17] border border-[#3D3025] text-white"
              />
            </div>
          </div>
        </div>

        {/* Notifications & Channels */}
        <div className="p-6 rounded-2xl bg-[#1C1612] border border-[#3D3025] space-y-4">
          <h3 className="font-display text-xl text-white font-bold flex items-center space-x-2">
            <Bell className="w-5 h-5 text-[#C89B3C]" />
            <span>NOTIFICATION BROADCAST CHANNELS</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="flex items-center space-x-3 p-3 rounded-xl bg-[#241D17] border border-[#3D3025] cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                className="rounded bg-[#1C1612] border-[#3D3025] text-[#C89B3C]"
              />
              <span className="text-white font-bold">Email Notifications</span>
            </label>

            <label className="flex items-center space-x-3 p-3 rounded-xl bg-[#241D17] border border-[#3D3025] cursor-pointer">
              <input
                type="checkbox"
                checked={settings.smsNotifications}
                onChange={(e) => setSettings({ ...settings, smsNotifications: e.target.checked })}
                className="rounded bg-[#1C1612] border-[#3D3025] text-[#C89B3C]"
              />
              <span className="text-white font-bold">SMS Dispatch Updates</span>
            </label>

            <label className="flex items-center space-x-3 p-3 rounded-xl bg-[#241D17] border border-[#3D3025] cursor-pointer">
              <input
                type="checkbox"
                checked={settings.whatsappNotifications}
                onChange={(e) => setSettings({ ...settings, whatsappNotifications: e.target.checked })}
                className="rounded bg-[#1C1612] border-[#3D3025] text-[#C89B3C]"
              />
              <span className="text-white font-bold">WhatsApp Order Alerts</span>
            </label>
          </div>
        </div>

        {/* Real-time Order SMS & WhatsApp Alert Channels for Estate Operations */}
        <div className="p-6 rounded-2xl bg-[#1C1612] border border-[#3D3025] space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="font-display text-xl text-white font-bold flex items-center space-x-2">
              <Smartphone className="w-5 h-5 text-[#C89B3C]" />
              <span>ESTATE ORDER SMS &amp; WHATSAPP ALERT DESTINATIONS</span>
            </h3>
            <span className="text-[11px] text-emerald-400 font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
              Active Estate Helplines
            </span>
          </div>

          <p className="text-gray-400 text-xs leading-relaxed">
            When a customer successfully completes an order, automated order notification messages are triggered to these phone numbers with complete order items, pouch sizes, grind options, and shipping address.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 font-bold mb-1">
                Primary Estate Alert Phone (SMS &amp; WhatsApp) *
              </label>
              <input
                type="text"
                required
                value={settings.adminAlertPhones?.[0] || '9483472070'}
                onChange={(e) => {
                  const current = settings.adminAlertPhones || ['9483472070', '9071870722'];
                  setSettings({
                    ...settings,
                    adminAlertPhones: [e.target.value.trim(), current[1] || '9071870722'],
                  });
                }}
                placeholder="9483472070"
                className="w-full p-2.5 rounded-xl bg-[#241D17] border border-[#3D3025] text-white font-mono"
              />
              <span className="text-[10px] text-gray-500 mt-1 block">Receives instant order alerts on +91 94834 72070</span>
            </div>

            <div>
              <label className="block text-gray-300 font-bold mb-1">
                Secondary Estate Alert Phone (SMS &amp; WhatsApp) *
              </label>
              <input
                type="text"
                required
                value={settings.adminAlertPhones?.[1] || '9071870722'}
                onChange={(e) => {
                  const current = settings.adminAlertPhones || ['9483472070', '9071870722'];
                  setSettings({
                    ...settings,
                    adminAlertPhones: [current[0] || '9483472070', e.target.value.trim()],
                  });
                }}
                placeholder="9071870722"
                className="w-full p-2.5 rounded-xl bg-[#241D17] border border-[#3D3025] text-white font-mono"
              />
              <span className="text-[10px] text-gray-500 mt-1 block">Receives instant order alerts on +91 90718 70722</span>
            </div>

            <div>
              <label className="block text-gray-300 font-bold mb-1">SMS Gateway Provider</label>
              <select
                value={settings.smsProvider || 'fast2sms'}
                onChange={(e) => setSettings({ ...settings, smsProvider: e.target.value as any })}
                className="w-full p-2.5 rounded-xl bg-[#241D17] border border-[#3D3025] text-white"
              >
                <option value="fast2sms">Fast2SMS (Quick Indian SMS Gateway)</option>
                <option value="twilio">Twilio Programmable SMS</option>
                <option value="custom_webhook">Custom Webhook / WhatsApp API</option>
                <option value="mock">Local &amp; Firestore Audit Mode</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 font-bold mb-1">
                Fast2SMS API Key (Optional)
              </label>
              <input
                type="password"
                value={settings.smsApiKey || ''}
                onChange={(e) => setSettings({ ...settings, smsApiKey: e.target.value })}
                placeholder="Paste your Fast2SMS API Key from fast2sms.com"
                className="w-full p-2.5 rounded-xl bg-[#241D17] border border-[#3D3025] text-white font-mono"
              />
              <span className="text-[10px] text-gray-500 mt-1 block">Leave empty to use Firestore audit logger or direct WhatsApp buttons</span>
            </div>
          </div>

          {/* Test Alert Dispatch Bar */}
          <div className="pt-3 border-t border-[#2D231A] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleSendTestOrderAlert}
                disabled={testAlertSending}
                className="px-4 py-2.5 rounded-xl bg-[#241D17] border border-[#3D3025] hover:border-[#C89B3C] text-white font-bold flex items-center space-x-2 text-xs cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5 text-[#C89B3C]" />
                <span>{testAlertSending ? 'Dispatching Test...' : 'Send Test Order Alert to 94834 72070 & 90718 70722'}</span>
              </button>
            </div>

            <div className="flex items-center space-x-3 text-xs">
              <a
                href={`https://api.whatsapp.com/send?phone=919483472070&text=${encodeURIComponent('☕ Coorg Coffee Alert: Direct WhatsApp test message for estate order notifications.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:underline flex items-center gap-1 font-bold"
              >
                <span>WhatsApp 94834 72070</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-gray-600">•</span>
              <a
                href={`https://api.whatsapp.com/send?phone=919071870722&text=${encodeURIComponent('☕ Coorg Coffee Alert: Direct WhatsApp test message for estate order notifications.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:underline flex items-center gap-1 font-bold"
              >
                <span>WhatsApp 90718 70722</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {testAlertFeedback && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
              {testAlertFeedback}
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-[#C89B3C] text-black font-bold text-sm flex items-center space-x-2 hover:bg-[#D4A748]"
          >
            <Save className="w-4 h-4" />
            <span>Save Store Settings</span>
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
