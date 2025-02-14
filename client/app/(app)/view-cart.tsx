import { FlatList, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import globalStyle from "../../assets/styles/globalStyle";
import TitleDashed from "@/components/titledashed";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import useCartTotal from "@/hooks/useCartTotal";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useRouter } from "expo-router";

interface AddOns {
  label: string;
  price: number;
}

interface MenuItems {
  qty: number;
  subId: string;
  itemId: string;
  label: string;
  fullLabel: string;
  description: string;
  price: number;
  time: string;
  image: string;
  addOns: Array<AddOns>;
  selectedAddOns: Array<AddOns>;
}

export default function ViewCart() {
  const context = useContext(AppContext);
  if (!context) {
    return <Text>Error: AppContext is not available</Text>;
  }
  const { order } = context;
  const router = useRouter();
  const [orderItems, setOrderItems] = useState<MenuItems[]>([]);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (order) {
      setOrderItems(order.order);
      console.log("Order: " + order.order);
    }
  }, [order]);

  const orderTotal = useCartTotal(order ? order.order : []);

  return (
    <View style={[globalStyle.container]}>
      <ScrollView style ={{padding: "5%" }}>
        <View style={{ flexDirection: "row" }}>
          <TitleDashed title="MY CART" />
          <Text style={{ fontFamily: 'MadimiOne', color: "#C1272D", fontSize: 24 }}> ({orderItems.length})</Text>
        </View>

        <FlatList
          data={orderItems}
          renderItem={({ item }) => {
            return (
              <View style={styles.cartItemContainer}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.image}
                />
                <View style={{ flexGrow: 1 }}>
                  <Text style={styles.textCartItem}>{item.qty}x {item.label} - P{item.price} </Text>
                  {
                    item.selectedAddOns.map((addOns: AddOns) => {
                      return (
                        <Text style={[styles.textCartItem, { fontSize: 16 }]}>{addOns.label} - P{addOns.price}</Text>
                      );
                    })
                  }
                  <View style={styles.line}></View>

                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <TouchableOpacity onPress={() => { }} style={styles.editBtn}>
                      <MaterialIcons name="mode-edit" size={20} color="#C1272D" />
                      <Text style={styles.editBtnText}>Edit</Text>
                    </TouchableOpacity>
                    <Text style={[styles.textCartItem, { fontSize: 24 }]}>PHP {item.qty * item.price + item.selectedAddOns.reduce((sum, addOn) => sum + addOn.price, 0)}</Text> {/* Calculate item total with add-ons */}
                  </View>
                </View>
              </View>
            );
          }}
          ListHeaderComponent={() => {
            return (
              <View style={{ borderBottomWidth: 4, borderColor: "#FB7F3B" }}></View>
            );
          }}
        />

      </ScrollView>
      <SafeAreaView>

      <View style={{paddingBottom: insets.bottom + 55 }}>
      <View style={styles.totalContainer}>
            <Text style={[styles.totalText, {fontSize: 24}]}>TOTAL:</Text>
            <Text style={[styles.totalText, {fontSize: 34}]}>PHP {orderTotal}</Text>
        </View>
        <View style={[styles.viewCartBtnCard]}>
        <TouchableOpacity
            onPress={() =>{ router.replace(`/(app)/checkout`);}}
            style={[styles.btnViewCart]}>
            <View style={{flexDirection: "row", justifyContent: "center",alignItems: "center", gap: 10, flexGrow: 1}}>
                <FontAwesome6 name="cart-shopping" size={16} color="white" />
                <Text style={styles.textViewCart}>CHECKOUT</Text>
            </View>
        </TouchableOpacity>
        </View>
      </View>
            
        </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  cartItemContainer: {
    borderBottomWidth: 4,
    borderColor: "#FB7F3B",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
  },
  image: {
    height: 100,
    width: 100,
    backgroundColor: "#C1272D",
    borderRadius: 10,
    marginRight: 10
  },
  textCartItem: {
    fontSize: 20,
    fontFamily: 'MadimiOne',
    color: '#C1272D',
  },
  line: {
    borderBottomWidth: 4,
    borderColor: 'rgba(194, 39, 45, 0.3)',
    flexGrow: 1,
    top: -6,
    paddingVertical: 5
  },
  editBtn: {
    padding: 10,
    flexDirection: "row",
    gap: 5,
    alignItems: "center"
  },
  editBtnText: {
    fontSize: 20,
    fontFamily: 'MadimiOne',
    color: '#C1272D',
  },
  totalContainer: {
    marginTop: 20,
    paddingVertical: 1,
    paddingHorizontal: 10,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 10,
    borderTopWidth: 4,
    borderColor: '#FB7F3B',
    borderStyle: 'dashed',
  },
  totalText: {
    fontFamily: 'MadimiOne',
    color: '#2C2C2C',
  },
  viewCartBtnCard: {
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
