import { StyleSheet, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";

interface Props {
    isLoading: boolean;
}
export default function Loading({isLoading}: Props) {
    return(
    <View  style={styles.container}>
        {
            isLoading &&

            <View style={styles.loading}>
                <ActivityIndicator animating={isLoading} color={"#FB7F3B"}  size="large" hidesWhenStopped={true}/>
            </View>
        }
    </View>
    );
}

const styles = StyleSheet.create({
    container:{
        position: 'absolute',  
        top: 0,
        left: 0,
        right: 0,
        bottom: 0, 
    }, 
    loading:{
        position: 'absolute',  
        top: 0,
        left: 0,
        right: 0,
        bottom: 0, 
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        gap: 5,
        zIndex: 1000
    }, 
});