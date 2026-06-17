import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ExerciseVideo } from './ExerciseVideo';
import { ExerciseFeedbackForm } from './ExerciseFeedbackForm';

export const ExerciseItem = ({ item, index, feedback, onUpdateFeedback }) => {
  return (
    <View style={styles.exerciseItem}>
      <Text style={styles.exerciseName}>{index + 1}. {item.ejercicio.nombre}</Text>
      <Text style={styles.exerciseDetails}>
        {item.series} series | {item.repeticiones} reps | {item.descanso}
      </Text>
      {item.ejercicio?.videoUrl ? (
        <ExerciseVideo videoUrl={item.ejercicio.videoUrl} />
      ) : (
        <View style={styles.videoPlaceholder}>
          <MaterialCommunityIcons name="video-off" size={40} color="#999" />
          <Text style={styles.videoPlaceholderText}>Video no disponible</Text>
        </View>
      )}
      {item.observaciones && (
        <Text style={styles.exerciseObs}>Nota: {item.observaciones}</Text>
      )}

      {/* Sección de Feedback para el ejercicio */}
      <ExerciseFeedbackForm
        feedback={feedback}
        onUpdateFeedback={onUpdateFeedback}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  exerciseItem: {
    marginBottom: 16,
    paddingBottom: 16,
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
  videoPlaceholder: {
    width: '100%',
    aspectRatio: 16 / 9,
    marginTop: 12,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  videoPlaceholderText: {
    color: '#999',
    marginTop: 8,
  },
});
