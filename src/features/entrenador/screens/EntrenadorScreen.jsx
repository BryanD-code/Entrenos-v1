import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getAtletas, createTrainingPlan } from '../services/trainerService';
import ExerciseSelectorModal from '../components/ExerciseSelectorModal';
import { useAuthGlobal } from '../../../context/AuthContext';
import SesionActiva from './SesionActiva';
import { Header } from '../../../components/Header';
import { Footer } from '../../../components/Footer';

const Toast = ({ message, visible }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.toast, { opacity: fadeAnim }]}>
      <Text style={styles.toastText}>{message}</Text>
    </Animated.View>
  );
};

const EntrenadorScreen = () => {
  const { user, logout } = useAuthGlobal();
  const [atletas, setAtletas] = useState([]);
  const [selectedAtleta, setSelectedAtleta] = useState(null);
  const [loadingAtletas, setLoadingAtletas] = useState(true);

  const [sesion, setSesion] = useState({ dia: '', tituloSesion: '', orden: '' });
  const [addedExercises, setAddedExercises] = useState([]);

  const [isModalVisible, setModalVisible] = useState(false);
  const [isEditSessionVisible, setEditSessionVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  // Toast 
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (message) => {
    setToastMessage(message);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  useEffect(() => {
    fetchAtletas();
  }, []);

  const fetchAtletas = async () => {
    try {
      const data = await getAtletas();
      setAtletas(data);
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar los atletas");
    } finally {
      setLoadingAtletas(false);
    }
  };

  const handleAddExercise = (exerciseData) => {
    setAddedExercises([...addedExercises, exerciseData]);
  };

  const handleRemoveExercise = (index) => {
    const newExercises = [...addedExercises];
    newExercises.splice(index, 1);
    setAddedExercises(newExercises);
  };

  const handleOpenEditSession = () => {
    if (!selectedAtleta) {
      showToast("⚠️ Primero debes seleccionar un atleta");
      return;
    }
    setEditSessionVisible(true);
  };

  const handleSaveSession = async () => {
    if (!selectedAtleta) {
      showToast("Selecciona un atleta primero");
      return;
    }
    if (!sesion.dia || !sesion.tituloSesion || !sesion.orden) {
      showToast("Completa el día, título y orden de la sesión");
      return;
    }
    if (addedExercises.length === 0) {
      showToast("Añade al menos un ejercicio a la sesión");
      return;
    }

    try {
      setSaving(true);
      const planData = {
        dia: sesion.dia,
        tituloSesion: sesion.tituloSesion,
        orden: parseInt(sesion.orden),
        ejercicios: addedExercises,
        atletaId: selectedAtleta.id,
        creadoPor: user.uid
      };

      await createTrainingPlan(planData);

      showToast("Sesión asignada correctamente");
      // Limpiamos los campos
      setSesion({ dia: '', tituloSesion: '', orden: '' });
      setAddedExercises([]);
      setSelectedAtleta(null);

    } catch (error) {
      console.error(error);
      showToast("No se pudo guardar la sesión");
    } finally {
      setSaving(false);
    }
  };

  return (

    <View style={{ flex: 1 }}>
      {/* header que tengo que separar en otro componente proximamente */}
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 50 }}>
        <Header
          title="Gestionar Sesiones"
        />

        {/* Seleccionar Atleta */}
        <Text style={styles.sectionTitle}>1. Seleccionar Atleta</Text>
        {loadingAtletas ? <ActivityIndicator /> : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.athleteList}>
            {atletas.map(atleta => (
              <TouchableOpacity
                key={atleta.id}
                style={[styles.athleteChip, selectedAtleta?.id === atleta.id && styles.selectedChip]}
                onPress={() => setSelectedAtleta(atleta)}
              >
                <Text style={[styles.athleteText, selectedAtleta?.id === atleta.id && styles.selectedText]}>
                  {atleta.username || atleta.email}
                </Text>
              </TouchableOpacity>
            ))}
            {atletas.length === 0 && <Text style={{ color: '#666', marginLeft: 16 }}>No hay atletas registrados</Text>}
          </ScrollView>
        )}

        {/*  Datos de la Sesión */}
        <Text style={styles.sectionTitle}>2. Datos de la Sesión</Text>
        <View style={styles.formCard}>
          <TextInput
            style={styles.input}
            placeholder="Dia (Ej: Lunes )"
            value={sesion.dia}
            onChangeText={t => setSesion({ ...sesion, dia: t })}
          />
          <TextInput
            style={styles.input}
            placeholder="Título (Ej:  Empuje, Pierna, etc)"
            value={sesion.tituloSesion}
            onChangeText={t => setSesion({ ...sesion, tituloSesion: t })}
          />
          {/* Para futura funcionalidad de exportar o obtener los entrenos */}
          <TextInput
            style={styles.input}
            placeholder="Orden (Ej: 1, 2, 3...)"
            keyboardType="numeric"
            value={sesion.orden}
            onChangeText={t => setSesion({ ...sesion, orden: t })}
          />
        </View>

        {/*  Ejercicios lo que vamos añadiendo */}
        <View style={styles.rowBetween}>
          <Text style={styles.sectionTitle}>3. Ejercicios ({addedExercises.length})</Text>
          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addButtonMini}>
            <MaterialCommunityIcons name="plus" size={20} color="#fff" />
            <Text style={styles.addButtonText}>Añadir</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.exerciseList}>
          {addedExercises.map((item, index) => (
            <View key={index} style={styles.exerciseItem}>
              <View style={{ flex: 1 }}>
                <Text style={styles.exerciseName}>{item.ejercicio.nombre}</Text>
                <Text style={styles.exerciseDetails}>
                  {item.series} series x {item.repeticiones} reps | {item.descanso || 'Descanso sin definir'}
                </Text>
                {item.observaciones ? <Text style={styles.obs}>{item.observaciones}</Text> : null}
              </View>
              <TouchableOpacity onPress={() => handleRemoveExercise(index)}>
                <MaterialCommunityIcons name="close-circle" size={24} color="#ff3b30" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Actualizar la sesión que ya hemos creado */}
        {/* Proximanente tengo que quitar las que ya se han completado y dejar solo las que no se han completado */}
        <View style={{ marginHorizontal: 20, marginBottom: 10 }}>
          <TouchableOpacity onPress={handleOpenEditSession} style={[styles.addButtonMini, { backgroundColor: '#FF9800', justifyContent: 'center' }]}>
            <MaterialCommunityIcons name="pencil" size={20} color="#fff" />
            <Text style={styles.addButtonText}>Modificar sesión activa</Text>
          </TouchableOpacity>
        </View>


        {/*  Guardar */}
        <TouchableOpacity
          style={[styles.saveButton, saving && styles.disabledButton]}
          onPress={handleSaveSession}
          disabled={saving}
        >
          {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveButtonText}>Guardar y Asignar</Text>}
        </TouchableOpacity>

        <ExerciseSelectorModal
          visible={isModalVisible}
          onClose={() => setModalVisible(false)}
          onSelect={handleAddExercise}
        />

        <SesionActiva
          visible={isEditSessionVisible}
          onClose={() => setEditSessionVisible(false)}
          atleta={selectedAtleta}
        />
      </ScrollView>
      <Toast message={toastMessage} visible={toastVisible} />
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f7' },
  headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: 20 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', margin: 20, color: '#1a1a1a' },
  logoutButton: { padding: 10 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginLeft: 20, marginTop: 10, marginBottom: 10, color: '#333' },
  athleteList: { paddingLeft: 20, marginBottom: 10 },
  athleteChip: { backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, marginRight: 10, elevation: 1 },
  selectedChip: { backgroundColor: '#6200ee' },
  athleteText: { color: '#333' },
  selectedText: { color: '#fff', fontWeight: 'bold' },
  formCard: { backgroundColor: '#fff', marginHorizontal: 20, padding: 15, borderRadius: 12, elevation: 1 },
  input: { borderBottomWidth: 1, borderBottomColor: '#eee', paddingVertical: 10, marginBottom: 10, fontSize: 16 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: 20 },
  addButtonMini: { flexDirection: 'row', backgroundColor: '#6200ee', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15, alignItems: 'center' },
  addButtonText: { color: '#fff', marginLeft: 4, fontWeight: '500' },
  exerciseList: { paddingHorizontal: 20 },
  exerciseItem: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 10, flexDirection: 'row', alignItems: 'center', elevation: 1 },
  exerciseName: { fontWeight: 'bold', fontSize: 16, color: '#333' },
  exerciseDetails: { color: '#666', marginTop: 4 },
  obs: { color: '#888', fontStyle: 'italic', fontSize: 12, marginTop: 2 },
  saveButton: { backgroundColor: '#00c853', margin: 20, padding: 16, borderRadius: 12, alignItems: 'center', elevation: 2 },
  disabledButton: { opacity: 0.7 },
  saveButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  toast: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  toastText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default EntrenadorScreen;