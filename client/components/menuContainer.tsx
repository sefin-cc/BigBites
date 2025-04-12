import React from 'react';
import { View, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Text } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';




interface MenuData {
  id: number;
  sub_category_id: number;
  name: string;
  image: string; 
}

interface Props {
  menuData: MenuData[];  // Array of MenuData
  handleTapItem: () => void;
  setItemId: React.Dispatch<React.SetStateAction<number | null>>;
  setSubCategoryId: React.Dispatch<React.SetStateAction<number | null>>;
}

export default function MenuContainer({ menuData, handleTapItem, setItemId, setSubCategoryId }: Props) {
  return (
    <View style={styles.grid} >
      {menuData.map((item) => (
        <TouchableOpacity key={item.id} style={styles.card} onPress={() =>{handleTapItem(); setItemId(item.id); setSubCategoryId(item.sub_category_id)}}>
          <ImageBackground 
            source={{ uri:  item?.image.replace('http://', 'https://') }}  // Update to handle URL images
            style={styles.image} 
            imageStyle={styles.imageStyle} 
            resizeMode="cover"
          >
            <LinearGradient
              colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0)']}
              start={{ x: 0, y: 1 }}
              end={{ x: 0, y: 0 }}
              style={styles.gradient} 
            />
            {/* Text (Above Gradient) */}
            <View style={styles.textContainer}>
              <Svg height="45" width="100%">
                <Text
                  fill="#C1272D"
                  stroke="#FFEEE5"
                  fontSize="20"
                  fontFamily="MadimiOne"
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  strokeWidth="1"
                  strokeLinejoin="round"
                >
                  {item.name}
                </Text>
              </Svg>
            </View>
          </ImageBackground>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: "space-between",
  },
  card: {
    width: '45%',
    aspectRatio: 1,
    marginBottom: "8%",
    overflow: 'hidden',
    borderRadius: 25,
    borderWidth: 4,
    borderColor: "#C1272D",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
    justifyContent: 'flex-end',
    backgroundColor: "#C1272D"
  },
  imageStyle: {
    borderRadius: 20,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
  },
  textContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },


});
