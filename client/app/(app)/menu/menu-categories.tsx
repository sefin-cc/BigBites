import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import globalStyle from "../../../assets/styles/globalStyle";
import React, { useContext, useState } from "react";
import Feather from '@expo/vector-icons/Feather';
import Slideshow from "@/components/slideShow";
import CategoriesItems from "@/components/categoriesItems";
import { router } from "expo-router";
import ViewCartContainer from "@/components/ViewCartContainer";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import useCartTotal from "@/hooks/useCartTotal";
import { AppContext } from "@/app/context/AppContext";
import SearchMenu from "@/components/SearchMenu";

export default function Categories() {
    const context = useContext(AppContext);
    if (!context) {
      return <Text>Error: AppContext is not available</Text>;
    }
    const { order } = context;

  const orderTotal = useCartTotal(order ? order.order : []);
  return (
    <View style={[globalStyle.container, {paddingTop: 0}]}>

    <SearchMenu />
      <ScrollView>
          <View style={styles.featuredContainer}>
            <Slideshow />
          </View>
          <View style={styles.contentContainer}>

            <View style={categoryTitleStyle.component}>
              <View style={categoryTitleStyle.dashedLine}/>
                <Text style={categoryTitleStyle.title}>
                    CATEGORIES
                </Text>
              <View style={categoryTitleStyle.dashedLine}/>
            </View>

            <CategoriesItems />
          </View>
        
        </ScrollView>

     
      <SafeAreaView>
            <View style={[styles.viewCartBtnCard]}>
            <TouchableOpacity
                onPress={() =>{ router.push(`/(app)/view-cart`);}}
                style={[styles.btnViewCart]}>
                <View style={{flexDirection: "row", justifyContent: "center",alignItems: "center", gap: 10, flexGrow: 1}}>
                    <FontAwesome6 name="cart-shopping" size={16} color="white" />
                    <Text style={styles.textViewCart}>VIEW CART</Text>
                </View>
                <Text style={styles.textViewCart}>PHP {orderTotal}</Text>
            </TouchableOpacity>
            </View>
        </SafeAreaView>
    </View>
    
  );
}

const styles = StyleSheet.create({
  featuredContainer: {
    padding: "5%",
    backgroundColor: "#C1272D"
  },
  contentContainer: {
    margin: "5%",
    paddingBottom: 50
  },
  
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
});

const categoryTitleStyle = StyleSheet.create({
  component: {
    flexDirection:"row"
  },
  title: {
    fontSize: 24,
    color: "#C1272D",
    fontWeight: "bold",
    fontFamily: 'MadimiOne',
    paddingHorizontal: 10
  },
  dashedLine: {          
    borderBottomWidth: 4,  
    borderColor: 'rgba(194, 39, 45, 0.5)',
    borderStyle: 'dashed',
    flexGrow: 1,
    top: -6 
  },
 
});

