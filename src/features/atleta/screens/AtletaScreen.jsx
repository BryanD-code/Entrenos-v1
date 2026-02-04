import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React from 'react'
import HomeScreen from '../../inicio/screens/HomeScreen'
import { Header } from '../../../components/Header'
import { Footer } from '../../../components/Footer'

const AtletaScreen = () => {
  return (
    <View style={styles.container}>
      <Header
        title="Mi Entrenamiento"
        rightIcon="notifications-outline"
        onRightIconPress={() => console.log('Notificaciones')}
      />
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <HomeScreen />
        <Text style={styles.debugText}>AtletaScreen</Text>
        <Footer />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  debugText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
    marginVertical: 10,
  }
})

export default AtletaScreen