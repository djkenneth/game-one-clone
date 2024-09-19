import { createContext, PropsWithChildren, useContext, useState } from 'react';
import { jwtDecode, JwtPayload } from "jwt-decode";

const AuthContext = createContext<JwtPayload | null>(null);

type AuthProviderProps = PropsWithChildren

export default function AuthProvider({
    children,
}: AuthProviderProps) {
    // Uses `isSignedIn` prop to determine whether or not to render a user
    const accessToken = localStorage.getItem('accessToken') ? jwtDecode(localStorage.getItem('accessToken') as string) : null;

    const [user] = useState<JwtPayload | null>(accessToken);

    return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
};