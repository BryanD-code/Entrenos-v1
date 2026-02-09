import { View, Text, StyleSheet } from 'react-native';

export const HeaderBanner = ({ title, role }) => (
  <View style={[
    styles.banner,
    role === 'entrenador' ? styles.bgEntrenador : styles.bgAtleta
  ]}>
    <Text style={styles.title}>
      {title}
      <Text style={role === 'entrenador' ? styles.textEntrenador : styles.textAtleta}>
        ({role})
      </Text>
    </Text>
  </View>
);

const styles = StyleSheet.create({
  banner: { padding: 20, borderRadius: 12, marginVertical: 10 },
  bgEntrenador: { backgroundColor: '#1b5e20' }, // Verde oscuro
  bgAtleta: { backgroundColor: '#0d47a1' },     // Azul oscuro
  title: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  textEntrenador: { color: '#69f0ae' }, // Verde claro brillante
  textAtleta: { color: '#40c4ff' },     // Azul claro brillante
});