import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import globalStyle from "../../../assets/styles/globalStyle";
import { useState } from "react";
import Feather from '@expo/vector-icons/Feather';
import Slideshow from "@/components/slideShow";
import CategoriesItems from "@/components/categoriesItems";

export default function Categories() {
  const [search, setSearch] = useState<string>(''); 
  const handleSearch = async (query: string) => {
    setSearch(query);
  }

  return (
    <View style={[globalStyle.container, {paddingTop: 0}]}>

        <View style={{padding: 10, justifyContent: "center",backgroundColor: "#C1272D"}}>
          <TextInput
            style={styles.input}
            value={search}
            placeholder="SEARCH..."
            onChangeText={handleSearch}  
          />
          <Feather size={23} name="search"  color="#C1272D"  style={{position: "absolute", right: 20}}/>
        </View>
  
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
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 45,
    backgroundColor: "white",
    borderColor: '#C1272D',
    borderWidth: 2,
    paddingLeft: 10,
    borderRadius: 5,
    fontFamily: 'MadimiOne',
    color: "#2C2C2C",
    flexGrow: 1
  },
  featuredContainer: {
    padding: "5%",
    backgroundColor: "#C1272D"
  },
  contentContainer: {
    margin: "5%"
  }
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

