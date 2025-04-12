import React from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import globalStyle from "../../../assets/styles/globalStyle";
import { useContext, useEffect, useRef, useState } from "react";
import { geocode } from 'opencage-api-client';
import { AppContext } from "@/app/context/AppContext";
import { router } from "expo-router";
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import Loading from "@/components/loading";
import Constants from 'expo-constants';
import { Portal, Snackbar } from "react-native-paper";
import { useGetBranchesQuery } from "../../../redux/feature/apiSlice";
import { WebView, WebViewMessageEvent } from "react-native-webview";

export default function MapLocationStep3() {
  const OPENCAGE_API_KEY = Constants.expoConfig?.extra?.OPENCAGE_API_KEY;
  const { data: branches, isLoading: branchLoading } = useGetBranchesQuery();
  const context = useContext(AppContext);
  if (!context) {
    return <Text>Error: AppContext is not available</Text>;
  }
  const { setOrder } = context;
  const [location, setLocation] = useState<string>('');  
  const [suggestions, setSuggestions] = useState<any[]>([]);  
  const [coordinates, setCoordinates] = useState<{ latitude: number, longitude: number } | null>(null);  
  const [region, setRegion] = useState<{ latitude: number, longitude: number, latitudeDelta: number, longitudeDelta: number } | null>(null); 
  const [isDraggable, setIsDraggable] = useState<boolean>(false);  
  const [savedLocation, setSavedLocation] = useState<{ description: string, latitude: number, longitude: number } | null>(null); 
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [townCity, setTownCity] = useState({ city: "", town: "" });
  const [visible, setVisible] = useState<boolean>(false);
  const webviewRef = useRef<WebView>(null);

  const generateLeafletMap = () => {
    const lat = region?.latitude || 0;
    const lng = region?.longitude || 0;

    return `
    <html>
    <head>
      <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
    </head>
    <body style="margin: 0; padding: 0;">
      <div id="map" style="width: 100%; height: 100%"></div>
      <script>
        var map = L.map('map').setView([${lat}, ${lng}], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
  
        var customIcon = L.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
           iconSize: [70, 114],  
          iconAnchor: [25, 82],
          popupAnchor: [0, -82]
        });
  
        var marker = L.marker([${lat}, ${lng}], {
          draggable: ${isDraggable},
          icon: customIcon
        }).addTo(map);
  
        marker.on('dragend', function (e) {
          var coords = e.target.getLatLng();
          window.ReactNativeWebView.postMessage(JSON.stringify({ latitude: coords.lat, longitude: coords.lng }));
        });
      </script>
    </body>
    </html>
  `;
  
  };

  const onWebViewMessage = (event: WebViewMessageEvent) => {
    const data = JSON.parse(event.nativeEvent.data);
    if (data.latitude && data.longitude) {
      setCoordinates({ latitude: data.latitude, longitude: data.longitude });
    }
  };

  const reverseGeocode = async (query: string) => {
    setIsLoading(true);
    try {
      const response = await geocode({ q: query, key: OPENCAGE_API_KEY });

      if (response.status.code === 200 && response.results.length > 0) {
        const result = response.results[0];
        setTownCity({ city: result.components.city, town: result.components.town });
        setSavedLocation({
          description: result.formatted,
          latitude: result.geometry.lat,
          longitude: result.geometry.lng
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }

    setIsDraggable(false);
  };

  const getUserLocation = async () => {
    setSuggestions([]);
    setIsLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }
      setPermissionGranted(true);

      const { coords } = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = coords;
      const query = latitude + ", " + longitude;
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setLocation(query);
    setIsDraggable(false);

    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await geocode({ q: query, key: OPENCAGE_API_KEY });

      if (response.status.code === 200 && response.results.length > 0) {
        const formattedSuggestions = response.results.map((result: any) => ({
          description: result.formatted,
          lat: result.geometry.lat,
          lng: result.geometry.lng,
          result: { city: result.components.city, town: result.components.town }
        }));
        setSuggestions(formattedSuggestions);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePlaceSelect = (place: any) => {
    setCoordinates({ latitude: place.lat, longitude: place.lng });
    setLocation(place.description);
    setSuggestions([]);
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
    setCoordinates({ latitude: newRegion.latitude, longitude: newRegion.longitude });
  };

  const handlePinLocationPress = async () => {
    if (coordinates) {
      setLocation('');
      const query = coordinates.latitude + ", " + coordinates.longitude;
      setRegion({
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      await reverseGeocode(query);
    }
  };

  const handleConfirm = () => {
    const isLocationAvailable = branches?.find(
      (branch) => branch.city === townCity.city || branch.city === townCity.town
    );

    if (isLocationAvailable) {
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

  const hideSnackbar = () => setVisible(false);

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        hideSnackbar();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  return (
    <View style={{ flex: 1, position: "relative" }}>
      <Portal>
        <Loading isLoading={isLoading} />
      </Portal>

      {/* Search Input */}
      <View style={{ flexDirection: "row", margin: 10 }}>
        <TextInput
          style={styles.input}
          value={location}
          placeholder="ENTER YOUR ADDRESS..."
          onChangeText={handleSearch}
        />
        <TouchableOpacity onPress={getUserLocation} style={{ padding: 5, justifyContent: "center", alignItems: "center" }}>
          <Ionicons size={28} name="locate" color="#C1272D" />
        </TouchableOpacity>
      </View>

      {/* Autosuggest Container */}
      {suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={suggestions}
            keyExtractor={(item, index) => item.place_id ? item.place_id.toString() : index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.suggestionItem} onPress={() => handlePlaceSelect(item)}>
                <Text style={{ fontFamily: 'MadimiOne', color: "#2C2C2C" }}>{item.description}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* MapView */}
      {region && (
        <View  style={{ flex: 3 }}>
          <WebView
            ref={webviewRef}
            originWhitelist={['*']}
            source={{ html: generateLeafletMap() }}
            style={{ flex: 1 }}
            onMessage={onWebViewMessage}
          />
        </View>
      )}

      {/* Save location buttons */}
      {
        region &&
        <View>
        {!isDraggable ? (
          <TouchableOpacity style={{ backgroundColor: "#FB7F3B", alignItems: 'center', paddingVertical: 7 }} onPress={() => setIsDraggable(true)}>
            <Text style={globalStyle.buttonText}>UPDATE LOCATION</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={{ backgroundColor: "#FB7F3B", alignItems: 'center', paddingVertical: 7 }} onPress={handlePinLocationPress}>
            <Text style={globalStyle.buttonText}>SAVE UPDATED LOCATION</Text>
          </TouchableOpacity>
        )}
      </View>
      }


      {/* Saved location */}
      {savedLocation ? (
        <View style={{ flex: 0.7, justifyContent: "center", alignItems: "center", padding: 10 }}>
          <Text style={{ fontFamily: 'MadimiOne', fontSize: 16, color: "#FB7F3B" }}>Pinned Location:</Text>
          <Text style={{ fontFamily: 'MadimiOne', fontSize: 16, color: "#2C2C2C" }}>
            {savedLocation?.description}
          </Text>
        </View>
      ) : (
        <View style={{ flex: 3, justifyContent: "center", alignItems: "center", padding: 10 }}>
          <Text style={{ fontFamily: 'MadimiOne', fontSize: 16, color: "#2C2C2C" }}>ENTER YOUR ADDRESS</Text>
        </View>
      )}

      {/* Confirm Button */}
      <View style={styles.confirmButtonContainer}>
        <TouchableOpacity
          style={[
            globalStyle.button,
            !savedLocation || savedLocation.description.trim() === '' ? { backgroundColor: '#6e6e6e' } : { backgroundColor: '#2C2C2C' }
          ]}
          onPress={handleConfirm}
          disabled={!savedLocation || savedLocation.description.trim() === ''}
        >
          <Text style={globalStyle.buttonText}>CONFIRM</Text>
        </TouchableOpacity>
      </View>

      {/* Snackbar for error */}
      <View style={{ bottom: 100 }}>
        <Snackbar
          visible={visible}
          onDismiss={hideSnackbar}
          duration={Snackbar.DURATION_LONG}
          style={{ backgroundColor: "#2C2C2C", borderRadius: 10 }}
        >
          <Text style={{ fontFamily: 'MadimiOne', alignSelf: "center", color: "white", fontSize: 16 }}>
            SORRY YOUR LOCATION IS NOT AVAILABLE!
          </Text>
        </Snackbar>
      </View>
    </View>
  );
}

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
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  confirmButtonContainer: {
    flex: 1,
    backgroundColor: 'white',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: "#dbdbdb"
  }
});
