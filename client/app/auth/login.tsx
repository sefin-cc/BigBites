

import { router } from "expo-router";
import React from "react";
import { useState } from "react";
import { Text, View, StyleSheet, SafeAreaView, TouchableOpacity,TextInput, Image, ActivityIndicator, ImageBackground } from "react-native";
import { useLoginMutation } from "../../redux/feature/auth/clientApiSlice";
import Ionicons from "@expo/vector-icons/Ionicons";
import Loading from "@/components/loading";
import { Portal } from "react-native-paper";



export default function Login() {
  const [login, { isLoading }] = useLoginMutation();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const [formData, setFormData] = useState({
      email: '',
      password: '',
  });


  const handleLogin = async () => {
    try {
      await login(formData).unwrap();
      router.replace("/"); // Redirect after successful login
    } catch (err: any) {
      console.log("Error Response:", JSON.stringify(err, null, 2));
  
      // Extract error response
      const errorData = err.response?.data || err.data || err;
  
      if (errorData?.errors) {
        setErrors(errorData.errors); // Handles Laravel validation errors
      } else if (errorData?.email) {
        setErrors({ email: errorData.email }); // Handles direct error response
      } else {
        setErrors({ general: ["An unexpected error occurred."] });
      }
    }
  };
  
  

  return (
    <ImageBackground source={require('../../assets/images/BG.png')} resizeMode="cover" style={styles.container}>
      <Portal>
        <Loading isLoading={isLoading} /> 
      </Portal>

        <Image
          style={styles.logo}
          source={require('../../assets/images/logo.png')}
          />
         <SafeAreaView style={{backgroundColor: "white",  padding: 20, borderRadius: 10, justifyContent: "center"}} >  
              
            <View>
            <Text style={styles.label}>EMAIL</Text>
            <TextInput style={styles.input} placeholder="example@email.com"  placeholderTextColor="#888"  value={formData.email} onChangeText={(text) => setFormData((prev) => ({ ...prev, email: text }))} />
                {errors.email && errors.email[0] && (
                  <View>
                    <Text style={styles.errorText}>{errors.email[0]}</Text>
                  </View>
                )}
            </View>
            
          <View>
            <Text style={styles.label}>PASSWORD</Text>
            <TextInput
                style={styles.input}
                placeholder="●●●●●●●●●●"
                placeholderTextColor="#888"
                secureTextEntry={!passwordVisible}
                value={formData.password}
                onChangeText={(text) => setFormData((prev) => ({ ...prev, password: text }))}
              />
              <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                <Text style={styles.eyeIcon}>{passwordVisible ? <Ionicons name="eye-off" size={24} color="#C1272D" /> : <Ionicons name="eye" size={24} color="#C1272D" /> }</Text>
              </TouchableOpacity>
                {errors.password && errors.password[0] && (
                  <View>
                    <Text style={[styles.errorText, {top: -25}]}>{errors.password[0]}</Text>
                  </View>
                )}
          </View>
      
          <TouchableOpacity onPress={() =>{handleLogin()}} style={styles.loginBtn} disabled={isLoading}>
              { 
                isLoading ?
                <Text style={styles.loginBtnText}>
               LOGGING IN...
                </Text>:
              
                <Text style={styles.loginBtnText}>
                  LOGIN 
                </Text>
              } 
          </TouchableOpacity>

        </SafeAreaView>
            
       
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: "5%",
    backgroundColor: "#FB7F3B",
    textAlign: "center",
  },
  input: {
    marginBottom: 10,
    backgroundColor: "#FFEEE5", 
    fontSize: 16,
    fontFamily: "MadimiOne",  
    borderWidth: 3,
    paddingLeft: 10,
    borderRadius: 5,
    borderColor: "#FB7F3B"
  },
  errorText:{
    color: "#C1272D", marginBottom: 5, fontFamily: "MadimiOne", alignSelf: "flex-end"
  },
  label: {
    color: "#2C2C2C", 
    marginBottom: 5, 
    fontFamily: "MadimiOne",
  },
  loginBtnText: {
    fontSize: 20,
    color: "white",
    fontFamily: 'MadimiOne',
  }, 
  loginBtn: {
    backgroundColor: "#2C2C2C",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    flexDirection: "row",
    gap: 10
  },
  forgotPasswordCard:{
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 10 
  },
  logo:{
    width: "auto", 
    height: 150,
    aspectRatio: 1,
    resizeMode: 'contain',
    marginBottom: 10 ,
    alignSelf: "center",
    bottom: -25
  },
  eyeIcon: {
    fontSize: 24,
    color: "#C1272D",
    bottom: 47,
    alignSelf: "flex-end",
    right: 15
  },
});