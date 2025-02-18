import { useLocalSearchParams, useRouter } from "expo-router";
import { Text, TextInput, View, StyleSheet, ScrollView, Button, NativeSyntheticEvent, Image, TouchableOpacity } from "react-native";
import globalStyle from "../../../assets/styles/globalStyle";
import menuData from "../../../data/menu.json";
import Feather from "@expo/vector-icons/Feather";
import { useState, useEffect, useRef, useMemo, useCallback, useContext } from "react";
import TitleDashed from "@/components/titledashed";
import MenuContainer from "@/components/menuContainer";
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Modalize } from "react-native-modalize";
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { AppContext } from "@/app/context/AppContext";
import ViewCartContainer from "@/components/ViewCartContainer";
import SearchMenu from "@/components/SearchMenu";

interface AddOns {
  label: string;
  price: number;
}

interface MenuItems {
  [x: string]: any;
  subId: string;
  itemId: string;
  label: string;
  fullLabel: string;
  description: string;
  price: number;
  time: string;
  image: string;
  addOns: Array<AddOns>;
}

interface MenuData {
  id: string;
  subId: string;
  name: string;
  image: string;
}

interface User {
  favourites: MenuItems[];
}


export default function MenuFavourite() {
  const context = useContext(AppContext);
  if (!context) {
    return <Text>Error: AppContext is not available</Text>;
  }
  const { order, setOrder, setUser, user} = context;
  const [menu, setMenu] = useState<any[] | null>(null);
  const modalizeRef = useRef<Modalize>(null);
  const [itemId, setItemId] = useState<string | null>(null);
  const [subCategoryId, setSubCategoryId] = useState<string | null>(null);
  const [favourite, toggleFavourite] = useState(false);
  const [qtyCount, setQtyCount] = useState(1);
  const [tappedItems, setTappedItems] = useState<{ [key: number]: boolean }>({}); 
  const [favMenu, setfavMenu] = useState<MenuData[]>();


  const setMenuData = () => {
    setMenu(user.favourites); 
  };

  const handleTapItem =()=>{
    setQtyCount(1);
    setTappedItems({});
    modalizeRef.current?.open();
  }


  const getSelectedItem = () => {
    if (menu){
      return menu.find(item => item.itemId === itemId);
    }
    return null;
  }

  const selectedItem = getSelectedItem();

  useEffect(() => {
    setMenuData();
    console.log(menu);
  }, [setMenuData]);

  useEffect(() => {
    console.log(order);
  }, [order]);

  
  useEffect(() => {
    if (menu) {
      const favourites = menu.map((item: MenuItems) => ({
        id: item.itemId,
        subId: item.subId,
        name: item.label,
        image: item.image
      }));
      setfavMenu(favourites);
      console.log("favourites:", favourites);  // Improved log
    }
  }, [menu]);  

  useEffect(() => {
    console.log(order);
  }, [order]);


  useEffect(() => {
    if (selectedItem) {
      // Check if the selected item is in the user's favourites
      const isFavourite = user.favourites.some(
        (item: { fullLabel: string; }) => selectedItem.fullLabel === item.fullLabel
      );
      
      // Update the favourite state accordingly
      toggleFavourite(isFavourite);
      console.log("user: "+  user);
    }
  }, [selectedItem, user.favourites]); 
  

  const setQty = (count: number) => {
    if (count <= 1){
      setQtyCount(1);
    }else{
      setQtyCount(count);
    }
  }

  const toggleAddOnTapped = (key: number) => {
    setTappedItems(prevState => ({
      ...prevState,
      [key]: !prevState[key], // Toggle tapped state for this item
    }));
  };

  const setFavourite = (itemMenu: MenuItems) => {
    // Toggle the favourite state
    toggleFavourite(prevState => {
      const newFavouriteState = !prevState;
  
      // Update the user's favourites list
      setUser((prev: User) => {
        const updatedFavourites = newFavouriteState
          ? [...prev.favourites, itemMenu] // Add the item if it's being set as favourite
          : prev.favourites.filter((fav) => fav.fullLabel !== itemMenu.fullLabel); // Remove the item if it's being unfavoured
  
        return {
          ...prev,
          favourites: updatedFavourites,
        };
      });
  
      return newFavouriteState; // Return the new state for toggleFavourite
    });
  };


  const handleAddToCart = (itemMenu: MenuItems) => {
    // Check if a similar item already exists in the order
    const existingItem = Object.entries(order.order).find(
      ([key, item]) => itemMenu.fullLabel === item.fullLabel
    );
  
    // If the item exists, update the quantity instead of adding a new item
    if (existingItem) {
      // Find the key of the existing item to update its quantity
      const [existingKey, existingItemData] = existingItem;
      const updatedItem = {
        ...existingItemData,
        qty: existingItemData.qty + qtyCount, // Increase the quantity
      };
  
      // Update the order state, replacing the existing item with the updated one
      setOrder(prev => ({
        ...prev,
        order: prev.order.map((item, index) => 
          index === Number(existingKey) ? updatedItem : item
        ),
      }));
    } else {
      // If the item does not exist in the order, add it as a new item
      const selectedAddOns = Object.entries(tappedItems)
        .filter(([key, item]) => item === true) // keep only the items that are true
        .map(([key, item]) => Number(key)); // map to get the keys (which are the selected add-ons)
  
      const newSelectedItem = selectedAddOns.map((key) => itemMenu.addOns[key]);
  
      // Add the new item to the order
      const newItemMenu = { ...itemMenu, selectedAddOns: newSelectedItem, qty: qtyCount };
  
      setOrder(prev => ({
        ...prev,
        order: [...prev.order, newItemMenu], // Add the new item to the order
      }));
    }
  
    // Reset the tappedItems and quantity count after adding/updating the cart
    setTappedItems({});
    setQtyCount(1);
  };
  
  
  
  return (
    <View style={[globalStyle.container, { paddingTop: 0 }]}>
    <GestureHandlerRootView >
      <BottomSheetModalProvider>
    
        <SearchMenu />

        <View style={{ minHeight: 700}}>
          {/* Menu */}
          <ScrollView style={{flexGrow: 1}}>
            <View style={styles.contentContainer}>
              <View style={{ marginBottom: 10 }}>
                <TitleDashed title="MY FAVOURITES" />
              </View>
                {menu && (
                  <>
                          {favMenu && (
                     <>
                      <View>
                        <MenuContainer
                          menuData={favMenu}
                          handleTapItem={handleTapItem}
                          setItemId={setItemId}
                          setSubCategoryId={setSubCategoryId}
                        />
                      </View>  
                </>
              )}
                </>
              )}
            </View>
          </ScrollView>
        </View>
       

        {/* Modal */}
        <Modalize ref={modalizeRef} snapPoint={600} modalHeight={600}>
          {selectedItem &&
            <View>
                  <Image 
                    source={{ uri: selectedItem.image }}  
                    style={styles.image}
                  />
                  <View style={styles.modalContainer}>
                    <View style={{flexDirection: "row"}}>
                      <Text style={styles.modalLabel}>{selectedItem.fullLabel}</Text>
                      <TouchableOpacity
                        onPress={() => {setFavourite(selectedItem)}}
                      >
                        {
                          favourite ? 
                          <AntDesign name="star" size={28} color="#C1272D" /> :
                          <AntDesign name="staro" size={28} color="#C1272D" />
                        }
                      </TouchableOpacity>
                    </View>
                    <View style={styles.dashedLine}/>
                    <View style={{flexDirection: "row", gap: 10}}>
                      <Text style={styles.modalPrice}>PHP {selectedItem.price}</Text>
                      <View style={styles.timeCard}>
                        <AntDesign name="clockcircle" size={16} color="white" />
                        <Text style={styles.timeText}>{selectedItem.time}</Text>
                      </View>
                    </View>
                    <Text style={styles.descriptionText}>{selectedItem.description}</Text>
                    <Text style={styles.addOnsText}>ADD ONS</Text>
                    <View style={styles.addOnsContainer}>
                      {

                            selectedItem.addOns.map((item: AddOns, key: number) => {
                              return (
                                <TouchableOpacity 
                                  key={key} 
                                  onPress={() => toggleAddOnTapped(key)} 
                                  style={[styles.addOnsItemCard, tappedItems[key] && { backgroundColor: "#FB7F3B" }]} // Conditional background color
                                >
                                  <Text style={[styles.addOnsItemText, tappedItems[key] && { color: "white" }]}>
                                    {item.label} + P {item.price}
                                  </Text>
                                </TouchableOpacity>
                              )
                            })
                      }
                    </View>
                    <View style={{flexDirection: "row", gap: 10}}>
                      <View style={styles.qtyCard}>
                        <TouchableOpacity onPress={() => {setQty(qtyCount - 1)}} style={[styles.qtyCardBtns]}><FontAwesome6 name="minus" size={16} color="white" /></TouchableOpacity>
                        <View style={styles.qtyCardView}><Text style={styles.qtyCardViewText}>{qtyCount}</Text></View>
                        <TouchableOpacity onPress={() => {setQty(qtyCount + 1)}} style={[styles.qtyCardBtns]}><FontAwesome6 name="plus" size={16} color="white" /></TouchableOpacity>
                      </View>
                      <TouchableOpacity
                        onPress={() =>{handleAddToCart(selectedItem)}}
                        style ={styles.btnCart}
                      >
                        <FontAwesome6 name="cart-shopping" size={16} color="white" />
                        <Text style={styles.cartText}>ADD TO CART</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
            </View>
          }

        </Modalize>

       <ViewCartContainer />
          
      
    </BottomSheetModalProvider>
    
    </GestureHandlerRootView>
    
    </View>
    
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    margin: "5%",
  },
  bottomSheetContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

 //View Cart
  viewCartBtnCard: {
    flex:1,
    padding: 15,
    justifyContent: "center",
    alignItems: "flex-start",
    flexDirection: "row",
    backgroundColor: "#FB7F3B",

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
  // image modal
  image: {
    backgroundColor: "#C1272D",
    height: 200,
  },

  //Modal
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalContainer: {
    padding: "3%",
    gap: 15
  },
  modalLabel: {
    fontFamily: 'MadimiOne',
    color: '#C1272D',
    fontSize: 24,
    flexGrow: 1
  },
  modalPrice: {
    fontFamily: 'MadimiOne',
    color: '#2C2C2C',
    fontSize: 24,
  },

  //Line
  dashedLine: {          
    borderBottomWidth: 4,  
    borderColor: 'rgba(194, 39, 45, 0.5)',
    borderStyle: 'dashed',
    flexGrow: 1,
    top: -6 
  },

  //Time
  timeCard: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FB7F3B",
    padding: 5,
    borderRadius: 5,
    flexDirection: "row",
    gap: 5
  },
  timeText: {
    color: "white",
    fontFamily: 'MadimiOne',
    fontSize: 16,
  },

  //Description
  descriptionText: {
    color: "#7d7c7c",
    fontFamily: 'MadimiOne',
  },

  // AddOns
  addOnsText:{
    color: "#C1272D",
    fontFamily: 'MadimiOne',
    fontSize: 20,
  },
  addOnsContainer: {
    flex: 1,
    flexDirection: "row",
    gap: 5,
  },
  addOnsItemCard: {
    borderWidth: 3,
    borderRadius: 5,
    borderColor: "#FB7F3B",
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  addOnsItemText: {
    fontFamily: 'MadimiOne',
    color: "#FB7F3B",
  },

  //Cart button
  btnCart: {
    flex: 1.5,
    backgroundColor: "#2C2C2C",
    borderRadius: 10,
    padding: 10, 
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 10
  },
  cartText: {
    color: "white",
    fontFamily: 'MadimiOne',
    fontSize: 20
  },

  // QTY 
  qtyCard:{
    flex: 1,
    borderRadius: 10,
    flexDirection: "row",
    borderWidth: 3,
    borderColor: "#FB7F3B"
  },
  qtyCardBtns:{
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FB7F3B",
  },
  qtyCardView:{
    flex: 1,
    backgroundColor: "white",
    fontFamily: 'MadimiOne',
    color: "#2C2C2C",
    justifyContent: "center",
    alignItems: "center",
  },
  qtyCardViewText:{
    fontFamily: 'MadimiOne',
    fontSize: 20,
  },


});
