import { Stack } from "expo-router";
import AppProvider from "./context/AppContext";
import { Text } from "react-native";
import { useFonts } from 'expo-font';
import { Provider } from "react-redux";
import {store} from "../redux/store";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'MadimiOne': require('../assets/fonts/MadimiOne-Regular.ttf'), // Make sure the path is correct
  });

  if (!fontsLoaded) {
    return <Text></Text>;
  }

  return (  
  <Provider store={store}>
     <AppProvider>
      <Stack>
        <Stack.Screen name="(app)" options={{ headerShown: false }} />

        {/* Authentication Screens */}
        <Stack.Screen name="auth/choose" options={{ headerShown: false }} />
        <Stack.Screen name="auth/login" options={{ headerShown: false }} />
        <Stack.Screen name="auth/register" options={{ headerShown: false }} />

        {/* Not Found Screen */}
        <Stack.Screen name="+not-found" />
      </Stack>
    </AppProvider>
  </Provider>
   
  );
}

