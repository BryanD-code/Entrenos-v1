import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Alert, Text, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Header } from '../../../components/Header';
import { useAuthGlobal } from '../../../context/AuthContext';
import { getMisPlanes, savePlanFeedback } from '../services/atletaService';
import { PlanCard } from '../components/PlanCard';

const AtletaScreen = () => {
  const { user } = useAuthGlobal();
  const [planes, setPlanes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedPlanId, setExpandedPlanId] = useState(null);

  // Estados para controlar el feedback rellenable y de guardado
  const [feedbackState, setFeedbackState] = useState({});
  const [savingPlanId, setSavingPlanId] = useState(null);

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

  useEffect(() => {
    fetchPlanes();
  }, [fetchPlanes]);

  const toggleExpand = (id) => {
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

      const resetEjercicios = await savePlanFeedback(plan.id, plan, updatedEjercicios);

      // Actualizamos el estado local del plan a completado = false y ejercicios con feedback vaciado
      setPlanes(prevPlanes =>
        prevPlanes.map(p =>
          p.id === plan.id ? { ...p, ejercicios: resetEjercicios, completado: false } : p
        )
      );

      // Vaciamos el feedbackState local de este plan
      setFeedbackState(prev => {
        const nextFeedback = { ...prev };
        if (nextFeedback[plan.id]) {
          const resetFeedback = {};
          plan.ejercicios.forEach((item, index) => {
            resetFeedback[index] = { peso: '', esfuerzo: null, comentarios: '' };
          });
          nextFeedback[plan.id] = resetFeedback;
        }
        return nextFeedback;
      });

      // Intentar exportación automática a Google Sheets si la URL está definida
      const googleScriptUrl = process.env.EXPO_PUBLIC_GOOGLE_SCRIPT_URL;
      if (googleScriptUrl) {
        try {
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
              ejercicios: updatedEjercicios
            })
          });
          const resJson = await response.json();
          if (resJson.status === "success") {
            showAlert("¡Éxito!", "Tu feedback se ha guardado en la base de datos como una nueva sesión completada y exportado a Google Sheets correctamente.");
            return;
          } else {
            throw new Error(resJson.message || "Error devuelto por Apps Script");
          }
        } catch (sheetError) {
          console.error("Error al exportar automáticamente a Google Sheets:", sheetError);
          showAlert("¡Guardado!", "Feedback guardado en Firebase como una nueva sesión completada, pero ocurrió un problema al exportar a Google Sheets: " + sheetError.message);
          return;
        }
      }

      showAlert("¡Éxito!", "Tu feedback se ha guardado en la base de datos como una nueva sesión completada correctamente.");
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

  return (
    <View style={styles.container}>
      <Header
        title="Mi Entrenamiento"
        rightIcon="notifications-outline"
        onRightIconPress={() => showAlert("Notificaciones", "Sin novedades")}
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
});

export default AtletaScreen;