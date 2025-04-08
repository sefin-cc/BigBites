import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import globalStyle from "../../../assets/styles/globalStyle";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import Slideshow from "@/components/slideShow";
import { useCallback, useContext, useEffect } from "react";
import { AppContext } from "@/app/context/AppContext";
import { useFocusEffect } from '@react-navigation/native';
import { BackHandler } from 'react-native';
import TitleDashed from "@/components/titledashed";
import * as Animatable from 'react-native-animatable';

export default function Index() {
  const context = useContext(AppContext);
  if (!context) {
      return <Text>Error: AppContext is not available</Text>;
  }
  const { resetOrder } = context;
  const router = useRouter();

  useEffect(() => {
    resetOrder();
  },[]);

  useFocusEffect(
    useCallback(() => {
        const onBackPress = () => true; 
        BackHandler.addEventListener('hardwareBackPress', onBackPress);
    
        return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );

  return (
    
    <Animatable.View animation="fadeIn" style={globalStyle.container}>
      <ScrollView>
        <Animatable.View animation="slideInDown" easing="ease-in-out">
          <LinearGradient
            colors={['#f2aa83', '#C1272D']}
            style={styles.mainContainer}>
              
            <Animatable.Image
              animation="tada" 
              easing="ease-in-out"
              style={[styles.image]}
              source={require('../../../assets/images/home.png')}
            />

            <View style={{justifyContent: "center", alignItems: "center"}}>
              <Image
                style={styles.logo}
                source={require('../../../assets/images/logo.png')}
              />
              <TouchableOpacity
                onPress={() =>{router.push(`/order/order-type`);}}
                // disabled={isPosting}
                style={[globalStyle.button]}>
                  <Text style={globalStyle.buttonText}>
                      ORDER NOW!
                  </Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animatable.View>
        
        
      <View style={styles.contentContainer}>
        <TitleDashed title={"PROMOS"} />
        <Slideshow />
      </View>
     
      </ScrollView>
    </Animatable.View>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    justifyContent: "flex-end",
    alignItems: "center",
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    height: 500,
    padding: "5%"
  },
  contentContainer: {
    margin: "5%",
    gap: 15
  },
  image:{
    width: "auto", 
    height: 400,
    aspectRatio: 1,
    resizeMode: 'contain',
    position: "absolute", 
  },
  logo:{
    width: "auto", 
    height: 70,
    aspectRatio: 1,
    resizeMode: 'contain',
    position: "absolute", 
    top: -60
  }
});

