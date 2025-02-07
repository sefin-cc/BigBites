import React from 'react';
import { View, ImageBackground, StyleSheet } from 'react-native';
import Svg, { Text } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';

const DATA = [
  { id: '1', name: 'Item 1', image: require('../assets/images/fries.jpg') },
  { id: '2', name: 'Item 2', image: require('../assets/images/fries.jpg') },
  { id: '3', name: 'Item 3', image: require('../assets/images/fries.jpg') },
  { id: '4', name: 'Item 4', image: require('../assets/images/fries.jpg') },
];

export default function MenuContainer() {
  return (
    <View style={styles.grid}>
      {DATA.map((item) => (
        <View key={item.id} style={styles.card}>
          <ImageBackground 
            source={item.image}
            style={styles.image} 
            imageStyle={styles.imageStyle} 
            resizeMode="contain"
          >
            <LinearGradient
              colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0)']}
              start={{ x: 0, y: 1 }}
              end={{ x: 0, y: 0 }}
              style={styles.gradient} 
            />



            {/* Text (Above Gradient) */}
            <View style={styles.textContainer}>
              <Svg height="45" width="100%">
                <Text
                  fill="#C1272D"
                  stroke="#FFEEE5"
                  fontSize="30"
                  fontFamily="MadimiOne"
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  strokeWidth="1"
                  strokeLinejoin="round"
                >
                  {item.name}
                </Text>
              </Svg>
            </View>
          </ImageBackground>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly', 
    
  },
  card: {
    width: '45%', 
    aspectRatio: 1, 
    marginBottom: 10,
    overflow: 'hidden', 
    borderRadius: 25,
    borderWidth: 4,
    borderColor: "#C1272D"

  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
    justifyContent: 'flex-end',
  },
  imageStyle: {
    borderRadius: 20, 
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
  },
  textContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});
