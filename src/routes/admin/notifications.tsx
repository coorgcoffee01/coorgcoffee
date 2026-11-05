import React, { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Bell, Send, CheckCircle, AlertTriangle, Info, Trash2, Smartphone } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import {
  getSystemNotifications,
  addSystemNotification,
  clearAllNotifications,
} from '../../lib/services/store-service';

export const Route = createFileRoute('/admin/notifications')({
  component: AdminNotificationsPage,
});

function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState(getSystemNotifications());
  const [newTitle, setNewTitle] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [category, setCategory] = useState<'order' | 'stock' | 'payment' | 'delivery' | 'system'>('order');
  const [severity, setSeverity] = useState<'info' | 'warning' | 'error' | 'success'>('info');

  const refreshNotifs = () => setNotifications(getSystemNotifications());

  const handleSendTestNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newMessage) return;

    addSystemNotification({
      title: newTitle,
      message: newMessage,
      category,
      severity,
    });

    setNewTitle('');
    setNewMessage('');
    refreshNotifs();
  };

  const handleClear = () => {
    clearAllNotifications();
    refreshNotifs();
  };

  return (
    <AdminLayout
      activeModule="notifications"
      title="SYSTEM NOTIFICATIONS &amp; BROADCAST ALERT HUB"
      subtitle="Monitor live store events, low-stock triggers, payment alert notifications, and dispatch test SMS/WhatsApp alerts."
    >
      {/* Dispatch Test Alert Card */}
      <div className="p-6 rounded-2xl bg-[#1C1612] border border-[#3D3025] space-y-4">
        <div className="flex items-center space-x-2">
          <Smartphone className="w-5 h-5 text-[#C89B3C]" />
          <h3 className="font-display text-xl text-white font-bold">TRIGGER SYSTEM TEST NOTIFICATION</h3>
        </div>

        <form onSubmit={handleSendTestNotification} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 font-bold mb-1">Notification Title *</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. DTDC Shipping Delay Notice"
                className="w-full p-2.5 rounded-xl bg-[#241D17] border border-[#3D3025] text-white focus:outline-none focus:border-[#C89B3C]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-gray-300 font-bold mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-[#241D17] border border-[#3D3025] text-white"
                >
                  <option value="order">Order Event</option>
                  <option value="stock">Low Stock</option>
                  <option value="payment">Payment Alert</option>
                  <option value="delivery">Delivery Update</option>
                  <option value="system">System Notice</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Severity</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-[#241D17] border border-[#3D3025] text-white"
                >
                  <option value="info">Info</option>
                  <option value="success">Success</option>
                  <option value="warning">Warning</option>
                  <option value="error">Critical Error</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-gray-300 font-bold mb-1">Message Content *</label>
            <textarea
              rows={2}
              required
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Detailed notification message text..."
              className="w-full p-2.5 rounded-xl bg-[#241D17] border border-[#3D3025] text-white focus:outline-none focus:border-[#C89B3C]"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#C89B3C] text-black font-bold flex items-center space-x-1.5 hover:bg-[#D4A748]"
          >
            <Send className="w-4 h-4" />
            <span>Broadcast Notification</span>
          </button>
        </form>
      </div>

      {/* Notifications Stream */}
      <div className="p-6 rounded-2xl bg-[#1C1612] border border-[#3D3025] space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl text-white font-bold">NOTIFICATION LOG FEED</h3>
          {notifications.length > 0 && (
            <button onClick={handleClear} className="text-xs text-gray-400 hover:text-red-400 font-bold">
              Clear All Logs
            </button>
          )}
        </div>

        <div className="space-y-3">
          {notifications.length === 0 ? (
            <p className="text-center text-gray-500 py-8 text-xs">No active notifications logged.</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className="p-4 rounded-xl bg-[#241D17] border border-[#3D3025] space-y-1 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                        n.severity === 'success'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : n.severity === 'warning'
                          ? 'bg-amber-500/20 text-amber-400'
                          : n.severity === 'error'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}
                    >
                      {n.category} • {n.severity}
                    </span>
                    <h4 className="font-bold text-white text-sm">{n.title}</h4>
                  </div>
                  <span className="text-[10px] text-gray-400">{new Date(n.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-gray-300 text-xs">{n.message}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
