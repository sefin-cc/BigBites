import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Image} from 'react-native';
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates';
import { AppContext } from "@/app/context/AppContext"; 
import globalStyle from "../../../assets/styles/globalStyle"; 
import { Button as PaperButton, Dialog } from "react-native-paper";
import { router } from "expo-router";

export default function AdvanceOrder() {
  const context = useContext(AppContext);

  // Error handling if AppContext is unavailable
  if (!context) {
    return <Text>Error: AppContext is not available</Text>;
  }
  const { order, setOrder } = context;
  const [date, setDate] = useState<Date | undefined>(undefined); 
  const [openDate, setOpenDate] = useState(false);
  const [openTime, setOpenTime] = useState(false);
  const [hours, setHours] = useState<number>(12); // Default to 9 AM
  const [minutes, setMinutes] = useState<number>(0); // Default to 0 minutes
  const [selectedBranch, setSelectedBranch] = useState(order?.branch?.[0]); // Default to the first branch
  const [modalVisible, setModalVisible] = useState(false);
  const [dialogueMsg, setDialogueMsg] = useState({ title: "", desc: "" });

  // Handle modal dismiss action for Date Picker
  const onDismissDate = React.useCallback(() => {
    setOpenDate(false); // Close the modal
  }, []);

  const onConfirmDate = React.useCallback(
    (params: any) => {
      const selectedDate = params.date;
      const today = new Date();
      const oneMonthFromNow = new Date();
      oneMonthFromNow.setMonth(today.getMonth() + 1); // Set one month ahead
  
      // Clear the time from both today and selectedDate for a date-only comparison
      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(9, 0, 0, 0);
  
      // Validation: Check if the date is in the past or more than one month ahead
      if (selectedDate < today) { 
        setDialogueMsg({ title: "Invalid Date", desc: "You cannot select a past date." });
        setModalVisible(true);
        return;
      }
  
      // Validation: Check if the date is the current date
      if (selectedDate.getTime() === today.getTime()) {
        setDialogueMsg({ title: "Invalid Date", desc: "Advance orders cannot be placed for the current date; they must be scheduled for a future date." });
        setModalVisible(true);
        return;
      }
  
      // Validation: Check if the date is more than one month ahead
      if (selectedDate > oneMonthFromNow) {
        setDialogueMsg({ title: "Invalid Date", desc: "You cannot select a date more than one month ahead." });
        setModalVisible(true);
        return;
      }
  
      // If the date is valid, set it
      setOpenDate(false); // Close the modal
      setDate(selectedDate); // Set the selected date
    },
    []
  );

  // Handle modal dismiss action for Time Picker
  const onDismissTime = React.useCallback(() => {
    setOpenTime(false); // Close the time picker modal
  }, []);

  const onConfirmTime = React.useCallback(
    ({ hours, minutes }: any) => {
      if (!date) {
        setDialogueMsg({ title: "Date Required", desc: "Please select a date first." });
        setModalVisible(true);
        return;
      }

      // Set the selected hours and minutes (if any)
      setHours(hours); 
      setMinutes(minutes);

      // If a date is already set, update the date object with the selected time
      if (date && selectedBranch) {
        const updatedDate = new Date(date);
        updatedDate.setHours(hours, minutes);

        // Get the current date and time
        const today = new Date();
        const currentTime = today.getTime(); // Current time in milliseconds


        // Convert opening and closing times to comparable minutes from midnight
        const openingTime = convertToMinutes(selectedBranch.openingTime);
        const closingTime = convertToMinutes(selectedBranch.closingTime);
        const selectedTime = updatedDate.getHours() * 60 + updatedDate.getMinutes();

        // Validate if the selected time is within the branch's opening and closing times
        if (selectedTime < openingTime || selectedTime > closingTime) {
          setDialogueMsg({
            title: "Invalid Time",
            desc: `The selected time must be between ${selectedBranch.openingTime} and ${selectedBranch.closingTime}.`
          });
          setModalVisible(true);
          return;
        }

        setOpenTime(false); 
        setDate(updatedDate); // Update the date with the selected time
      }
    },
    [date, selectedBranch]
  );

  // Helper function to convert "HH:MM" time format to minutes from midnight
  const convertToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  // Combine Date and Time to display
  const displayDateTime = date && `${date.toDateString()} ${date.toLocaleTimeString()}`;

  const handleConfirm = () => {
    if(displayDateTime) {
      setOrder(prev => ({
        ...prev,
        dateTimePickUp: displayDateTime,
      }));
      router.push("/(app)/menu/menu-categories");
    } else {
      setDialogueMsg({
        title: "Error",
        desc: "Please select the Date and Time."
      });
      setModalVisible(true);
    }
  }

  useEffect(() => {
    console.log("Updated Order:", order);
  }, [order]);


  return (
  <ImageBackground source={require('../../../assets/images/BG.png')} resizeMode="cover" style={styles.container}>
         <Image style={styles.logo} source={require('../../../assets/images/logo.png')} />
      <View style={styles.containerButton}>
        {/* Display Selected Date & Time */}
        {date && (
          <View style={{ marginBottom: 10 }}>
            <Text style={[styles.selectedDate, { fontFamily: "MadimiOne", fontSize: 20 }]}>
              SELECTED DATE & TIME:
            </Text>
            <Text style={[styles.selectedDate, { fontFamily: "MadimiOne" }]}>
              {displayDateTime}
            </Text>
          </View>
        )}

        {/* Select Date Button */}
        <TouchableOpacity
          onPress={() => setOpenDate(true)}
          style={[globalStyle.button, { width: "100%", backgroundColor: "none", borderColor: "#FB7F3B", marginTop: 10 }]}
        >
          <Text style={[globalStyle.buttonText, { color: "#FB7F3B" }]}>SELECT DATE</Text>
        </TouchableOpacity>

        {/* Select Time Button */}
        <TouchableOpacity
          onPress={() => setOpenTime(true)}
          style={[globalStyle.button, { width: "100%", backgroundColor: "none", borderColor: "#FB7F3B", marginVertical: 10 }]}
        >
          <Text style={[globalStyle.buttonText, { color: "#FB7F3B" }]}>SELECT TIME</Text>
        </TouchableOpacity>

        {/* DatePickerModal */}
        <DatePickerModal
          locale="en"
          mode="single"
          visible={openDate && !modalVisible} // Ensure it doesn't show when the dialog is visible
          onDismiss={onDismissDate}
          date={date || new Date()}
          onConfirm={onConfirmDate}
        />

        {/* TimePickerModal */}
        <TimePickerModal
          visible={openTime && !modalVisible} // Ensure it doesn't show when the dialog is visible
          onDismiss={onDismissTime}
          onConfirm={onConfirmTime}
          hours={hours}  // Pass selected hours
          minutes={minutes}  // Pass selected minutes
        />

        {/* Confirm Button */}
        <TouchableOpacity
          onPress={() => {handleConfirm()}}
          style={[globalStyle.button, { width: "100%", marginTop: 10 }]}
        >
          <Text style={globalStyle.buttonText}>CONFIRM</Text>
        </TouchableOpacity>
      </View>
      
        {/* Custom Dialog Alert (visible on top of the modals) */}
        <Dialog visible={modalVisible} onDismiss={() => setModalVisible(false)} style={styles.dialog}>
          <Dialog.Title style={styles.dialogTitle}>{dialogueMsg.title}</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogContent}>{dialogueMsg.desc}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <PaperButton onPress={() => setModalVisible(false)}>
              <Text style={styles.dialogText}>OK</Text>
            </PaperButton>
          </Dialog.Actions>
        </Dialog>

    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",

  },
  containerButton: {
    backgroundColor: "#FFEEE5",
    padding: "2%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    width: "80%",
    margin: 10,
  },
  selectedDate: {
    marginTop: 10,
    fontSize: 16,
    color: "#333",
  },
  dialog: {
    zIndex: 1000, // Ensure Dialog is on top
  },
  dialogTitle: {
    fontFamily: 'MadimiOne',
    fontSize: 24,
    color: '#C1272D',  // Customize title color
  },
  dialogContent: {
    fontFamily: 'MadimiOne',
    fontSize: 18,
    color: '#333',  // Customize content color
  },
  dialogText: {
    fontFamily: 'MadimiOne',
    fontSize: 16,
    color: '#FB7F3B',  // Customize button text color
  },
  logo:{
    width: "auto", 
    height: 120,
    aspectRatio: 1, 
    resizeMode: 'contain',
  }
});
