import React, { useState } from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { useThemeGlobal } from '../../../context/ThemeContext';

// Componente reutilizable para inputs en auth con soporte de temas y foco animado/visual
export const AuthInput = ({ value, onChangeText, placeholder, secureTextEntry }) => {
  const { theme } = useThemeGlobal();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <TextInput
      style={[
        styles.input,
        {
          backgroundColor: theme.inputBackground,
          borderColor: isFocused ? theme.primary : theme.border,
          color: theme.text,
        }
      ]}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      autoCapitalize="none"
      secureTextEntry={secureTextEntry}
      placeholderTextColor={theme.textMuted}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    height: 55,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
  },
});