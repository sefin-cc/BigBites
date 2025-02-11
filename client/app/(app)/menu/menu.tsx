import { useLocalSearchParams, useRouter } from "expo-router";
import { Text, TextInput, View, StyleSheet, ScrollView, Button, NativeSyntheticEvent } from "react-native";
import globalStyle from "../../../assets/styles/globalStyle";
import menuData from "../../../data/menu.json";
import Feather from "@expo/vector-icons/Feather";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import TitleDashed from "@/components/titledashed";
import MenuContainer from "@/components/menuContainer";
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Modalize } from "react-native-modalize";

interface AddOns {
  label: string;
  price: number;
}

interface MenuItems {
  itemId: string;
  label: string;
  fullLabel: string;
  description: string;
  price: number;
  time: string;
  image: string;
  favourite: boolean;
  addOns: Array<AddOns>;
}

interface SubCategories {
  subId: string;
  label: string;
  items: Array<MenuItems>;
}

interface Menu {
  id: string;
  category: string;
  subCategories: Array<SubCategories>;
}

interface MenuItemCard {
  id: string;
  name: string;
  image: string;
}

type MenuData = typeof menuData;

export default function Menu() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [menu, setMenu] = useState<Menu | null>(null);
  const [search, setSearch] = useState<string>(''); 
  const modalizeRef = useRef<Modalize>(null);

  const setMenuData = () => {
    const categoryId = parseInt(id as string);
    setMenu(menuData[categoryId]); 
  };

  // Handle search logic to filter menu items
  const handleSearch = (query: string) => {
    setSearch(query);
  };

  // Filtered items based on search query
  const filteredItems = menu?.subCategories?.flatMap(subCategory => 
    subCategory.items.filter(item => 
      item.label.toLowerCase().includes(search.toLowerCase()) || 
      item.fullLabel.toLowerCase().includes(search.toLowerCase())
    )
  );

  const handleTapItem =()=>{
    modalizeRef.current?.open();
  }

  useEffect(() => {
    setMenuData();
    console.log(menu?.subCategories);
  }, [setMenuData]);

  return (
    <GestureHandlerRootView >
      <BottomSheetModalProvider>
      <View style={[globalStyle.container, { paddingTop: 0 }]}>
        <View style={{ padding: 10, justifyContent: "center", backgroundColor: "#C1272D" }}>
          <TextInput
            style={globalStyle.searchMenu}
            value={search}
            placeholder="SEARCH..."
            onChangeText={handleSearch}
          />
          <Feather size={23} name="search" color="#C1272D" style={{ position: "absolute", right: 20 }} />
        </View>

        <ScrollView>
          <View style={styles.contentContainer}>
            {menu && (
              <>
                {menu.subCategories.map((item, key) => {
                  const menuData: MenuItemCard[] = item.items.map((menuItem) => ({
                    id: menuItem.itemId,
                    name: menuItem.label,
                    image: menuItem.image
                  }));

                  return (
                    <View key={key}>
                      <View style={{ marginBottom: 10 }}>
                        <TitleDashed title={item.label} />
                      </View>

                      {/* Pass the entire menuData array to MenuContainer */}
                      <MenuContainer
                        menuData={menuData}  // Pass the array of menu items
                        handleTapItem={handleTapItem}  // Tap callback to trigger bottom sheet
                      />
                    </View>
                  );
                })}
              </>
            )}
          </View>
        </ScrollView>

       
        <Modalize ref={modalizeRef} snapPoint={500} modalHeight={500}>
          
        </Modalize>

      </View>
    </BottomSheetModalProvider>
    </GestureHandlerRootView>
    
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
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
});
