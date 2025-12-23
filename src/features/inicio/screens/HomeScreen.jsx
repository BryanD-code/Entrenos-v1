// src/features/inicio/screens/HomeScreen.jsx
import React from 'react';
import { View, StyleSheet, Pressable, Text} from 'react-native';
import { useAuthGlobal } from '../../../context/AuthContext';
import { HeaderBanner } from '../components/HeaderBanner'; 

const HomeScreen = () => {
  // 1. Extraemos el objeto 'user' (que contiene toda la info de la BBDD)
  const { user ,logout} = useAuthGlobal();


  console.log("Datos del usuario en Home:", user); // Para depurar y ver si llegan los datos

  return (
    <View style={styles.container}>
      {/* 2. Accedemos a las propiedades DENTRO de user */}
      {/* Usamos 'user?.propiedad' por si tarda un milisegundo en cargar y user es null */}
      <HeaderBanner 
        title={user?.username || "Usuario"} 
        role={user?.role || "Sin rol asignado"} 
      />
    <Pressable
                style={[styles.button, styles.bgRegistrar, styles.btnFull]}
                onPress={() => logout()}> 
                <Text style={styles.textStyle}>Cerrar Sesión</Text>
              </Pressable>
    </View> 
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' }
});

export default HomeScreen;