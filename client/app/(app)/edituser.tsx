

import { useRouter } from "expo-router";
import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { Text, View, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar,TextInput, Image, ScrollView } from "react-native";
import { useGetProfileQuery, useUpdateClientMutation } from '@/redux/feature/auth/clientApiSlice'; 
import { useSelector } from "react-redux";
import { skipToken } from "@reduxjs/toolkit/query";
import type { RootState } from '@/redux/store'; 
import Loading from "@/components/loading";
import { Portal } from "react-native-paper";

export default function EditUser() {
  const router = useRouter();
  const token = useSelector((state: RootState) => state.auth.token);
  const { data: profile, refetch } = useGetProfileQuery(token ? undefined : skipToken);
  const [update, {isLoading}] = useUpdateClientMutation();
  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    address: '',
    email: '',
    general: ''
});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
});


  const handleUpdate = async () => {
    // Basic validation
    const validationErrors: any = {};

    // General field checks
    if (!formData.name) validationErrors.name = "* Name is required";
    if (!formData.address) validationErrors.address = "* Address is required";
    if (!formData.phone) validationErrors.phone = "* Phone number is required";
    if (!formData.email) validationErrors.email = "* Email is required";
    if (!profile) return;
    setErrors(validationErrors);

    // If there are validation errors, don't proceed
    if (Object.keys(validationErrors).length > 0) return;

    try {
      const response = await update({id: profile.id, data:formData}).unwrap();  // Perform the register mutation

      if (response) { 
        router.replace("/settings"); 
      }
    } catch (err) {
      console.error(err);  // Log the error for debugging purposes
    }
  };

  useEffect(() =>{
    refetch();
    setFormData({
      name: profile?.name || "",
      email: profile?.email || "",
      phone: profile?.phone || "",
      address:  profile?.address || ""
    });
  },[profile]);

  return (
    <SafeAreaView style={{ flex: 1}}>
      
      <Portal>
        <Loading isLoading={isLoading} />
      </Portal>
     
        <ScrollView>
          <View style={styles.container}>

            
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


          {/* Register Button */}
          <View style={{ marginTop: 20 }}>
            <TouchableOpacity onPress={handleUpdate} style={styles.loginBtn} disabled={isLoading}>
              <Text style={styles.loginBtnText}>
                {isLoading ? "UPDATING..." : "UPDATE"}
              </Text>
            </TouchableOpacity>
          </View>


          </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: "5%",
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
    borderColor: "#FB7F3B"
  },
  errorText:{
    color: "#FFEEE5", marginBottom: 5, fontFamily: "MadimiOne", alignSelf: "flex-end"
  },
  label: {
    color: "#2C2C2C", 
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

});