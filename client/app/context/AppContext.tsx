import React, { createContext, useEffect, useState } from "react";
import { useGetProfileQuery, useUpdateFavouritesMutation } from "@/redux/feature/auth/clientApiSlice";

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
  openingTime: string;
  closingTime: string;
  acceptAdvancedOrder: boolean;
}

interface Order {
  costumer: any | null;
  type: string;
  pickUpType: string | null;
  location: Location | null;
  branch: Array<Branch> | null;
  order: any[]; // Adjust type as needed
  basePrice: number,
  timestamp: string | null;
  status: string;
  dateTimePickUp: any | null;
}

// Define the context type
interface AppContextType {
  user: any | null; 
  setUser: React.Dispatch<React.SetStateAction<any>>;
  order: Order;
  setOrder: React.Dispatch<React.SetStateAction<Order>>;
}

// Create the context with a default value
export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: profile } = useGetProfileQuery();
  const [updateFavourites, { isLoading, error }] = useUpdateFavouritesMutation();
  
  // Initialize user state with correct types
  const [user, setUser] = useState<{ userId: number | null; favourites: any[] }>({
    userId: null,
    favourites: [],
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
    status: "pending",
    dateTimePickUp: null,
  });

  //Set userId and favourites when profile data is available
  useEffect(() => {
    if (profile) {
      setUser({
        userId: profile.id, 
        favourites: profile.favourites || [], 
      });
    }
  }, [profile]);

  // Function to update favourites
  const handleUpdateFavourites = async () => {
    if (user.userId === null) {
      console.error("User ID is not set.");
      return;
    }

    try {
      await updateFavourites({
        userId: user.userId,
        favourites: user.favourites,
      }).unwrap();

    } catch (err) {
      console.error("Error updating favourites:", err);
    }
  };

  //Debugging to verify user state updates
  useEffect(() => {
    handleUpdateFavourites();
    console.log("User state updated:", user);
  }, [user]);

  return (
    <AppContext.Provider value={{ user, setUser, order, setOrder}}>
      {children}
    </AppContext.Provider>
  );
};

// ✅ Add default export
export default AppProvider;