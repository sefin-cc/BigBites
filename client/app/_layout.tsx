import { Stack } from "expo-router";
import AppProvider from "./context/AppContext";
import { Text } from "react-native";
import { useFonts } from 'expo-font';


export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'MadimiOne': require('../assets/fonts/MadimiOne-Regular.ttf'), // Make sure the path is correct
  });

  if (!fontsLoaded) {
    return <Text>Loading fonts...</Text>;
  }

  return (
    <AppProvider>
      <Stack>
        <Stack.Screen name="(app)" options={{ headerShown: false }} />

        {/* Authentication Screens */}
        <Stack.Screen name="auth/login" options={{ headerShown: false }} />
        <Stack.Screen name="auth/register" options={{ headerShown: false }} />

        {/* Not Found Screen */}
        <Stack.Screen name="+not-found" />
      </Stack>
    </AppProvider>
  );
}

