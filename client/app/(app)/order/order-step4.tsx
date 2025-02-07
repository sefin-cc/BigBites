import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import globalStyle from "../../../assets/styles/globalStyle";
import { useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";


export default function BranchesStep3() {
  const branches = [
    { id: "1", branchName: "SM DAGUPAN CITY", address: "M.H. Del Pilar &, Herrero Rd, Dagupan, 2400 Pangasinan", tags: ["CURRENTLY CLOSED", "ADVANCE ORDER"] },
    { id: "2", branchName: "SM MANILA", address: "San Marcelino St, Ermita, Manila, 1000 Metro Manila", tags: ["ADVANCE ORDER"] },
    { id: "3", branchName: "SM DAGUPAN CITY", address: "M.H. Del Pilar &, Herrero Rd, Dagupan, 2400 Pangasinan", tags: ["CURRENTLY CLOSED", "ADVANCE ORDER"] },
    { id: "4", branchName: "SM DAGUPAN CITY", address: "M.H. Del Pilar &, Herrero Rd, Dagupan, 2400 Pangasinan", tags: ["CURRENTLY CLOSED", "ADVANCE ORDER"] },
  ];
  const [provinceOpen, setProvinceOpen] = useState(false);
  const [province, setProvince] = useState(null);
  const [provinceItems, setProvinceItems] = useState([
    { label: "Pangasinan", value: "pangasinan" },
    { label: "Ilocos Norte", value: "ilocos_norte" },
  ]);

  const [cityOpen, setCityOpen] = useState(false);
  const [city, setCity] = useState(null);
  const [cityItems, setCityItems] = useState([
    { label: "Dagupan", value: "dagupan" },
    { label: "Laoag", value: "laoag" },
  ]);
  return (
    <View style={[globalStyle.container, { paddingHorizontal: "5%"}]}>
      <FlatList
        data={branches}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.branchName}>{item.branchName}</Text>
            <Text style={styles.address}>{item.address}</Text>
            <View style={styles.tagContainer}>
              {item.tags.map((tag, index) => (
                <Text 
                  key={index} 
                  style={[
                    styles.tag, 
                    { backgroundColor: tag === "CURRENTLY CLOSED" ? "#C1272D" : "#FB7F3B" }
                  ]}
                >
                  {tag}
                </Text>
              ))}
            </View>
          </View>
        )}
        ListHeaderComponent={
          <View style={{ borderBottomWidth: 4, borderColor: "#FB7F3B", flexDirection: "row", width:200, backgroundColor: "black",
            paddingVertical: 10,}}>
             <DropDownPicker
                open={provinceOpen}
                value={province}
                items={provinceItems}
                setOpen={setProvinceOpen}
                setValue={setProvince}
                setItems={setProvinceItems}
                placeholder="PROVINCE"
                style={dropdownStyle.dropdown}
                textStyle={dropdownStyle.text}
              />
              <DropDownPicker
                open={cityOpen}
                value={city}
                items={cityItems}
                setOpen={setCityOpen}
                setValue={setCity}
                setItems={setCityItems}
                placeholder="CITY"
                style={dropdownStyle.dropdown}
                textStyle={dropdownStyle.text}
              />
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 15, 
    borderBottomWidth: 4, 
    borderColor: "#FB7F3B",
   
  },
  branchName: { 
    fontSize: 24, 
    fontWeight: "bold", 
    color: "#2C2C2C",
    fontFamily: 'MadimiOne',
  },
  address: { 
    fontSize: 14, 
    color: "#FB7F3B", 
    fontFamily: 'MadimiOne',
  },
  tagContainer: { 
    flexDirection: "row", 
    marginTop: 10, 
    flexWrap: "wrap" 
  },
  tag: { 
    color: "white", 
    padding: 5, 
    borderRadius: 5,
    marginRight: 5,
    fontFamily: 'MadimiOne',
  },
});

const dropdownStyle = StyleSheet.create({
  dropdown: {
    flex: 1,  
    marginHorizontal: 5, 
    width: "48%", 
    borderColor: "#FB7F3B",
    borderWidth: 3,
    borderRadius: 10,
    fontFamily: 'MadimiOne',
  },
  text: {
    fontSize: 14,
    color: "#FB7F3B",
    fontFamily: 'MadimiOne',
  },
});