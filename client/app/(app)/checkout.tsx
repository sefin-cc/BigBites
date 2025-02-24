import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import globalStyle from "../../assets/styles/globalStyle";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import TitleDashed from "@/components/titledashed";
import { format } from 'date-fns';
import { Checkbox, Dialog, Portal, RadioButton, Snackbar, TextInput, Button as PaperButton } from "react-native-paper";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

interface AddOns {
  label: string;
  price: number;
}

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
  addOns: Array<AddOns>;
  selectedAddOns: Array<AddOns> | [];  
}


export default function Checkout() {
    const context = useContext(AppContext);
    if (!context) {
      return <Text>Error: AppContext is not available</Text>;
    }
    const { order, setOrder, setUser, user} = context;
    const [name, setName] = useState(""); 
    const [discountCard, setDiscountCard] = useState(""); 
    const [discount, toggleDiscount] = useState(false);
    const [discountDeduction, setDiscountDeduction] = useState(0);
    const [selectedValue, setSelectedValue] = useState("GCASH");
    const [errors, setErrors] = useState({ name: "", card: "" });
    const currentTimestamp = format(new Date(), "yyyy-MM-dd HH:mm:ss");
   const [visible, setVisible] = useState<boolean>(false);

   

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
      const grandTotal = order.basePrice - discountDeduction;

      setOrder(prev => ({
        ...prev,
        discountCardDetails: {name: name, discountCard: discountCard},
        fees: {subTotal: order.basePrice, discountDeduction: discountDeduction, grandTotal: grandTotal},
        timestamp: currentTimestamp
      }));
   
      showDialog();

    }

   

    //post to server
  }

  const [modalVisible, setModalVisible] = useState(false);

  // Function to show the dialog
  const showDialog = () => setModalVisible(true);

  // Function to hide the dialog
  const hideDialog = () => setModalVisible(false);

    // Function to handle confirmation
    const handleConfirm = () => {
      setVisible(true);
      hideDialog();
    };
  
    // Function to handle cancellation
    const handleCancel = () => {
      hideDialog();
    };

     // Function to hide the snackbar
    const hideSnackbar = () => setVisible(false);

    useEffect(() => {
      if (visible) {
        const timer = setTimeout(() => {
          hideSnackbar(); // Hide snackbar after 3 seconds
        }, 3000);
  
        // Cleanup timer on component unmount or when visible changes
        return () => clearTimeout(timer);
      }
    }, [visible]); 

  return (
    <View style={[globalStyle.container, {padding: "5%"}]}>
     
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
              <Text style={styles.collapsibleText}>Rogena Sefin Tibegar </Text>
              <Text style={styles.collapsibleText}>09212121212 </Text>
            </View>
          </View>

          <View style={{flexDirection: "row", marginBottom: 10}}>
            <View style={{flex: 1}}>
              <Text style={styles.text}>LOCATION:</Text>
            </View>
            <View style={{flex: 1}}>
              {order.branch && (
                <View>
                  <Text style={styles.collapsibleText}>{order.branch[0].branchName}</Text>
                  <Text style={styles.collapsibleText}>{order.branch[0].fullAddress}</Text>
                </View>
              )}
              {order.location && (
                <Text style={styles.collapsibleText}>
                  {order.location && order.location?.description}
                </Text>
              )}
            </View>
          </View>

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
                <Text style={styles.discountText}>ENTER YOUR PWD OR SENIOR CITIZEN CARD</Text>
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
          <TitleDashed title="PAYMENT METHOD" />
        </View>
        
          <View style={{marginBottom: 10}}>
            <View>
              <TouchableOpacity
                style={styles.radioContainer}
                onPress={() => setSelectedValue("GCASH")}
              >
                <RadioButton
                  value="GCASH"
                  status={selectedValue === "GCASH" ? "checked" : "unchecked"}
                  onPress={() => setSelectedValue("GCASH")}
                  color="#C1272D"
                />
                <Text style={styles.radioBtnLabel}>GCASH</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.radioContainer}
                onPress={() => setSelectedValue("CARD")}
              >
                <RadioButton
                  value="CARD"
                  status={selectedValue === "CARD" ? "checked" : "unchecked"}
                  onPress={() => setSelectedValue("CARD")}
                  color="#C1272D"
                />
                <Text style={styles.radioBtnLabel}>CREDIT / DEBIT CARD</Text>
              </TouchableOpacity>
            </View>

            {/* {
              selectedValue == "GCASH" &&
              (

              )
            } */}
          </View>

          <View style={{marginBottom: 10}}>
            <TitleDashed title="TOTAL" />
          </View>

          <View style={{marginBottom: 20}}>
            <View style={styles.subTotalCard}>
              <Text style={[styles.totalText, {fontSize: 20}]}>SUBTOTAL:    <Text style={{fontSize: 16}}>PHP {order.basePrice}</Text></Text>
              <Text style={[styles.totalText, {fontSize: 20}]}>DISCOUNT:    <Text style={{fontSize: 16}}>PHP {discountDeduction >0 && <Text>-</Text>}{discountDeduction}</Text></Text>
            </View>
            <View style={styles.grandTotalCard}>
              <Text style={[styles.totalText, {fontSize: 20, color: "white"}]}>GRAND TOTAL:    <Text style={{fontSize: 24}}>PHP {(order.basePrice - discountDeduction)}</Text></Text>
            </View>
          </View>
          
          <View style={{marginBottom: 100}}>
            <TouchableOpacity onPress={() =>{handlePlaceOrder();}} style={styles.placeOrderBtn}>
              <FontAwesome6 name="cart-shopping" size={16} color="white" />
              <Text style={styles.placeOrderBtnText}>PLACE ORDER</Text>
            </TouchableOpacity>
          </View>


        
      </ScrollView>
        <View style={{flex: 1}}>
          <Snackbar
            visible={visible}
            onDismiss={hideSnackbar}
            duration={Snackbar.DURATION_LONG} 
            style={{
              bottom: 100,            
              backgroundColor:"#2C2C2C",
              borderRadius: 10,    
              zIndex: 10000,     
            }}
          >
            <Text style={{fontFamily: 'MadimiOne', alignSelf:"center", color: "white", fontSize: 16}}> <FontAwesome6 name="check" size={16} color="white" />   ORDER SUCCESSFUL!</Text>
          </Snackbar>
        </View>
      

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
    fontSize: 16,
    color: "#2C2C2C",
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