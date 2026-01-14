// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import api from "../api/axios";

// Backend user type
type ApiUser = {
  _id: string;
  first_name: string;
  last_name?: string;
  email_id: string;
  profile_picture?: string | null;
};

// Client user type
export type ClientUser = {
  id: string;
  _id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  name?: string;
  avatar?: string;
  profile_picture?: string | null;
};

interface AuthContextType {
  user: ClientUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  verifyOTP: (otp: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
  needsVerification: boolean;
  pendingEmail: string | null;
  refreshUser: () => Promise<boolean>;
  setUser: (u: ClientUser | null) => void;
  updateUser: (u: Partial<ClientUser>) => void; // ✅ allow partial updates
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const LOCAL_KEY = "hirehelper_user";

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUserState] = useState<ClientUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_KEY);
    if (saved) setUserState(JSON.parse(saved));
  }, []);

  const toClientUser = (apiUser: ApiUser | null): ClientUser | null => {
  if (!apiUser) return null;
  const name = `${apiUser.first_name || ""} ${apiUser.last_name || ""}`.trim();
  return {
    id: apiUser._id,
    _id: apiUser._id,
    first_name: apiUser.first_name,
    last_name: apiUser.last_name,
    email: apiUser.email_id,
    name,
      avatar: apiUser.profile_picture
       ? `${import.meta.env.VITE_API_URL.replace("/api/v1","")}${apiUser.profile_picture}`
      : "/default-pfp.jpg",  // ✅ default if no profile picture
    profile_picture: apiUser.profile_picture ?? null,
  };
};


  // Set full user
  const setUser = (u: ClientUser | null) => {
    setUserState(u);
    if (u) localStorage.setItem(LOCAL_KEY, JSON.stringify(u));
    else localStorage.removeItem(LOCAL_KEY);
  };

  // ✅ Update partial fields (like avatar)
  const updateUser = (u: Partial<ClientUser>) => {
    setUserState(prev => {
      if (!prev) return null;
      const updated: ClientUser = { ...prev, ...u };
      localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const refreshUser = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await api.get("/settings/profile");
      if (res.data?.user) {
        setUser(toClientUser(res.data.user));
        setIsLoading(false);
        return true;
      }
    } catch (err) {
      console.error("refreshUser error:", err);
    }
    setIsLoading(false);
    return false;
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email_id: email, password });
      if (data?.user) {
        setUser(toClientUser(data.user));
        setIsLoading(false);
        return true;
      } else if (data?.msg?.includes("verify")) {
        setPendingEmail(email);
        setNeedsVerification(true);
      }
    } catch (err) {
      console.error("Login error:", err);
    }
    setIsLoading(false);
    return false;
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const [first_name, ...rest] = name.trim().split(" ");
      const last_name = rest.join(" ");
      const { data } = await api.post("/auth/register", {
        first_name,
        last_name,
        email_id: email,
        password,
      });
      if (data?.msg?.includes("OTP sent")) {
        setPendingEmail(email);
        setNeedsVerification(true);
        setIsLoading(false);
        return true;
      }
    } catch (err) {
      console.error("Register error:", err);
    }
    setIsLoading(false);
    return false;
  };

  const verifyOTP = async (otp: string): Promise<boolean> => {
    if (!pendingEmail) return false;
    setIsLoading(true);
    try {
      const { data } = await api.post("/auth/verify-otp", { email_id: pendingEmail, otp });
      if (data?.user) {
        setUser(toClientUser(data.user));
        setNeedsVerification(false);
        setPendingEmail(null);
        setIsLoading(false);
        return true;
      }
    } catch (err) {
      console.error("Verify OTP error:", err);
    }
    setIsLoading(false);
    return false;
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await api.post("/auth/logout");
    } catch {}
    setUser(null);
    setNeedsVerification(false);
    setPendingEmail(null);
    setIsLoading(false);
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    verifyOTP,
    logout,
    isLoading,
    needsVerification,
    pendingEmail,
    refreshUser,
    setUser,
    updateUser, // ✅ added here
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook
export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
