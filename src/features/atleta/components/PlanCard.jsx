import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ExerciseItem } from './ExerciseItem';

export const PlanCard = ({
  plan,
  isExpanded,
  onToggleExpand,
  feedbackState,
  onUpdateFeedback,
  onSaveFeedback,
  isSaving,
  onExportToSheets,
}) => {
  return (
    <View style={styles.planCard}>
      <TouchableOpacity
        style={styles.planHeader}
        onPress={onToggleExpand}
      >
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.planTitle}>{plan.tituloSesion}</Text>
            {plan.completado && (
              <View style={styles.completedBadge}>
                <MaterialCommunityIcons name="check-circle" size={14} color="#4caf50" style={{ marginRight: 4 }} />
                <Text style={styles.completedBadgeText}>Completado</Text>
              </View>
            )}
          </View>
          <Text style={styles.planDay}>{plan.dia}</Text>
        </View>
        <MaterialCommunityIcons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={24}
          color="#666"
        />
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.exercisesList}>
          {plan.ejercicios?.map((item, index) => {
            const exerciseFeedback = feedbackState[index] || { peso: '', esfuerzo: null, comentarios: '' };
            return (
              <ExerciseItem
                key={index}
                item={item}
                index={index}
                feedback={exerciseFeedback}
                onUpdateFeedback={(field, val) => onUpdateFeedback(index, field, val)}
              />
            );
          })}

          {/* Botón para guardar feedback de toda la sesión */}
          <TouchableOpacity
            style={[styles.saveFeedbackButton, isSaving && styles.disabledButton]}
            onPress={onSaveFeedback}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialCommunityIcons name="content-save-check" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.saveFeedbackButtonText}>Guardar Feedback de la Sesión</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Botón para exportar a Google Sheets si ya está completado */}
          {plan.completado && (
            <TouchableOpacity
              style={[styles.exportButton, isSaving && styles.disabledButton]}
              onPress={onExportToSheets}
              disabled={isSaving}
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
  saveFeedbackButton: {
    flexDirection: 'row',
    backgroundColor: '#6200ee',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    shadowColor: '#6200ee',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  saveFeedbackButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  exportButton: {
    flexDirection: 'row',
    backgroundColor: '#0f9d58',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: '#0f9d58',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  exportButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.6,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 10,
  },
  completedBadgeText: {
    fontSize: 11,
    color: '#2e7d32',
    fontWeight: 'bold',
  },
});
