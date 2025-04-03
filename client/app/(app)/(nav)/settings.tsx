import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useLogoutMutation, useGetProfileQuery } from "../../../redux/feature/auth/clientApiSlice";


export default function Login() {
  const router = useRouter();
  const [logout, { isLoading }] = useLogoutMutation();
  const { data: profile } = useGetProfileQuery();
  const handleLogout = async () => {
    try {

    // await logout().unwrap();
      router.replace("/auth/choose");
    } catch (error) {
      console.log(error);
    }
  };
  
  useEffect(()=>{
    console.log("profile: "+ profile);
  },[]);
  
  return (
    <View style={styles.container}>
    <Image
          source={{ uri: 'https://res.cloudinary.com/dqp0ejscz/image/upload/v1735899431/blank-profile-picture-973460_1280_idgyn3.png' }} 
          style={styles.img}
        />
        
      <Text style={styles.userInfoTextTitle} >{profile?.email}</Text>
      <Text style={styles.userInfoText} >{profile?.name}</Text>
      <TouchableOpacity
        onPress={handleLogout}
        style={styles.button}
        disabled={isLoading}
        >
        { 
          isLoading ?
          <ActivityIndicator animating={isLoading} color={"#FFEEE5"}  size="large" hidesWhenStopped={true}/>:
        
          <Text style={styles.buttonText}>
            LOGOUT 
          </Text>
        } 
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