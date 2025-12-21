import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

// Nota el "export const" (Exportación nombrada)
export const AuthInput = ({ value, onChangeText, placeholder, secureTextEntry }) => {
  return (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      autoCapitalize="none" // Evita mayúsculas automáticas en correos
      secureTextEntry={secureTextEntry} // Para ocultar contraseña
      placeholderTextColor="#999"
    />
  );
};

const styles = StyleSheet.create({
  input: {
    height: 55,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12, // Bordes un poco más redondeados
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
    fontSize: 16,
    color: '#333'
  },
});