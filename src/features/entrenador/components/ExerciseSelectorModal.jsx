import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, TextInput, Alert, TouchableOpacity } from 'react-native';
import Ejercicio from '../../Ejercicios/Screens/Ejercicio';

const ExerciseSelectorModal = ({ visible, onClose, onSelect }) => {
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [details, setDetails] = useState({ series: '', repeticiones: '', descanso: '', observaciones: '' });

    useEffect(() => {
        if (visible) {
            setSelectedExercise(null);
            setDetails({ series: '', repeticiones: '', descanso: '', observaciones: '' });
        }
    }, [visible]);

    const handleSelectExercise = (ejercicio) => {
        setSelectedExercise(ejercicio);
    };
    // una vez rellenamos los datos esto se envia a la pantalla de crear rutina
    const handleConfirm = () => {
        if (!details.series || !details.repeticiones) {
            Alert.alert("Faltan datos", "Indica series y repeticiones");
            return;
        }
        onSelect({
            ejercicio: selectedExercise, // Objeto completo
            ...details
        });
        onClose();
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <View style={styles.container}>
                {!selectedExercise ? (
                    <>
                        <View style={styles.header}>
                            <Text style={styles.title}>Selecciona un Ejercicio</Text>
                            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                <Text style={styles.closeText}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                        {/* Renderizamos la pantalla completa de Ejercicios en modo selección */}
                        <View style={{ flex: 1 }}>
                            <Ejercicio onSelect={handleSelectExercise} />
                        </View>
                    </>
                ) : (
                    <View style={styles.configContainer}>
                        <Text style={styles.title}>Configurar {selectedExercise.nombre}</Text>

                        <View style={styles.form}>
                            <View style={styles.row}>
                                <TextInput
                                    style={[styles.input, { flex: 1, marginRight: 5 }]}
                                    placeholder="Series"
                                    keyboardType="numeric"
                                    value={details.series}
                                    onChangeText={t => setDetails({ ...details, series: t })}
                                    autoFocus
                                />
                                <TextInput
                                    style={[styles.input, { flex: 1, marginLeft: 5 }]}
                                    placeholder="Reps (ej: 12)"
                                    value={details.repeticiones}
                                    onChangeText={t => setDetails({ ...details, repeticiones: t })}
                                />
                            </View>
                            <TextInput
                                style={styles.input}
                                placeholder="Descanso (ej: 90s)"
                                value={details.descanso}
                                onChangeText={t => setDetails({ ...details, descanso: t })}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Observaciones / Notas"
                                value={details.observaciones}
                                onChangeText={t => setDetails({ ...details, observaciones: t })}
                            />
                        </View>

                        <View style={styles.buttons}>
                            <TouchableOpacity onPress={() => setSelectedExercise(null)} style={styles.backButton}>
                                <Text style={styles.backText}>Cambiar Ejercicio</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleConfirm} style={styles.confirmButton}>
                                <Text style={styles.confirmText}>Añadir a la Sesión</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
    title: { fontSize: 18, fontWeight: 'bold' },
    closeButton: { padding: 5 },
    closeText: { color: '#ff3b30', fontSize: 16 },
    configContainer: { flex: 1, padding: 20, justifyContent: 'center' },
    form: { marginBottom: 30 },
    row: { flexDirection: 'row', marginBottom: 15 },
    input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 15, marginBottom: 15, fontSize: 18 },
    buttons: { flexDirection: 'row', justifyContent: 'space-between' },
    backButton: { padding: 15, borderRadius: 8, backgroundColor: '#f0f0f0', flex: 1, marginRight: 10, alignItems: 'center' },
    confirmButton: { padding: 15, borderRadius: 8, backgroundColor: '#6200ee', flex: 1, marginLeft: 10, alignItems: 'center' },
    backText: { color: '#333', fontSize: 16 },
    confirmText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default ExerciseSelectorModal;
