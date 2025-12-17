// app/index.jsx
import { Redirect } from "expo-router";
import { useAuthGlobal } from "../src/context/AuthContext";

export default function Index() {
  const { user } = useAuthGlobal();

  // Si no hay usuario, al login. Si hay usuario, a las tabs.
  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Redirect href="/(tabs)" />;
}