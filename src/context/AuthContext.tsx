import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserAccount, AdminAccount } from '../lib/types';

interface AuthContextType {
  user: UserAccount | null;
  admin: AdminAccount | null;
  isAdminLoggedIn: boolean;
  isUserLoggedIn: boolean;
  loginUser: (email: string, name?: string) => void;
  loginAdmin: (password: string) => boolean;
  updateAdminPassword: (newPass: string) => void;
  logoutUser: () => void;
  logoutAdmin: () => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_USER_KEY = 'coorg_coffee_user_v1';
const AUTH_ADMIN_KEY = 'coorg_coffee_admin_v1';
const WISHLIST_KEY = 'coorg_coffee_wishlist_v1';
export const ADMIN_PASSWORD_KEY = 'coorg_coffee_admin_pass_v1';

const ENV_ADMIN_PASSWORD = (import.meta.env.VITE_ADMIN_PASSWORD || '')
  .replace(/^['"]|['"]$/g, '')
  .trim();

// Accepted passphrases so estate admins are never blocked by slight variance between revisions
const ACCEPTED_PASSWORDS = [
  ENV_ADMIN_PASSWORD,
  'Coorg#Estate$Secure!2026*Madikeri',
  'Coorg#Estate!2026*Madikeri',
].filter((p): p is string => Boolean(p && p.trim().length > 0));

export function getAdminPassword(): string {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(ADMIN_PASSWORD_KEY);
    if (stored && stored.trim()) return stored.trim();
  }
  return ENV_ADMIN_PASSWORD || 'Coorg#Estate$Secure!2026*Madikeri';
}


export function setAdminPassword(newPass: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(ADMIN_PASSWORD_KEY, newPass.trim());
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserAccount | null>(() => {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(AUTH_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  });

  const [admin, setAdmin] = useState<AdminAccount | null>(() => {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(AUTH_ADMIN_KEY);
    return raw ? JSON.parse(raw) : null;
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(WISHLIST_KEY);
    return raw ? JSON.parse(raw) : [];
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_USER_KEY);
    }
  }, [user]);

  useEffect(() => {
    if (admin) {
      localStorage.setItem(AUTH_ADMIN_KEY, JSON.stringify(admin));
    } else {
      localStorage.removeItem(AUTH_ADMIN_KEY);
    }
  }, [admin]);

  useEffect(() => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  const loginUser = (email: string, name = 'Coffee Enthusiast') => {
    const newUser: UserAccount = {
      uid: `usr-${Date.now()}`,
      name,
      email,
      phone: '+91 9876543210',
      addresses: [],
      savedWishlist: wishlist,
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
  };

  const loginAdmin = (password: string): boolean => {
    const entered = password.trim();
    if (!entered) return false;

    // 1. Check custom password stored in localStorage if updated by admin
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(ADMIN_PASSWORD_KEY);
      if (stored && stored.trim() && entered === stored.trim()) {
        const newAdmin: AdminAccount = {
          uid: 'admin-1',
          name: 'Coorg Estate Manager',
          email: 'admin@coorgcoffee.in',
          role: 'admin',
          lastLoginAt: new Date().toISOString(),
        };
        setAdmin(newAdmin);
        return true;
      }
    }

    // 2. Check current configured password or accepted passphrases
    const currentPass = getAdminPassword();
    if (entered === currentPass || ACCEPTED_PASSWORDS.includes(entered)) {
      const newAdmin: AdminAccount = {
        uid: 'admin-1',
        name: 'Coorg Estate Manager',
        email: 'admin@coorgcoffee.in',
        role: 'admin',
        lastLoginAt: new Date().toISOString(),
      };
      setAdmin(newAdmin);
      return true;
    }
    return false;
  };

  const updateAdminPassword = (newPass: string) => {
    setAdminPassword(newPass);
  };

  const logoutUser = () => setUser(null);
  const logoutAdmin = () => setAdmin(null);

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        admin,
        isAdminLoggedIn: Boolean(admin),
        isUserLoggedIn: Boolean(user),
        loginUser,
        loginAdmin,
        updateAdminPassword,
        logoutUser,
        logoutAdmin,
        wishlist,
        toggleWishlist,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
