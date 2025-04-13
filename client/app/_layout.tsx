import { Stack } from "expo-router";
import AppProvider from "./context/AppContext";
import { Text, View, StatusBar } from "react-native";
import * as Font from 'expo-font';
import { Provider } from "react-redux";
import { store } from "../redux/store";
import { Provider as PaperProvider, Snackbar } from 'react-native-paper';
import SplashScreen from "@/components/SplashScreen";
import { useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";

export default function RootLayout() {
  const [isSplashVisible, setSplashVisible] = useState(true);
  const [visible, setVisible] = useState<boolean>(false);
  const [fontsLoaded] = Font.useFonts({
    'MadimiOne': require('../assets/fonts/MadimiOne-Regular.ttf'),
  });


  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setVisible(!state.isConnected);
    });
  
    return () => unsubscribe(); 
  }, []);
  

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: '#000' }} />;
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
            }}
          >
            <Stack.Screen name="(app)" options={{ headerShown: false }} />
            <Stack.Screen name="auth/choose" options={{ headerShown: false }} />
            <Stack.Screen name="auth/login" options={{ headerShown: false }} />
            <Stack.Screen name="auth/register" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>

          {/* Snackbar Overlay */}
          <Snackbar
            visible={visible}
            onDismiss={() => {}} 
            duration={0} 
            style={{
              position: 'absolute',
              left: 20,
              right: 20,
              bottom: 40,
              backgroundColor: '#2C2C2C',
              borderRadius: 10,
              zIndex: 10000,
            }}
          >
            <Text style={{ fontFamily: 'MadimiOne', color: "white", fontSize: 16, textAlign: 'center' }}>
              NO INTERNET CONNECTION!
            </Text>
          </Snackbar>
        </AppProvider>
      </PaperProvider>
    </Provider>
  );
}
