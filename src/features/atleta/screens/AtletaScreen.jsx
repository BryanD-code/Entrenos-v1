import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, TouchableOpacity, Button } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Header } from '../../../components/Header';
import { Footer } from '../../../components/Footer';
import { useAuthGlobal } from '../../../context/AuthContext';
import { getMisPlanes } from '../services/atletaService';
import { useVideoPlayer, VideoView } from 'expo-video';

const ExerciseVideo = ({ videoUrl }) => {
  const player = useVideoPlayer(videoUrl, player => {
    player.loop = true;


  });

  return (
    <View style={styles.videoContainer}>
      <VideoView
        style={styles.video}
        player={player}
        fullscreenOptions={{
          visible: true
        }}

        contentFit="contain"
      />
    </View>
  );
};

const AtletaScreen = () => {
  const { user } = useAuthGlobal();
  const [planes, setPlanes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedPlanId, setExpandedPlanId] = useState(null);

  useEffect(() => {
    fetchPlanes();
  }, []);

  const fetchPlanes = async () => {
    try {
      if (user?.uid) {
        const data = await getMisPlanes(user.uid);
        setPlanes(data);
        if (data.length > 0) {
          Alert.alert("¡Nuevos Entrenamientos!", "Tienes planes asignados por tu entrenador.");
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedPlanId(expandedPlanId === id ? null : id);
  };

  return (
    <View style={styles.container}>
      <Header
        title="Mi Entrenamiento"
        rightIcon="notifications-outline"
        onRightIconPress={() => Alert.alert("Notificaciones", "Sin novedades")}
      />

      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#6200ee" style={{ marginTop: 50 }} />
        ) : planes.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="clipboard-text-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>No tienes entrenamientos asignados aún.</Text>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {planes.map((plan) => (
              <View key={plan.id} style={styles.planCard}>
                <TouchableOpacity
                  style={styles.planHeader}
                  onPress={() => toggleExpand(plan.id)}
                >
                  <View>
                    <Text style={styles.planTitle}>{plan.tituloSesion}</Text>
                    <Text style={styles.planDay}>{plan.dia}</Text>
                  </View>
                  <MaterialCommunityIcons
                    name={expandedPlanId === plan.id ? "chevron-up" : "chevron-down"}
                    size={24}
                    color="#666"
                  />
                </TouchableOpacity>

                {expandedPlanId === plan.id && (
                  <View style={styles.exercisesList}>
                    {plan.ejercicios?.map((item, index) => (
                      <View key={index} style={styles.exerciseItem}>
                        <Text style={styles.exerciseName}>{index + 1}. {item.ejercicio.nombre}</Text>
                        <Text style={styles.exerciseDetails}>
                          {item.series} series | {item.repeticiones} reps | {item.descanso}
                        </Text>
                        {item.ejercicio?.videoUrl ? (
                          <ExerciseVideo videoUrl={item.ejercicio.videoUrl} />
                        ) : (
                          <View style={[styles.videoContainer, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#eee' }]}>
                            <MaterialCommunityIcons name="video-off" size={40} color="#999" />
                            <Text style={{ color: '#999', marginTop: 8 }}>Video no disponible</Text>
                          </View>
                        )}
                        {item.observaciones && (
                          <Text style={styles.exerciseObs}>Nota: {item.observaciones}</Text>
                        )}
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
        )}
      </View>
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f7',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    marginTop: 10,
    textAlign: 'center',
  },
  planCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  planTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  planDay: {
    fontSize: 14,
    color: '#6200ee',
    marginTop: 4,
    fontWeight: '600',
  },
  exercisesList: {
    backgroundColor: '#fafafa',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    padding: 16,
  },
  exerciseItem: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
  },
  exerciseDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  exerciseObs: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
    marginTop: 2,
  },
  videoContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    marginTop: 12,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#000',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  video: {
    width: '100%',
    height: '100%',
  },
});

export default AtletaScreen;