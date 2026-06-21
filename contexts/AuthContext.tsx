import { createContext, useContext, useState } from "react";

type User = {
    role: "student" | "faculty" | "admin";

    [key: string]: any;
};

type AuthContextType = {
    user: User | null;
    setUser: (
        user: User | null
    ) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }

    return context;
}