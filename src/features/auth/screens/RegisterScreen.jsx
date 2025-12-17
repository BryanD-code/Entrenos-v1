// src/features/auth/screens/RegisterScreen.jsx
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRegister } from '../hooks/useRegister';

const RegisterScreen = () => {
  const { formData, setFormData, handleRegister } = useRegister();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Cuenta</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre completo"
        onChangeText={(val) => setFormData({ ...formData, name: val })}
      />

      <Text style={styles.label}>¿Cuál es tu rol?</Text>
      
      <View style={styles.roleContainer}>
        <TouchableOpacity 
          style={[styles.roleBtn, formData.role === 'entrenador' && styles.entrenadorActive]}
          onPress={() => setFormData({ ...formData, role: 'entrenador' })}
        >
          <Text style={styles.roleText}>Soy Entrenador</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.roleBtn, formData.role === 'atleta' && styles.atletaActive]}
          onPress={() => setFormData({ ...formData, role: 'atleta' })}
        >
          <Text style={styles.roleText}>Soy Atleta</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.mainBtn} onPress={handleRegister}>
        <Text style={styles.mainBtnText}>Finalizar Registro</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 25, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  input: { backgroundColor: '#f0f0f0', padding: 15, borderRadius: 10, marginBottom: 20 },
  label: { fontSize: 16, marginBottom: 15, fontWeight: '600' },
  roleContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40 },
  roleBtn: { width: '48%', padding: 20, borderRadius: 10, borderWidth: 1, borderColor: '#ccc', alignItems: 'center' },
  entrenadorActive: { backgroundColor: '#e8f5e9', borderColor: '#2e7d32' },
  atletaActive: { backgroundColor: '#e3f2fd', borderColor: '#1565c0' },
  roleText: { fontWeight: '500' },
  mainBtn: { backgroundColor: '#6200ee', padding: 18, borderRadius: 10, alignItems: 'center' },
  mainBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});

export default RegisterScreen;