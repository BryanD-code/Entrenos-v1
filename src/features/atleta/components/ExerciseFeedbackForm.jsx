import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useThemeGlobal } from '../../../context/ThemeContext';

export const ExerciseFeedbackForm = ({ feedback, onUpdateFeedback, isEditable = true }) => {
  const { theme, isDark } = useThemeGlobal();
  const effortLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <View style={[
      styles.feedbackFormContainer, 
      { 
        backgroundColor: isDark ? '#141b2b' : '#f8fafc', 
        borderColor: theme.border 
      }
    ]}>
      <Text style={[styles.feedbackFormTitle, { color: theme.primary }]}>Registrar Progreso</Text>
      
      <View style={styles.inputRow}>
        <Text style={[styles.inputLabel, { color: theme.textMuted }]}>Peso usado:</Text>
        <TextInput
          style={[
            styles.textInput, 
            { 
              backgroundColor: theme.card, 
              borderColor: theme.border,
              color: theme.text
            },
            !isEditable && styles.textInputDisabled
          ]}
          placeholder="Ej: 50 kg, 20 lbs..."
          placeholderTextColor={theme.textMuted}
          value={feedback.peso}
          onChangeText={(val) => onUpdateFeedback('peso', val)}
          editable={isEditable}
        />
      </View>

      <View style={styles.effortContainer}>
        <Text style={[styles.inputLabel, { color: theme.textMuted }]}>
          Esfuerzo (RPE 1-10): {feedback.esfuerzo ? `${feedback.esfuerzo}/10` : 'No seleccionado'}
        </Text>
        <View style={styles.effortButtonsRow}>
          {effortLevels.map((num) => {
            const isSelected = feedback.esfuerzo === num;
            return (
              <TouchableOpacity
                key={num}
                style={[
                  styles.effortButton,
                  {
                    backgroundColor: isSelected ? theme.primary : theme.card,
                    borderColor: isSelected ? theme.primary : theme.border,
                  },
                  !isEditable && styles.effortButtonDisabled,
                  !isEditable && isSelected && styles.effortButtonSelectedDisabled
                ]}
                onPress={() => onUpdateFeedback('esfuerzo', num)}
                disabled={!isEditable}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.effortButtonText,
                    {
                      color: isSelected ? (isDark ? '#0f172a' : '#fff') : theme.textMuted
                    },
                    !isEditable && styles.effortButtonTextDisabled
                  ]}
                >
                  {num}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.inputRow}>
        <Text style={[styles.inputLabel, { color: theme.textMuted }]}>Comentarios:</Text>
        <TextInput
          style={[
            styles.textInput, 
            styles.multilineInput, 
            { 
              backgroundColor: theme.card, 
              borderColor: theme.border,
              color: theme.text
            },
            !isEditable && styles.textInputDisabled
          ]}
          placeholder="Comentarios sobre cómo te sentiste..."
          placeholderTextColor={theme.textMuted}
          multiline
          numberOfLines={2}
          value={feedback.comentarios}
          onChangeText={(val) => onUpdateFeedback('comentarios', val)}
          editable={isEditable}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  feedbackFormContainer: {
    marginTop: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  feedbackFormTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  inputRow: {
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  textInput: {
    borderWidth: 1.5,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  multilineInput: {
    height: 50,
    textAlignVertical: 'top',
  },
  effortContainer: {
    marginBottom: 12,
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
    borderWidth: 1.5,
    borderRadius: 8,
    marginHorizontal: 1,
  },
  effortButtonText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  textInputDisabled: {
    backgroundColor: '#e2e8f0',
    opacity: 0.6,
  },
  effortButtonDisabled: {
    opacity: 0.5,
  },
  effortButtonSelectedDisabled: {
    opacity: 0.7,
  },
  effortButtonTextDisabled: {
    opacity: 0.7,
  },
});
