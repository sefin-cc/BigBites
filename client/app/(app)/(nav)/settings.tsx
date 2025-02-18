import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import globalStyle from "../../../assets/styles/globalStyle";
import { useContext } from "react";
import { AppContext } from "@/app/context/AppContext";
import { useRouter } from "expo-router";

export default function Login() {
  const context = useContext(AppContext);
  const router = useRouter();
  if (!context) {
    return <Text>Error: AppContext is not available</Text>;
  }
  const {user, setUser, setToken} = context;

  const handleLogout = async () => {
    // try {
    //   await API.post("/logout");
  
    //   setUser(null);
    //   setToken(null);
    //   await AsyncStorage.removeItem("token");
  
      router.replace("/auth/choose");
    // } catch (error) {
    //   if (error instanceof Error) {
    //     console.error("Logout error:", error.message);
    //   } else {
    //     console.error("An unknown error occurred");
    //   }
    // }
  };
  
  
  return (
    <View style={styles.container}>
    <Image
          source={{ uri: 'https://res.cloudinary.com/dqp0ejscz/image/upload/v1735899431/blank-profile-picture-973460_1280_idgyn3.png' }} 
          style={styles.img}
        />
      <Text style={styles.userInfoTextTitle} >{user.email}</Text>
      <Text style={styles.userInfoText} >{user.name}</Text>
      <TouchableOpacity
        onPress={handleLogout}
        style={styles.button}>
        <Text style={styles.buttonText}>
          LOGOUT
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  img:{
    width: 200, 
    height: 200, 
    borderRadius: 100, 
    margin: 20
  },
  userInfoTextTitle :{
    fontSize: 24,
    color: "#666666",
    fontFamily: 'MadimiOne'
  },
  userInfoText: {
    color: "#666666",
    fontFamily: 'MadimiOne'
  },
  button: {
    backgroundColor: '#FB7F3B',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 40
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'MadimiOne'
  },
});