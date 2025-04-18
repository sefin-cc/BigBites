import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import globalStyle from "../../../assets/styles/globalStyle";
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "@/app/context/AppContext";

export default function OrderType() {
  const router = useRouter();
  const context = useContext(AppContext);
  if (!context) {
    return <Text>Error: AppContext is not available</Text>;
  }
  const { order, setOrder} = context;
  const [isOrderOne, setIsOrderOne] = useState(true);
  

  const setOrderisPickUptype = (pickUpType: string) => {
    setOrder(prev => ({
      ...prev,
      pickUpType: pickUpType
    }));
    router.push("/(app)/order/order-step4");
  };

  const navigateOrder = (type : string) => {
    if(type === "PickUp"){
      setOrder(prev => ({
        ...prev,
        type: type
      }));
      setIsOrderOne(false);
    }else if(type === "Delivery") {
      setOrder(prev => ({
        ...prev,
        type: type
      }));
      router.push("/(app)/order/order-step3");
    }else {
      console.log("Something went wrong");
    }
  }
  

  useEffect(() => {
    console.log("Updated Order:", order);
  }, [order]);
  
  return (
  <ImageBackground source={require('../../../assets/images/BG.png')} resizeMode="cover" style={styles.container}>
    
    <View style={styles.container}>
      <Image style={styles.logo} source={require('../../../assets/images/logo.png')} />
  
      {isOrderOne ? 
        <View style={styles.containerButton}>
          <TouchableOpacity
            onPress={() => navigateOrder("PickUp")}
            style={[globalStyle.button, {width: "100%"}]}>
            <Text style={globalStyle.buttonText}>PICK UP</Text>
          </TouchableOpacity>
  
          <TouchableOpacity
            onPress={() => navigateOrder("Delivery")}
            style={[globalStyle.button, {width: "100%"}]}>
            <Text style={globalStyle.buttonText}>DELIVERY</Text>
          </TouchableOpacity>
        </View>
      :
        <View style={styles.containerButton}>
          <TouchableOpacity
            onPress={() => setOrderisPickUptype("DineIn")}
            style={[globalStyle.button, {width: "100%"}]}>
            <Text style={globalStyle.buttonText}>DINE IN</Text>
          </TouchableOpacity>
  
          <TouchableOpacity
            onPress={() => setOrderisPickUptype("TakeOut")}
            style={[globalStyle.button, {width: "100%"}]}>
            <Text style={globalStyle.buttonText}>TAKE OUT</Text>
          </TouchableOpacity>
        </View>
      }
    </View>
  </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%"
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