import type { Address, Profile } from '.';

export type UserRole = 'ADMIN' | 'USER' | 'SELLER';

export type UserData = {
  id: number;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  profile?: Profile | null;
  addresses?: Address[];
};

export interface AuthResponse {
  user: { id: number; email: string; role: UserRole };
  accessToken: string;
}

export interface SignupData {
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}
