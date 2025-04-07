

import { useRouter } from "expo-router";
import React, { useContext } from "react";
import { useState } from "react";
import { Text, View, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar,TextInput, Image, ScrollView } from "react-native";
import { useRegisterMutation } from '@/redux/feature/auth/clientApiSlice'; 
import Ionicons from '@expo/vector-icons/Ionicons';
import Loading from "@/components/loading";


export default function Register() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [register] = useRegisterMutation();
  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    address: '',
    email: '',
    password: '',
    general: ''
});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: '',
    address: ''
});


  const handleRegister = async () => {
    // Basic validation
    const validationErrors: any = {};

    // General field checks
    if (!formData.name) validationErrors.name = "* Name is required";
    if (!formData.address) validationErrors.address = "* Address is required";
    if (!formData.phone) validationErrors.phone = "* Phone number is required";
    if (!formData.email) validationErrors.email = "* Email is required";
    if (!formData.password) validationErrors.password = "* Password is required";

    // Password specific checks
    if (formData.password !== formData.password_confirmation) {
      validationErrors.password_confirmation = "* Passwords do not match";
    }
    
    // Password length check (minimum 8 characters)
    if (formData.password && formData.password.length < 8) {
      validationErrors.password = "* Password must be at least 8 characters long";
    }

    // Password complexity check (at least one lowercase, one uppercase, one number, and one special character)
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (formData.password && !passwordPattern.test(formData.password)) {
      validationErrors.password = "* Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character.";
    }

    setErrors(validationErrors);

    // If there are validation errors, don't proceed
    if (Object.keys(validationErrors).length > 0) return;

    try {
      setIsLoading(true);  // Set loading state to true while the request is in progress
      const response = await register(formData).unwrap();  // Perform the register mutation
      setIsLoading(false);  // Set loading state to false when the request finishes

      if (response) { 
        router.replace("/(app)/(nav)"); 
      }
    } catch (err) {
      setIsLoading(false);  // Set loading state to false on error
    
      console.error(err);  // Log the error for debugging purposes
    }
  };

  return (

<ScrollView >
<Loading isLoading={isLoading} />
<View style={styles.container}>
  <SafeAreaView>
    <Image
      style={styles.logo}
      source={require('../../assets/images/logo.png')}
    />
    {/* Global error message */}
    {errors.general && (
      <Text style={styles.errorText}>{errors.general}</Text>
    )}

    {/* Full Name */}
    <View>
      <Text style={styles.label}>FULL NAME</Text>
      <TextInput
        style={styles.input}
        placeholder="John Doe"
        placeholderTextColor="#888"
        value={formData.name}
        onChangeText={(text) => setFormData((prev) => ({ ...prev, name: text }))}
      />
      {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
    </View>

    {/* Phone */}
    <View>
      <Text style={styles.label}>PHONE</Text>
      <TextInput
        style={styles.input}
        placeholder="0987654321"
        placeholderTextColor="#888"
        value={formData.phone}
        onChangeText={(text) => setFormData((prev) => ({ ...prev, phone: text }))}
      />
      {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
    </View>

    {/* Email */}
    <View>
      <Text style={styles.label}>EMAIL</Text>
      <TextInput
        style={styles.input}
        placeholder="example@email.com"
        placeholderTextColor="#888"
        value={formData.email}
        onChangeText={(text) => setFormData((prev) => ({ ...prev, email: text }))}
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
    </View>

    {/* Address */}
    <View>
      <Text style={styles.label}>ADDRESS</Text>
      <TextInput
        style={styles.input}
        placeholder="Sampaloc, Manila 1008 Metro Manila"
        multiline
        numberOfLines={2}
        placeholderTextColor="#888"
        value={formData.address}
        onChangeText={(text) => setFormData((prev) => ({ ...prev, address: text }))}
      />
      {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}
    </View>

    {/* Password */}
    <View>
          <Text style={styles.label}>PASSWORD</Text>
          <View>
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
          </View>
          {errors.password && <Text style={[styles.errorText, {bottom: 25}]}>{errors.password}</Text>}
        </View>

    {/* Confirm Password */}
    <View>
      <Text style={styles.label}>CONFIRM PASSWORD</Text>
      <TextInput
        style={styles.input}
        placeholder="●●●●●●●●●●"
        placeholderTextColor="#888"
        secureTextEntry
        value={formData.password_confirmation}
        onChangeText={(text) => setFormData((prev) => ({ ...prev, password_confirmation: text }))}
      />
    </View>
  

  {/* Register Button */}
  <View style={{ marginTop: 20 }}>
    <TouchableOpacity onPress={handleRegister} style={styles.loginBtn} disabled={isLoading}>
      <Text style={styles.loginBtnText}>
        {isLoading ? "REGISTERING..." : "REGISTER"}
      </Text>
    </TouchableOpacity>
  </View>

  </SafeAreaView>
  </View>
  </ScrollView>


  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: "5%",
    backgroundColor: "#FB7F3B",
    textAlign: "center",
    paddingVertical: 70
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
    color: "#FFEEE5", marginBottom: 5, fontFamily: "MadimiOne", alignSelf: "flex-end"
  },
  label: {
    color: "white", 
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
    height: 100,
    aspectRatio: 1,
    resizeMode: 'contain',
    marginBottom: 10 ,
    alignSelf: "center"
  },
  eyeIcon: {
    fontSize: 24,
    color: "#C1272D",
    bottom: 47,
    alignSelf: "flex-end",
    right: 15
  },
});