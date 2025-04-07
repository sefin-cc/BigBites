import { ActivityIndicator, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";
import { useNavigationContainerRef, useRouter } from "expo-router";
import { useLogoutMutation, useGetProfileQuery } from "../../../redux/feature/auth/clientApiSlice";
import { useSelector } from "react-redux";
import type { RootState } from '@/redux/store'; 
import { skipToken } from "@reduxjs/toolkit/query";
import { useDispatch } from 'react-redux'; 
import { CommonActions } from '@react-navigation/native';
import { clientApi } from '@/redux/feature/auth/clientApiSlice'; 
import { LinearGradient } from 'expo-linear-gradient';
import globalStyles from "@/assets/styles/globalStyle";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Loading from "@/components/loading";

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const rootNavigation = useNavigationContainerRef();
  const [logout, { isLoading }] = useLogoutMutation();
  const token = useSelector((state: RootState) => state.auth.token);
  const { data: profile, refetch, isLoading: profileLoading } = useGetProfileQuery(token ? undefined : skipToken);
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
    
      //Reset RTK Query cache 
    dispatch(clientApi.util.resetApiState());

    //Reset navigation
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
    refetch();
    setUserInfo({
      name: profile?.name || "",
      email: profile?.email || "" ,
      phone:  profile?.phone || "",
      address: profile?.address || "" 
    });

  },[profile]);
  
  return (

    <View style={styles.container}>
        <Loading isLoading={isLoading} />
        <LinearGradient
          colors={['#f2aa83', '#C1272D']}
          style={styles.mainContainer}>
          

          <TouchableOpacity
            onPress={() =>{router.push("/edituser");}}
            style={{backgroundColor: "#2C2C2C", padding: 10, borderRadius: 100, borderWidth: 4, borderColor: "white"}}
            >
              <MaterialIcons name="edit" size={20} color="white" />
          </TouchableOpacity>


        </LinearGradient>



        <View style={{alignItems: "center", top: -130}}>
          <Image
            source={{ uri: 'https://res.cloudinary.com/dqp0ejscz/image/upload/v1735899431/blank-profile-picture-973460_1280_idgyn3.png' }} 
            style={styles.img}
          />

          {
          !profileLoading ?
          <View style={{alignItems: "center"}}>
            <Text style={styles.userInfoTextTitle} >{userInfo.name}</Text>
            <Text style={styles.userInfoText} >{userInfo.address}</Text>
            <Text style={styles.userInfoText} >{userInfo.email}</Text>
            <Text style={styles.userInfoText} >{userInfo.phone}</Text>
          </View>   :
          <ActivityIndicator animating={profileLoading} color={"#FB7F3B"}  size="large" hidesWhenStopped={true}/>
          }
        </View>
    

    
      <TouchableOpacity
        onPress={handleLogout}
        style={[globalStyles.button,  {marginHorizontal: 20}]}
        disabled={isLoading}
        >
        { 
          isLoading ?
          <ActivityIndicator animating={isLoading} color={"#FFEEE5"}  size="large" hidesWhenStopped={true}/>:
        
          <Text style={globalStyles.buttonText}>
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
  },
  img:{
    width: 200, 
    height: 200, 
    borderRadius: 100, 
    margin: 20,
    borderWidth: 6,
    borderColor: "#fff"
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
  mainContainer: {
    // justifyContent: "flex-end",
    alignItems: "flex-end",
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    height: 250,
    padding: "5%",
    // width: "100%"
  },
});