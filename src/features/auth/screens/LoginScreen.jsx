// src/features/auth/screens/LoginScreen.jsx
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useLogin } from '../hooks/useLogin';
import { useRouter } from 'expo-router';

const LoginScreen = () => {
  const { email, setEmail, password, setPassword, loading, handleLogin } = useLogin();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity 
        style={styles.button} 
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Iniciar Sesión</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/register')}>
        <Text style={styles.linkText}>¿No tienes cuenta? Regístrate aquí</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 40, textAlign: 'center', color: '#6200ee' },
  input: { height: 55, borderWidth: 1, borderColor: '#ddd', borderRadius: 10, paddingHorizontal: 15, marginBottom: 15, backgroundColor: '#f9f9f9' },
  button: { height: 55, backgroundColor: '#6200ee', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  linkText: { marginTop: 20, textAlign: 'center', color: '#6200ee', fontWeight: '600' }
});

export default LoginScreen;