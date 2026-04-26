// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";
const AuthContext = createContext(undefined);
const LOCAL_KEY = "hirehelper_user";
export const AuthProvider = ({ children }) => {
    const [user, setUserState] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [needsVerification, setNeedsVerification] = useState(false);
    const [pendingEmail, setPendingEmail] = useState(null);
    useEffect(() => {
        const saved = localStorage.getItem(LOCAL_KEY);
        if (saved)
            setUserState(JSON.parse(saved));
    }, []);
    const toClientUser = (apiUser) => {
        if (!apiUser)
            return null;
        const name = `${apiUser.first_name || ""} ${apiUser.last_name || ""}`.trim();
        return {
            id: apiUser._id,
            _id: apiUser._id,
            first_name: apiUser.first_name,
            last_name: apiUser.last_name,
            email: apiUser.email_id,
            name,
            avatar: apiUser.profile_picture
                ? `${import.meta.env.VITE_API_URL.replace("/api/v1", "")}${apiUser.profile_picture}`
                : "/default-pfp.jpg", // ✅ default if no profile picture
            profile_picture: apiUser.profile_picture ?? null,
        };
    };
    // Set full user
    const setUser = (u) => {
        setUserState(u);
        if (u)
            localStorage.setItem(LOCAL_KEY, JSON.stringify(u));
        else
            localStorage.removeItem(LOCAL_KEY);
    };
    // ✅ Update partial fields (like avatar)
    const updateUser = (u) => {
        setUserState(prev => {
            if (!prev)
                return null;
            const updated = { ...prev, ...u };
            localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
            return updated;
        });
    };
    const refreshUser = async () => {
        setIsLoading(true);
        try {
            const res = await api.get("/settings/profile");
            if (res.data?.user) {
                setUser(toClientUser(res.data.user));
                setIsLoading(false);
                return true;
            }
        }
        catch (err) {
            console.error("refreshUser error:", err);
        }
        setIsLoading(false);
        return false;
    };
    const login = async (email, password) => {
        setIsLoading(true);
        try {
            const { data } = await api.post("/auth/login", { email_id: email, password });
            if (data?.user) {
                setUser(toClientUser(data.user));
                setIsLoading(false);
                return { success: true };
            }
            else if (data?.msg?.includes("verify")) {
                setPendingEmail(email);
                setNeedsVerification(true);
                setIsLoading(false);
                return { success: false, msg: "Please verify your email via OTP." };
            }
        }
        catch (err) {
            setIsLoading(false);
            if (err.response?.status === 403 && err.response?.data?.msg?.includes("verify")) {
                setPendingEmail(email);
                setNeedsVerification(true);
                return { success: false, msg: "Please verify your email via OTP." };
            }
            return { success: false, msg: err.response?.data?.msg || "Login failed due to a server error." };
        }
        setIsLoading(false);
        return { success: false, msg: "Unknown error occurred" };
    };
    const register = async (email, password, name) => {
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
                return { success: true };
            }
        }
        catch (err) {
            setIsLoading(false);
            return { success: false, msg: err.response?.data?.msg || "Registration failed" };
        }
        setIsLoading(false);
        return { success: false, msg: "Unknown error occurred" };
    };
    const verifyOTP = async (otp) => {
        if (!pendingEmail)
            return false;
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
        }
        catch (err) {
            console.error("Verify OTP error:", err);
        }
        setIsLoading(false);
        return false;
    };
    const logout = async () => {
        setIsLoading(true);
        try {
            await api.post("/auth/logout");
        }
        catch { }
        setUser(null);
        setNeedsVerification(false);
        setPendingEmail(null);
        setIsLoading(false);
    };
    const value = {
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
export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx)
        throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};
