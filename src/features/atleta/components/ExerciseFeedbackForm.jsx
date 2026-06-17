import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';

export const ExerciseFeedbackForm = ({ feedback, onUpdateFeedback }) => {
  const effortLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <View style={styles.feedbackFormContainer}>
      <Text style={styles.feedbackFormTitle}>Registrar Progreso</Text>
      
      <View style={styles.inputRow}>
        <Text style={styles.inputLabel}>Peso usado:</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Ej: 50 kg, 20 lbs..."
          placeholderTextColor="#999"
          value={feedback.peso}
          onChangeText={(val) => onUpdateFeedback('peso', val)}
        />
      </View>

      <View style={styles.effortContainer}>
        <Text style={styles.inputLabel}>
          Esfuerzo (RPE 1-10): {feedback.esfuerzo ? `${feedback.esfuerzo}/10` : 'No seleccionado'}
        </Text>
        <View style={styles.effortButtonsRow}>
          {effortLevels.map((num) => (
            <TouchableOpacity
              key={num}
              style={[
                styles.effortButton,
                feedback.esfuerzo === num && styles.effortButtonSelected
              ]}
              onPress={() => onUpdateFeedback('esfuerzo', num)}
            >
              <Text
                style={[
                  styles.effortButtonText,
                  feedback.esfuerzo === num && styles.effortButtonTextSelected
                ]}
              >
                {num}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputRow}>
        <Text style={styles.inputLabel}>Comentarios:</Text>
        <TextInput
          style={[styles.textInput, styles.multilineInput]}
          placeholder="Comentarios sobre cómo te sentiste..."
          placeholderTextColor="#999"
          multiline
          numberOfLines={2}
          value={feedback.comentarios}
          onChangeText={(val) => onUpdateFeedback('comentarios', val)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  feedbackFormContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f9f9fb',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e8e8ed',
  },
  feedbackFormTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6200ee',
    marginBottom: 8,
  },
  inputRow: {
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
    marginBottom: 4,
  },
  textInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dcdce2',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 14,
    color: '#333',
  },
  multilineInput: {
    height: 50,
    textAlignVertical: 'top',
  },
  effortContainer: {
    marginBottom: 10,
  },
  effortButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  effortButton: {
    flex: 1,
    aspectRatio: 1,
    maxWidth: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dcdce2',
    borderRadius: 6,
    marginHorizontal: 1,
  },
  effortButtonSelected: {
    backgroundColor: '#6200ee',
    borderColor: '#6200ee',
  },
  effortButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
  },
  effortButtonTextSelected: {
    color: '#fff',
  },
});
