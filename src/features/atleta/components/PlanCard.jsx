import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ExerciseItem } from './ExerciseItem';
import { useThemeGlobal } from '../../../context/ThemeContext';

export const PlanCard = ({
  plan,
  isExpanded,
  onToggleExpand,
  feedbackState,
  onUpdateFeedback,
  onSaveFeedback,
  isSaving,
  onExportToSheets,
  isEditing,
  onStartEditing,
}) => {
  const { theme, isDark } = useThemeGlobal();

  const allFieldsCompleted = plan.ejercicios?.every((item, index) => {
    const exerciseFeedback = feedbackState[index] || {};
    const pesoVal = exerciseFeedback.peso;
    const esfuerzoVal = exerciseFeedback.esfuerzo;
    return (
      pesoVal !== undefined && pesoVal !== null && String(pesoVal).trim() !== '' &&
      esfuerzoVal !== undefined && esfuerzoVal !== null && esfuerzoVal !== ''
    );
  }) ?? false;

  return (
    <View style={[
      styles.planCard, 
      { 
        backgroundColor: theme.card, 
        borderColor: theme.border,
        shadowColor: isDark ? '#000' : '#888'
      }
    ]}>
      <TouchableOpacity
        style={[styles.planHeader, { backgroundColor: theme.card }]}
        onPress={onToggleExpand}
        activeOpacity={0.8}
      >
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={[styles.planTitle, { color: theme.text }]}>{plan.tituloSesion}</Text>
            {plan.completado && (
              <View style={[styles.completedBadge, { backgroundColor: theme.accent + '15' }]}>
                <MaterialCommunityIcons name="check-circle" size={14} color={theme.accent} style={{ marginRight: 4 }} />
                <Text style={[styles.completedBadgeText, { color: theme.accent }]}>Completado</Text>
              </View>
            )}
          </View>
          <Text style={[styles.planDay, { color: theme.primary }]}>{plan.dia}</Text>
        </View>
        <MaterialCommunityIcons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={24}
          color={theme.primary}
        />
      </TouchableOpacity>

      {isExpanded && (
        <View style={[
          styles.exercisesList, 
          { 
            backgroundColor: isDark ? '#101625' : '#f8f9fb', 
            borderTopColor: theme.border 
          }
        ]}>
          {plan.ejercicios?.map((item, index) => {
            const exerciseFeedback = feedbackState[index] || { peso: '', esfuerzo: null, comentarios: '' };
            return (
              <ExerciseItem
                key={index}
                item={item}
                index={index}
                feedback={exerciseFeedback}
                onUpdateFeedback={(field, val) => onUpdateFeedback(index, field, val)}
                isEditable={!plan.completado || isEditing}
              />
            );
          })}

          {/* Botón condicional de Guardar o Editar según el estado de completado y modo edición */}
          {plan.completado && !isEditing ? (
            <TouchableOpacity
              style={[styles.editButton, { backgroundColor: theme.primary }]}
              onPress={onStartEditing}
              activeOpacity={0.8}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialCommunityIcons name="pencil" size={20} color={isDark ? '#0f172a' : '#fff'} style={{ marginRight: 8 }} />
                <Text style={[styles.editButtonText, { color: isDark ? '#0f172a' : '#fff' }]}>Editar Sesión</Text>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[
                styles.saveFeedbackButton, 
                { backgroundColor: theme.primary, shadowColor: theme.primary },
                (isSaving || !allFieldsCompleted) && styles.disabledButton
              ]}
              onPress={onSaveFeedback}
              disabled={isSaving || !allFieldsCompleted}
              activeOpacity={0.8}
            >
              {isSaving ? (
                <ActivityIndicator color={isDark ? '#0f172a' : '#fff'} />
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <MaterialCommunityIcons name="content-save-check" size={20} color={isDark ? '#0f172a' : '#fff'} style={{ marginRight: 8 }} />
                  <Text style={[styles.saveFeedbackButtonText, { color: isDark ? '#0f172a' : '#fff' }]}>Guardar Feedback de la Sesión</Text>
                </View>
              )}
            </TouchableOpacity>
          )}

          {/* Botón para exportar a Google Sheets si ya está completado */}
          {plan.completado && (
            <TouchableOpacity
              style={[
                styles.exportButton, 
                { backgroundColor: theme.accent, shadowColor: theme.accent },
                isSaving && styles.disabledButton
              ]}
              onPress={onExportToSheets}
              disabled={isSaving}
              activeOpacity={0.8}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialCommunityIcons name="file-excel" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.exportButtonText}>Exportar a Google Sheets</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  planCard: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  planDay: {
    fontSize: 13,
    marginTop: 4,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  exercisesList: {
    borderTopWidth: 1,
    padding: 16,
  },
  saveFeedbackButton: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  saveFeedbackButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  exportButton: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  exportButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.4,
    elevation: 0,
    shadowOpacity: 0,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    marginLeft: 10,
  },
  completedBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  editButton: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  editButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
});
