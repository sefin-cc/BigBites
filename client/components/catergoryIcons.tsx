import React from 'react';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

interface CategoryIconProps {
  name: string;
}

export default function CategoryIcon({ name }: CategoryIconProps) {
  // Function to render the icon based on the category name
  const renderContent = () => {
    switch (name) {
      case 'FAVOURITES':
        return <AntDesign size={70} name="star" color="#FFEEE5" />;
      case 'BURGERS':
        return <FontAwesome6 size={70} name="burger" color="#FFEEE5" />;
      case 'BARKADAS':
        return <Ionicons size={70} name="fast-food" color="#FFEEE5" />;
      case 'SIDES':
        return <MaterialCommunityIcons size={70} name="french-fries" color="#FFEEE5" />;
      case 'DRINKS':
        return <FontAwesome5 size={70} name="wine-glass-alt" color="#FFEEE5" />;
      case 'DESSERTS':
        return <Ionicons size={70} name="ice-cream" color="#FFEEE5" />;
      default:
        return <Ionicons size={70} name="help" color="#FFEEE5" />; 
    }
  };

  return <>{renderContent()}</>; 
}
