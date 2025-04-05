// App.js or WebViewScreen.js
import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { AppContext } from '../context/AppContext';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { BackHandler } from 'react-native';

const PaymentScreen = () => {
    const context = useContext(AppContext);
    if (!context) {
        return <Text>Error: AppContext is not available</Text>;
    }
    const { order } = context;
    const [paymentUrl, setPaymentUrl] = useState<string>(); 

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => true; 
        
            BackHandler.addEventListener('hardwareBackPress', onBackPress);
        
            return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [])
        );

    useEffect(() =>{
        if(order.paymentUrl){
            setPaymentUrl(order.paymentUrl);
        }else{
            router.back(); 
        }
    },[])

    return (
        <View style={styles.container}>
            {
                paymentUrl &&
                <WebView 
                    source={{ uri: paymentUrl }} 
                    style={{ flex: 1}} 
                />
            }
            
        </View> 
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 100,
    backgroundColor: "#fff"
  },
});

export default PaymentScreen;
