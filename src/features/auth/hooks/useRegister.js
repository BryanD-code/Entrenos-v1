// src/features/auth/hooks/useRegister.js
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuthGlobal } from '../../../context/AuthContext';

export const useRegister = () => {
  const { setUser } = useAuthGlobal();
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', role: '' });

  const handleRegister = () => {
    if (!formData.name || !formData.role) {
      alert("Completa los datos");
      return;
    }

    // 1. ACTUALIZAR EL MODELO (Contexto)
    setUser({ 
      name: formData.name, 
      role: formData.role 
    });

    // 2. NAVEGAR A LA VISTA PRINCIPAL
    // Usamos "/(tabs)" para entrar al grupo de navegación con Footer
    router.replace("/(tabs)"); 
  };

  return { formData, setFormData, handleRegister };
};