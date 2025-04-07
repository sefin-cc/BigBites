

import { useRouter } from "expo-router";
import React from "react";
import { Text, View, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar,TextInput, Image, ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from 'react-native-animatable';

export default function Choose() {
  const router = useRouter();

  return (
  
  <ImageBackground source={require('../../assets/images/BG.png')} resizeMode="cover" style={styles.container}>
    <LinearGradient
      colors={['transparent', '#C1272D']}
      style={{flex: 1, justifyContent: "flex-end", padding: 20}}>
      
        <Animatable.Image
          animation="tada" 
          easing="ease-in-out"
          style={[styles.image]}
          source={require('../../assets/images/home.png')}
        />
  
        <Animatable.View animation="fadeInDown"   easing="ease-in-out">
          <Image
            style={styles.logo}
            source={require('../../assets/images/logo.png')}
          />

          <SafeAreaView style={{backgroundColor: "white",  padding: 20, borderRadius: 10, justifyContent: "center"}} >  
            <View>
                <TouchableOpacity onPress={() =>{router.push("/auth/login");}} style={styles.btn}>
                  <Text style={styles.btnText}>LOGIN</Text>
                </TouchableOpacity>
              </View>

              <View style={{marginTop:20}}>
                <TouchableOpacity onPress={() =>{router.push("/auth/register");}} style={styles.btn}>
                  <Text style={styles.btnText}>REGISTER</Text>
                </TouchableOpacity>
              </View>
          </SafeAreaView>
        </Animatable.View>
        

      </LinearGradient>
    </ImageBackground>
    
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
 
    backgroundColor: "#FB7F3B",
    textAlign: "center",
  },

  btnText: {
    fontSize: 20,
    color: "white",
    fontFamily: 'MadimiOne',
  }, 
  btn: {
    backgroundColor: "#2C2C2C",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    flexDirection: "row",
    gap: 10
  },
  logo:{
    width: "auto", 
    height: 100,
    aspectRatio: 1,
    resizeMode: 'contain',
    marginBottom: 10 ,
    alignSelf: "center",
    top: 20
  },
  image:{
    width: "auto", 
    height: 400,
    aspectRatio: 1,
    resizeMode: 'contain',
    alignSelf: "center",
    top: 50
  },
});