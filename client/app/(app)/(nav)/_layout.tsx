
import { Tabs } from 'expo-router';
import React from 'react';
import { useAppTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
    const { theme } = useAppTheme();
  
    return (
        <Tabs
        screenOptions={{
            headerShown: false, 
            tabBarLabel: () => null,
            tabBarStyle: {
            backgroundColor: theme.primary, 
            borderTopWidth: 0, 
            padding: 5
            },
        }}>
        <Tabs.Screen
            name="index"
            options={{
              tabBarIcon: () => <Ionicons size={28} name="home"  color={theme.secondary} />,
            }}
        />

        <Tabs.Screen
            name="settings"
            options={{
              tabBarIcon: () => <Ionicons size={28} name="settings" color={theme.secondary} />,
            }}
        />
        </Tabs>
    );
    }
   