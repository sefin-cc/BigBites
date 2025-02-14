import { AppContext } from "@/app/context/AppContext";
import useCartTotal from "@/hooks/useCartTotal";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";



export default function ViewCartContainer() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const context = useContext(AppContext);
    if (!context) {
    return <Text>Error: AppContext is not available</Text>;
    }
    const { order } = context;
    const orderTotal = useCartTotal(order ? order.order : []);

    return(
        <SafeAreaView>
            <View style={[styles.viewCartBtnCard,  { paddingBottom: insets.bottom + 70 }]}>
            <TouchableOpacity
                onPress={() =>{ router.replace(`/(app)/view-cart`);}}
                style={[styles.btnViewCart]}>
                <View style={{flexDirection: "row", justifyContent: "center",alignItems: "center", gap: 10, flexGrow: 1}}>
                    <FontAwesome6 name="cart-shopping" size={16} color="white" />
                    <Text style={styles.textViewCart}>VIEW CART</Text>
                </View>
                <Text style={styles.textViewCart}>PHP {orderTotal}</Text>
            </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({

 //View Cart
 viewCartBtnCard: {
    position: "absolute",  // This keeps it fixed at the bottom
    bottom: 0,  // Align it to the bottom of the screen
    left: 0,  // Align it to the left edge of the screen
    right: 0,  // Stretch the button across the entire width of the screen
    padding: 15,
    justifyContent: "center",
    alignItems: "center",  // Center the content inside the button
    flexDirection: "row",
    backgroundColor: "#FB7F3B",
    zIndex: 1000,  // Ensure it stays above other content
  },
    btnViewCart: {
      flex: 1,
      backgroundColor: "#2C2C2C",
      borderRadius: 10,
      padding: 10, 
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row",
      gap: 10
    },
    textViewCart: {
      color: "white",
      fontFamily: 'MadimiOne',
      fontSize: 20
    },
})