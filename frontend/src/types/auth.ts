export type User = {
    userId: number;
    exp: number;
    iat: number;
};

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
}

export interface SignupData {
    email: string;
    password: string;
    name: string;
}

export interface LoginData {
    email: string;
    password: string;
}