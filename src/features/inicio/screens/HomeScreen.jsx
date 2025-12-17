// src/features/inicio/screens/HomeScreen.jsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useAuthGlobal } from '../../../context/AuthContext';
import { HeaderBanner } from '../components/HeaderBanner'; // <-- Un solo nivel atrás (..) para subir a 'inicio'

const HomeScreen = () => {
  const { user } = useAuthGlobal();

  return (
    <View style={styles.container}>
      <HeaderBanner 
        title={user?.name || "Bienvenido"} 
        role={user?.role} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' }
});

export default HomeScreen;