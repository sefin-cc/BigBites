import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import globalStyle from "../../../assets/styles/globalStyle";
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "@/app/context/AppContext";

export default function ChooseOrderType() {
  const router = useRouter();
  const context = useContext(AppContext);
  if (!context) {
    return <Text>Error: AppContext is not available</Text>;
  }
  const { order, setOrder} = context;
  
  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require('../../../assets/images/logo.png')} />
  
      
        <View style={styles.containerButton}>
          <TouchableOpacity
            onPress={() => {router.push("/(app)/order/order-step6")}}
            style={[globalStyle.button, {width: "100%"}]}>
            <Text style={globalStyle.buttonText}>ADVANCED ORDER</Text>
          </TouchableOpacity>
  
          <TouchableOpacity
            onPress={() => {router.push("/(app)/menu/menu-categories")}}
            style={[globalStyle.button, {width: "100%"}]}>
            <Text style={globalStyle.buttonText}>ORDER NOW</Text>
          </TouchableOpacity>
        </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FB7F3B"
  },
  containerButton: {
    backgroundColor: "#FFEEE5",
    padding: "2%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    width: "80%",
    margin: 10
  },
  logo:{
    width: "auto", 
    height: 120,
    aspectRatio: 1, 
    resizeMode: 'contain',
  }
});