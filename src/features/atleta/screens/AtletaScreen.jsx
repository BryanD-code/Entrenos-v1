import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Alert, Text, Platform, TouchableOpacity, LayoutAnimation, UIManager } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Header } from '../../../components/Header';
import { useAuthGlobal } from '../../../context/AuthContext';
import { getMisPlanes, savePlanFeedbackSingle, archiveAllPlansAndReset, getEntrenamientosCompletados } from '../services/atletaService';
import { PlanCard } from '../components/PlanCard';
import { useThemeGlobal } from '../../../context/ThemeContext';

const AtletaScreen = () => {
  const { user } = useAuthGlobal();
  const { theme, isDark } = useThemeGlobal();
  const [planes, setPlanes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedPlanId, setExpandedPlanId] = useState(null);

  const [feedbackState, setFeedbackState] = useState({});
  const [savingPlanId, setSavingPlanId] = useState(null);
  const [editingPlans, setEditingPlans] = useState({});
  const [completedWeeks, setCompletedWeeks] = useState([]);

  // Función auxiliar para mostrar alertas compatibles con Web y Nativo
  const showAlert = (title, message) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}\n\n${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const fetchPlanes = useCallback(async () => {
    try {
      if (user?.uid) {
        const data = await getMisPlanes(user.uid);
        setPlanes(data);

        // Inicializamos el estado local de feedback con los datos ya existentes (si los hay)
        const initialFeedback = {};
        data.forEach((plan) => {
          initialFeedback[plan.id] = {};
          plan.ejercicios?.forEach((item, index) => {
            initialFeedback[plan.id][index] = {
              peso: item.feedback?.peso || '',
              esfuerzo: item.feedback?.esfuerzo || null,
              comentarios: item.feedback?.comentarios || '',
            };
          });
        });
        setFeedbackState(initialFeedback);

        if (data.length > 0) {
          showAlert("¡Nuevos Entrenamientos!", "Tienes planes asignados por tu entrenador.");
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  const fetchCompletedWeeks = useCallback(async () => {
    try {
      if (user?.uid) {
        const data = await getEntrenamientosCompletados(user.uid);
        setCompletedWeeks(data);
      }
    } catch (error) {
      console.error("Error fetching completed weeks:", error);
    }
  }, [user?.uid]);

  useEffect(() => {
    fetchPlanes();
    fetchCompletedWeeks();
  }, [fetchPlanes, fetchCompletedWeeks]);

  const toggleExpand = (id) => {
    if (Platform.OS === 'android') {
      if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
      }
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedPlanId(expandedPlanId === id ? null : id);
  };

  const handleUpdateFeedback = (planId, index, field, value) => {
    setFeedbackState(prev => ({
      ...prev,
      [planId]: {
        ...prev[planId],
        [index]: {
          ...prev[planId]?.[index],
          [field]: value
        }
      }
    }));
  };

  const handleAutofillTestData = () => {
    const filledFeedback = {};
    planes.forEach((plan) => {
      filledFeedback[plan.id] = {};
      plan.ejercicios?.forEach((item, index) => {
        filledFeedback[plan.id][index] = {
          peso: item.feedback?.peso || `${30 + (index * 10)} kg`,
          esfuerzo: item.feedback?.esfuerzo || (7 + (index % 3)),
          comentarios: item.feedback?.comentarios || 'Completado con buena técnica y sensaciones.',
        };
      });
    });
    setFeedbackState(prev => ({
      ...prev,
      ...filledFeedback
    }));
    showAlert("Autorellenado", "Se han cargado datos de prueba en todas las sesiones de esta semana.");
  };

  const handleSaveFeedback = async (plan) => {
    try {
      setSavingPlanId(plan.id);

      // Mapeamos los ejercicios actuales e inyectamos su respectivo feedback
      const updatedEjercicios = plan.ejercicios.map((item, index) => {
        const feedback = feedbackState[plan.id]?.[index] || { peso: '', esfuerzo: null, comentarios: '' };
        return {
          ...item,
          feedback: {
            peso: feedback.peso,
            esfuerzo: feedback.esfuerzo,
            comentarios: feedback.comentarios
          }
        };
      });

      // Verificamos si completando esta sesión se habrán completado todas las sesiones de todas las semanas
      const otherPlanesCompleted = planes
        .filter(p => p.id !== plan.id)
        .every(p => p.completado === true);

      const allCompleted = otherPlanesCompleted;

      if (allCompleted) {
        // Guardamos todo el registro completo semanal y reseteamos todas las plantillas en Firestore
        await archiveAllPlansAndReset(user.uid, user, planes, plan.id, updatedEjercicios);

        // Actualizamos el estado local: todos los planes a completado = false y vaciamos sus feedbacks
        setPlanes(prevPlanes =>
          prevPlanes.map(p => {
            const exercisesToReset = p.id === plan.id ? updatedEjercicios : p.ejercicios;
            const resetEjercicios = exercisesToReset.map(item => ({
              ...item,
              feedback: { peso: '', esfuerzo: null, comentarios: '' }
            }));
            return {
              ...p,
              ejercicios: resetEjercicios,
              completado: false
            };
          })
        );

        // Vaciamos el feedbackState local de todos los planes
        setFeedbackState({});
        setEditingPlans({});

        // Actualizamos la lista de semanas completadas en la UI
        await fetchCompletedWeeks();

        showAlert("¡Semana Completada!", "Has terminado todos tus entrenamientos de la semana. Se ha guardado el registro completo y se han reiniciado tus rutinas para la siguiente.");
      } else {
        // Guardamos el feedback de esta sesión individualmente en Firestore
        await savePlanFeedbackSingle(plan.id, updatedEjercicios);

        // Actualizamos el estado local de este plan a completado = true y sus feedbacks actuales
        setPlanes(prevPlanes =>
          prevPlanes.map(p =>
            p.id === plan.id ? { ...p, ejercicios: updatedEjercicios, completado: true } : p
          )
        );

        // Bloqueamos los campos desactivando el modo edición de esta sesión
        setEditingPlans(prev => ({
          ...prev,
          [plan.id]: false
        }));

        showAlert("¡Sesión Guardada!", "Se ha guardado el progreso de esta sesión correctamente y ha quedado bloqueada para edición.");
      }

      // Intentar exportación automática a Google Sheets si la URL está definida
      const googleScriptUrl = process.env.EXPO_PUBLIC_GOOGLE_SCRIPT_URL;
      if (googleScriptUrl) {
        try {
          let payload;
          if (allCompleted) {
            const completedSessions = planes.map(p => {
              const exercises = p.id === plan.id ? updatedEjercicios : p.ejercicios;
              return {
                dia: p.dia || '',
                tituloSesion: p.tituloSesion || '',
                ejercicios: exercises,
                completado: p.id === plan.id ? true : (p.completado || false)
              };
            });
            payload = {
              atletaName: user.username || user.email || 'Atleta',
              atletaEmail: user.email || '',
              fechaCompletado: new Date().toLocaleString(),
              sesiones: completedSessions
            };
          } else {
            payload = {
              atletaName: user.username || user.email || 'Atleta',
              atletaEmail: user.email || '',
              dia: plan.dia,
              tituloSesion: plan.tituloSesion,
              ejercicios: updatedEjercicios
            };
          }

          const response = await fetch(googleScriptUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'text/plain',
            },
            body: JSON.stringify(payload)
          });
          const resJson = await response.json();
          if (resJson.status !== "success") {
            throw new Error(resJson.message || "Error devuelto por Apps Script");
          }
        } catch (sheetError) {
          console.error("Error al exportar automáticamente a Google Sheets:", sheetError);
          showAlert("¡Guardado!", "Se ha guardado en Firebase, pero ocurrió un problema al exportar a Google Sheets: " + sheetError.message);
        }
      }
    } catch (error) {
      console.error("Error guardando feedback:", error);
      showAlert("Error", "No se pudo guardar el feedback: " + error.message);
    } finally {
      setSavingPlanId(null);
    }
  };

  const handleExportToSheets = async (plan) => {
    const googleScriptUrl = process.env.EXPO_PUBLIC_GOOGLE_SCRIPT_URL;
    if (!googleScriptUrl) {
      showAlert(
        "Google Sheets no configurado",
        "Por favor, configure la variable EXPO_PUBLIC_GOOGLE_SCRIPT_URL en su archivo .env con la URL de su Web App de Google Apps Script."
      );
      return;
    }

    try {
      setSavingPlanId(plan.id);

      const ejercicios = plan.ejercicios.map((item, index) => {
        const feedback = feedbackState[plan.id]?.[index] || { peso: '', esfuerzo: null, comentarios: '' };
        return {
          ...item,
          feedback: {
            peso: feedback.peso,
            esfuerzo: feedback.esfuerzo,
            comentarios: feedback.comentarios
          }
        };
      });

      const response = await fetch(googleScriptUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify({
          atletaName: user.username || '',
          atletaEmail: user.email || '',
          dia: plan.dia,
          tituloSesion: plan.tituloSesion,
          ejercicios: ejercicios
        })
      });

      const resJson = await response.json();
      if (resJson.status === "success") {
        showAlert("¡Exportado!", "La sesión ha sido exportada a Google Sheets con éxito.");
      } else {
        throw new Error(resJson.message || "Error desconocido del script");
      }
    } catch (error) {
      console.error("Error al exportar a Google Sheets:", error);
      showAlert("Error de Exportación", "No se pudo exportar la sesión: " + error.message);
    } finally {
      setSavingPlanId(null);
    }
  };

  const handleExportSpecificWeek = async (week) => {
    const googleScriptUrl = process.env.EXPO_PUBLIC_GOOGLE_SCRIPT_URL;
    if (!googleScriptUrl) {
      showAlert(
        "Google Sheets no configurado",
        "Por favor, configure la variable EXPO_PUBLIC_GOOGLE_SCRIPT_URL en su archivo .env con la URL de su Web App de Google Apps Script."
      );
      return;
    }

    try {
      // Validar que todas las sesiones de esa semana estén marcadas como completadas (en true)
      const allSessionsCompleted = week.sesiones && week.sesiones.length > 0 && week.sesiones.every(sesion => {
        if (sesion.completado !== undefined) {
          return sesion.completado === true;
        }
        // Fallback para sesiones antiguas que no tengan la propiedad 'completado' guardada:
        // Se considera completada si tiene ejercicios registrados y cada uno tiene peso y esfuerzo
        return sesion.ejercicios && sesion.ejercicios.every(ex => 
          ex.feedback && 
          ex.feedback.peso !== undefined && ex.feedback.peso !== null && String(ex.feedback.peso).trim() !== '' &&
          ex.feedback.esfuerzo !== undefined && ex.feedback.esfuerzo !== null && ex.feedback.esfuerzo !== ''
        );
      });

      if (!allSessionsCompleted) {
        showAlert("Error de Validación", "No se puede exportar la semana completa porque contiene sesiones no completadas.");
        return;
      }

      setLoading(true);

      // Damos formato a la fecha de finalización si es un timestamp de Firestore
      let fechaStr = "";
      if (week.fechaCompletado) {
        if (week.fechaCompletado.seconds) {
          fechaStr = new Date(week.fechaCompletado.seconds * 1000).toLocaleString();
        } else {
          fechaStr = week.fechaCompletado;
        }
      } else {
        fechaStr = new Date().toLocaleString();
      }

      const response = await fetch(googleScriptUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify({
          atletaName: week.atletaName || user.username || 'Atleta',
          atletaEmail: week.atletaEmail || user.email || '',
          fechaCompletado: fechaStr,
          sesiones: week.sesiones || []
        })
      });

      const resJson = await response.json();
      if (resJson.status === "success") {
        showAlert("¡Exportado!", "El entrenamiento semanal seleccionado ha sido exportado a Google Sheets con éxito.");
      } else {
        throw new Error(resJson.message || "Error del script");
      }
    } catch (error) {
      console.error("Error al exportar semana completada:", error);
      showAlert("Error de Exportación", "No se pudo exportar la semana completada: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header
        title="Mi Entrenamiento"
        rightIcon="notifications-outline"
        onRightIconPress={() => showAlert("Notificaciones", "Sin novedades")}
      />

      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 50 }} />
        ) : planes.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="clipboard-text-outline" size={60} color={theme.textMuted} />
            <Text style={[styles.emptyText, { color: theme.textMuted }]}>No tienes entrenamientos asignados aún.</Text>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Botón para rellenar datos de prueba rápidamente (deshabilitado temporalmente) */}
            {false && (
              <TouchableOpacity
                style={styles.autofillButton}
                onPress={handleAutofillTestData}
              >
                <MaterialCommunityIcons name="flash" size={18} color="#fff" style={{ marginRight: 6 }} />
                <Text style={styles.autofillButtonText}>Autorellenar Datos de Prueba para Testear</Text>
              </TouchableOpacity>
            )}

            {/* Historial de Semanas Completadas para Exportación */}
            {completedWeeks.length > 0 && (
              <View style={[
                styles.historySection, 
                { 
                  backgroundColor: theme.card, 
                  borderColor: theme.border,
                  shadowColor: isDark ? '#000' : '#888'
                }
              ]}>
                <Text style={[
                  styles.historyTitle, 
                  { 
                    color: theme.text, 
                    borderBottomColor: theme.border 
                  }
                ]}>Historial de Semanas Completadas</Text>
                {completedWeeks.map((week) => {
                  let dateStr = "Reciente";
                  if (week.fechaCompletado) {
                    if (week.fechaCompletado.seconds) {
                      dateStr = new Date(week.fechaCompletado.seconds * 1000).toLocaleString();
                    } else {
                      dateStr = week.fechaCompletado;
                    }
                  }
                  return (
                    <View key={week.id} style={[styles.historyItem, { borderBottomColor: theme.border }]}>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.historyText, { color: theme.textMuted }]}>Semana finalizada el:</Text>
                        <Text style={[styles.historyDateText, { color: theme.text }]}>{dateStr}</Text>
                        <Text style={[styles.historySubText, { color: theme.textMuted }]}>{week.sesiones?.length || 0} sesiones registradas</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.exportWeekButton}
                        onPress={() => handleExportSpecificWeek(week)}
                      >
                        <MaterialCommunityIcons name="file-excel" size={16} color="#fff" style={{ marginRight: 4 }} />
                        <Text style={styles.exportWeekButtonText}>Exportar</Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            )}

            {planes.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                isExpanded={expandedPlanId === plan.id}
                onToggleExpand={() => toggleExpand(plan.id)}
                feedbackState={feedbackState[plan.id] || {}}
                onUpdateFeedback={(index, field, val) => handleUpdateFeedback(plan.id, index, field, val)}
                onSaveFeedback={() => handleSaveFeedback(plan)}
                isSaving={savingPlanId === plan.id}
                onExportToSheets={() => handleExportToSheets(plan)}
                isEditing={!!editingPlans[plan.id]}
                onStartEditing={() => setEditingPlans(prev => ({ ...prev, [plan.id]: true }))}
              />
            ))}
          </ScrollView>
        )}
      </View>
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
  autofillButton: {
    flexDirection: 'row',
    backgroundColor: '#ff9500',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#ff9500',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  autofillButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  historySection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e8e8ed',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  historyTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f5',
    paddingBottom: 6,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5fa',
  },
  historyText: {
    fontSize: 12,
    color: '#666',
  },
  historyDateText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 2,
  },
  historySubText: {
    fontSize: 11,
    color: '#999',
  },
  exportWeekButton: {
    flexDirection: 'row',
    backgroundColor: '#0f9d58',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0f9d58',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 1,
  },
  exportWeekButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default AtletaScreen;