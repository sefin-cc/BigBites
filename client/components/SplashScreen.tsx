import React, { useEffect, useState } from 'react';
import { StyleSheet, Animated, Dimensions, View, StatusBar } from 'react-native';
import { Image } from 'expo-image'; 
import * as Animatable from 'react-native-animatable';
import * as SplashScreens from 'expo-splash-screen';

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
    const [circleSize] = useState(new Animated.Value(0));  
    const [bgColor] = useState(new Animated.Value(0));  
    const [show, setShow] = useState(false);
    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;
    const maxCircleSize = (Math.sqrt(Math.pow(screenWidth, 2) + Math.pow(screenHeight, 2)) * 2) + 50;

    useEffect(() => {
      SplashScreens.preventAutoHideAsync();
      StatusBar.setHidden(true);
      Animated.sequence([
        Animated.timing(bgColor, {
          toValue: 1, 
          duration: 500,
          useNativeDriver: false, 
        }),
        Animated.timing(circleSize, {
          toValue: maxCircleSize, 
          duration: 1000,
          useNativeDriver: false, 
          delay: 5500
        }),
    ]).start();

    const playGif = setTimeout(() => {
        setShow(true);
      }, 2000);
      const hideGif = setTimeout(() => {
        setShow(false);
      }, 7500); 
    const timer = setTimeout(() => {
      StatusBar.setHidden(false);
      onFinish();
    }, 8500);

    return () => {
        clearTimeout(timer);
        clearTimeout(playGif);
        clearTimeout(hideGif);
    };
  }, [bgColor, onFinish]);

  // Interpolating background color based on bgColor value
  const backgroundColor = bgColor.interpolate({
    inputRange: [0, 1],
    outputRange: ['#C1272D', '#ffffff'],  
  });

  return (
    <View style={{flex: 1}}>

      <Animatable.View 
        animation="fadeOut"
        duration={300}
        delay={8000}
        style={[styles.circle, {
          width: circleSize,
          height: circleSize,
          borderRadius: Animated.divide(circleSize, 2),
          left: Animated.multiply(Animated.divide(circleSize, 2), -1),
          top: Animated.multiply(Animated.divide(circleSize, 2), -1),
       }]}/>

      <Animated.View style={[styles.container, { backgroundColor }]}>
        {
          show &&
          <Image
          source={require('../assets/images/bigbites.gif')}
          style={styles.logo}
          contentFit="contain"
          />
        }
      </Animated.View>

    </View>
    
  );
}
const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    backgroundColor: "#FB7F3B",
    position: "absolute",
    zIndex: 999,
  },
    
  logo: {
    width: screenWidth,
    height: undefined,
    aspectRatio: 1, 
  },
});
