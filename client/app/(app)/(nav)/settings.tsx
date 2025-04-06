import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";
import { useNavigationContainerRef, useRouter } from "expo-router";
import { useLogoutMutation, useGetProfileQuery } from "../../../redux/feature/auth/clientApiSlice";
import { useSelector } from "react-redux";
import type { RootState } from '@/redux/store'; 
import { skipToken } from "@reduxjs/toolkit/query";
import { useDispatch } from 'react-redux'; 
import { CommonActions } from '@react-navigation/native';
import { clientApi } from '@/redux/feature/auth/clientApiSlice'; 

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const rootNavigation = useNavigationContainerRef();
  const [logout, { isLoading }] = useLogoutMutation();
  const token = useSelector((state: RootState) => state.auth.token);
  const { data: profile } = useGetProfileQuery(token ? undefined : skipToken);
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });


  const handleLogout = async () => {
    try {

      await logout().unwrap();
      setUserInfo({
        name:  "",
        email: "" ,
        phone:  "",
        address: "" 
      });
      // router.replace('/auth/choose'); 
      // 🔄 Reset RTK Query cache (important!)
    dispatch(clientApi.util.resetApiState());

    // 🧹 Reset navigation
    rootNavigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'auth/choose' }],
      })
    );
    } catch (error) {
      console.log(error);
    }
  };
  
  useEffect(()=>{
    console.log("profile: ", profile);
    setUserInfo({
      name: profile?.name || "",
      email: profile?.email || "" ,
      phone:  profile?.phone || "",
      address: profile?.address || "" 
    });

  },[profile]);
  
  return (
    <View style={styles.container}>
    <Image
          source={{ uri: 'https://res.cloudinary.com/dqp0ejscz/image/upload/v1735899431/blank-profile-picture-973460_1280_idgyn3.png' }} 
          style={styles.img}
        />
        
      <Text style={styles.userInfoTextTitle} >{userInfo.name}</Text>
      <Text style={styles.userInfoText} >{userInfo.address}</Text>
      <Text style={styles.userInfoText} >{userInfo.email}</Text>
      <Text style={styles.userInfoText} >{userInfo.phone}</Text>
      

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