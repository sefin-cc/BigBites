import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
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

  //use contextAPI for order details
   

  const setOrderType = (type: string) => {
    setOrder(prev => ({
      ...prev,
      type: type
    }));
    setIsOrderOne(false);
  };
  

  const setOrderisTakeout = (takeout: boolean) => {
    setOrder(prev => ({
      ...prev,
      takeout: takeout
    }));
  };
  

  useEffect(() => {
    console.log("Updated Order:", order);
  }, [order]);
  
  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require('../../../assets/images/logo.png')} />
  
      {isOrderOne ? 
        <View style={styles.containerButton}>
          <TouchableOpacity
            onPress={() => setOrderType("PickUp")}
            style={[globalStyle.button, {width: "100%"}]}>
            <Text style={globalStyle.buttonText}>PICK UP</Text>
          </TouchableOpacity>
  
          <TouchableOpacity
            onPress={() => setOrderType("Delivery")}
            style={[globalStyle.button, {width: "100%"}]}>
            <Text style={globalStyle.buttonText}>DELIVERY</Text>
          </TouchableOpacity>
        </View>
      :
        <View style={styles.containerButton}>
          <TouchableOpacity
            onPress={() => setOrderisTakeout(false)}
            style={[globalStyle.button, {width: "100%"}]}>
            <Text style={globalStyle.buttonText}>DINE IN</Text>
          </TouchableOpacity>
  
          <TouchableOpacity
            onPress={() => setOrderisTakeout(true)}
            style={[globalStyle.button, {width: "100%"}]}>
            <Text style={globalStyle.buttonText}>TAKE OUT</Text>
          </TouchableOpacity>
        </View>
      }
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