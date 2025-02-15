import {  StyleSheet, Text, View } from "react-native";


interface TitleDashedProps {
  title: string;  // Define the prop type as a string
}
export default function TitleDashed({title}: TitleDashedProps) {

  return (
      <View style={styles.component}>
        <Text style={styles.title}>
            {title}
        </Text>
        <View style={styles.dashedLine}/>
      </View>
  );
}
const styles = StyleSheet.create({
  component: {
    flexDirection:"row",
    flexGrow: 1
  },
  title: {
    fontSize: 24,
    color: "#C1272D",
    fontWeight: "bold",
    fontFamily: 'MadimiOne',
    paddingRight: 6
  },
  dashedLine: {          
    borderBottomWidth: 4,  
    borderColor: 'rgba(194, 39, 45, 0.5)',
    borderStyle: 'dashed',
    flexGrow: 1,
    top: -6 
  },
 
});

