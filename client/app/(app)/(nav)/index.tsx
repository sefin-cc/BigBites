import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import globalStyle from "../../../assets/styles/globalStyle";
import { LinearGradient } from 'expo-linear-gradient';
import TitleDashed from "@/components/titledashed";
import ItemMenu from "@/components/itemmenu";

export default function Index() {

  return (
    <View style={globalStyle.container}>
      <LinearGradient
        // Background Linear Gradient
        colors={['transparent', '#C1272D']}
        style={styles.mainContainer}>

        <TouchableOpacity
          onPress={() =>{}}
          // disabled={isPosting}
          style={globalStyle.button}>
            <Text style={globalStyle.buttonText}>
                ORDER NOW!
            </Text>
        </TouchableOpacity>

      </LinearGradient>


      <ItemMenu name="TEST" />
      
      <View style={styles.contentContainer}>
      <TitleDashed title="BEST SELLERS" />
        
      </View>
   

    </View>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60
  },
  contentContainer: {
    flex: 1,
    margin: "5%"
  },

});

