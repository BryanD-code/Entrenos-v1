import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { firebaseConfig } from '../../../../firebase-config';
import { initializeApp } from "firebase/app";



export const useLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  const handleRegister = () => {
    createUserWithEmailAndPassword(auth, email, password)
     .then (() => {
      console.log("Registro exitoso");
      const user = userCredential.user;
      console.log(user);
     })
     .catch((error) => {
      console.log(error);
     });
    };
  const handleLogin = async () => {
    // 1. Validaciones simples
    if (!email || !password) {
      alert("Por favor ingresa correo y contraseña");
      return;
    }

    setLoading(true);

    try {
      // 2. Intentar loguear con Firebase
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Login exitoso");

      // 3. Navegar a la pantalla principal (ajusta la ruta según tu app)
      router.replace('/(tabs)'); 
      
    } catch (error) {
      console.log(error.code);
      // 4. Manejo de errores amigable
      if (error.code === 'auth/invalid-email') alert("El formato del correo no es válido.");
      else if (error.code === 'auth/user-not-found') alert("No existe una cuenta con este correo.");
      else if (error.code === 'auth/wrong-password') alert("Contraseña incorrecta.");
      else if (error.code === 'auth/invalid-credential') alert("Credenciales incorrectas.");
      else alert("Ocurrió un error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return { email, setEmail, password, setPassword, loading, handleLogin, handleRegister };
};