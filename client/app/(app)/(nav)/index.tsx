import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import globalStyle from "../../../assets/styles/globalStyle";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import Slideshow from "@/components/slideShow";
import { useCallback, useContext, useEffect } from "react";
import { AppContext } from "@/app/context/AppContext";
import { useFocusEffect } from '@react-navigation/native';
import { BackHandler } from 'react-native';


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
    
    <View style={globalStyle.container}>
      <ScrollView>
        <LinearGradient
          colors={['transparent', '#C1272D']}
          style={styles.mainContainer}>
            
          <Image
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
        
      <View style={styles.contentContainer}>
        <Slideshow />
      </View>
     
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    justifyContent: "flex-end",
    alignItems: "center",
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    height: 520,
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

