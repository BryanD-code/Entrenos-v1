// app/_layout.jsx
import { Stack } from "expo-router";
import { AuthProvider } from "../src/context/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Si el usuario no está logueado, ve esto: */}
        <Stack.Screen name="(auth)" />
        {/* Si el usuario se loguea, lo mandamos aquí: */}
        <Stack.Screen name="(tabs)" />
      </Stack>
    </AuthProvider>
  );
}