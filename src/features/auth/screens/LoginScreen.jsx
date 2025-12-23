import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { useLogin } from '../hooks/useLogin';
//modal de registro
import ModalRegistro from '../components/ModalRegistro';





// IMPORTANTE: Rutas corregidas (3 niveles hacia atrás)
import { AuthInput } from '../../../components/AuthInput';
import { PrimaryButton } from '../../../components/PrimaryButton';

const LoginScreen = () => {
  const { email, setEmail, password, setPassword, loading, handleLogin, handleRegister } = useLogin();
  const [modalVisible, setModalVisible] = React.useState(false);

  const handleCloseModal = () => {
    setModalVisible(false);
  }


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

     {/* ESTE BOTÓN ABRE LA MODAL */}
        <PrimaryButton
          title="Regístrate"
          onPress={() => setModalVisible(true)} 
          style={{ marginTop: 10 }}
        />
      
      {/* COMPONENTE MODAL */}
        {/* Le pasamos el estado (true/false) y la función para cerrarse */}
        <ModalRegistro 
            visible={modalVisible} 
            onClose={() => setModalVisible(false)} 
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