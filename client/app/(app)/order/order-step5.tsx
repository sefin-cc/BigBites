import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates';
import { AppContext } from "@/app/context/AppContext"; 
import globalStyle from "../../../assets/styles/globalStyle"; 
import { Button as PaperButton, Dialog } from "react-native-paper";
import { router } from "expo-router";

export default function ChooseTime() {
  const context = useContext(AppContext);

  // Error handling if AppContext is unavailable
  if (!context) {
    return <Text>Error: AppContext is not available</Text>;
  }

  const { order, setOrder } = context;
  const [date, setDate] = useState<Date | undefined>(undefined); 
  const [openDate, setOpenDate] = useState(false);
  const [openTime, setOpenTime] = useState(false);
  const [hours, setHours] = useState<number>(12); // Default hours
  const [minutes, setMinutes] = useState<number>(0); // Default minutes
  const [selectedBranch, setSelectedBranch] = useState(order?.branch?.[0]); // Default to the first branch
  const [modalVisible, setModalVisible] = useState(false);
  const [dialogueMsg, setDialogueMsg] = useState({ title: "", desc: "" });

  // Handle modal dismiss action for Date Picker
  const onDismissDate = React.useCallback(() => {
    setOpenDate(false); // Close the modal
  }, []);

  // Handle confirmation of the selected date with validation
  const onConfirmDate = React.useCallback(
    (params: any) => {
      const selectedDate = params.date;
      const today = new Date();
      const oneWeekFromNow = new Date();
      oneWeekFromNow.setDate(today.getDate() + 7); // Set one week ahead

      // Validation: Check if the date is in the past or more than one week ahead
      if (selectedDate < today) {
        setDialogueMsg({ title: "Invalid Date", desc: "You cannot select a past date." });
        setModalVisible(true);
        return;
      }

      if (selectedDate > oneWeekFromNow) {
        setDialogueMsg({ title: "Invalid Date", desc: "You cannot select a date more than one week ahead." });
        setModalVisible(true);
        return;
      }

      // If date is valid, set it
      setOpenDate(false); // Close the modal
      setDate(selectedDate); // Set the selected date
    },
    []
  );

  // Handle modal dismiss action for Time Picker
  const onDismissTime = React.useCallback(() => {
    setOpenTime(false); // Close the time picker modal
  }, []);

  // Handle confirmation of the selected time with validation against branch working hours
  const onConfirmTime = React.useCallback(
    ({ hours, minutes }: any) => {

      setHours(hours); // Set the selected hours
      setMinutes(minutes); // Set the selected minutes

      // If a date is already set, update the date object with the selected time
      if (date && selectedBranch) {
        const updatedDate = new Date(date);
        updatedDate.setHours(hours, minutes);

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

  const handleConfirm = () =>{
    if(displayDateTime){
      setOrder(prev => ({
        ...prev,
        dateTimePickUp: displayDateTime,
      }));
      router.push("/(app)/menu/menu-categories");
    }else{
      setDialogueMsg({
        title: "Error",
        desc: `Please select the Date and Time .`
      });
      setModalVisible(true);
    }
  }

  useEffect(() => {
    console.log("Updated Order:", order);
  }, [order]);


  return (
    <View style={styles.container}>
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

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FB7F3B",
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
});
