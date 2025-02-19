import { createContext, useEffect, useState } from "react";

// Define the shape of your context data
interface AppContextType {
    token: string | null;
    setToken: React.Dispatch<React.SetStateAction<string | null>>;
    user: any;  // You can replace 'any' with a more specific type if needed
    setUser: React.Dispatch<React.SetStateAction<any>>; // Replace 'any' with a more specific type
}

// Provide a default value for the context
export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: any) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [user, setUser] = useState<any>();  // Replace 'any' with the type of user if known

    const getUser = async () => {
        const res = await fetch('/api/user', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await res.json();

        if (res.ok) {
            setUser(data);
        }
    };

    useEffect(() => {
        if (token) {
            getUser();
        }
    }, [token]);

    return (
        <AppContext.Provider value={{ token, setToken, user, setUser }}>
            {children}
        </AppContext.Provider>
    );
};
