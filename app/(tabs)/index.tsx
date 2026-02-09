import { useAuthGlobal } from "../../src/context/AuthContext";
import AtletasScreen from "../../src/features/atleta/screens/AtletaScreen";
import EntrenadorScreen from "../../src/features/entrenador/screens/EntrenadorScreen";
import { View, Text, TouchableOpacity } from "react-native";

//Dependiendo del rol del usuario se muestra una pantalla u otra
export default function Index() {
  const { user, logout } = useAuthGlobal();
  console.log("Rol del usuario en Index.tsx:", user?.role);
  if (user?.role?.toLowerCase() === "atleta") {
    return (
      <AtletasScreen />
    );
  } else if (user?.role?.toLowerCase() === "entrenador") {
    return (
      <EntrenadorScreen />
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Rol no detectado o cuenta incompleta.</Text>
      <Text>Por favor, contacta al administrador.</Text>
      <TouchableOpacity onPress={() => logout()} style={{ marginTop: 20 }}>
        <Text style={{ color: 'blue' }}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}








