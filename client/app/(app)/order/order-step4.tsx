import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import globalStyle from "../../../assets/styles/globalStyle";
import { useContext, useEffect, useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import location from "../../../data/location.json"
import { AppContext } from "@/app/context/AppContext";



export default function BranchesStep3() {
  //This is temporary data
  const branches = [
    { id: "1", branchName: "SM DAGUPAN CITY", province: "Pangasinan", city: "Dagupan", fullAddress: "M.H. Del Pilar &, Herrero Rd, Dagupan, 2400 Pangasinan", tags: ["CURRENTLY CLOSED", "ADVANCE ORDER"] },
    { id: "2", branchName: "SM CITY URDANETA", province: "Pangasinan", city: "Urdaneta", fullAddress: "2nd St, Urdaneta, Pangasinan", tags: ["ADVANCE ORDER"] },
    { id: "3", branchName: "CITYMALL SAN CARLOS", province: "Pangasinan", city: "San Carlos", fullAddress: "Bugallon St, cor Posadas St, San Carlos City, Pangasinan", tags: ["ADVANCE ORDER"] },
    { id: "4", branchName: "ROBINSONS PLACE LA UNION", province: "La Union", city: "San Fernando", fullAddress: "Brgy, MacArthur Hwy, San Fernando, La Union", tags: ["CURRENTLY CLOSED"] },
  ];

  const context = useContext(AppContext);
  if (!context) {
    return <Text>Error: AppContext is not available</Text>;
  }
  const { order, setOrder} = context;

  const [provinceOpen, setProvinceOpen] = useState<boolean>(false);
  const [province, setProvince] = useState<string | null>(null);
  const [provinceItems, setProvinceItems] = useState<{ label: string; value: string }[]>([]);

  const [cityOpen, setCityOpen] = useState<boolean>(false);
  const [city, setCity] = useState<string | null>(null);
  const [cityItems, setCityItems] = useState<{ label: string; value: string }[]>([]);

  // Initialize provincesItems with the data from provincesData
  useEffect(() => {
    const formattedProvinces = location.Luzon.provinces.map((province) => ({
      label: province.name,
      value: province.name,
    }));
    setProvinceItems(formattedProvinces);
  }, []);

  // Update the cityItems based on the selected province
  useEffect(() => {
    if (province) {
      const selectedProvince = location.Luzon.provinces.find((p) => p.name === province);
      if (selectedProvince) {
        const formattedCities = selectedProvince.cities.map((city) => ({
          label: city,
          value: city
        }));
        setCityItems(formattedCities);
        setCity(null); 
      }
    }
  }, [province]);

    // Filter branches based on selected province and city
    const filteredBranches = branches.filter((branch) => {
      const isProvinceMatch = province ? branch.province === province : true;
      const isCityMatch = city ? branch.city === city : true;
      return isProvinceMatch && isCityMatch;
    });
  
    const handleSelectedBranch = (item: object ) => {
      setOrder(prev => ({
        ...prev,
        branch: item,
      }));
    }

    useEffect(() => {
      console.log(order);
    },[handleSelectedBranch]);

  return (
    <View style={[globalStyle.container, { paddingHorizontal: "5%" }]}>
      <View style={dropdownStyles.dropdownMainContainer}>
          <DropDownPicker
            open={provinceOpen}
            value={province}
            items={provinceItems}
            setOpen={setProvinceOpen}
            setValue={setProvince}
            setItems={setProvinceItems}
            placeholder="PROVINCE"
            style={dropdownStyles.dropdown}
            dropDownContainerStyle={dropdownStyles.dropDownStyle} 
            textStyle={dropdownStyles.text}
            containerStyle={dropdownStyles.dropdownContainer}
            selectedItemContainerStyle={dropdownStyles.selectedItemContainerStyle} 
          />
          <DropDownPicker
            open={cityOpen}
            value={city}
            items={cityItems}
            setOpen={setCityOpen}
            setValue={setCity}
            setItems={setCityItems}
            placeholder="CITY"
            style={dropdownStyles.dropdown}
            dropDownContainerStyle={dropdownStyles.dropDownStyle}
            textStyle={dropdownStyles.text}
            containerStyle={dropdownStyles.dropdownContainer}
            selectedItemContainerStyle={dropdownStyles.selectedItemContainerStyle} 
          />
      </View>
    
 
      <FlatList
        data={filteredBranches}
        contentContainerStyle={{ flex: 1 }}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleSelectedBranch(item)}>
            <View style={styles.card}>
            <Text style={styles.branchName}>{item.branchName}</Text>
            <Text style={styles.address}>{item.fullAddress}</Text>
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
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>NO AVAILABLE BRANCH</Text>
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
    fontSize: 20, 
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
    paddingHorizontal: 10, 
    paddingVertical: 5, 
    borderRadius: 5,
    marginRight: 5,
    fontFamily: 'MadimiOne',
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#f2aa83',
    fontFamily: 'MadimiOne',
  },
});

const dropdownStyles = StyleSheet.create({
  dropdownMainContainer: {
    zIndex: 1000, 
    flexDirection: "row",
    justifyContent: "space-between",
    borderColor: "#FB7F3B",
    borderBottomWidth: 4,
    padding: "5%",
  },
  dropdown: {
    width: "100%",
    borderColor: "#FB7F3B",
    borderWidth: 3,
    borderRadius: 10,
    zIndex: 1000, 
  },
  // Text style for the dropdown (label/text when closed)
  text: {
    fontSize: 14,
    color: "#FB7F3B",
    fontFamily: 'MadimiOne',
  },
  // Style for the container around the dropdown
  dropdownContainer: {
    width: "48%",
    zIndex: 1000, 
  },
  dropDownStyle: {
    backgroundColor: "white", 
    borderWidth: 3,
    borderColor: "#FB7F3B",
    borderRadius: 10,
    maxHeight: 200, 
    zIndex: 1000, 
    position: "absolute", 
    borderTopWidth: 1
  },
  // Style for the selected item label (when it appears in the dropdown)
  selectedItemStyle: {
    fontWeight: "bold", 
    color: "#FB7F3B", 
    fontFamily: 'MadimiOne',
  },
  selectedItemContainerStyle: {
    backgroundColor: "#ffe3d4", 
  },

});