import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { colors } from '../theme/theme';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState(systemScheme || 'light');

  useEffect(() => {
    if (systemScheme) {
      setThemeMode(systemScheme);
    }
  }, [systemScheme]);

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const theme = colors[themeMode];

  return (
    <ThemeContext.Provider value={{ themeMode, theme, toggleTheme, isDark: themeMode === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeGlobal = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeGlobal must be used within a ThemeProvider');
  }
  return context;
};
