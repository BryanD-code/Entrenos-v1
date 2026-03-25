import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, TextInput, Alert, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';

const JsonImportModal = ({ visible, onClose, onImport }) => {
    const [jsonInput, setJsonInput] = useState('');

    const handleImport = () => {
        try {
            const parsedData = JSON.parse(jsonInput);
            if (!parsedData.dia && !parsedData.tituloSesion && (!parsedData.ejercicios || !Array.isArray(parsedData.ejercicios))) {
               Alert.alert("Formato Inválido", "El JSON no tiene la estructura de un entrenamiento (dia, tituloSesion, ejercicios).");
               return;
            }
            onImport(parsedData);
            setJsonInput('');
            onClose();
        } catch (error) {
            Alert.alert("Error", "El formato del JSON no es válido. Asegúrate de copiar el código correctamente.");
        }
    };

    const handleCancel = () => {
        setJsonInput('');
        onClose();
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={handleCancel}>
            <SafeAreaView style={styles.safeArea}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Cargar desde JSON</Text>
                        <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
                            <Text style={styles.closeText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView contentContainerStyle={styles.content}>
                        <Text style={styles.instructions}>
                            Pega aquí el objeto JSON con el entrenamiento.
                        </Text>
                        <TextInput
                            style={styles.textInput}
                            multiline
                            placeholder='{\n  "dia": "Lunes",\n  "tituloSesion": "Empuje",\n  "orden": "1",\n  "ejercicios": [\n    ...\n  ]\n}'
                            value={jsonInput}
                            onChangeText={setJsonInput}
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                    </ScrollView>

                    <View style={styles.footer}>
                        <TouchableOpacity onPress={handleImport} style={styles.importButton}>
                            <Text style={styles.importText}>Cargar Datos</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#fff' },
    container: { flex: 1, backgroundColor: '#fff' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
    title: { fontSize: 18, fontWeight: 'bold' },
    closeButton: { padding: 5 },
    closeText: { color: '#ff3b30', fontSize: 16 },
    content: { padding: 20 },
    instructions: { color: '#666', marginBottom: 15, fontSize: 14, lineHeight: 20 },
    textInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 15,
        height: 300,
        textAlignVertical: 'top',
        fontSize: 14,
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    },
    footer: { padding: 20, borderTopWidth: 1, borderTopColor: '#eee' },
    importButton: { padding: 15, borderRadius: 8, backgroundColor: '#6200ee', alignItems: 'center' },
    importText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default JsonImportModal;
