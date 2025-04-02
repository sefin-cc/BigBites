import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, Dimensions, Image, StyleSheet, ActivityIndicator } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { useGetPromosQuery } from "../redux/feature/apiSlice";

const { width, height } = Dimensions.get('window');

export default function Slideshow() {
    const [activeIndex, setActiveIndex] = useState(0);
    const { data: promos, isLoading } = useGetPromosQuery();

    return (
      <View style={styles.container}>
        {/* Show Loader When Data is Loading */}
        {isLoading ? (
          <View style={{ height: 150, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator animating={isLoading} color={"#FB7F3B"} size="large" />
          </View>
        ) : promos && promos.length > 0 ? (
          <>
            <Carousel
              loop
              autoPlayInterval={3000}
              width={width}
              height={height * 0.2}
              autoPlay
              data={promos}
              renderItem={({ index, item }) => (
                <View style={styles.slide}>
                  <Image source={{ uri: item?.image }} style={styles.image} />
                </View>
              )}
              onSnapToItem={(index) => setActiveIndex(index)}
            />
    
            {/* Dots Indicator */}
            <View style={styles.indicatorContainer}>
              {promos.map((_, index) => (
                <Text
                  key={index}
                  style={[styles.indicator, activeIndex === index && styles.activeIndicator]}
                >
                  ●
                </Text>
              ))}
            </View>
          </>
        ) : (
          <Text style={{ textAlign: "center", marginTop: 20 }}>No promos available</Text>
        )}
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slide: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  image: {
    width: width * 0.8,
    height: height * 0.2,
    borderRadius: 10,
    borderWidth: 4,
    borderColor: "#C1272D"
  },
  indicatorContainer: {
    zIndex: 1000,
    position: "absolute",
    flexDirection: 'row',
    bottom: 3
  },
  indicator: {
    fontSize: 20,
    color: '#B0B0B0',
    margin: 3,
  },
  activeIndicator: {
    color: '#FF6347', // Active indicator color
  },
});
