import React, { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";


interface Location {
  description: string;
  latitude: number;
  longitude: number;
}

interface Branch {
  id: string;
  branchName: string;
  province: string;
  city: string;
  fullAddress: string;
  tags: Array<string | null>; 
}

interface Order {
  costumer: any | null;
  type: string;
  pickUpType: string | null;
  location: Location | null;
  branch: Array<Branch> | null;
  order: any[]; // Adjust type as needed
  basePrice: number,
  timestamp: string | null

}

// Define the context type
interface AppContextType {
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  user: any | null; 
  setUser: React.Dispatch<React.SetStateAction<any>>;
  order: Order;
  setOrder: React.Dispatch<React.SetStateAction<Order>>;
}

// Create the context with a default value
export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>({
    name: "",
    email: "",
    phone: "",
    address: "",
    favourites: []
  });
  const [order, setOrder] = useState<Order>({
    costumer: null,
    type: "",
    pickUpType: null,
    location: null,
    branch: null,
    order: [],
    basePrice: 0,
    timestamp: null,
  });

  // Load token from AsyncStorage
  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await AsyncStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
      }
    };
    loadToken();
  }, []);

  // Fetch user data when token changes
  useEffect(() => {
    const getUser = async () => {
      if (!token) return;

      try {
        const res = await fetch("http://127.0.0.1:8000/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
          setOrder(prev => ({
            ...prev,
            costumer: data
          }));
        } else {
          console.error("Failed to fetch user:", res.status);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    getUser();
  }, [token]);

  return (
    <AppContext.Provider value={{ token, setToken, user, setUser, order, setOrder}}>
      {children}
    </AppContext.Provider>
  );
};

// ✅ Add default export
export default AppProvider;