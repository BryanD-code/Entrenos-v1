// app/(auth)/_layout.jsx
import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ 
      headerShown: true, 
      headerTitleAlign: 'center',
      headerShadowVisible: false // Para un look más limpio
    }}>
      <Stack.Screen name="login" options={{ title: 'Iniciar Sesión' }} />
    </Stack>
  );
}