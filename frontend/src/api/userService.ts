import api from "./axiosInstance.ts";
import {LoginResponse} from "../Interfaces/User.ts";

export const refreshToken = async (): Promise<boolean> => {
    try {
        const storedRefreshToken = localStorage.getItem("RefreshToken");
        if (!storedRefreshToken) {
            return false;
        }

        // Make sure to send the refresh request with credentials
        const response = await api.post(
            "/users/refresh",
            storedRefreshToken,
            { withCredentials: true } // Ensures cookies are sent along with the request
        );

        // If refresh is successful, store the new AccessToken
        if (response.data.AccessToken) {
            localStorage.setItem("AccessToken", response.data.AccessToken);
            return true;
        }

        return false;
    } catch (error) {
        console.error("Token refresh failed", error);
        return false;
    }
};


export const getUser = async (userId: string) => {
    try {
        // Fetch the access token from storage or cookies
        const token = getAccessToken();

        const requestConfig = {
            withCredentials: true,
            headers: token
                ? {
                      Authorization: `Bearer ${token}`,
                  }
                : undefined,
        };

        // Fetch user data from API (header token when available, cookie fallback otherwise)
        const response = await api.get(`/users/${userId}`, requestConfig);

        return response.data;
    } catch (error) {
        console.error("Error fetching user:", error);
        throw error;
    }
};

// Helper function to extract token from cookies
function getAccessTokenFromCookie(): string | null {
    const cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
        if (cookie.startsWith("AccessToken=")) {
            return cookie.split("=")[1];
        }
    }
    return null;
}

function getAccessToken(): string | null {
    return localStorage.getItem("AccessToken") || getAccessTokenFromCookie();
}


export const logout = async (userId: string) => {
    try {
        await api.post("/users/logout", userId);
        localStorage.removeItem("AccessToken");
        localStorage.removeItem("RefreshToken");
    } catch (error) {
        console.error("Error logging out", error);
    }
};

export interface RegisterData {
    name: string;
    userName: string;
    email: string;
    password: string;
    phoneNumber: string;
    preferredLanguage: string;
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/users/login", { email, password });
    console.log(response.data); // Debugging
    return response.data; // Correctly return the structured response
};


export const register = async (data: RegisterData) => {
    const response = await api.post("/users/register", data);
    return response.data;
};


export const changePassword = async (
    userId: string,
    oldPassword: string,
    newPassword: string
): Promise<boolean> => {
    try {
        const response = await api.post("/users/change-password", {
            userId,
            oldPassword,
            newPassword,
        });

        return response.status === 200;
    } catch (error) {
        console.error("Password change failed", error);
        return false;
    }
};

export const changePreferredLanguage = async (userId: string, preferredLanguage: string): Promise<boolean> => {
    try {
        const response = await api.put(
            `/users/updatePreferredLanguage/${userId}`,
            JSON.stringify(preferredLanguage),
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        return response.status === 200;
    } catch (error) {
        console.error("Failed to change preferred language", error);
        return false;
    }
};

