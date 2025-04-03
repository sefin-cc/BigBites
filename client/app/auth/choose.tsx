

import { useRouter } from "expo-router";
import React, { useContext } from "react";
import { useState } from "react";
import { Text, View, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar,TextInput, Image } from "react-native";
import { Checkbox } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";


export default function Choose() {
  const router = useRouter();

  return (
    <View style={styles.container}>

       
            
    <Image
    style={[styles.image]}
    source={require('../../assets/images/home.png')}
    />
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
    </View>
    
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: "5%",
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