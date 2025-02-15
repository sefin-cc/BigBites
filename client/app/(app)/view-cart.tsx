import { FlatList, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import globalStyle from "../../assets/styles/globalStyle";
import TitleDashed from "@/components/titledashed";
import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../context/AppContext";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import useCartTotal from "@/hooks/useCartTotal";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useRouter } from "expo-router";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Modalize } from "react-native-modalize";
import AntDesign from "@expo/vector-icons/AntDesign";

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
  selectedAddOns: Array<AddOns> | [];  
}

export default function ViewCart() {
  const context = useContext(AppContext);
  if (!context) {
    return <Text>Error: AppContext is not available</Text>;
  }
  const { order, setOrder } = context;
  const router = useRouter();
  const modalizeRef = useRef<Modalize>(null);
  const [orderItems, setOrderItems] = useState<MenuItems[]>([]);
  const insets = useSafeAreaInsets();
  const [selectedItem, setSelectedItem] = useState<MenuItems>();
  const [qtyCount, setQtyCount] = useState(1);
  const [tappedItems, setTappedItems] = useState<{ [key: string]: boolean}>({}); 

  const openEditModal =()=>{
    setQtyCount(1);
    setTappedItems({});
    modalizeRef.current?.open();
  }


  useEffect(() => {
    if (order) {
      setOrderItems(order.order);
      console.log("Order: " + order.order);
    }
  }, [order]);

  const orderTotal = useCartTotal(order ? order.order : []);

  const getSelectedItem = (menuitem: MenuItems) => {
    if (menuitem) {
      setSelectedItem(menuitem);
      setQtyCount(menuitem.qty);
  
      // Initialize tappedItems based on the labels of the selectedAddOns
      const initialTappedState: { [key: string]: boolean } = {};
  
      // Loop through the addOns of the menu item
      menuitem.addOns.forEach((addOn) => {
        // Check if the addOn's label is in selectedAddOns, if so set it as true in tappedItems
        const isSelected = menuitem.selectedAddOns.some((selected) => selected.label === addOn.label);
        initialTappedState[addOn.label] = isSelected; // Set tappedItems to true if the add-on is selected
      });
  
      setTappedItems(initialTappedState); // Update tappedItems state
    }
  };
  

  const toggleAddOnTapped = (label: string) => {
    setTappedItems(prevState => ({
      ...prevState,
      [label]: !prevState[label], // Toggle tapped state based on label
    }));
  };
  

  const setQty = (count: number) => {
    if (count <= 1){
      setQtyCount(1);
    }else{
      setQtyCount(count);
    }
  }
  const EditItem = (itemMenu: MenuItems) => {
    // Check if a similar item already exists in the order
    const existingItem = Object.entries(order.order).find(
      ([key, item]) => itemMenu.fullLabel === item.fullLabel
    );
  
    // If the item exists, update
    if (existingItem) {
      // Map through tappedItems and get the corresponding addOns from itemMenu.addOns
      const newSelectedItem = Object.entries(tappedItems)
        .filter(([key, value]) => value === true) // Keep only the items that are true
        .map(([key, value]) => {
          // Find the corresponding addOn by matching the label
          const selectedAddOn = itemMenu.addOns.find(addOn => addOn.label === key);
          return selectedAddOn; // Return the matched addOn object
        }).filter(Boolean); // Filter out any undefined values (in case no match is found)
  
      // Find the key of the existing item to update
      const [existingKey, existingItemData] = existingItem;
      const updatedItem = {
        ...existingItemData,
        qty: qtyCount, // Update the quantity
        selectedAddOns: newSelectedItem, // Update the selected add-ons
      };
  
      // Update the order state, replacing the existing item with the updated one
      setOrder(prev => ({
        ...prev,
        order: prev.order.map((item, index) =>
          index === Number(existingKey) ? updatedItem : item
        ),
      }));
  
      // Reset after updating the cart
      setTappedItems({});
      setQtyCount(1);
      modalizeRef.current?.close();
    }
  };

  const deleteItem = (itemMenu: MenuItems) => {
    // Remove the item from the order by filtering out the item based on fullLabel (or itemId)
    const updatedOrder = order.order.filter(item => item.fullLabel !== itemMenu.fullLabel);
  
    // Update the order state with the new list (after removal)
    setOrder(prev => ({
      ...prev,
      order: updatedOrder,
    }));
     // Reset after deleting
     setTappedItems({});
     setQtyCount(1);
     modalizeRef.current?.close();
  };
  
  useEffect(() =>{
    console.log("TappedItems: "+ tappedItems);
  }, [tappedItems]);

  return (
   
    <BottomSheetModalProvider >
    <GestureHandlerRootView  >
    <View style={[globalStyle.container]}>

      <View style ={{padding: "5%", flexGrow: 1}}>
        <View style={{ flexDirection: "row", paddingBottom: 10 }}>
          <TitleDashed title="MY CART" />
          <Text style={{ fontFamily: 'MadimiOne', color: "#C1272D", fontSize: 24 }}> ({orderItems.length})</Text>
        </View>

        <FlatList
          data={orderItems}
          style={{ height: "70%"}}
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
                    item.selectedAddOns.map((addOn: AddOns) => {
                      return (
                        addOn && addOn.label && addOn.price && (
                          <Text style={[styles.textCartItem, { fontSize: 16 }]} key={addOn.label}>
                            {addOn.label} - P{addOn.price}
                          </Text>
                        )
                      );
                    })
                  }

                  <View style={styles.line}></View>

                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <TouchableOpacity onPress={() => {openEditModal(); getSelectedItem(item);}} style={styles.editBtn}>
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



      </View>

              {/* Modal */}
              <Modalize ref={modalizeRef} snapPoint={630} modalHeight={630}>
          {selectedItem &&
            <View>
                  <Image 
                    source={{ uri: selectedItem.image }}  
                    style={globalStyle.image}
                  />
                  <View style={globalStyle.modalContainer}>
                    <View style={{flexDirection: "row"}}>
                      <Text style={globalStyle.modalLabel}>{selectedItem.fullLabel}</Text>
                      <TouchableOpacity
                        onPress={() => {deleteItem(selectedItem)}}
                      >
                        <View style={{backgroundColor: "#C1272D", borderRadius: 10, padding:10, justifyContent: "center", alignItems: "center", flexDirection: "row", gap:10}}>
                          <FontAwesome6 name="trash-can" size={12} color="white" />
                          <Text style={{    
                            fontSize: 12,
                            fontFamily: 'MadimiOne',
                            color: 'white'}}>
                              REMOVE ITEM</Text>
                        </View>
                          
                      </TouchableOpacity>
                    </View>
                    <View style={globalStyle.dashedLine}/>
                    <View style={{flexDirection: "row", gap: 10}}>
                      <Text style={globalStyle.modalPrice}>PHP {selectedItem.price}</Text>
                      <View style={globalStyle.timeCard}>
                        <AntDesign name="clockcircle" size={16} color="white" />
                        <Text style={globalStyle.timeText}>{selectedItem.time}</Text>
                      </View>
                    </View>
                    <Text style={globalStyle.descriptionText}>{selectedItem.description}</Text>
                    <Text style={globalStyle.addOnsText}>ADD ONS</Text>
                    <View style={globalStyle.addOnsContainer}>
                      {

                        selectedItem.addOns.map((item) => {
                          return (
                            <TouchableOpacity
                              key={item.label}  // Use label as key for uniqueness
                              onPress={() => toggleAddOnTapped(item.label)}
                              style={[globalStyle.addOnsItemCard, tappedItems[item.label] && { backgroundColor: "#FB7F3B" }]} // Conditional background color
                            >
                              <Text style={[globalStyle.addOnsItemText, tappedItems[item.label] && { color: "white" }]}>
                                {item.label} + P {item.price}
                              </Text>
                            </TouchableOpacity>
                          );
                        })

                      }
                    </View>
                    <View style={{flexDirection: "row", gap: 10}}>
                      <View style={globalStyle.qtyCard}>
                        <TouchableOpacity onPress={() => {setQty(qtyCount - 1)}} style={[globalStyle.qtyCardBtns]}><FontAwesome6 name="minus" size={16} color="white" /></TouchableOpacity>
                        <View style={globalStyle.qtyCardView}><Text style={globalStyle.qtyCardViewText}>{qtyCount}</Text></View>
                        <TouchableOpacity onPress={() => {setQty(qtyCount + 1)}} style={[globalStyle.qtyCardBtns]}><FontAwesome6 name="plus" size={16} color="white" /></TouchableOpacity>
                      </View>
                      <TouchableOpacity
                        onPress={() =>{EditItem(selectedItem)}}
                        style ={globalStyle.btnCart}
                      >
                        <FontAwesome6 name="edit" size={16} color="white" />
                        <Text style={globalStyle.cartText}>UPDATE ORDER</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  
            </View>
          }
        </Modalize>

        <SafeAreaView >
          <View  style={[styles.bottomContainer,  { paddingBottom: insets.bottom + 55 }]}>
            <View style={styles.totalContainer}>
              <Text style={[styles.totalText, { fontSize: 24 }]}>TOTAL:</Text>
              <Text style={[styles.totalText, { fontSize: 34 }]}>PHP {orderTotal}</Text>
            </View>
            <View style={[styles.checkOutBtnCard]}>
              <TouchableOpacity
                onPress={() => { router.replace(`/(app)/checkout`); }}
                style={[styles.btnViewCart]}>
                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 10 }}>
                  <FontAwesome6 name="cart-shopping" size={16} color="white" />
                  <Text style={styles.textViewCart}>CHECKOUT</Text>
                </View>
              </TouchableOpacity>
            </View>      
          </View>
        </SafeAreaView>

        </View>
      </GestureHandlerRootView> 
          
      </BottomSheetModalProvider>
      

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
  checkOutBtnCard: {
    padding: 15,
    justifyContent: "center",
    alignItems: "center",  // Center the content inside the button
    flexDirection: "row",
    backgroundColor: "#FB7F3B",
  },
  bottomContainer:{

    bottom: 0,  // Align it to the bottom of the screen
    left: 0,  // Align it to the left edge of the screen
    right: 0,  // Stretch the button across the entire width of the screen
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
