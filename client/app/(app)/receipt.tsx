
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { AppContext } from '../context/AppContext';
import { router } from 'expo-router';
import globalStyle from '@/assets/styles/globalStyle';
import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import { View as ViewComponent } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { Snackbar } from 'react-native-paper';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useFocusEffect } from '@react-navigation/native';
import { BackHandler } from 'react-native';


const ReceiptScreen = () => {
    const context = useContext(AppContext);
    if (!context) {
        return <Text>Error: AppContext is not available</Text>;
    }
    const { order, resetOrder } = context;
    const viewRef = useRef<ViewComponent | null>(null);
    const [hasPermission, setHasPermission] = useState(false);
    const [visible, setVisible] = useState<boolean>(false);

    useFocusEffect(
        useCallback(() => {
          const onBackPress = () => true; 
      
          BackHandler.addEventListener('hardwareBackPress', onBackPress);
      
          return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [])
      );

    useEffect(() => {
        (async () => {
          const { status } = await MediaLibrary.requestPermissionsAsync();
          setHasPermission(status === 'granted');
        })();
      }, []);

    const handleReturnHome = () => {
        resetOrder();
        router.replace("/(app)/(nav)");
    }

    const handleCapture = async () => {
        if (!viewRef.current) return;
    
        try {
          const uri = await captureRef(viewRef, {
            format: 'png',
            quality: 1,
          });
    
          const asset = await MediaLibrary.createAssetAsync(uri);
          await MediaLibrary.createAlbumAsync('Screenshots', asset, false);
          setVisible(true);
        } catch (error) {
          console.error('Capture failed:', error);
        }
      };

      const hideSnackbar = () => setVisible(false);
      
          useEffect(() => {
            if (visible) {
              const timer = setTimeout(() => {
                hideSnackbar(); 
              }, 3000);
        
              // Cleanup timer on component unmount or when visible changes
              return () => clearTimeout(timer);
            }
          }, [visible]); 

    return (
        <View style={styles.container}>
            <Snackbar
                visible={visible}
                onDismiss={hideSnackbar}
                duration={Snackbar.DURATION_LONG} 
                style={{
                    position: "absolute",    
                    bottom: 20,       
                    backgroundColor:"#2C2C2C",
                    borderRadius: 10,    
                    zIndex: 10000,     
                }}
                >
                <Text style={{fontFamily: 'MadimiOne', alignSelf:"center", color: "white", fontSize: 16}}> <FontAwesome6 name="check" size={16} color="white" />   SAVED TO GALLERY!</Text>
            </Snackbar>

            <TouchableOpacity
                onPress={() =>{handleCapture()}}
                style={{alignSelf: "flex-end", marginRight: 40, padding:4 }}
            >
                <Feather name="download" size={30} color="white" />
            </TouchableOpacity>

            <View  ref={viewRef} style={styles.capture} collapsable={false}>
                <Image style={styles.logo} source={require('../../assets/images/logo.png')} />
                <Text style={[styles.text, {fontSize: 16, color: "#fff", textAlign:"center", paddingBottom: 10}]}>Please present this receipt to the counter or to the delivery person.</Text>
                
                <View style={styles.card}>
                    <View style={styles.innerCard}>
                        <Text style={[styles.text, {fontSize: 50 }]}>#{order.orderNumber}</Text>
                        <Text style={[styles.text, {fontSize: 16, paddingBottom: 20}]}>REF #{order.reference_number}</Text>

                        <View style={{ borderBottomWidth: 3,  borderColor: '#f2aa83', width: "100%", borderStyle: 'dashed' }}></View>
                        <Text style={[styles.text, {fontSize: 30}]}> PHP {order.fees.grandTotal?.toFixed(2)}</Text>
                        <View style={{ borderBottomWidth: 3,  borderColor: '#f2aa83', width: "100%", borderStyle: 'dashed' }}></View>
                
                        <Text style={[styles.text, {fontSize: 16, paddingTop: 20, color: "#727272"}]}> {order.branch?.[0]?.branchName ?? 'No Branch'}</Text>
                        <Text style={[styles.text, {fontSize: 13 , color: "#727272"}]}>
                            {new Date(order.orderCreated).toLocaleString('en-GB', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false,
                            timeZone: 'Asia/Manila', 
                            }).replace(',', '')}
                        </Text>
                    </View>
                </View>
            </View>
            


            <TouchableOpacity
                onPress={() =>{handleReturnHome()}}
                style={[globalStyle.button, { width: "80%" , marginTop: 20}]}
                >
                <Text style={globalStyle.buttonText}>RETURN TO HOME</Text>
            </TouchableOpacity>


        </View> 
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FB7F3B",
        justifyContent: "center",
        alignItems: "center",
    },
    capture:{
        justifyContent: "center",
        alignItems: "center",
        padding: 35,
        width: "100%",
        backgroundColor: "#FB7F3B",
    },
    logo: {
        width: "auto",
        height: 70,
        aspectRatio: 1,
        resizeMode: 'contain',
    },
    text: {
        fontFamily: 'MadimiOne',
        color: '#3e3e3e',
    },
    card:{
        backgroundColor:"#FFEEE5",
        width: "100%",
        borderRadius:20,
        padding: 20,
    },
    innerCard:{
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 4,
        borderRadius: 16,
        padding: 20,
        borderColor: "#FB7F3B",
    }
});

export default ReceiptScreen;
