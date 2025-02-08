import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, Dimensions, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

const { width, height } = Dimensions.get('window');

const images = [
  { id: 1, uri: 'https://pbs.twimg.com/media/EZL87HLWoAAEepO?format=jpg&name=4096x4096' },
  { id: 2, uri: 'https://smartcanucks.ca/wp-content/uploads/2024/08/Screenshot-2024-08-30-at-12.35.02%E2%80%AFAM-500x252.png' },
];

export default function Slideshow() {
    const router = useRouter();
    const [activeIndex, setActiveIndex] = useState(0);

  return (
    <View style={styles.container}>
      <Carousel
        loop
        autoPlayInterval={3000}
        width={width}
        height={height * 0.2}
        autoPlay={true} 
        data={images}
        renderItem={({ index, item }) => (
            <TouchableOpacity onPress={() => router.push("/(app)/menu/menu-featured")}>
                <View style={styles.slide}>
                    <Image source={{ uri: item.uri }} style={styles.image} />
                </View>
            </TouchableOpacity>
        )}
        onSnapToItem={(index) => setActiveIndex(index)}
      />

      <View style={styles.indicatorContainer}>
        {images.map((_, index) => (
          <Text
            key={index}
            style={[
              styles.indicator,
              activeIndex === index && styles.activeIndicator,
            ]}
          >
            ●
          </Text>
        ))}
      </View>

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
