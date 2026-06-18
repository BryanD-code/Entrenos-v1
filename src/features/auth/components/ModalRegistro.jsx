import React, { useState } from 'react';
import { Modal, StyleSheet, Text, View, Alert, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AuthInput } from './AuthInput';
import { useLogin } from '../hooks/useLogin';
import { useThemeGlobal } from '../../../context/ThemeContext';

const ModalRegistro = ({ visible, onClose }) => {
  const { email, setEmail, password, setPassword, handleRegister } = useLogin();
  const { theme, isDark } = useThemeGlobal();

  const [selectedRole, setSelectedRole] = useState(null);
  const [username, setUsername] = useState('');

  const onFinalRegister = () => {
    if (!selectedRole) {
      Alert.alert("Atención", "Por favor selecciona un rol (Entrenador o Atleta)");
      return;
    }
    if (!username) {
      Alert.alert("Atención", "Por favor ingresa un nombre de usuario");
      return;
    }
    handleRegister(selectedRole, username);
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={[styles.modalView, { backgroundColor: theme.card, shadowColor: isDark ? '#000' : '#888' }]}>
          <Text style={[styles.modalText, { color: theme.text }]}>Crea tu Cuenta</Text>

          <View style={styles.inputContainer}>
            <AuthInput
              placeholder="Nombre de usuario"
              value={username}
              onChangeText={setUsername}
            />
            <AuthInput
              placeholder="Correo electrónico"
              value={email}
              onChangeText={setEmail}
            />
            <AuthInput
              placeholder="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <Text style={[styles.labelRol, { color: theme.textMuted }]}>Selecciona tu rol en la plataforma:</Text>

          <View style={styles.botonesRow}>
            {/* --- Botón Entrenador --- */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.roleCard,
                {
                  backgroundColor: theme.inputBackground,
                  borderColor: selectedRole === 'entrenador' ? theme.primary : theme.border,
                }
              ]}
              onPress={() => setSelectedRole('entrenador')}
            >
              <View style={[styles.iconWrapper, { backgroundColor: selectedRole === 'entrenador' ? theme.primary : theme.border }]}>
                <MaterialCommunityIcons 
                  name="whistle-outline" 
                  size={24} 
                  color={selectedRole === 'entrenador' ? (isDark ? '#0f172a' : '#fff') : theme.textMuted} 
                />
              </View>
              <Text style={[styles.roleText, { color: theme.text, fontWeight: selectedRole === 'entrenador' ? 'bold' : '600' }]}>
                Entrenador
              </Text>
            </TouchableOpacity>

            {/* --- Botón Atleta --- */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.roleCard,
                {
                  backgroundColor: theme.inputBackground,
                  borderColor: selectedRole === 'atleta' ? theme.primary : theme.border,
                }
              ]}
              onPress={() => setSelectedRole('atleta')}
            >
              <View style={[styles.iconWrapper, { backgroundColor: selectedRole === 'atleta' ? theme.primary : theme.border }]}>
                <MaterialCommunityIcons 
                  name="run" 
                  size={24} 
                  color={selectedRole === 'atleta' ? (isDark ? '#0f172a' : '#fff') : theme.textMuted} 
                />
              </View>
              <Text style={[styles.roleText, { color: theme.text, fontWeight: selectedRole === 'atleta' ? 'bold' : '600' }]}>
                Atleta
              </Text>
            </TouchableOpacity>
          </View>

          {/* --- BOTONES DE ACCIÓN --- */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.actionBtn, { backgroundColor: theme.primary }]}
            onPress={onFinalRegister}
          >
            <Text style={[styles.actionBtnText, { color: isDark ? '#0f172a' : '#fff' }]}>Registrarse</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.cancelBtn, { borderColor: theme.border }]}
            onPress={onClose}
          >
            <Text style={[styles.cancelBtnText, { color: theme.textMuted }]}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalView: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  modalText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
  },
  labelRol: {
    fontSize: 14,
    marginBottom: 12,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  botonesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
  },
  roleCard: {
    width: '48%',
    borderWidth: 2,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  roleText: {
    fontSize: 15,
  },
  actionBtn: {
    width: '100%',
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelBtn: {
    width: '100%',
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  cancelBtnText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ModalRegistro;