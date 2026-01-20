import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import HomeScreen from '../../inicio/screens/HomeScreen';

const EntrenadorScreen = () => {

  
  const entrenamientoEjemplo = {
    id: "1",
    nombre: "RUTINA MOVILIDAD",
    grupo: "Movilidad",
    instrucciones: "Hombros, cuello y tronco + general",
    videoUrl: null
  };

  return (
    <View style={styles.container}>
       <HomeScreen />
      
       <View style={styles.card}>
          <Text style={styles.titulo}>{entrenamientoEjemplo.nombre}</Text>
          <Text>Grupo: {entrenamientoEjemplo.grupo}</Text>
          <Text>Instrucciones: {entrenamientoEjemplo.instrucciones}</Text>
       </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  card: { padding: 20, margin: 10, backgroundColor: '#eee', borderRadius: 8 },
  titulo: { fontWeight: 'bold', fontSize: 18, marginBottom: 5 }
});

export default EntrenadorScreen;