import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, ActivityIndicator, Text, TextInput, ScrollView, TouchableOpacity, Modal, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getEjercicios, addEjercicio, updateEjercicio, deleteEjercicio } from '../services/exerciseService';
import EjercicioCard from './EjercicioCard';
import { useAuthGlobal } from '../../../context/AuthContext';

const Ejercicio = ({ onSelect }) => {
    const { user } = useAuthGlobal();
    const isEntrenador = user?.role === 'entrenador';

    const [ejercicios, setEjercicios] = useState([]);
    const [filteredEjercicios, setFilteredEjercicios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    // Filtros
    const [searchText, setSearchText] = useState('');
    const [selectedGroup, setSelectedGroup] = useState('Todos');
    const [groups, setGroups] = useState(['Todos']);

    // Modales
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [selectedEjercicio, setSelectedEjercicio] = useState(null);
    const [newExercise, setNewExercise] = useState({ nombre: '', grupo: '', instrucciones: '' });
    const [editInstructions, setEditInstructions] = useState('');

    useEffect(() => {
        fetchEjercicios();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [searchText, selectedGroup, ejercicios]);

    const fetchEjercicios = async () => {
        try {
            setLoading(true);
            const data = await getEjercicios();
            setEjercicios(data);

            // Extraer grupos únicos
            const uniqueGroups = ['Todos', ...new Set(data.filter(item => item.grupo).map(item => item.grupo))];
            setGroups(uniqueGroups);
        } catch (err) {
            setError("No se pudieron cargar los ejercicios");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchEjercicios();
        setRefreshing(false);
    };

    const applyFilters = () => {
        let filtered = ejercicios;

        if (searchText) {
            filtered = filtered.filter(item =>
                item.nombre?.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        if (selectedGroup !== 'Todos') {
            filtered = filtered.filter(item => item.grupo === selectedGroup);
        }

        setFilteredEjercicios(filtered);
    };

    const handleAddExercise = async () => {
        if (!newExercise.nombre || !newExercise.grupo) {
            Alert.alert("Error", "El nombre y el grupo son obligatorios");
            return;
        }

        try {
            setLoading(true);
            await addEjercicio(newExercise);
            setIsAddModalVisible(false);
            setNewExercise({ nombre: '', grupo: '', instrucciones: '' });
            await fetchEjercicios();
            Alert.alert("Éxito", "Ejercicio añadido correctamente");
        } catch (err) {
            Alert.alert("Error", "No se pudo añadir el ejercicio");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateInstructions = async () => {
        try {
            setLoading(true);
            await updateEjercicio(selectedEjercicio.id, { instrucciones: editInstructions });
            setIsEditModalVisible(false);
            await fetchEjercicios();
            Alert.alert("Éxito", "Instrucciones actualizadas");
        } catch (err) {
            Alert.alert("Error", "No se pudieron actualizar las instrucciones");
        } finally {
            setLoading(false);
        }
    };

    const openEditModal = (ejercicio) => {
        if (!isEntrenador) return;
        setSelectedEjercicio(ejercicio);
        setEditInstructions(ejercicio.instrucciones || '');
        setIsEditModalVisible(true);
    };

    const handleDeleteEjercicio = async (ejercicio) => {
        if (!isEntrenador) return;

        const deleteAction = async () => {
            try {
                setLoading(true);
                await deleteEjercicio(ejercicio.id);
                await fetchEjercicios();
                if (Platform.OS === 'web') {
                    window.alert("Ejercicio eliminado");
                } else {
                    Alert.alert("Éxito", "Ejercicio eliminado");
                }
            } catch (err) {
                console.error("Error al eliminar:", err);
                if (Platform.OS === 'web') {
                    window.alert("No se pudo eliminar el ejercicio");
                } else {
                    Alert.alert("Error", "No se pudo eliminar el ejercicio");
                }
            } finally {
                setLoading(false);
            }
        };

        if (Platform.OS === 'web') {
            const confirm = window.confirm(
                `¿Estás seguro de que quieres eliminar "${ejercicio.nombre}"? esta acción no se puede deshacer.`
            );
            if (confirm) {
                await deleteAction();
            }
        } else {
            Alert.alert(
                "Eliminar Ejercicio",
                `¿Estás seguro de que quieres eliminar "${ejercicio.nombre}"? esta acción no se puede deshacer.`,
                [
                    { text: "Cancelar", style: "cancel" },
                    {
                        text: "Eliminar",
                        onPress: deleteAction,
                        style: "destructive"
                    }
                ]
            );
        }
    };

    const handleExercisePress = (item) => {
        if (onSelect) {
            onSelect(item);
        } else {
            console.log('Ejercicio seleccionado:', item.id);
        }
    };

    if (loading && !refreshing && ejercicios.length === 0) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#6200ee" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <MaterialCommunityIcons name="magnify" size={20} color="#666" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar ejercicio..."
                    value={searchText}
                    onChangeText={setSearchText}
                    placeholderTextColor="#999"
                />
                {searchText !== '' && (
                    <TouchableOpacity onPress={() => setSearchText('')}>
                        <MaterialCommunityIcons name="close-circle" size={20} color="#ccc" />
                    </TouchableOpacity>
                )}
            </View>

            {/* Group Filter */}
            <View style={styles.filterWrapper}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterContainer}
                >
                    {groups.map(group => (
                        <TouchableOpacity
                            key={group}
                            style={[
                                styles.chip,
                                selectedGroup === group && styles.chipActive
                            ]}
                            onPress={() => setSelectedGroup(group)}
                        >
                            <Text style={[
                                styles.chipText,
                                selectedGroup === group && styles.chipTextActive
                            ]}>
                                {group}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <FlatList
                data={filteredEjercicios}
                keyExtractor={(item) => item.id}
                onRefresh={onRefresh}
                refreshing={refreshing}
                renderItem={({ item }) => (
                    <EjercicioCard
                        ejercicio={item}
                        onPress={() => handleExercisePress(item)}
                        onLongPress={() => openEditModal(item)}
                        onDelete={isEntrenador ? () => handleDeleteEjercicio(item) : null}
                    />
                )}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <MaterialCommunityIcons name="dumbbell" size={48} color="#ddd" />
                        <Text style={styles.emptyText}>No se encontraron ejercicios</Text>
                    </View>
                }
            />

            {/* Boton flotante para agregar ejercicio */}
            {isEntrenador && (
                <TouchableOpacity
                    style={styles.fab}
                    onPress={() => setIsAddModalVisible(true)}
                >
                    <MaterialCommunityIcons name="plus" size={30} color="#fff" />
                </TouchableOpacity>
            )}

            {/* Modal: Agregar Ejercicio */}
            <Modal visible={isAddModalVisible} animationType="slide" transparent>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.modalOverlay}
                >
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Nuevo Ejercicio</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nombre del ejercicio"
                            value={newExercise.nombre}
                            onChangeText={(text) => setNewExercise({ ...newExercise, nombre: text })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Grupo (Ej: Pecho, Pierna...)"
                            value={newExercise.grupo}
                            onChangeText={(text) => setNewExercise({ ...newExercise, grupo: text })}
                        />
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Instrucciones"
                            multiline
                            numberOfLines={4}
                            value={newExercise.instrucciones}
                            onChangeText={(text) => setNewExercise({ ...newExercise, instrucciones: text })}
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setIsAddModalVisible(false)}
                            >
                                <Text style={styles.buttonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.saveButton]}
                                onPress={handleAddExercise}
                            >
                                <Text style={styles.buttonTextWhite}>Guardar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            {/* Modal: editar instrucciones */}
            <Modal visible={isEditModalVisible} animationType="fade" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Editar Instrucciones</Text>
                        <Text style={styles.subtitle}>{selectedEjercicio?.nombre}</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Instrucciones"
                            multiline
                            numberOfLines={6}
                            value={editInstructions}
                            onChangeText={setEditInstructions}
                            autoFocus
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setIsEditModalVisible(false)}
                            >
                                <Text style={styles.buttonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.saveButton]}
                                onPress={handleUpdateInstructions}
                            >
                                <Text style={styles.buttonTextWhite}>Actualizar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        margin: 16,
        paddingHorizontal: 12,
        borderRadius: 12,
        height: 45,
        borderWidth: 1,
        borderColor: '#eee',
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    filterWrapper: {
        marginBottom: 8,
    },
    filterContainer: {
        paddingHorizontal: 16,
        paddingBottom: 8,
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#fff',
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#eee',
    },
    chipActive: {
        backgroundColor: '#6200ee',
        borderColor: '#6200ee',
    },
    chipText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    chipTextActive: {
        color: '#fff',
    },
    listContent: {
        paddingBottom: 100,
    },
    errorText: {
        color: '#ff3b30',
        fontSize: 16,
        textAlign: 'center',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 50,
    },
    emptyText: {
        color: '#8e8e93',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 10,
    },
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        backgroundColor: '#6200ee',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#1a1a1a',
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 16,
    },
    input: {
        backgroundColor: '#f5f5f7',
        borderRadius: 10,
        padding: 12,
        marginBottom: 12,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#e1e1e8',
    },
    textArea: {
        height: 120,
        textAlignVertical: 'top',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10,
    },
    modalButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
        marginLeft: 10,
    },
    cancelButton: {
        backgroundColor: '#f0f0f5',
    },
    saveButton: {
        backgroundColor: '#6200ee',
    },
    buttonText: {
        fontWeight: '600',
        color: '#666',
    },
    buttonTextWhite: {
        fontWeight: '600',
        color: '#fff',
    },
});

export default Ejercicio;