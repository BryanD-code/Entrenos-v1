import { useRouter } from 'expo-router';
import { initializeApp } from "firebase/app";
// 1. IMPORTANTE: Agregamos las funciones de Firestore (Base de Datos)
import { getFirestore, doc, setDoc } from 'firebase/firestore'; 
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';

import { firebaseConfig } from '../../../../firebase-config';

export const useLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Inicialización
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app); // 2. Inicializamos la base de datos

  // 3. MODIFICADO: handleRegister ahora recibe los parámetros extra
  const handleRegister = async (role, username) => {
    
    // Validaciones básicas
    if (!email || !password || !role || !username) {
      alert("Por favor completa todos los campos (email, contraseña, usuario y rol).");
      return;
    }

    setLoading(true); // Iniciamos carga

    try {
      // A. Crear usuario en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const uid = user.uid; // Obtenemos el ID único generado

      console.log("Usuario creado en Auth con ID:", uid);

      // B. Guardar Rol y Nombre en Firestore Database
      // Creamos una carpeta en la colección "users" con el nombre del UID
      await setDoc(doc(db, "users", uid), {
        uid: uid,
        username: username,
        email: email,
        role: role, // Aquí guardamos si es 'entrenador' o 'atleta'
        createdAt: new Date().toISOString()
      });

      alert(`¡Registro exitoso! Bienvenido ${username}`);
      
      // C. Navegar automáticamente a la app principal
      router.replace('/(tabs)');

    } catch (error) {
      console.log(error);
      
      // Manejo de errores específicos
      if (error.code === 'auth/email-already-in-use') {
        alert("El correo ya está en uso.");
      } else if (error.code === 'auth/invalid-email') {
        alert("El formato del correo no es válido.");
      } else if (error.code === 'auth/weak-password') {
        alert("La contraseña es muy débil (mínimo 6 caracteres).");
      } else {
        alert("Error al registrar: " + error.message);
      }
    } finally {
      setLoading(false); // Terminamos carga
    }
  };

  const handleLogin = async () => {
    // 1. Validaciones simples
    if (!email || !password) {
      alert("Por favor ingresa correo y contraseña");
      return;
    }

    

    try {
      
      setLoading(true);

      // 2. Intentar loguear con Firebase
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Login exitoso");
      
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