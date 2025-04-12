import { useLocalSearchParams, useRouter } from "expo-router";
import { Text, TextInput, View, StyleSheet, ScrollView, Button, NativeSyntheticEvent, Image, TouchableOpacity, SafeAreaView, Dimensions, ToastAndroid } from "react-native";
import globalStyle from "../../../assets/styles/globalStyle";

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
import Loading from "@/components/loading";
import { Portal, Snackbar } from "react-native-paper";
import { useGetMenuQuery } from "../../../redux/feature/apiSlice";
import { Category, Item} from "@/types/clients";
import { useOptimizedCloudinaryUrl } from "@/hooks/useOptimizedCloudinaryUrl";



interface MenuItemCard {
  id: number;
  sub_category_id: number;
  name: string;
  image: string;
}

interface User {
  favourites: Item[];
}

export default function Menu() {
  const { data: menuData, isLoading: menuLoading } = useGetMenuQuery();
  const context = useContext(AppContext);
  if (!context) {
    return <Text>Error: AppContext is not available</Text>;
  }
  const { order, setOrder, setUser, user} = context;
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [menu, setMenu] = useState<Category | null>(null);
  const [visible, setVisible] = useState<boolean>(false);
  const modalizeRef = useRef<Modalize>(null);
  const [itemId, setItemId] = useState<number | null>(null);
  const [subCategoryId, setSubCategoryId] = useState<number | null>(null);
  const [favourite, toggleFavourite] = useState(false);
  const [qtyCount, setQtyCount] = useState(1);
  const [tappedItems, setTappedItems] = useState<{ [key: number]: boolean }>({}); 


  const setMenuData = () => {
    const categoryId = parseInt(id as string);
    if (menuData && categoryId in menuData) {
        setMenu(menuData[categoryId]);  
    }
  };

  const handleTapItem =()=>{
    setQtyCount(1);
    setTappedItems({});
    modalizeRef.current?.open();
  }


  const getSelectedItem = () => {
    if (!menu || !subCategoryId || !itemId) return null;
    const subCategory = menu.sub_categories.find(sub => sub.id === subCategoryId);
    if (subCategory) {
      return subCategory.items.find(item => item.id === itemId);
    }
    return null;
  }

  const selectedItem = getSelectedItem();

  useEffect(() => {
    setMenuData();
    console.log(menuData);
  }, [menuData]);

  useEffect(() => {
    console.log(order);
  }, [order]);

  useEffect(() => {
    if (selectedItem) {
      // Check if the selected item is in the user's favourites
      const isFavourite = user.favourites.some(
        (item: { full_label: string; }) => selectedItem.full_label === item.full_label
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
  
   // Function to hide the snackbar
  const hideSnackbar = () => setVisible(false);

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        hideSnackbar(); // Hide snackbar after 3 seconds
      }, 3000);

      // Cleanup timer on component unmount or when visible changes
      return () => clearTimeout(timer);
    }
  }, [visible]); 
  
  return (

    <View style={[globalStyle.container]}>
      <Portal>
        <Loading isLoading={menuLoading} />
      </Portal>
   
      <BottomSheetModalProvider >
      <GestureHandlerRootView >
      
      <SearchMenu  />
     
        {/* Menu */}
      <View style={{ minHeight: 700}}>
      <ScrollView >
      <View style={styles.contentContainer}>
        {menu ? (
          menu.sub_categories.length > 0 ? (
            menu.sub_categories.map((item, key) => {
              const menuData: MenuItemCard[] = item.items.map((menuItem) => ({
                id: menuItem.id,
                sub_category_id: menuItem.sub_category_id,
                name: menuItem.label,
                image: menuItem.image,
              }));

              return (
                <View key={key}>
                  <View style={{ marginBottom: 10 }}>
                    <TitleDashed title={item.label} />
                  </View>

                  {/* Pass the entire menuData array to MenuContainer */}
                  <MenuContainer
                    menuData={menuData} // Pass the array of menu items
                    handleTapItem={() => handleTapItem()} // Tap callback to trigger bottom sheet
                    setItemId={setItemId}
                    setSubCategoryId={setSubCategoryId}
                  />
                </View>
              );
            })
          ) : (
            <View style={styles.noMenuContainer} >
              <Text style={styles.noMenuText}>NO MENU ITEMS AVAILABLE</Text>
            </View>

            
          )
        ) : (
          <View style={styles.noMenuContainer} >
            <Text style={styles.noMenuText}>NO MENU ITEMS AVAILABLE</Text>
          </View>
        )}
      </View>


            
          <Snackbar
            visible={visible}
            onDismiss={hideSnackbar}
            duration={Snackbar.DURATION_LONG} 
            style={{
              position: 'absolute',  
              bottom: -90,          
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
                    source={{ uri: useOptimizedCloudinaryUrl(selectedItem.image) }}  
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

                            selectedItem.add_ons.map((item, key) => {
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
        
        
        </GestureHandlerRootView> 
        </BottomSheetModalProvider>
      </View>
      

    
  );
}


const styles = StyleSheet.create({
  contentContainer: {
    margin: "5%",
  },
  noMenuContainer:{
    height: 500,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noMenuText: {
    textAlign: "center",
    fontSize: 16,
    color: "#f2aa83",
    marginTop: 20,
    fontFamily: 'MadimiOne',
  },


});
