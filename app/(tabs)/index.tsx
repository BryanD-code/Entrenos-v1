
import HomeScreen from "../../src/features/inicio/screens/HomeScreen";
import { Redirect } from "expo-router";
import { useAuthGlobal } from "../../src/context/AuthContext";
import AtletasScreen from "../../src/features/atleta/screens/AtletaScreen";
import EntrenadorScreen from "../../src/features/entrenador/screens/EntrenadorScreen";


export default function Index() {
   const { user } = useAuthGlobal();
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
}

  // app/index.jsx




  

