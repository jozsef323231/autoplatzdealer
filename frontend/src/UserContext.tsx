import React, { createContext, useState, useContext, useEffect } from "react";
import { UserDTO } from "./Interfaces/User";
import { getUser, login, register, logout, RegisterData } from "./api/userService.ts";

interface UserContextType {
    user: UserDTO | null;
    isAuthenticated: boolean;
    loginUser: (email: string, password: string) => Promise<void>;
    registerUser: (data: RegisterData) => Promise<void>;
    logoutUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error("useUser must be used within a UserProvider");
    return context;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserDTO | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const fetchUser = async () => {
        try {
            const userId = getUserId();
            if (userId) {
                const userData = await getUser(userId);
                setUser(userData);
                setIsAuthenticated(true);
                localStorage.setItem("userId", userId);
                return;
            }
            setIsAuthenticated(false);
        } catch (error) {
            console.error("Error fetching user:", error);
            setIsAuthenticated(false);
        }
    };
    
    useEffect(() => {
        fetchUser();
    }, []);
    
    const loginUser = async (email: string, password: string) => {
        const response = await login(email, password);
        console.log("Login response:", response);

        const accessToken = (response as any).AccessToken || (response as any).accessToken;
        const refreshToken = (response as any).RefreshToken || (response as any).refreshToken;

        if (accessToken) {
            localStorage.setItem("AccessToken", accessToken);
            const tokenUserId = getUserIdFromToken(accessToken);
            if (tokenUserId) {
                localStorage.setItem("userId", tokenUserId);
            }
        }

        if (refreshToken) {
            localStorage.setItem("RefreshToken", refreshToken);
        }

        // Set user data directly from response (use User property if available)
        if ((response as any).User || (response as any).user) {
            const responseUser = (response as any).User || (response as any).user;
            setUser(responseUser);
            setIsAuthenticated(true);
            if (responseUser?.id) {
                localStorage.setItem("userId", responseUser.id);
            }
        } else if (accessToken) {
            setIsAuthenticated(true);
        }

        // Fetch the latest user data - don't throw if this fails
        try {
            await fetchUser();
        } catch (error) {
            console.error("Failed to fetch user after login, but login was successful", error);
        }
    };
    



    const registerUser = async (data: RegisterData) => {
        try {
            await register(data);
        } catch (error) {
            console.error("Error registering user:", error);
        }
    };

    const logoutUser = async () => {
        try {
            const userId = user?.id || "";
            await logout(userId);
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem("userId");
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <UserContext.Provider value={{ user, isAuthenticated, loginUser, registerUser, logoutUser }}>
            {children}
        </UserContext.Provider>
    );
};

// Helper function to read the userId cookie
const getUserIdFromCookie = (): string | null => {
    const match = document.cookie.match(/(?:^|;\s*)userId=([^;]*)/);
    return match ? match[1] : null;
};

const getUserIdFromToken = (token: string): string | null => {
    try {
        const payloadPart = token.split(".")[1];
        if (!payloadPart) {
            return null;
        }

        const normalized = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
        const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
        const payloadJson = atob(padded);
        const payload = JSON.parse(payloadJson);

        return payload.Id || payload.id || null;
    } catch {
        return null;
    }
};

const getUserId = (): string | null => {
    const storageUserId = localStorage.getItem("userId");
    if (storageUserId) {
        return storageUserId;
    }

    const accessToken = localStorage.getItem("AccessToken");
    if (accessToken) {
        const tokenUserId = getUserIdFromToken(accessToken);
        if (tokenUserId) {
            return tokenUserId;
        }
    }

    return getUserIdFromCookie();
};
