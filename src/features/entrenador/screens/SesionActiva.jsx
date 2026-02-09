import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, FlatList, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getTrainerPlanes, updateTrainingPlan, deleteTrainingPlan } from '../services/trainerService';
import ExerciseSelectorModal from '../components/ExerciseSelectorModal';

const SesionActiva = ({ visible, onClose, atleta }) => {
    const [planes, setPlanes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [isExerciseModalVisible, setExerciseModalVisible] = useState(false);

    // editar sesion
    const [editData, setEditData] = useState(null);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        if (visible && atleta) {
            loadPlanes();
            setSelectedPlan(null);
            setEditData(null);
        }
    }, [visible, atleta]);

    const loadPlanes = async () => {
        setLoading(true);
        try {
            const data = await getTrainerPlanes(atleta.id);
            setPlanes(data);
        } catch (error) {
            Alert.alert("Error", "No se cargaron los planes");
        } finally {
            setLoading(false);
        }
    };

    const handleSelectPlan = (plan) => {
        setSelectedPlan(plan);
        setEditData(JSON.parse(JSON.stringify(plan)));
    };

    const handleAddExercise = (exerciseData) => {
        if (!editData) return;
        const newExercises = [...(editData.ejercicios || []), exerciseData];
        setEditData({ ...editData, ejercicios: newExercises });
    };

    const handleRemoveExercise = (index) => {
        if (!editData) return;
        const newExercises = [...editData.ejercicios];
        newExercises.splice(index, 1);
        setEditData({ ...editData, ejercicios: newExercises });
    };

    const handleSaveChanges = async () => {
        if (!editData) return;

        try {
            setSaving(true);
            await updateTrainingPlan(editData.id, {
                dia: editData.dia,
                tituloSesion: editData.tituloSesion,
                orden: parseInt(editData.orden),
                ejercicios: editData.ejercicios
            });

            showToast("Éxito", "Plan actualizado correctamente");
            await loadPlanes();
            setSelectedPlan(editData);

        } catch (error) {
            console.error(error);
            showToast("Error", "No se pudo actualizar el plan");
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteSession = async () => {
        console.log("Intentando eliminar sesión...", selectedPlan?.id);
        if (!selectedPlan) return;

        const performDelete = async () => {
            try {
                setDeleting(true);
                await deleteTrainingPlan(selectedPlan.id);
                console.log("Sesión eliminada con éxito");
                setSelectedPlan(null);
                setEditData(null);
                await loadPlanes();
                if (Platform.OS === 'web') {
                    window.alert("Éxito: Sesión eliminada");
                } else {
                    Alert.alert("Éxito", "Sesión eliminada");
                }
            } catch (error) {
                console.error("Error al eliminar sesión:", error);
                const errorMsg = "No se pudo eliminar la sesión: " + error.message;
                if (Platform.OS === 'web') {
                    window.alert("Error: " + errorMsg);
                } else {
                    Alert.alert("Error", errorMsg);
                }
            } finally {
                setDeleting(false);
            }
        };

        if (Platform.OS === 'web') {
            if (window.confirm(`¿Estás seguro de que quieres eliminar la sesión "${selectedPlan.tituloSesion}"?`)) {
                await performDelete();
            }
        } else {
            Alert.alert(
                "Eliminar Sesión",
                `¿Estás seguro de que quieres eliminar la sesión "${selectedPlan.tituloSesion}"?`,
                [
                    { text: "Cancelar", style: "cancel", onPress: () => console.log("Cancelado eliminación") },
                    {
                        text: "Eliminar",
                        style: "destructive",
                        onPress: performDelete
                    }
                ]
            );
        }
    };

    const renderPlanItem = ({ item }) => (
        <TouchableOpacity
            style={[styles.planItem, selectedPlan?.id === item.id && styles.selectedPlanItem]}
            onPress={() => handleSelectPlan(item)}
        >
            <View>
                <Text style={[styles.planTitle, selectedPlan?.id === item.id && styles.selectedPlanText]}>
                    {item.dia}
                </Text>
                <Text style={[styles.planValid, selectedPlan?.id === item.id && styles.selectedPlanText]}>
                    {item.tituloSesion}
                </Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color={selectedPlan?.id === item.id ? "#fff" : "#ccc"} />
        </TouchableOpacity>
    );

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                        <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>
                        Sesiones de {atleta?.username || "Atleta"}
                    </Text>
                    <View style={{ width: 24 }} />
                </View>

                <View style={styles.content}>
                    {/* List of sessions */}
                    <View style={styles.sidebar}>
                        <Text style={styles.sidebarTitle}>Sesiones</Text>
                        {loading ? <ActivityIndicator /> : (
                            <FlatList
                                data={planes}
                                renderItem={renderPlanItem}
                                keyExtractor={item => item.id}
                                ListEmptyComponent={<Text style={styles.emptyText}>No hay sesiones</Text>}
                            />
                        )}
                    </View>

                    {/* Editor Area */}
                    <View style={styles.editor}>
                        {selectedPlan && editData ? (
                            <ScrollView contentContainerStyle={styles.editorScroll}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={styles.editorTitle}>Editar Sesión</Text>
                                    <TouchableOpacity onPress={handleDeleteSession} style={styles.deleteButtonHeader}>
                                        {deleting ? <ActivityIndicator color="#fff" size="small" /> : (
                                            <MaterialCommunityIcons name="delete" size={24} color="#fff" />
                                        )}
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.formRow}>
                                    <TextInput
                                        style={[styles.input, { flex: 1, marginRight: 5 }]}
                                        value={editData.dia}
                                        onChangeText={t => setEditData({ ...editData, dia: t })}
                                        placeholder="Día"
                                    />
                                    <TextInput
                                        style={[styles.input, { flex: 2, marginLeft: 5 }]}
                                        value={editData.tituloSesion}
                                        onChangeText={t => setEditData({ ...editData, tituloSesion: t })}
                                        placeholder="Título"
                                    />
                                </View>
                                <TextInput
                                    style={[styles.input, { alignSelf: 'flex-start', minWidth: 80 }]}
                                    value={String(editData.orden)}
                                    onChangeText={t => setEditData({ ...editData, orden: t })}
                                    placeholder="Orden"
                                    keyboardType="numeric"
                                />

                                <View style={styles.exercisesHeader}>
                                    <Text style={styles.subTitle}>Ejercicios ({editData.ejercicios?.length || 0})</Text>
                                    <TouchableOpacity
                                        style={styles.addBtn}
                                        onPress={() => setExerciseModalVisible(true)}
                                    >
                                        <Text style={styles.addBtnText}>+ Añadir</Text>
                                    </TouchableOpacity>
                                </View>

                                {editData.ejercicios?.map((item, index) => (
                                    <View key={index} style={styles.exerciseCard}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.exName}>{item.ejercicio.nombre}</Text>
                                            <View style={styles.exRow}>
                                                <TextInput
                                                    style={styles.miniInput}
                                                    value={item.series}
                                                    onChangeText={t => {
                                                        const newEx = [...editData.ejercicios];
                                                        newEx[index].series = t;
                                                        setEditData({ ...editData, ejercicios: newEx });
                                                    }}
                                                    placeholder="Series"
                                                />
                                                <Text> x </Text>
                                                <TextInput
                                                    style={styles.miniInput}
                                                    value={item.repeticiones}
                                                    onChangeText={t => {
                                                        const newEx = [...editData.ejercicios];
                                                        newEx[index].repeticiones = t;
                                                        setEditData({ ...editData, ejercicios: newEx });
                                                    }}
                                                    placeholder="Reps"
                                                />
                                            </View>
                                        </View>
                                        <TouchableOpacity onPress={() => handleRemoveExercise(index)}>
                                            <MaterialCommunityIcons name="delete" size={24} color="#ff3b30" />
                                        </TouchableOpacity>
                                    </View>
                                ))}

                                <TouchableOpacity
                                    style={[styles.saveButton, saving && styles.disabled]}
                                    onPress={handleSaveChanges}
                                    disabled={saving}
                                >
                                    {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveText}>Guardar Cambios</Text>}
                                </TouchableOpacity>

                            </ScrollView>
                        ) : (
                            <View style={styles.emptyEditor}>
                                <MaterialCommunityIcons name="format-list-bulleted" size={60} color="#ddd" />
                                <Text style={styles.emptyEditorText}>Selecciona una sesión de la izquierda para editarla</Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>

            <ExerciseSelectorModal
                visible={isExerciseModalVisible}
                onClose={() => setExerciseModalVisible(false)}
                onSelect={handleAddExercise}
            />
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f1f1f1' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 50, paddingBottom: 15, paddingHorizontal: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#ddd' },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },
    content: { flex: 1, flexDirection: 'row' },
    sidebar: { width: '35%', backgroundColor: '#fff', borderRightWidth: 1, borderRightColor: '#ddd' },
    sidebarTitle: { padding: 15, fontWeight: 'bold', backgroundColor: '#fafafa', color: '#666' },
    planItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    selectedPlanItem: { backgroundColor: '#6200ee' },
    planTitle: { fontWeight: 'bold', fontSize: 14, color: '#333' },
    selectedPlanText: { color: '#fff' },
    planValid: { fontSize: 12, color: '#666' },
    emptyText: { padding: 20, color: '#999', fontStyle: 'italic' },

    editor: { flex: 1, padding: 10 },
    editorScroll: { paddingBottom: 50 },
    editorTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#333' },
    formRow: { flexDirection: 'row', marginBottom: 15 },
    input: { backgroundColor: '#fff', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#ddd' },
    subTitle: { fontSize: 18, fontWeight: 'bold', color: '#444' },
    exercisesHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, marginBottom: 10 },
    addBtn: { backgroundColor: '#6200ee', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
    addBtnText: { color: '#fff', fontWeight: '600' },

    exerciseCard: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 10, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 1 },
    exName: { fontWeight: 'bold', fontSize: 16, marginBottom: 5 },
    exRow: { flexDirection: 'row', alignItems: 'center' },
    miniInput: { backgroundColor: '#f9f9f9', borderWidth: 1, borderColor: '#eee', padding: 5, borderRadius: 5, width: 60, textAlign: 'center' },

    saveButton: { backgroundColor: '#00c853', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 30 },
    saveText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    disabled: { opacity: 0.6 },

    emptyEditor: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyEditorText: { color: '#999', marginTop: 10 },
    deleteButtonHeader: { backgroundColor: '#ff3b30', padding: 8, borderRadius: 8 },
});

export default SesionActiva;
