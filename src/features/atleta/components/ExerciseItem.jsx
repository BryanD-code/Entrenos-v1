import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ExerciseVideo } from './ExerciseVideo';
import { ExerciseFeedbackForm } from './ExerciseFeedbackForm';
import { useThemeGlobal } from '../../../context/ThemeContext';

export const ExerciseItem = ({ item, index, feedback, onUpdateFeedback, isEditable = true }) => {
  const { theme } = useThemeGlobal();

  return (
    <View style={[styles.exerciseItem, { borderBottomColor: theme.border }]}>
      <Text style={[styles.exerciseName, { color: theme.text }]}>
        {index + 1}. {item.ejercicio.nombre}
      </Text>
      <Text style={[styles.exerciseDetails, { color: theme.textMuted }]}>
        {item.series} series | {item.repeticiones} reps | {item.descanso}
      </Text>
      {item.ejercicio?.videoUrl ? (
        <ExerciseVideo videoUrl={item.ejercicio.videoUrl} />
      ) : (
        <View style={[styles.videoPlaceholder, { backgroundColor: theme.inputBackground }]}>
          <MaterialCommunityIcons name="video-off" size={40} color={theme.textMuted} />
          <Text style={[styles.videoPlaceholderText, { color: theme.textMuted }]}>Video no disponible</Text>
        </View>
      )}
      {item.observaciones && (
        <Text style={[styles.exerciseObs, { color: theme.textMuted }]}>Nota: {item.observaciones}</Text>
      )}

      {/* Sección de Feedback para el ejercicio */}
      <ExerciseFeedbackForm
        feedback={feedback}
        onUpdateFeedback={onUpdateFeedback}
        isEditable={isEditable}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  exerciseItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
  },
  exerciseDetails: {
    fontSize: 14,
    marginTop: 2,
  },
  exerciseObs: {
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 6,
  },
  videoPlaceholder: {
    width: '100%',
    aspectRatio: 16 / 9,
    marginTop: 12,
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  videoPlaceholderText: {
    marginTop: 8,
  },
});
