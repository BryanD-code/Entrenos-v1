import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

//componente reutilizable para inputs en auth
export const AuthInput = ({ value, onChangeText, placeholder, secureTextEntry }) => {
  return (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      autoCapitalize="none"
      secureTextEntry={secureTextEntry}
      placeholderTextColor="#999"
    />
  );
};

const styles = StyleSheet.create({
  input: {
    height: 55,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
    fontSize: 16,
    color: '#333'
  },
});