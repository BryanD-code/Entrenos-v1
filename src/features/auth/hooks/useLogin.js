// src/features/auth/hooks/useLogin.js
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { loginUser } from '../services/authService';



export const useLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const user = await loginUser(email, password);
      console.log("Login exitoso:", user);
      // Navegar a la pantalla principal
      router.replace('/inicio'); 
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  return { email, setEmail, password, setPassword, loading, handleLogin };
};