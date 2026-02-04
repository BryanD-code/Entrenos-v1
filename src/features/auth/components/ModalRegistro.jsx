import React, { useState } from 'react'; // 1. Importamos useState
import { Modal, StyleSheet, Text, Pressable, View, Alert } from 'react-native';
import { AuthInput } from './AuthInput';
import { useLogin } from '../hooks/useLogin';

const ModalRegistro = ({ visible, onClose }) => {
  const { email, setEmail, password, setPassword, loading, handleRegister } = useLogin();

  // 2. Nuevo estado para saber cuál está seleccionado
  const [selectedRole, setSelectedRole] = useState(null);
  const [username, setUsername] = useState('');

  // Función auxiliar para enviar el registro final
  const onFinalRegister = () => {
    if (!selectedRole) {
      Alert.alert("Atención", "Por favor selecciona un rol (Entrenador o Atleta)");
      return;
    }
    if (!username) {
      Alert.alert("Atención", "Por favor ingresa un nombre de usuario");
      return;
    }
    // Llama a tu hook con el rol seleccionado
    handleRegister(selectedRole, username);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Completa el registro</Text>

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

          <Text style={styles.labelRol}>Selecciona tu rol para registrarte:</Text>

          <View style={styles.botonesRow}>

            {/* --- Botón Entrenador --- */}
            <Pressable
              // LOGICA DE ESTILO CONDICIONAL:
              style={[
                styles.button,
                styles.btnMitad,
                // 1. Si este es el seleccionado -> AZUL (#2196F3)
                selectedRole === 'entrenador'
                  ? { backgroundColor: '#2196F3', opacity: 1 }
                  // 2. Si el OTRO está seleccionado -> OPACO (gris o transparente)
                  : selectedRole === 'atleta'
                    ? { backgroundColor: '#6200ee', opacity: 0.3 }
                    // 3. Si ninguno está seleccionado -> Color Original
                    : styles.bgEntrenador
              ]}
              // Al presionar, solo guardamos el estado, no registramos aún
              onPress={() => setSelectedRole('entrenador')}
            >
              <Text style={styles.textStyle}>Entrenador</Text>
            </Pressable>

            {/* --- Botón Atleta --- */}
            <Pressable
              style={[
                styles.button,
                styles.btnMitad,
                // Misma lógica invertida
                selectedRole === 'atleta'
                  ? { backgroundColor: '#2196F3', opacity: 1 }
                  : selectedRole === 'entrenador'
                    ? { backgroundColor: '#03dac6', opacity: 0.3 }
                    : styles.bgAtleta
              ]}
              onPress={() => setSelectedRole('atleta')}
            >
              <Text style={styles.textStyle}>Atleta</Text>
            </Pressable>
          </View>

          {/* --- BOTÓN ACEPTAR --- */}
          {/* Ahora este botón ejecuta el registro real con el rol seleccionado */}
          <Pressable
            style={[styles.button, styles.bgRegistrar, styles.btnFull]}
            onPress={onFinalRegister}>
            <Text style={styles.textStyle}>Aceptar</Text>
          </Pressable>

          <Pressable
            style={[styles.button, styles.bgCancelar, styles.btnFull]}
            onPress={onClose}>
            <Text style={styles.textStyle}>Cancelar</Text>
          </Pressable>

        </View>
      </View>
    </Modal>
  );
};

// Tus estilos se mantienen exactamente igual
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
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 10,
  },
  labelRol: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    marginTop: 5,
  },
  botonesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 15,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 12,
    elevation: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnMitad: {
    width: '48%',
  },
  btnFull: {
    width: '100%',
    marginTop: 10,
  },
  bgEntrenador: {
    backgroundColor: '#6200ee',
  },
  bgAtleta: {
    backgroundColor: '#03dac6',
  },
  bgRegistrar: {
    backgroundColor: '#2196F3',
  },
  bgCancelar: {
    backgroundColor: '#ff5252',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default ModalRegistro;