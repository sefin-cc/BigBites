import { AppContext } from "@/app/context/AppContext";
import globalStyle from "@/assets/styles/globalStyle";
import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet,TouchableOpacity } from "react-native";
import menuData from "../data/menu.json";

interface AddOns {
  label: string;
  price: number;
}

interface MenuItems {
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

interface SubCategories {
  subId: string;
  label: string;
  items: Array<MenuItems>;
}

interface MenuCategory {
  id: string;
  category: string;
  subCategories: SubCategories[];
}

type Menu = MenuCategory[];

export default function SearchMenu() {
  const router = useRouter();
  const [search, setSearch] = useState<string>(''); 
  const [searchResults, setSearchResults] = useState<Array<any>>([]); // Flattened search results
  const [menu, setMenu] = useState<Menu | null>(null);  

  const handleSearch = (query: string) => {
    setSearch(query);

    // Don't show suggestions if query length is less than 3
    if (query.length < 3) {
      setSearchResults([]);
      return;
    }

    if (!menu) {
      return;
    }

    // Filter menu based on the search query and flatten the results
    const results = menu
      .map(category => {
        // Filter subcategories and items that match the query
        const matchingSubCategoriesAndItems = category.subCategories.flatMap(subCategory => {
          const subCategoryMatch = subCategory.label.toLowerCase().includes(query.toLowerCase());
          
          // Find matching items within the subcategory
          const matchingItems = subCategory.items.filter(item => 
            item.fullLabel.toLowerCase().includes(query.toLowerCase())
          );
          
          // Return both subcategory and its matching items if they match
          return [
            ...(subCategoryMatch ? [{ type: 'subcategory', label: subCategory.label, id: category.id }] : []),
            ...matchingItems.map(item => ({ type: 'item', label: item.fullLabel, id: category.id, itemId: item.itemId }))
          ];
        });

        // Return matching subcategories/items (no category required)
        return matchingSubCategoriesAndItems.length > 0 ? matchingSubCategoriesAndItems : null;
      })
      .filter(result => result !== null);

    // Flatten the results to a single array of items and subcategories
    const flattenedResults = results.flat();
    setSearchResults(flattenedResults);
  };

  const handleOnTap = (id: string) => {
    setSearch('');
    setSearchResults([]);
    router.push(`/(app)/menu/menu?id=${id}`)
  }

  useEffect(() => {
    setMenu(menuData);  // Initialize menu data
  }, []);   // Only run once when the component is mounted

  useEffect(() => {
     console.log("searchResults: " + searchResults);
  }, [searchResults]);  

  return (
    <View style={{ padding: 10, justifyContent: "center", backgroundColor: "#C1272D" }}>
      <TextInput
        style={globalStyle.searchMenu}
        value={search}
        placeholder="SEARCH..."
        onChangeText={handleSearch}
      />
      <Feather size={23} name="search" color="#C1272D" style={{ position: "absolute", right: 20 }} />

      {/* Display search results */}
      {searchResults.length > 0 && (
        <View style={styles.searchContainer}>
          {searchResults.map((result, index) => (
            <View key={index}>
              {result.type === 'subcategory' ? (
                <TouchableOpacity style={styles.itemCard} onPress={() =>handleOnTap(result.id)}>
                    <Text style={styles.text}>{result.label}</Text>
                </TouchableOpacity>

              ) : result.type === 'item' ? (
                <TouchableOpacity style={styles.itemCard} onPress={() =>handleOnTap(result.id)}>
                    <Text style={styles.text}>{result.label}</Text> 
                </TouchableOpacity>
              ) : null}
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    position: "absolute",
    right: 14,
    left: 14,
    top: 60,
    zIndex: 1000,
    borderColor: "#ddd",
    borderWidth: 1
  },
  text: {
    fontSize: 20,
    color: "#2C2C2C",
    fontFamily: 'MadimiOne'
  },
  itemCard: {
    padding: 15,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1
  }
});
