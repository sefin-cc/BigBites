import React, { useContext, useEffect, useState, useCallback, useRef } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFocusEffect } from '@react-navigation/native';
import { router, useLocalSearchParams } from 'expo-router';

import { AppContext } from '../context/AppContext';
import globalStyle from '@/assets/styles/globalStyle';

import { useCreateOrderMutation } from '@/redux/feature/ordersApi';
import {
  useCreatePaymentLinkMutation,
  useGetPaymentLinkByReferenceQuery,
} from '@/redux/feature/paymentSlice';
import { useGetProfileQuery } from '@/redux/feature/auth/clientApiSlice';

const VerificationScreen = () => {
  const context = useContext(AppContext);
  if (!context) return <Text>Error: AppContext not available</Text>;

  const { order, setOrder } = context;
  const { ts } = useLocalSearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);

  const [createOrder] = useCreateOrderMutation();
  const [createPaymentLink, { isLoading: linkLoading }] = useCreatePaymentLinkMutation();
  const { data: user } = useGetProfileQuery();

  const {
    data: paymentStatusData,
    isFetching,
    refetch,
  } = useGetPaymentLinkByReferenceQuery(order?.reference_number, {
    skip: !order?.reference_number,
    pollingInterval: 0, 
  });

  const isPlacingOrderRef = useRef(false);
  const hasCheckedRef = useRef(false);

  // Trigger refetch if reference_number changes
  useEffect(() => {
    if (order?.reference_number) {
      console.log("Effect: Triggering refetch because reference_number is available.");
      setTimeout(() => {
          refetch();
      }, 4000);
    }
  }, [order?.reference_number]);

  // Refetch on screen focus
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      if (order?.reference_number && isActive) {
        console.log("useFocusEffect: Refetching payment status...");
        hasCheckedRef.current = false;
        setIsLoading(true);

        setTimeout(() => {
          if (isActive) {
            refetch();
          }
        }, 4000);
      }

      return () => {
        isActive = false;
        setIsFailed(false);
        setIsSuccessful(false);
        setIsLoading(false);
        hasCheckedRef.current = false;
      };
    }, [order?.reference_number, ts])
  );

  useEffect(() => {
    const checkVerification = async () => {
      if (!paymentStatusData || hasCheckedRef.current) return;
      hasCheckedRef.current = true;

      const status = paymentStatusData?.data?.[0]?.attributes?.status;
      console.log('Payment status:', status);

      if (!status) {
        setIsFailed(true);
        setIsLoading(false);
        return;
      }

      if (status === 'paid') {
        await handlePlaceOrder();
      } else {
        setIsFailed(true);
        setIsLoading(false);
      }
    };

    checkVerification();
  }, [paymentStatusData]);

  const handleRetryCreateLink = async () => {
    try {
      const totalInCents = Math.round(order?.fees?.grandTotal * 100);
      const response = await createPaymentLink({ amount: totalInCents }).unwrap();

      const url = response?.data?.attributes?.checkout_url;
      const ref = response?.data?.attributes?.reference_number;

      if (!url || !ref) throw new Error('Invalid payment link response');

      setOrder((prev) => ({
        ...prev,
        paymentUrl: url,
        reference_number: ref,
      }));

      router.replace("/(app)/payment");
    } catch (error) {
      console.error('Payment link creation failed:', error);
    }
  };

  const handlePlaceOrder = async () => {
    if (isPlacingOrderRef.current || !user) return;

    isPlacingOrderRef.current = true;

    try {
      setIsLoading(true);

      const response = await createOrder({
        user_id: user.id,
        type: order.type,
        pick_up_type: order.pickUpType,
        location: order.location,
        branch_id: order.branch?.[0]?.id ? Number(order.branch[0].id) : undefined,
        order_items: order.order,
        base_price: order.basePrice,
        timestamp: order.timestamp,
        date_time_pickup: order.dateTimePickUp,
        status: "pending",
        discount_card_details: order.discountCardDetails,
        fees: order.fees,
        user,
        branch: order.branch?.[0] ?? null,
      }).unwrap();

      setOrder((prev) => ({
        ...prev,
        orderNumber: response.order?.id,
        orderCreated: response.order?.created_at,
      }));

      setIsSuccessful(true);

      setTimeout(() => {
        router.replace("/(app)/receipt");
      }, 1000);
    } catch (err) {
      console.error("Error creating order:", err);
      setIsFailed(true);
    } finally {
      setIsLoading(false);
      isPlacingOrderRef.current = false;
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.center}>
          <Image style={styles.logo} source={require('../../assets/images/logo.png')} />
          <Text style={styles.text}>VERIFYING PAYMENT</Text>
          <ActivityIndicator animating color="#fff" size="small" />
        </View>
      );
    }

    if (isFailed && !isSuccessful) {
      return (
        <View style={styles.center}>
          <Image style={styles.logo} source={require('../../assets/images/logo.png')} />
          <Text style={styles.text}>PAYMENT FAILED</Text>

          <TouchableOpacity
            onPress={handleRetryCreateLink}
            style={[globalStyle.button, { width: "90%" }]}
            disabled={linkLoading}
          >
            {linkLoading
              ? <ActivityIndicator animating color="#fff" size="small" />
              : <Text style={globalStyle.buttonText}>RE-ENTER PAYMENT</Text>}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              hasCheckedRef.current = false;
              setTimeout(() => {
                refetch();
            }, 4000);
            }}
            style={[globalStyle.button, { width: "90%", marginTop: 10 }]}
            disabled={isFetching}
          >
            {isFetching
              ? <ActivityIndicator animating color="#fff" size="small" />
              : <Text style={globalStyle.buttonText}>RETRY VERIFICATION</Text>}
          </TouchableOpacity>
        </View>
      );
    }

    if (isSuccessful) {
      return (
        <View style={styles.center}>
          <FontAwesome name="check" size={150} color="white" />
          <Text style={styles.text}>PAYMENT SUCCESSFUL!</Text>
        </View>
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      {renderContent()}
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
  logo: {
    height: 170,
    aspectRatio: 1,
    resizeMode: 'contain',
  },
  text: {
    marginBottom: 20,
    fontFamily: 'MadimiOne',
    fontSize: 16,
    color: '#fff',
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
});

export default VerificationScreen;
