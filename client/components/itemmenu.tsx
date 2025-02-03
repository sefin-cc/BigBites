import {  StyleSheet, Text, View } from "react-native";


interface ItemMenuProps {
  name: string;  // Define the prop type as a string
}
export default function ItemMenu({name}: ItemMenuProps) {

  return (
      <View style={styles.component}>
        <Text style={[styles.name,  styles.nameOutline]}>
            {name}
        </Text>
      </View>
  );
}
const styles = StyleSheet.create({
  component: {
    height: 150,
    width: 150,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    backgroundColor: "#C1272D",
    borderRadius: 20,
    padding:10
  },
  name: {
    fontSize: 24,
    color: "#C1272D",
    fontFamily: 'MadimiOne',
    paddingRight: 6
  },
  nameOutline: {
    position: 'absolute',
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFEEE5', // Outline color
    textShadowColor: '#FFEEE5', // Shadow color to enhance the effect
    textShadowOffset: { width: 2, height: 2 }, // Offset for shadow
    textShadowRadius: 2, // Blur radius for smooth effect
  },
});

