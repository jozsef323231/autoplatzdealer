export interface UserDTO {
    id: string;
    name?: string;
    email: string;
    userName: string;
    phoneNumber: string;
    preferredLanguage: 'en' | 'de' | 'hu';
}

export interface RegisterData {
    name: string;
    userName: string;
    email: string;
    password: string;
    phoneNumber: string;
    preferredLanguage: 'en' | 'de' | 'hu';
}

export interface LoginResponse {
    User?: UserDTO;
    user?: UserDTO;
    AccessToken?: string;
    accessToken?: string;
    RefreshToken?: string;
    refreshToken?: string;
}