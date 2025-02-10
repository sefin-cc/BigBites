import { useLocalSearchParams, useRouter } from "expo-router";
import { Text, TextInput, View, FlatList } from "react-native";
import globalStyle from "../../../assets/styles/globalStyle";
import menuData from "../../../data/menu.json"; // Assuming your menu data is in a file
import Feather from "@expo/vector-icons/Feather";
import { useState, useEffect } from "react";
import TitleDashed from "@/components/titledashed";
import React from "react";

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

// Assuming menuData is an object with categories as keys
type MenuData = typeof menuData;

export default function Menu() {
  const router = useRouter();
  const { id } = useLocalSearchParams();  
  const [menu, setMenu] = useState<Menu | null>(null);
  const [search, setSearch] = useState<string>(''); 


  const setMenuData = () =>{
    const categoryId = parseInt(id as string);
    setMenu(menuData[categoryId]); 
  }

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

  useEffect(() => {
    setMenuData();
    console.log(menu);
  }, [setMenuData]);

  return (
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

      {menu && (
        <>
          <TitleDashed title={menu.category} />
          
          <FlatList
            data={filteredItems}
            keyExtractor={(item) => item.itemId}
            renderItem={({ item }) => (
              <View style={{ padding: 10, borderBottomWidth: 1, borderColor: '#ddd' }}>
                <Text style={{ fontWeight: 'bold' }}>{item.label}</Text>
                <Text>{item.description}</Text>
                <Text>{`Price: $${item.price}`}</Text>
                <Text>{`Time: ${item.time}`}</Text>
              </View>
            )}
          />
        </>
      )}
    </View>
  );
}
