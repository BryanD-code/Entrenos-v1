
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { useAuthGlobal } from '../../../context/AuthContext';
import { HeaderBanner } from '../components/HeaderBanner';

const HomeScreen = () => {
  const { user, logout } = useAuthGlobal();

  return (
    <View style={styles.container}>

      <HeaderBanner
        title={user?.username || "Usuario"}
        role={user?.role || "Sin rol asignado"}
      />

      <View style={styles.spacer} />

      <Pressable
        style={styles.button}
        onPress={() => logout()}>
        <Text style={styles.textStyle}>Cerrar Sesión</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#fff' },
  spacer: { height: 1 },
  button: {
    height: 30,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ff5252',
    width: '10%',
    marginVertical: 1,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  }
});

export default HomeScreen;