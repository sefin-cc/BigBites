import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import globalStyle from "../../../assets/styles/globalStyle";
import { LinearGradient } from 'expo-linear-gradient';
import TitleDashed from "@/components/titledashed";
import MenuContainer from "@/components/menuContainer";
import { useRouter } from "expo-router";


export default function Index() {
  const router = useRouter();
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
            onPress={() =>{router.replace(`/order/order-type`);}}
            // disabled={isPosting}
            style={[globalStyle.button]}>
              <Text style={globalStyle.buttonText}>
                  ORDER NOW!
              </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
      
      <View style={styles.contentContainer}>
        <TitleDashed title="BEST SELLERS" />
        <MenuContainer />
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
    height: 450,
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

