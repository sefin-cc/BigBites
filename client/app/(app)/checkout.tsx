import { ActivityIndicator, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import globalStyle from "../../assets/styles/globalStyle";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import TitleDashed from "@/components/titledashed";
import { format } from 'date-fns';
import { Checkbox, Dialog, TextInput, Button as PaperButton } from "react-native-paper";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { AddOn } from "@/types/clients";
import { useGetProfileQuery } from "../../redux/feature/auth/clientApiSlice";
import Loading from "@/components/loading";
import { useRouter } from "expo-router";
import { useCreatePaymentLinkMutation } from "@/redux/feature/paymentSlice";
import { Portal } from "react-native-paper";


interface MenuItems {
  qty: number;
  subId: string;
  itemId: string;
  label: string;
  fullLabel: string;
  description: string;
  price: number;
  time: string;
  image: string;
  addOns: Array<AddOn>;
  selectedAddOns: Array<AddOn> | [];  
}


export default function Checkout() {
    const router = useRouter();
    const { data: user, isLoading } = useGetProfileQuery();
    const context = useContext(AppContext);
    if (!context) {
      return <Text>Error: AppContext is not available</Text>;
    }
    const { order, setOrder } = context;
    const [name, setName] = useState(""); 
    const [discountCard, setDiscountCard] = useState(""); 
    const [discount, toggleDiscount] = useState(false);
    const [discountDeduction, setDiscountDeduction] = useState(0);
    const [errors, setErrors] = useState({ name: "", card: "" });
    const currentTimestamp = format(new Date(), "yyyy-MM-dd HH:mm:ss");
    const [createPaymentLink, { isLoading: generateLinkLoading }] = useCreatePaymentLinkMutation();

   const validateForm = () => {
    if(discount){
      let valid = true;
      let newErrors = { name: "", card: "" };
  
      if (!name.trim()) {
        newErrors.name = "Name is required!";
        valid = false;
      }
  
      if (!discountCard.trim()) {
        newErrors.card = "Card number is required!";
        valid = false;
      } else if (!/^[\d-]+$/.test(discountCard)) {
        newErrors.card = "Card number can only contain numbers and dashes!";
        valid = false;
      } else if (discountCard.replace(/-/g, "").length < 8) {
        newErrors.card = "Card number must have at least 8 digits!";
        valid = false;
      }
  
      setErrors(newErrors);
      return valid;
    }else{
      return true;
    }
  };

    useEffect(() =>{
      console.log(JSON.stringify(order, null, 2));
    },[order]);

    
    useEffect(() =>{
      if(discount){
        const discountedPrice = parseFloat(((10 / 100) * order.basePrice).toFixed(2));
        setDiscountDeduction(discountedPrice);
      }else{
        setDiscountDeduction(0);
      }
    },[discount, discountDeduction]);

  function handlePlaceOrder() {
    if (validateForm()) {
      const deliveryFee = (order.type === "Delivery" ? 50 : 0);
      const grandTotal = order.basePrice - discountDeduction + deliveryFee;

      setOrder(prev => ({
        ...prev,
        discountCardDetails: {name: name, discountCard: discountCard},
        fees: {subTotal: order.basePrice, discountDeduction: discountDeduction, deliveryFee: deliveryFee, grandTotal: grandTotal},
        timestamp: currentTimestamp
      }));
   
      showDialog();

    }
  }

  const [modalVisible, setModalVisible] = useState(false);

  // Function to show the dialog
  const showDialog = () => setModalVisible(true);

  // Function to hide the dialog
  const hideDialog = () => setModalVisible(false);

    // Function to handle confirmation
    const handleConfirm = async () => {
      try {
        const totalInCents = Math.round(order.fees.grandTotal * 100); // Ensures no floating point weirdness
        const response = await createPaymentLink({ amount: totalInCents }).unwrap(); 
    
        const url = response?.data?.attributes?.checkout_url;
        const ref = response?.data?.attributes?.reference_number;
    
        if (!url) throw new Error('No payment URL returned');
    
        setOrder(prev => ({
          ...prev,
          paymentUrl: url,
          reference_number: ref,
        }));
    
        router.replace("/(app)/payment"); // Navigating to payment screen
        hideDialog();
      } catch (error) {
        console.log('Payment link creation failed:', error);
      }
    };
    
    // Function to handle cancellation
    const handleCancel = () => {
      hideDialog();
    };

  return (
    <View style={[{padding: "5%", backgroundColor: "#FFEEE5"}]}>
     
      <ScrollView>
        <View style={{marginBottom: 10}}>
          <TitleDashed title="ORDER DETAIL" />
        </View>
        <View>
          <View style={{flexDirection: "row", marginBottom: 10}}>
            <View style={{flex: 1}}>
              <Text style={styles.text}>YOUR INFORMATION:</Text>
            </View>
            <View style={{flex: 1}}>
              {
                user && !isLoading ? 
                <View>
                  <Text style={styles.collapsibleText}>{user.name}</Text>
                  <Text style={styles.collapsibleText}>{user.phone} </Text>
                </View> :
                <View>
                  <ActivityIndicator animating={isLoading} color={"#FB7F3B"}  size="large" hidesWhenStopped={true}/>:
                </View>
              }
              
              
            </View>
          </View>

          <View style={{flexDirection: "row", marginBottom: 10}}>
            <View style={{flex: 1}}>
              <Text style={styles.text}>LOCATION:</Text>
            </View>
            <View style={{flex: 1}}>
              { (order.type !== "Delivery" && order.branch ) && (
                <View>
                  <Text style={styles.collapsibleText}>{order.branch[0].branchName}</Text>
                  <Text style={styles.collapsibleText}>{order.branch[0].fullAddress}</Text>
                </View>
              )}
              {order.location && (
                <View>
                  <Text style={styles.collapsibleText}>
                    {order.location && order.location?.description}
                  </Text>
                </View>
              )}
            </View>
          </View>

          <View style={{flexDirection: "row", marginBottom: 10}}>
            <View style={{flex: 1}}>
              <Text style={styles.text}>ORDER TYPE:</Text>
            </View>
            <View style={{flex: 1}}>
                <View>
                  <Text style={styles.collapsibleText}>{order.type} {order.pickUpType}</Text>
                </View>
            </View>
          </View>
            
          {
            (order.dateTimePickUp && order.pickUpType === "TakeOut") &&
            <View style={{flexDirection: "row", marginBottom: 10}}>
              <View style={{flex: 1}}>
                <Text style={styles.text}>DATE AND TIME OF PICKUP:</Text>
              </View>
              <View style={{flex: 1}}>
                  <View>
                    <Text style={styles.collapsibleText}>{order.dateTimePickUp}</Text>
                  </View>
              </View>
            </View>
          }


          


          <View style={{flexDirection: "row", marginBottom: 10}}>
            <View style={{flex: 1}}>
              <Text style={styles.text}>ORDER SUMMARY:</Text>
            </View>

            <View style={{flex: 1}}>
            {
                order.order.map((item: MenuItems, key) => {
                  return (
                    <View style={{marginBottom: 10}}>
                      <Text key={key} style={[styles.collapsibleText]}>
                        {item.qty}x {item.label} 
                      </Text>
                    {item.addOns && item.addOns.length > 0 && (
                    item.addOns.map((addOn, addOnKey) => (
                      <Text key={addOnKey} style={[styles.collapsibleText, {paddingLeft: 30}]}>
                        {addOn.label}{addOnKey < item.addOns.length - 1 ? ', ' : ''}
                      </Text>
                    ))
                  ) }
                    </View>
                  );
                })
              }
            </View>
          </View>
        </View>

        <View style={{marginBottom: 10}}>
          <TitleDashed title="DISCOUNT" />
        </View>

        <View  style={{marginBottom: 10}}>
          <View style={styles.checkBoxCard}>
            <Checkbox
              status={discount ? "checked" : "unchecked"}
              onPress={() => toggleDiscount(!discount)} 
              color="#C1272D" 
            />
            <Text style={styles.checkBoxlabel}>HAVE A PWD OR SENIOR CITIZEN CARD?</Text>
          </View>
          {
            discount &&
            (
              <View>
                <View style={{borderTopWidth: 2, borderColor: "#7d7d7d", marginTop: 10, marginBottom: 17}}></View>
                <Text style={styles.discountText}>Present the card upon receiving the order. Discount is invalid if the card is invalid.</Text>
                <TextInput
                  label="FULL NAME"
                  mode="outlined"
                  placeholder="ENTER FULL NAME..."
                  outlineColor="#C1272D" 
                  activeOutlineColor="#C1272D"
                  style={styles.input}
                  theme={{
                    roundness: 5,
                    fonts: {
                      bodyLarge: { fontFamily: "MadimiOne" }, 
                    },
                  }}
                  placeholderTextColor="#7d7d7d"
                  contentStyle={{ fontFamily: "MadimiOne" }} 
                  outlineStyle={{borderWidth: 2}}
                  value={name} 
                  onChangeText={(text) => {
                    setName(text);
                    setErrors((prev) => ({ ...prev, name: "" })); // Clear error on change
                  }}
                  error={!!errors.name}
              />
               {errors.name ? <Text style={{ color: "#C1272D", marginBottom: 5, fontFamily: "MadimiOne"}}>{errors.name}*</Text> : null}
              <TextInput
                  label="CARD NUMBER"
                  mode="outlined"
                  placeholder="ENTER CARD NUMBER..."
                  outlineColor="#C1272D" 
                  activeOutlineColor="#C1272D"
                  style={styles.input}
                  theme={{
                    roundness: 5,
                    fonts: {
                      bodyLarge: { fontFamily: "MadimiOne" }, 
                    },
                  }}
                  placeholderTextColor="#7d7d7d"
                  contentStyle={{ fontFamily: "MadimiOne" }} 
                    keyboardType="numeric"
                  outlineStyle={{borderWidth: 2}}
                  value={discountCard} 
                  onChangeText={(text) => {
                    setDiscountCard(text);
                    setErrors((prev) => ({ ...prev, card: "" })); // Clear error on change
                  }}
                  error={!!errors.card}
              />
               {errors.card ? <Text style={{ color: "#C1272D", marginBottom: 5, fontFamily: "MadimiOne"}}>{errors.card}*</Text> : null}
              </View>
            )
          }
        </View>

      

          <View style={{marginBottom: 10}}>
            <TitleDashed title="TOTAL" />
          </View>

          <View style={{marginBottom: 20}}>
            <View style={styles.subTotalCard}>
              <Text style={[styles.totalText, {fontSize: 20}]}>SUBTOTAL:    <Text style={{fontSize: 16}}>PHP {order.basePrice}</Text></Text>
              <Text style={[styles.totalText, {fontSize: 20}]}>DISCOUNT:    <Text style={{fontSize: 16}}>PHP {discountDeduction >0 && <Text>-</Text>}{discountDeduction}</Text></Text>
              {
                order.type === "Delivery" &&
                <Text style={[styles.totalText, {fontSize: 20}]}>DELIVERY:    <Text style={{fontSize: 16}}>PHP 50</Text></Text>
              }
              
            </View>
            <View style={styles.grandTotalCard}>
              <Text style={[styles.totalText, {fontSize: 20, color: "white"}]}>GRAND TOTAL:    <Text style={{fontSize: 24}}> PHP {order.basePrice - discountDeduction + (order.type === "Delivery" ? 50 : 0)}</Text></Text>
            </View>
          </View>
          
          <View style={{marginBottom: 100}}>
            <TouchableOpacity onPress={() =>{handlePlaceOrder();}} style={styles.placeOrderBtn}>
              <FontAwesome6 name="cart-shopping" size={16} color="white" />
              <Text style={styles.placeOrderBtnText}>PLACE ORDER</Text>
            </TouchableOpacity>
          </View>


        
      </ScrollView>

      <Portal>
        <Dialog visible={modalVisible} onDismiss={hideDialog}>
          <Dialog.Title style={styles.dialogTitle}>Are you sure?</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogContent}>Do you want to proceed with this order?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <PaperButton onPress={handleCancel}><Text style={styles.dialogText}>CANCEL</Text></PaperButton>
            <PaperButton onPress={handleConfirm} ><Text style={styles.dialogText}>CONFIRM</Text></PaperButton>
          </Dialog.Actions>
        </Dialog>
        <Loading isLoading={generateLinkLoading} />
      </Portal>
     
      


    </View>
  );
}

