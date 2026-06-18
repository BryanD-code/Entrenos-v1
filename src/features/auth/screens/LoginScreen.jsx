import React from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLogin } from '../hooks/useLogin';
import ModalRegistro from '../components/ModalRegistro';
import { AuthInput } from '../components/AuthInput';
import { PrimaryButton } from '../../../components/PrimaryButton';
import { useThemeGlobal } from '../../../context/ThemeContext';

const LoginScreen = () => {
  const { email, setEmail, password, setPassword, loading, handleLogin } = useLogin();
  const { theme, isDark } = useThemeGlobal();
  const [modalVisible, setModalVisible] = React.useState(false);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        {/* Decoración superior premium (círculos difusos en el fondo) */}
        <View style={[styles.decorCircle, { backgroundColor: theme.primary, opacity: isDark ? 0.15 : 0.08 }]} />

        <View style={styles.cardContainer}>
          {/* Logo animado / Icono representativo */}
          <View style={[styles.logoContainer, { backgroundColor: isDark ? theme.border : theme.primaryMuted }]}>
            <MaterialCommunityIcons name="fire" size={42} color={theme.primary} />
          </View>

          <Text style={[styles.title, { color: theme.text }]}>ENTRENOS</Text>
          <Text style={[styles.subtitle, { color: theme.textMuted }]}>
            Tu conexión directa con tu entrenador y tus rutinas diarias
          </Text>

          <View style={styles.form}>
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

            <PrimaryButton
              title="Iniciar Sesión"
              onPress={handleLogin}
              loading={loading}
              style={styles.loginBtn}
            />

            <View style={styles.dividerRow}>
              <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
              <Text style={[styles.dividerText, { color: theme.textMuted }]}>o</Text>
              <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
            </View>

            <TouchableOpacity
              style={[styles.registerBtn, { borderColor: theme.primary }]}
              onPress={() => setModalVisible(true)}
              activeOpacity={0.8}
            >
              <Text style={[styles.registerBtnText, { color: theme.primary }]}>Crear una Cuenta</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Modal de Registro */}
        <ModalRegistro
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    position: 'relative',
  },
  decorCircle: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    top: -50,
    right: -50,
    zIndex: 0,
  },
  cardContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 1.5,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
    paddingHorizontal: 16,
  },
  form: {
    width: '100%',
  },
  loginBtn: {
    marginTop: 8,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 14,
    fontWeight: '600',
  },
  registerBtn: {
    height: 55,
    borderWidth: 2,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginTop: 10,
  },
  registerBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;