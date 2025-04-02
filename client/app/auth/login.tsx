

import { router, useRouter } from "expo-router";
import React, { useContext } from "react";
import { useState } from "react";
import { Text, View, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar,TextInput, Image, ActivityIndicator } from "react-native";
import { Checkbox } from "react-native-paper";
import { useLoginMutation } from "../../redux/feature/auth/clientApiSlice";



export default function Login() {
  const [login, { isLoading, error }] = useLoginMutation();
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
    <View style={styles.container}>
      <SafeAreaView >
            <Image
            style={styles.logo}
            source={require('../../assets/images/logo.png')}
            />
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
          <TextInput style={styles.input} placeholder="●●●●●●●●●●"  placeholderTextColor="#888"  value={formData.password} onChangeText={(text) => setFormData((prev) => ({ ...prev, password: text }))} />
              {errors.password && errors.password[0] && (
                <View>
                  <Text style={styles.errorText}>{errors.password[0]}</Text>
                </View>
              )}
          </View>
      </SafeAreaView>
            

          <View style={{marginTop:20}}>
            <TouchableOpacity onPress={() =>{handleLogin()}} style={styles.loginBtn} disabled={isLoading}>
                { 
                  isLoading ?
                  <ActivityIndicator animating={isLoading} color={"#FFEEE5"}  size="large" hidesWhenStopped={true}/>:
                
                  <Text style={styles.loginBtnText}>
                    LOGIN 
                  </Text>
                } 
            </TouchableOpacity>
          </View>
    </View>
    
    
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
    backgroundColor: "#FCE8E8", 
    fontSize: 16,
    fontFamily: "MadimiOne",  
    borderWidth: 3,
    paddingLeft: 10,
    borderRadius: 5,
    borderColor: "#C1272D"
  },
  errorText:{
    color: "#C1272D", marginBottom: 5, fontFamily: "MadimiOne"
  },
  label: {
    color: "white", 
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
    alignSelf: "center"
  }
});