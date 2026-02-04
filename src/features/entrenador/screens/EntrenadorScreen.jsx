import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import HomeScreen from '../../inicio/screens/HomeScreen';
import { Header } from '../../../components/Header';
import { Footer } from '../../../components/Footer';

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
      <Header
        title="Panel de Entrenador"
        rightIcon="settings-outline"
        onRightIconPress={() => console.log('Ajustes')}
      />
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <HomeScreen />
        <View style={styles.card}>
          <Text style={styles.titulo}>{entrenamientoEjemplo.nombre}</Text>
          <Text>Grupo: {entrenamientoEjemplo.grupo}</Text>
          <Text>Instrucciones: {entrenamientoEjemplo.instrucciones}</Text>
        </View>
        <Footer />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1 },
  scrollContent: { paddingBottom: 20 },
  card: { padding: 20, margin: 10, backgroundColor: '#f5f5f5', borderRadius: 12 },
  titulo: { fontWeight: 'bold', fontSize: 18, marginBottom: 5 }
});

export default EntrenadorScreen;