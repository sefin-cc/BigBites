
import React from "react";
import { Pressable, Text} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { router } from "expo-router";


export const  VerifyButton = () => {
    
    const handleVerifykPress = () => {
        router.replace(`/(app)/verification?ts=${Date.now()}`);  
    };

  return (
        <Pressable style={{ marginHorizontal: 15 , flexDirection: "row", alignItems: "center"}} onPress={handleVerifykPress} >
            <Text style={{fontFamily: 'MadimiOne', color: "#fff"}}>NEXT</Text>  
            <Ionicons size={28} name="chevron-forward"  color= "#FFEEE5" />
        </Pressable>
    );
}