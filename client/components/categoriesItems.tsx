import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Text } from 'react-native-svg';
import CatergoryIcon from './catergoryIcons';
import { router } from "expo-router";

const DATA = [
  { id: '1',  categoryId: '1', name: 'FAVOURITES'},
  { id: '2',  categoryId: '2', name: 'BURGERS' },
  { id: '3',  categoryId: '3', name: 'BARKADAS' },
  { id: '4',  categoryId: '4', name: 'SIDES' },
  { id: '5',  categoryId: '5', name: 'DRINKS' },
  { id: '6',  categoryId: '6', name: 'DESSERTS'},
];

export default function CategoriesItems() {
 
  return (
    <View style={styles.grid}>
      {DATA.map((item) => (

        <TouchableOpacity onPress={() => {router.push(`/(app)/menu/menu?categoryId=${item.categoryId}`)}} key={item.id} style={styles.card}>
          <View style={{ flex: 1, justifyContent: "center"}}>
           <CatergoryIcon name={item.name} />
          </View>
  
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
        </TouchableOpacity>

      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly', 
    paddingVertical: "5%"
  },
  card: {
    width: '44%', 
    aspectRatio: 1, 
    marginBottom: 15,
    overflow: 'hidden', 
    borderRadius: 25,
    backgroundColor: "#C1272D",
    justifyContent: 'center',
    alignItems: "center",
  },

  textContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