const styles = StyleSheet.create({
  dialogTitle: {
    fontFamily: 'MadimiOne', // Custom font for the title
    fontSize: 24,             // Custom font size
    color: '#2C2C2C',         // Custom font color     
  },
  dialogContent: {
    fontFamily: 'MadimiOne',     // Custom font for the content
    fontSize: 16,             // Custom font size
    color: '#5e5e5e',            // Custom font color for the content
  },
  dialogText:{
    fontFamily: 'MadimiOne',     // Custom font for the content
    fontSize: 16,  
    color: '#C1272D',  
  },

  text: {
    fontSize: 16,
    color: "#2C2C2C",
    fontFamily: 'MadimiOne', 
  },
  collapsibleText: {
    fontSize: 16,
    color: "#2C2C2C",
    fontFamily: 'MadimiOne',
    flexShrink: 1,
  },
  input: {
    marginBottom: 10,
    backgroundColor: "#FCE8E8", 
    fontSize: 16,
    fontFamily: "MadimiOne",  
  },
  discountText: {
    fontSize: 14,
    color: "#747474",
    fontFamily: 'MadimiOne', 
    marginBottom: 10,
    alignSelf: "center"
  },
  checkBoxlabel:{
    fontSize: 16,
    color: "#2C2C2C",
    fontFamily: 'MadimiOne', 
  },
  checkBoxCard:{
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  radioBtnLabel: {
    fontSize: 20,
    color: "#2C2C2C",
    fontFamily: 'MadimiOne', 
  },
  radioContainer: {
    flexDirection: "row", // Arrange items in a row
    alignItems: "center", // Align radio button and text
    marginBottom: 10,
  },
  subTotalCard: {
    backgroundColor: "white",
    padding: 10,
    alignItems: "flex-end",
    borderTopEndRadius: 10,
    borderTopLeftRadius: 10
  },
  grandTotalCard: {
    backgroundColor: "#FB7F3B",
    padding: 10,
    alignItems: "center",
    borderBottomEndRadius: 10,
    borderBottomLeftRadius: 10
  },
  totalText: {
    color: "#2C2C2C",
    fontFamily: 'MadimiOne'
  },
  placeOrderBtnText: {
    fontSize: 20,
    color: "white",
    fontFamily: 'MadimiOne',
  },
  placeOrderBtn: {
    backgroundColor: "#2C2C2C",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    flexDirection: "row",
    marginHorizontal: 40,
    gap: 10
  }
});