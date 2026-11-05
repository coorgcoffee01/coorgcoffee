import React, { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { UserCheck, Plus, Edit2, Trash2, X, Save, Shield } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { getAdminUsers, saveAdminUser, deleteAdminUser } from '../../lib/services/store-service';
import { AdminAccount } from '../../lib/types';
import { useAuth } from '../../context/AuthContext';

export const Route = createFileRoute('/admin/admin-users')({
  component: AdminUsersPage,
});

function AdminUsersPage() {
  const { admin: currentAdmin } = useAuth();
  const [adminUsers, setAdminUsers] = useState(getAdminUsers());

  const [editingUser, setEditingUser] = useState<Partial<AdminAccount> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const refreshUsers = () => setAdminUsers(getAdminUsers());

  const handleOpenAddModal = () => {
    setEditingUser({
      name: '',
      email: '',
      role: 'Order Specialist',
      status: 'active',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (u: AdminAccount) => {
    setEditingUser({ ...u });
    setIsModalOpen(true);
  };

  const handleDelete = (uid: string) => {
    if (uid === currentAdmin?.uid) {
      alert('Cannot delete currently logged in administrator.');
      return;
    }
    if (window.confirm('Delete admin account access?')) {
      deleteAdminUser(uid, currentAdmin?.name);
      refreshUsers();
    }
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser || !editingUser.name || !editingUser.email) return;

    const userToSave: AdminAccount = {
      uid: editingUser.uid || `admin-${Date.now()}`,
      name: editingUser.name,
      email: editingUser.email,
      role: editingUser.role || 'Order Specialist',
      status: editingUser.status || 'active',
      lastLoginAt: editingUser.lastLoginAt || new Date().toISOString(),
      createdAt: editingUser.createdAt || new Date().toISOString(),
    };

    saveAdminUser(userToSave, currentAdmin?.name);
    setIsModalOpen(false);
    setEditingUser(null);
    refreshUsers();
  };

  return (
    <AdminLayout
      activeModule="admin-users"
      title="ADMIN ACCOUNTS &amp; ROLE PERMISSIONS (RBAC)"
      subtitle="Manage manager team accounts, role-based access levels, permissions, and active login sessions."
    >
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#1C1612] border border-[#3D3025]">
        <div>
          <h3 className="font-display text-lg text-white font-bold">STORE ADMINISTRATORS</h3>
          <p className="text-xs text-[#B5A490]">Total Manager Accounts: {adminUsers.length}</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#C89B3C] text-black font-bold text-xs hover:bg-[#D4A748] shadow-md shadow-[#C89B3C]/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Admin User</span>
        </button>
      </div>

      {/* Admin Users Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminUsers.map((usr) => (
          <div
            key={usr.uid}
            className="p-6 rounded-2xl bg-[#1C1612] border border-[#3D3025] space-y-4 flex flex-col justify-between hover:border-[#C89B3C]/40 transition-colors"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-[#C89B3C]/20 text-[#C89B3C] flex items-center justify-center font-bold">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-display text-lg text-white font-bold">{usr.name}</h4>
                    <span className="text-[10px] font-bold text-[#C89B3C] uppercase">{usr.role}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleOpenEditModal(usr)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-[#C89B3C]"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(usr.uid)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-1 text-xs text-gray-300 pt-2 border-t border-[#2D231A]">
                <p>Email: <strong className="text-white">{usr.email}</strong></p>
                <p>Last Login: <strong className="text-white">{usr.lastLoginAt ? new Date(usr.lastLoginAt).toLocaleString() : 'N/A'}</strong></p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#2D231A] flex items-center justify-between text-xs">
              <span className="text-gray-400 text-[10px]">UID: {usr.uid}</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                ACTIVE
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Admin Modal */}
      {isModalOpen && editingUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1C1612] border border-[#3D3025] rounded-2xl w-full max-w-md p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#3D3025] pb-4">
              <h3 className="font-display text-xl text-white font-bold">
                {editingUser.uid ? 'Edit Admin User' : 'Add Admin User'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-bold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={editingUser.name || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  placeholder="Enter full name"
                  className="w-full p-2.5 rounded-xl bg-[#241D17] border border-[#3D3025] text-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={editingUser.email || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  placeholder="user@coorgcoffee.in"
                  className="w-full p-2.5 rounded-xl bg-[#241D17] border border-[#3D3025] text-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Admin Role</label>
                <select
                  value={editingUser.role || 'Order Specialist'}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as any })}
                  className="w-full p-2.5 rounded-xl bg-[#241D17] border border-[#3D3025] text-white"
                >
                  <option value="Super Admin">Super Admin (Full Access)</option>
                  <option value="Inventory Manager">Inventory Manager (Stock &amp; Products)</option>
                  <option value="Order Specialist">Order Specialist (Orders &amp; Shipping)</option>
                  <option value="Support Lead">Support Lead (Customers &amp; Reviews)</option>
                </select>
              </div>

              <div className="pt-4 border-t border-[#3D3025] flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#241D17] border border-[#3D3025] text-gray-400 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#C89B3C] text-black font-bold flex items-center space-x-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
