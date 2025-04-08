import { Stack } from "expo-router";
import AppProvider from "./context/AppContext";
import { Text, View } from "react-native";
import * as Font from 'expo-font';
import { Provider } from "react-redux";
import {store} from "../redux/store";
import { StatusBar } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import SplashScreen from "@/components/SplashScreen";
import { useState } from "react";

export default function RootLayout() {
  const [isSplashVisible, setSplashVisible] = useState(true);
  const [fontsLoaded] = Font.useFonts({
    'MadimiOne': require('../assets/fonts/MadimiOne-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return <Text></Text>;
  }

  if (isSplashVisible) {
    return <SplashScreen onFinish={() => setSplashVisible(false)} />;
  }


  return (  
  <Provider store={store}>
    <PaperProvider>
     <AppProvider>
        <StatusBar
          backgroundColor="transparent" 
          translucent={true} 
          barStyle="light-content"
        />

        <Stack
          screenOptions={{
            animation: 'fade_from_bottom', 
          }}>
          <Stack.Screen name="(app)" options={{ headerShown: false }} />

          {/* Authentication Screens */}
          <Stack.Screen name="auth/choose" options={{ headerShown: false }} />
          <Stack.Screen name="auth/login" options={{ headerShown: false }} />
          <Stack.Screen name="auth/register" options={{ headerShown: false }} />

          {/* Not Found Screen */}
          <Stack.Screen name="+not-found" />
        </Stack>
      </AppProvider>
    </PaperProvider>
  </Provider>
   
  );
}

