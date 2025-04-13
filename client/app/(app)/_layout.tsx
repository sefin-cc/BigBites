import { router, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import globalStyle from "../../assets/styles/globalStyle";
import { BackButton } from "@/components/BackButton";
import { VerifyButton } from "@/components/VerifyButton";
import { useSelector } from "react-redux";
import type { RootState } from '@/redux/store'; 
import { useGetProfileQuery } from "@/redux/feature/auth/clientApiSlice";

export default function AppLayout() {
  const token = useSelector((state: RootState) => state.auth.token);
  const [isLayoutReady, setIsLayoutReady] = useState(false);

  const {
    data: profile,
    error: profileError,
    isFetching: isProfileLoading,
  } = useGetProfileQuery(undefined, {
    skip: !token,
  });

  useEffect(() => {
    setIsLayoutReady(true);
  }, []);

  useEffect(() => {
 
    if (isLayoutReady && !token) {
      router.replace("/auth/choose");
    }
    
    // for invalid tokens
    if(!isProfileLoading && isLayoutReady){
      const user = profile?.name;
      if (!user && profileError && token) {
        router.replace("/auth/choose");
      }
    }
  

  }, [isLayoutReady, token, profileError,isProfileLoading]);

  if (!isLayoutReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
      <Stack
        screenOptions={{
          animation: 'fade',
        }}
      >


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
            
        <Stack.Screen name="order/order-step5"  options={{
          headerShown: false,
            }}/>

          <Stack.Screen name="order/order-step6"  options={{ headerShown: false }} />

        {/* Menu Screens */}
        <Stack.Screen name="menu/menu-categories" options={{
          headerShown: true,
          headerTitle: "MENU - CATEGORIES",
          headerStyle: globalStyle.headerStyle,
          headerTitleStyle: globalStyle.headerTitleStyle,
          headerLeft: () => (
            <BackButton />
          ),
            }}/>
        <Stack.Screen name="menu/menu"  options={{
          headerShown: true,
          headerTitle: "MENU",
          headerStyle: globalStyle.headerStyle,
          headerTitleStyle: globalStyle.headerTitleStyle,
          headerLeft: () => (
            <BackButton />
          ),
            }}/>

          <Stack.Screen name="menu/menu-favourite" options={{
          headerShown: true,
          headerTitle: "MENU - FAVOURITE",
          headerStyle: globalStyle.headerStyle,
          headerTitleStyle: globalStyle.headerTitleStyle,
          headerLeft: () => (
            <BackButton />
          ),
            }}/>

        {/* Buying Screens */}
        <Stack.Screen name="view-cart" options={{
          headerShown: true,
          headerTitle: "CART",
          headerStyle: globalStyle.headerStyle,
          headerTitleStyle: globalStyle.headerTitleStyle,
          headerLeft: () => (
            <BackButton />
          ),
            }}/>

        <Stack.Screen name="checkout" options={{
          headerShown: true,
          headerTitle: "CHECKOUT",
          headerStyle: globalStyle.headerStyle,
          headerTitleStyle: globalStyle.headerTitleStyle,
          headerLeft: () => (
            <BackButton />
          ),
            }}/>

        <Stack.Screen name="payment" options={{
          headerShown: true,
          headerBackVisible: false, 
          headerTitle: "PROCESS PAYMENT",
          headerStyle: globalStyle.headerStyle,
          headerTitleStyle: globalStyle.headerTitleStyle,
          headerRight: () => (
            <VerifyButton />
          ),
          }}/>

        <Stack.Screen name="verification" options={{
          headerShown: false,
          }}/>

        <Stack.Screen name="receipt" options={{
          headerShown: false,
          }}/>

        <Stack.Screen name="edituser" options={{
          headerShown: true,
          headerTitle: "EDIT YOUR INFORMATION",
          headerStyle: globalStyle.headerStyle,
          headerTitleStyle: globalStyle.headerTitleStyle,
          headerLeft: () => (
            <BackButton />
          ),
        }}/>
      </Stack>
  );
}

