
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = Constants.expoConfig?.extra?.BACKEND_URL;

export const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: async (headers, { getState }) => {
    const token = await AsyncStorage.getItem("authToken"); 
    console.log("Token in baseQuery:", token); 

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    } else {
      console.warn("No Token Found in AsyncStorage");
    }

    headers.set("Accept", "application/json");
    return headers;
  },
  credentials: "include", 
});