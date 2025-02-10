import { useLocalSearchParams, useRouter } from "expo-router";
import { Text, View } from "react-native";

export default function Menu() {
  const router = useRouter();
  const { categoryId } = useLocalSearchParams();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Burgers</Text>
    </View>
  );
}
