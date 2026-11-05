import React, { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { ShieldCheck, Lock, Key, Eye, X, Activity, UserCheck } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { getAuditLogs, logAuditAction } from '../../lib/services/store-service';
import { AuditLog } from '../../lib/types';
import { useAuth, setAdminPassword } from '../../context/AuthContext';

export const Route = createFileRoute('/admin/security')({
  component: AdminSecurityPage,
});

function AdminSecurityPage() {
  const { admin } = useAuth();
  const logs = getAuditLogs();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.trim().length < 8) {
      setErrorMessage('Security Passphrase must be at least 8 characters long.');
      return;
    }
    setAdminPassword(newPassword.trim());
    logAuditAction(admin?.name || 'Admin', 'UPDATE_ADMIN_PASSWORD', 'Security', 'master_passphrase');
    setPasswordSuccess(true);
    setErrorMessage('');
    setTimeout(() => {
      setPasswordSuccess(false);
      setShowPasswordModal(false);
      setNewPassword('');
    }, 2000);
  };

  const filteredLogs = logs.filter((log) =>
    log.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.targetType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.targetId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout
      activeModule="security"
      title="SECURITY &amp; SYSTEM AUDIT TRAIL"
      subtitle="Inspect administrator actions, password resets, active login sessions, and before/after state mutation diffs."
    >
      {/* Session Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-[#1C1612] border border-[#3D3025] space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-[#C89B3C]/20 text-[#C89B3C]">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display text-xl text-white font-bold">{admin?.name || 'Administrator'}</h3>
              <p className="text-xs text-[#B5A490]">Role: <strong className="text-[#C89B3C]">{admin?.role || 'Super Admin'}</strong></p>
            </div>
          </div>

          <div className="space-y-1 text-xs text-gray-400 pt-2 border-t border-[#2D231A]">
            <p>Admin Email: <strong className="text-white">{admin?.email}</strong></p>
            <p>Last Login: <strong className="text-white">{admin?.lastLoginAt ? new Date(admin.lastLoginAt).toLocaleString() : 'Active Now'}</strong></p>
          </div>

          <button
            onClick={() => setShowPasswordModal(true)}
            className="w-full py-2.5 rounded-xl bg-[#241D17] border border-[#3D3025] text-white hover:border-[#C89B3C] font-bold text-xs flex items-center justify-center space-x-2"
          >
            <Key className="w-4 h-4 text-[#C89B3C]" />
            <span>Update Master Security Passphrase</span>
          </button>
        </div>

        <div className="p-6 rounded-2xl bg-[#1C1612] border border-[#3D3025] space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display text-xl text-white font-bold">SECURITY PROTECTION STATUS</h3>
              <p className="text-xs text-emerald-400 font-bold">Firebase Auth &amp; Local Encryption Active</p>
            </div>
          </div>

          <div className="space-y-1 text-xs text-gray-400 pt-2 border-t border-[#2D231A]">
            <p>Session State: <strong className="text-emerald-400">AUTHENTICATED (TOKEN VALID)</strong></p>
            <p>Audit Trail Capacity: <strong className="text-white">200 Recorded Log Entries</strong></p>
          </div>
        </div>
      </div>

      {/* Audit Log Explorer */}
      <div className="p-6 rounded-2xl bg-[#1C1612] border border-[#3D3025] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-[#C89B3C]" />
            <h3 className="font-display text-xl text-white font-bold">MUTATION AUDIT TRAIL</h3>
          </div>

          <input
            type="text"
            placeholder="Filter logs by actor, action, or target ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3.5 py-1.5 rounded-xl bg-[#241D17] border border-[#3D3025] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#C89B3C]"
          />
        </div>

        {filteredLogs.length === 0 ? (
          <p className="text-center text-gray-500 py-8 text-xs">No audit logs recorded.</p>
        ) : (
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#3D3025] text-[#B5A490] font-bold">
                  <th className="py-2.5 px-2">TIME</th>
                  <th className="py-2.5 px-2">ACTOR</th>
                  <th className="py-2.5 px-2">ACTION</th>
                  <th className="py-2.5 px-2">TARGET ENTITY</th>
                  <th className="py-2.5 px-2 text-right">SNAPSHOT DIFF</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A211B]">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#241D17]">
                    <td className="py-2.5 px-2 text-gray-400 font-mono text-[10px]">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="py-2.5 px-2 text-white font-bold">{log.actorName}</td>
                    <td className="py-2.5 px-2 font-mono text-[#C89B3C] font-bold">{log.action}</td>
                    <td className="py-2.5 px-2 text-gray-300">
                      {log.targetType} <span className="font-mono text-gray-500">#{log.targetId}</span>
                    </td>
                    <td className="py-2.5 px-2 text-right">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="px-2.5 py-1 rounded-lg bg-[#241D17] border border-[#3D3025] text-white hover:text-[#C89B3C] text-[10px] font-bold flex items-center space-x-1 ml-auto"
                      >
                        <Eye className="w-3 h-3 text-[#C89B3C]" />
                        <span>Inspect Diff</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Snapshot Diff Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1C1612] border border-[#3D3025] rounded-2xl w-full max-w-xl p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#3D3025] pb-4">
              <div>
                <h3 className="font-display text-lg text-white font-bold">{selectedLog.action} AUDIT DIFF</h3>
                <p className="text-xs text-[#B5A490]">
                  By {selectedLog.actorName} on {new Date(selectedLog.timestamp).toLocaleString()}
                </p>
              </div>
              <button onClick={() => setSelectedLog(null)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <h4 className="font-bold text-red-400 mb-1 font-sans">STATE BEFORE MUTATION</h4>
                <pre className="p-3 rounded-xl bg-[#241D17] border border-[#3D3025] text-red-300 overflow-x-auto text-[10px]">
                  {selectedLog.beforeSnapshot
                    ? JSON.stringify(selectedLog.beforeSnapshot, null, 2)
                    : 'None (Initial State)'}
                </pre>
              </div>

              <div>
                <h4 className="font-bold text-emerald-400 mb-1 font-sans">STATE AFTER MUTATION</h4>
                <pre className="p-3 rounded-xl bg-[#241D17] border border-[#3D3025] text-emerald-300 overflow-x-auto text-[10px]">
                  {selectedLog.afterSnapshot
                    ? JSON.stringify(selectedLog.afterSnapshot, null, 2)
                    : 'Deleted (Target Removed)'}
                </pre>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-[#3D3025]">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 rounded-xl bg-[#C89B3C] text-black font-bold text-xs"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Reset Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1C1612] border border-[#3D3025] rounded-2xl w-full max-w-md p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#3D3025] pb-4">
              <h3 className="font-display text-lg text-white font-bold">UPDATE MASTER PASSPHRASE</h3>
              <button onClick={() => setShowPasswordModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-4 text-xs">
              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 font-bold">
                  {errorMessage}
                </div>
              )}
              {passwordSuccess ? (
                <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold">
                  Passphrase updated successfully!
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-gray-300 font-bold mb-1">New Security Passphrase *</label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new admin passphrase"
                      className="w-full p-2.5 rounded-xl bg-[#241D17] border border-[#3D3025] text-white focus:outline-none focus:border-[#C89B3C]"
                    />
                  </div>

                  <div className="pt-4 border-t border-[#3D3025] flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowPasswordModal(false)}
                      className="px-4 py-2 rounded-xl bg-[#241D17] border border-[#3D3025] text-gray-400 font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-[#C89B3C] text-black font-bold"
                    >
                      Update Passphrase
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
