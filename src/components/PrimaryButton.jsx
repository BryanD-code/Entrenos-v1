import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useThemeGlobal } from '../context/ThemeContext';

export const PrimaryButton = ({ onPress, title, loading, disabled, style }) => {
  const { theme, isDark } = useThemeGlobal();

  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        { 
          backgroundColor: theme.primary, 
          shadowColor: theme.primary 
        },
        (disabled || loading) && styles.disabledButton,
        style
      ]} 
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text 
          style={[
            styles.buttonText, 
            { color: isDark ? '#0f172a' : '#fff' } // Usamos texto oscuro en botones primarios sobre fondo lavanda brillante en modo oscuro
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 55,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: '#a5a5a5',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});