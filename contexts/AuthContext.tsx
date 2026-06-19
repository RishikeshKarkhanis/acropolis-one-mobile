import { Faculty } from "@/types/Faculty";
import { createContext, useContext, useState } from "react";

type AuthContextType = {
    faculty: Faculty | null;
    setFaculty: (faculty: Faculty | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [faculty, setFaculty] = useState<Faculty | null>(null);

    return (
        <AuthContext.Provider value={{ faculty, setFaculty }}>
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