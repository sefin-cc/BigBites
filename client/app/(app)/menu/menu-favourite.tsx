import { useLocalSearchParams, useRouter } from "expo-router";
import { Text, TextInput, View, StyleSheet, ScrollView, Button, NativeSyntheticEvent, Image, TouchableOpacity } from "react-native";
import globalStyle from "../../../assets/styles/globalStyle";
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
import { Item, AddOn} from "@/types/clients";
import { Snackbar } from "react-native-paper";
import { useOptimizedCloudinaryUrl } from "@/hooks/useOptimizedCloudinaryUrl";


interface User {
  favourites: Item[];
}

interface MenuData {
  id: number;
  sub_category_id: number;
  name: string;
  image: string; 
}


export default function MenuFavourite() {
  const context = useContext(AppContext);
  if (!context) {
    return <Text>Error: AppContext is not available</Text>;
  }
  const { order, setOrder, setUser, user } = context;
  const [menu, setMenu] = useState<any[] | null>(null);
  const modalizeRef = useRef<Modalize>(null);
  const [itemId, setItemId] = useState<number | null>(null);
  const [subCategoryId, setSubCategoryId] = useState<number | null>(null);
  const [favourite, toggleFavourite] = useState(false);
  const [qtyCount, setQtyCount] = useState(1);
  const [tappedItems, setTappedItems] = useState<{ [key: number]: boolean }>({}); 
  const [favMenu, setfavMenu] = useState<MenuData[]>([]);
  const [visible, setVisible] = useState<boolean>(false);

  const setMenuData = () => {
    if(user){
      setMenu(user.favourites); 
    }
  };

  const handleTapItem =()=>{
    setQtyCount(1);
    setTappedItems({});
    modalizeRef.current?.open();
  }


  const getSelectedItem = () => {
    if (menu) {
      return menu.find((item) => item.id === itemId); 
    }
    return null;
  }

  const selectedItem = getSelectedItem();

  useEffect(() => {
    setMenuData();
    console.log(menu);
  }, [user]); 

  useEffect(() => {
    console.log(order);
  }, [order]);

  
  useEffect(() => {
    if (menu) {
      const favourites = menu.map((item: Item) => ({
        id: item.id,
        sub_category_id: item.sub_category_id,
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
    if(user && user.favourites){
      if (selectedItem) {
        const isFavourite = user.favourites.some(
          (item: Item) => selectedItem.full_label === item.full_label
        );
        toggleFavourite(isFavourite);
        console.log("user: ", user);
      }
    }

  }, [selectedItem, user.favourites]); 
  
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        setVisible(false);// Hide snackbar after 3 seconds
      }, 3000);

      // Cleanup timer on component unmount or when visible changes
      return () => clearTimeout(timer);
    }
  }, [visible]); 

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

  const setFavourite = (itemMenu: Item) => {
    // Toggle the favourite state
    toggleFavourite(prevState => {
      const newFavouriteState = !prevState;
  
      // Update the user's favourites list
      setUser((prev: User) => {
        const updatedFavourites = newFavouriteState
          ? [...prev.favourites, itemMenu] // Add the item if it's being set as favourite
          : prev.favourites.filter((fav) => fav.full_label !== itemMenu.full_label); // Remove the item if it's being unfavoured
  
        return {
          ...prev,
          favourites: updatedFavourites,
        };
      });
  
      return newFavouriteState; // Return the new state for toggleFavourite
    });
  };


  const handleAddToCart = (itemMenu: Item) => {
    // Check if a similar item already exists in the order
    const existingItem = Object.entries(order.order).find(
      ([key, item]) => itemMenu.full_label === item.full_label
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
  
      const newSelectedItem = selectedAddOns.map((key) => itemMenu.add_ons[key]);
  
      // Add the new item to the order
      const newItemMenu = { ...itemMenu, selectedAddOns: newSelectedItem, qty: qtyCount };
  
      setOrder(prev => ({
        ...prev,
        order: [...prev.order, newItemMenu], // Add the new item to the order
      }));
    }
    setVisible(true);
    // Reset the tappedItems and quantity count after adding/updating the cart
    setTappedItems({});
    setQtyCount(1);
    modalizeRef.current?.close();
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
                  {favMenu?.length ? ( 
                    <View>
                      <MenuContainer
                        menuData={favMenu}
                        handleTapItem={handleTapItem}
                        setItemId={setItemId}
                        setSubCategoryId={setSubCategoryId}
                      />
                    </View>
                  ) : (
                    <View style={styles.noFavouritesContainer}>
                      <AntDesign name="star" size={100} color="#f2aa83" />
                      <Text style={styles.noFavouritesText}>NO ADDED FAVOURITES</Text>
                    </View>
                  )}
                </>
              )}

            </View>

            <Snackbar
              visible={visible}
              onDismiss={() =>setVisible(false)}
              duration={Snackbar.DURATION_LONG} 
              style={{
                position: 'absolute',  
                bottom: -130,          
                left: 60,             
                right: 60,           
                backgroundColor: '#2C2C2C', 
                borderRadius: 10,     
                zIndex: 10000,          
              }}
            >
              <Text style={{fontFamily: 'MadimiOne', alignSelf:"center", color: "white", fontSize: 16}}> <FontAwesome6 name="check" size={16} color="white" />  SUCCESSFULLY ADDED!</Text>
            </Snackbar>
          </ScrollView>
        </View>
       

        {/* Modal */}
        <Modalize 
          ref={modalizeRef} 
          snapPoint={630} 
          adjustToContentHeight
          childrenStyle={{ height: 630 }}
        >
          {selectedItem &&
            <View>
                  <Image 
                    source={{ uri:  useOptimizedCloudinaryUrl(selectedItem.image)}}  
                    style={globalStyle.image}
                  />
                  <View style={globalStyle.modalContainer}>
                    <View style={{flexDirection: "row"}}>
                      <Text style={globalStyle.modalLabel}>{selectedItem.full_label}</Text>
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

                            selectedItem.add_ons.map((item: AddOn , key: number) => {
                              return (
                                <TouchableOpacity 
                                  key={key} 
                                  onPress={() => toggleAddOnTapped(key)} 
                                  style={[globalStyle.addOnsItemCard, tappedItems[key] && { backgroundColor: "#FB7F3B" }]} // Conditional background color
                                >
                                  <Text style={[globalStyle.addOnsItemText, tappedItems[key] && { color: "white" }]}>
                                    {item.label} + P {item.price}
                                  </Text>
                                </TouchableOpacity>
                              )
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
                        onPress={(e) =>{
                          e.persist?.();
                          handleAddToCart(selectedItem)}
                        }
                        style ={globalStyle.btnCart}
                      >
                        <FontAwesome6 name="cart-shopping" size={16} color="white" />
                        <Text style={globalStyle.cartText}>ADD TO CART</Text>
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

  noFavouritesContainer:{
    height: 500,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noFavouritesText: {
    textAlign: "center",
    fontSize: 16,
    color: "#f2aa83",
    marginTop: 20,
    fontFamily: 'MadimiOne',
  },

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
