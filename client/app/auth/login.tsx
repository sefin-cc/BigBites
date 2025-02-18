

import { useRouter } from "expo-router";
import React, { useContext } from "react";
import { useState } from "react";
import { Text, View, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar,TextInput, Image } from "react-native";
import { AppContext } from "../context/AppContext";
import { Checkbox } from "react-native-paper";


export default function Login() {
  const context = useContext(AppContext);
  const router = useRouter();
  if (!context) {
    return <Text>Error: AppContext is not available</Text>;
  }

  // const {setToken} = context;
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string[]; password?: string[] }>({});
  const [formData, setFormData] = useState({
      email: '',
      password: '',
  });
  const [rememberMe, toggleRememberMe] = useState(false);


  const handleLogin = async () => {
      // setIsLoading(true);
    
      // try {
      //   const res = await API.post("/login", formData);
      //   const data = res.data;
    
      //   if (data.errors) {
      //     // Set form errors if they exist in the response
      //     setErrors(data.errors);
      //   } else {
      //     // Store token in AsyncStorage for persistence in React Native
      //     await AsyncStorage.setItem("token", data.token);
      //     setToken(data.token);
      //   }
    
      //   // Navigate to the homepage after successful login
      //   router.replace("/");
    
      // } catch (error) {
      //   // Handle Axios errors
      //   if (axios.isAxiosError(error)) {
      //     console.error("Axios error:", error.response?.data || error.message);
      //     // Setting error messages from the response or a general error message
      //     setErrors(error.response?.data?.errors || { general: "Something went wrong" });
      //   } else {
      //     // Handle other unexpected errors
      //     console.error("Unexpected error:", error);

      //   }
      // } finally {
      //   // Ensure loading state is reset whether successful or failed
      //   setIsLoading(false);
      // }
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
            
      <View style={styles.forgotPasswordCard}>
            <TouchableOpacity onPress={() =>{}} >
              <Text style={[styles.label, {fontSize: 16}]}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          <View style={{marginTop:20}}>
            <TouchableOpacity onPress={() =>{}} style={styles.loginBtn}>
              <Text style={styles.loginBtnText}>LOGIN</Text>
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