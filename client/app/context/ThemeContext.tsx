import React, { createContext, useContext, useState } from 'react';
import { useColorScheme } from 'react-native';

// Define light and dark themes
const lightTheme = {
  primary: '#FB7F3B',
  secondary: '#FFEEE5',
  red: '#C1272D',
  yellow: '#FCE600',
  black: '#2C2C2C',
};

const darkTheme = {
    primary: '#FB7F3B',
    secondary: '#FFEEE5',
    red: '#C1272D',
    yellow: '#FCE600',
    black: '#2C2C2C',
};

// Create a context with a default value
const ThemeContext = createContext({
  theme: lightTheme,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const colorScheme = useColorScheme(); // Get system theme (light/dark)
  const [theme, setTheme] = useState(colorScheme === 'dark' ? darkTheme : lightTheme);

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === lightTheme ? darkTheme : lightTheme));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook to use theme in components
export const useAppTheme = () => useContext(ThemeContext);
