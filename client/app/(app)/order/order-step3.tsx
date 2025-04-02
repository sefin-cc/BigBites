import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import globalStyle from "../../../assets/styles/globalStyle";
import MapView, { Marker } from 'react-native-maps';
import { useContext, useEffect, useState } from "react";
import { geocode } from 'opencage-api-client'; 
import { AppContext } from "@/app/context/AppContext";
import { router } from "expo-router";
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import Loading from "@/components/loading";

import Constants from 'expo-constants';
import { Snackbar } from "react-native-paper";
import { useGetBranchesQuery } from "../../../redux/feature/apiSlice";
import { Branch } from "@/types/clients";

export default function MapLocationStep3() {
  const OPENCAGE_API_KEY = Constants.expoConfig?.extra?.OPENCAGE_API_KEY;
  const { data: branches, isLoading: branchLoading } = useGetBranchesQuery();
  const context = useContext(AppContext);
  if (!context) {
    return <Text>Error: AppContext is not available</Text>;
  }
  const { setOrder} = context;
  const [location, setLocation] = useState<string>('');  // User input for search
  const [suggestions, setSuggestions] = useState<any[]>([]);  // Location suggestions
  const [coordinates, setCoordinates] = useState<{ latitude: number, longitude: number } | null>(null);  // Selected location coordinates
  const [region, setRegion] = useState<{ latitude: number, longitude: number, latitudeDelta: number, longitudeDelta: number } | null>(null); // Store region info
  const [isDraggable, setIsDraggable] = useState<boolean>(false);  
  const [savedLocation, setSavedLocation] = useState<{ description: string, latitude: number, longitude: number } | null>(null); 
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [townCity, setTownCity] = useState({city: "", town: ""});
  const [visible, setVisible] = useState<boolean>(false);
  
  const reverseGeocode = async (query: string) =>{
    setIsLoading(true);
    try {
      const response = await geocode({ q: query, key: OPENCAGE_API_KEY });

      if (response.status.code === 200 && response.results.length > 0) {
        const result = response.results[0];
        setTownCity({ city: result.components.city , town: result.components.town});
        // Set location suggestions
        setSavedLocation({
          description: result.formatted,
          latitude: result.geometry.lat,
          longitude: result.geometry.lng
        });  
      } else {
     //   setError('Something went wrong.');
      }
    } catch (err) {
   //   setError('An error occurred while fetching results.');
      console.error(err);  
    }finally{
      setIsLoading(false);
    }
    
    setIsDraggable(false);
  }
  

  // Request location permission and get user location
  const getUserLocation = async () => {
    setSuggestions([]); 
    setIsLoading(true);
    try {
      // Request permission to access location
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }
      setPermissionGranted(true);

      // Get current position using expo-location
      const { coords } = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = coords;
      const query = latitude+", "+longitude;
      setLocation('');
      setCoordinates({ latitude, longitude });                  
      setRegion({
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }); 
      await reverseGeocode(query);
    } catch (err) {
  
      console.error(err);
    }finally{
      setIsLoading(false);
    }
  };

  // Fetch suggestions based on search input
  const handleSearch = async (query: string) => {
    setLocation(query);  // Update the search query
    // setError('');  
    setIsDraggable(false);

    // Don't show suggestions if query length is less than 3
    if (query.length < 3) {
      setSuggestions([]); 
      return;
    }

    try {

      const response = await geocode({ q: query, key: OPENCAGE_API_KEY });

      if (response.status.code === 200 && response.results.length > 0) {
  
        // Map OpenCage results to suggestions
        const formattedSuggestions = response.results.map((result: any) => ({
          description: result.formatted,
          lat: result.geometry.lat,
          lng: result.geometry.lng,
          result: { city: result.components.city, town: result.components.town}
        }));
        // Set location suggestions
        setSuggestions(formattedSuggestions);  
      } else {
        // setError('No results found.');
      }
    } catch (err) {
     // setError('An error occurred while fetching results.');
      console.error(err);  
    }
  };

  // Handle selecting a place from the suggestions
  const handlePlaceSelect = (place: any) => {
    setCoordinates({ latitude: place.lat, longitude: place.lng });  // Set the selected coordinates
    setLocation(place.description);  // Set the search input field to the selected place
    setSuggestions([]);  // Clear suggestions
    setRegion({
      latitude: place.lat,
      longitude: place.lng,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }); 
    setSavedLocation({
      description: place.description,
      latitude: place.lat,
      longitude: place.lng,
    }); 
    setTownCity(place.result);
  };

  const handlePinLocation = (newRegion: any) => {
    setCoordinates({ latitude: newRegion.latitude, longitude: newRegion.longitude }); // Update the coordinates when region changes
  };

  const handlePinLocationPress  = async () => {
    if (coordinates) {
      setLocation('');
      const query = coordinates.latitude+", "+coordinates.longitude;
      setRegion({
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }); // Manually change the region to the selected coordinates when button is pressed
      
      await reverseGeocode(query);
  };
  }
 
  const handleConfirm = () => {
    // Find a branch with a matching city or town from the selected location
    const isLocationAvailable = branches?.find(
      (branch) => branch.city === townCity.city || branch.city === townCity.town
    );

    if (isLocationAvailable) {
      // If a branch is found, save the location and navigate
      setOrder((prev) => ({
        ...prev,
        location: savedLocation,
        branch: [isLocationAvailable],
      }));
      router.push("/(app)/menu/menu-categories");
    } else {
      setVisible(true);
    }
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
    <View style={{ flex: 1, position: "relative" }}>
      <Loading isLoading={isLoading} />
      {/* Search Input */}
      <View style={{ flexDirection: "row", margin: 10 }}>
        <TextInput
          style={styles.input}
          value={location}
          placeholder="ENTER YOU ADDRESS..."
          onChangeText={handleSearch}  
        />
        <TouchableOpacity 
          onPress={ () =>getUserLocation()}
          style ={{padding: 5, justifyContent: "center", alignItems: "center"}}
        >
          <Ionicons size={28} name="locate"  color="#C1272D" />
        </TouchableOpacity>
         
      </View>


      {/* Autosuggest Container */}
      {suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={suggestions}
            keyExtractor={(item, index) => {
              // Use place_id if available, otherwise use index as a fallback
              return item.place_id ? item.place_id.toString() : index.toString();
            }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => handlePlaceSelect(item)}
              >
                <Text style={{  fontFamily: 'MadimiOne', color: "#2C2C2C"}}>{item.description}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* MapView */}
      {region && (
        <MapView
            style={{ flex: 3}}
            region={region}
            onRegionChangeComplete={handlePinLocation}
        >
          {/* Add a marker at the selected location */}
          <Marker
         
            coordinate={{
              latitude: !isDraggable ? region?.latitude : coordinates?.latitude || 0,
              longitude: !isDraggable ? region?.longitude : coordinates?.longitude || 0,
            }}
            title={location}
            description={`Latitude: ${region?.latitude}, Longitude: ${region?.longitude}`}
          />
        </MapView>
      )}


      {
        region &&
        <View>
          {
            !isDraggable ? 
            <TouchableOpacity style={ {backgroundColor: "#FB7F3B",alignItems: 'center',paddingVertical: 7}} onPress={() => setIsDraggable(true)}>
              <Text style={globalStyle.buttonText}>UPDATE LOCATION</Text>
            </TouchableOpacity> :
            <TouchableOpacity style={{backgroundColor: "#FB7F3B",alignItems: 'center',paddingVertical: 7}} onPress={handlePinLocationPress}>
              <Text style={globalStyle.buttonText}>SAVE UPDATED LOCATION</Text>
            </TouchableOpacity>
          }
        </View>
      }


      <View style={{flex: 1, justifyContent: "center", alignItems: "center", padding: 10}}>
        <View>
          <Text style={{
              fontFamily: 'MadimiOne',
              fontSize: 16,
              color:"#FB7F3B"
            }}>
              {savedLocation?.description ? "Pinned Location:" : ""}
            </Text>
            <Text style={{
              fontFamily: 'MadimiOne',
              fontSize: 16,
              color:"#2C2C2C"
            }}>

              {savedLocation?.description || "ENTER YOUR ADDRESS"}
            </Text>
        </View>
      </View>
      
      <View style={{
        backgroundColor: 'white', 
        paddingVertical: 20,
        borderTopWidth: 1,
        borderColor: "#dbdbdb"
      }}>
          <TouchableOpacity 
            style={[
              globalStyle.button,
              !savedLocation || savedLocation.description.trim() === '' 
                ? { backgroundColor: '#6e6e6e' }  // Disable state color (e.g., gray)
                : { backgroundColor: '#2C2C2C' }  // Active state color (e.g., blue)
            ]}
            onPress={handleConfirm}  
            disabled={!savedLocation || savedLocation.description.trim() === ''}>
            <Text style={globalStyle.buttonText}>CONFIRM</Text>
          </TouchableOpacity>
        </View>
        <View style={{bottom: 100}}>
          <Snackbar
            visible={visible}
            onDismiss={hideSnackbar}
            duration={Snackbar.DURATION_LONG} 
            style={{  
              backgroundColor:"#2C2C2C",
              borderRadius: 10,    
              zIndex: 10000,     
            }}
          >
            <Text style={{fontFamily: 'MadimiOne', alignSelf:"center", color: "white", fontSize: 16}}> SORRY YOUR LOCATION IS NOT AVAILABLE!</Text>
          </Snackbar>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 45,
    borderColor: '#C1272D',
    borderWidth: 2,
    paddingLeft: 10,
    borderRadius: 5,
    fontFamily: 'MadimiOne',
    color: "#2C2C2C",
    flexGrow: 1
  },
  error: {
    color: 'red',
    textAlign: 'center',
    margin: 10,
    fontFamily: 'MadimiOne'
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 60,  
    left: 10,
    right: 10,
    maxHeight: 300,
    backgroundColor: 'white',
    zIndex: 1000,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    fontFamily: 'MadimiOne'
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    fontFamily: 'MadimiOne'
  },
});
