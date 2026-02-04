import { useEffect } from 'react';
import { Stack, useRouter, useSegments, Slot } from 'expo-router';
import { AuthProvider, useAuthGlobal } from "../src/context/AuthContext"; // Ajusta la ruta

// 1. Este componente maneja la lógica de protección
// (Solo puede existir PORQUE está dentro del Provider abajo)
function InitialLayout() {
  const { user, loading } = useAuthGlobal();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inTabsGroup = segments[0] === '(tabs)';

    if (user) {
      if (inAuthGroup || !inTabsGroup) {
        router.replace('/(tabs)');
      }
    } else if (!inAuthGroup) {
      router.replace('/(auth)/login');
    }
  }, [user, loading, segments]);

  // Mientras carga el estado de Auth, no renderizamos nada (o un spinner)
  // Esto evita errores de renderizado antes de saber si hay usuario
  if (loading) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="index" />
    </Stack>
  );
}

// 2. Este es el componente Raíz que exportas
export default function RootLayout() {
  return (
    <AuthProvider>
      <InitialLayout />
    </AuthProvider>
  );
}