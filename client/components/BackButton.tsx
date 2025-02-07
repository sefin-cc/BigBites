
import React from "react";
import { Pressable } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { router } from "expo-router";


export const  BackButton = () => {
    
    const handleBackPress = () => {
        router.back();  // This will navigate back to the previous screen
    };

  return (
        <Pressable style={{ marginHorizontal: 15 }} onPress={handleBackPress} >
            <Ionicons size={28} name="chevron-back"  color= "#FFEEE5" />
        </Pressable>
    );
}