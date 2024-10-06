export type User = {
  userId: number;
  exp: number;
  iat: number;
};

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export interface ErrorResponse {
  response: {
    message: string;
    errorCode: number;
  };
}

export interface SignupData {
  email: string;
  password: string;
  name: string;
}

export interface SignupResponse {
  user: {
    id: number;
    name: string;
    email: string;
    password: string;
    role: string;
    defaultShippingAddress: null;
    defaultBillingAddress: null;
    createdAt: string;
    updatedAt: string;
  };
}

export interface LoginData {
  email: string;
  password: string;
}
