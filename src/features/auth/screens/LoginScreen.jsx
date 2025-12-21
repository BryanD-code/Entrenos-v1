import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useLogin } from '../hooks/useLogin';


// IMPORTANTE: Rutas corregidas (3 niveles hacia atrás)
import { AuthInput } from '../../../components/AuthInput';
import { PrimaryButton } from '../../../components/PrimaryButton';



const LoginScreen = () => {
  const { email, setEmail, password, setPassword, loading, handleLogin, handleRegister } = useLogin();
  const router = useRouter();

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Bienvenido</Text>
        <Text style={styles.subtitle}>Inicia sesión para continuar</Text>
        
        {/* Usando tu componente reutilizable */}
        <AuthInput
          placeholder="Correo electrónico"
          value={email}
          onChangeText={setEmail}
        />

        {/* Usando tu componente reutilizable */}
        <AuthInput
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {/* Usando tu componente reutilizable */}
        <PrimaryButton 
          title="Iniciar Sesión" 
          onPress={handleLogin}
          loading={loading}
          style={{ marginTop: 10 }}
        />

      <PrimaryButton
          title="Regístrate"
          onPress={handleRegister}
          style={{ marginTop: 10 }}
      />
         
          
        
       
     
       
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 25,
  },
  title: { 
    fontSize: 32, 
    fontWeight: 'bold', 
    marginBottom: 10, 
    textAlign: 'center', 
    color: '#6200ee' 
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  linkContainer: {
    marginTop: 25,
    alignItems: 'center',
  },
  linkText: { 
    color: '#666', 
    fontSize: 15
  },
  linkBold: {
    color: '#6200ee',
    fontWeight: 'bold'
  }
});

export default LoginScreen;