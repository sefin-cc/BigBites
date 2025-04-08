
import { Tabs } from 'expo-router';
import React from 'react';

import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
 
  
    return (
    <Tabs
        screenOptions={{
            headerShown: false, 
            tabBarStyle: {
                backgroundColor:'#FB7F3B', 
                borderTopWidth: 1, 
            },
            animation: 'shift',
            tabBarActiveTintColor: '#FFEEE5',
            tabBarInactiveTintColor: '#FFEEE5',
            tabBarLabelStyle: {
              fontSize: 9,
              fontFamily: 'MadimiOne', 
              paddingTop: 2,
            },
        }}>
        <Tabs.Screen
            name="index"
            options={{
                tabBarLabel: 'HOME',
                tabBarIcon: () => <Ionicons size={28} name="home"  color={'#FFEEE5'} />,
            }}
        />

        <Tabs.Screen
            name="settings"
            options={{
                tabBarLabel: 'PROFILE',
                tabBarIcon: () => <Ionicons size={28} name="person" color={'#FFEEE5'} />,
            }}
        />
        </Tabs>
    );
    }
   