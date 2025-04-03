
import globalStyle from "@/assets/styles/globalStyle";
import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet,TouchableOpacity, ActivityIndicator } from "react-native";
import { useGetMenuQuery } from "../redux/feature/apiSlice";
import { Category } from "@/types/clients";


export default function SearchMenu() {
  const router = useRouter();
  const { data: menuData } = useGetMenuQuery();
  const [search, setSearch] = useState<string>(''); 
  const [searchResults, setSearchResults] = useState<Array<{ type: string; label: string; id: number; itemId?: number }>>([]); // Flattened search results
  const [menu, setMenu] = useState<Category[]>([]);  
  const [searchLoading, setSearchLoading] = useState(false);

  const handleSearch = (query: string) => {
    setSearch(query);
  
    if (query.length < 3) {
      setSearchResults([]);
      return;
    }
  
    if (!menu || menu.length === 0) {
      setSearchResults([]);
      return;
    }
  
    setSearchLoading(true);
  
  
    const results = menu
      .map(category => {
  
        const matchingSubCategoriesAndItems = category.sub_categories.flatMap(subCategory => {
          const subCategoryMatch = subCategory.label.toLowerCase().includes(query.toLowerCase());
  
   
          const matchingItems = subCategory.items.filter(item =>
            item.full_label.toLowerCase().includes(query.toLowerCase())
          );
  
          
          return [
            ...(subCategoryMatch
              ? [{ type: "subcategory", label: subCategory.label, id: category.id }]
              : []),
            ...matchingItems.map(item => ({
              type: "item",
              label: item.full_label,
              id: category.id,
              itemId: item.id,
            })),
          ];
        });
  
        // ✅ Return only valid results (ignore empty ones)
        return matchingSubCategoriesAndItems.length > 0 ? matchingSubCategoriesAndItems : null;
      })
      .filter(result => result !== null) // Remove null values
      .flat(); // Flatten the final array
  
    console.log("Filtered Results:", results);
    setSearchResults(results);
    setSearchLoading(false);
  };
  

  useEffect(() => {
    if (menuData && Array.isArray(menuData)) {
      console.log("Setting menu data:", menuData);
      setMenu(menuData);
    }
  }, [menuData]);

  const handleOnTap = (id: number) => {
    setSearch('');
    setSearchResults([]);
    router.push(`/(app)/menu/menu?id=${id-1}`)
  }
  

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
      
      {/* Display search results or loading */}
      {searchLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FB7F3B" />
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      ) : searchResults.length > 0 && (
        <View style={styles.searchContainer}>
          {searchResults.map((result, index) => (
            <View key={index}>
              {result.type === 'subcategory' ? (
                <TouchableOpacity style={styles.itemCard} onPress={() => handleOnTap(result.id)}>
                  <Text style={styles.text}>{result.label}</Text>
                </TouchableOpacity>
              ) : result.type === 'item' ? (
                <TouchableOpacity style={styles.itemCard} onPress={() => handleOnTap(result.id)}>
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
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#FB7F3B",
    fontWeight: "bold",
  }
});
