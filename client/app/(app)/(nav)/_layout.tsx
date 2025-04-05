
import { Tabs } from 'expo-router';
import React from 'react';

import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
 
  
    return (
        <Tabs
        screenOptions={{
            headerShown: false, 
            tabBarLabel: () => null,
            tabBarStyle: {
            backgroundColor:'#FB7F3B', 
            borderTopWidth: 0, 
            padding: 5
            },
        }}>
        <Tabs.Screen
            name="index"
            options={{
              tabBarIcon: () => <Ionicons size={28} name="home"  color={'#FFEEE5'} />,
            }}
        />

        <Tabs.Screen
            name="settings"
            options={{
              tabBarIcon: () => <Ionicons size={28} name="settings" color={'#FFEEE5'} />,
            }}
        />
        </Tabs>
    );
    }
   