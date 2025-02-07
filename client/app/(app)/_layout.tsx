import { Stack, useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { AppContext } from "../context/AppContext";
import globalStyle from "../../assets/styles/globalStyle";
import { BackButton } from "@/components/BackButton";

export default function AppLayout() {
    // const context = useContext(AppContext);
    // const router = useRouter();
  
    // // State to track loading
    // const [loading, setLoading] = useState(true);
  
    // if (!context) {
    //   return <Text>Error: AppContext is not available</Text>;
    // }
  
    // const { token, user } = context;
    // const [isLayoutReady, setIsLayoutReady] = useState(false);
  
    // useEffect(() => {
    //   // Wait until the layout is ready
    //   setIsLayoutReady(true);
    // }, []);
  
    // useEffect(() => {
    //   if (isLayoutReady) {
    //     const checkAuthStatus = () => {
    //       if (!token && !user) {
    //         router.replace("/auth/login");
    //       }
    //       setLoading(false);
    //     };
    //     checkAuthStatus();
    //   }
    // }, [isLayoutReady, token, user, router]);
  
    // // Show loading spinner until authentication is checked
    // if (loading) {
    //   return (
    //     <View style={styles.loadingContainer}>
    //       <ActivityIndicator size="large" color="#ff6347" />
    //       <Text style={styles.loadingText}>Loading...</Text>
    //     </View>
    //   );
    // }
  
  return (
      <Stack>
        <Stack.Screen name="(nav)" options={{ headerShown: false }} />

        {/* Order Screens */}
        <Stack.Screen name="order/order-type"  options={{ headerShown: false }}/>
        <Stack.Screen name="order/order-step3"  options={{ 
          headerShown: true,
          headerTitle: "ENTER YOUR FULL ADDRESS",
          headerStyle: globalStyle.headerStyle,
          headerTitleStyle: globalStyle.headerTitleStyle,
          headerLeft: () => (
            <BackButton />
          ),
           }}/>
        <Stack.Screen name="order/order-step4"  options={{
          headerShown: true,
          headerTitle: "SELECT PROVINCE AND CITY",
          headerStyle: globalStyle.headerStyle,
          headerTitleStyle: globalStyle.headerTitleStyle,
          headerLeft: () => (
            <BackButton />
          ),
            }}/>
        
        {/* Menu Screens */}
        <Stack.Screen name="menu/menu-categories"  options={{ headerShown: false }}/>
        <Stack.Screen name="menu/menu-burgers"  options={{ headerShown: false }}/>
        <Stack.Screen name="menu/menu-drinks"  options={{ headerShown: false }}/>
        <Stack.Screen name="menu/menu-favorites"  options={{ headerShown: false }}/>
        <Stack.Screen name="menu/menu-featured"  options={{ headerShown: false }}/>

        {/* Buying Screens */}
        <Stack.Screen name="view-cart" options={{ headerShown: false }} />
        <Stack.Screen name="checkout" options={{ headerShown: false }} />
      </Stack>
  );
}

