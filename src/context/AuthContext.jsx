import React, { createContext, useState, useEffect, useContext } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
// Ajusta esta ruta a donde tengas tu archivo de configuración real
import { firebaseConfig } from '../config/firebase';

// 1. Inicializamos Firebase una sola vez para este contexto
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Aquí guardaremos usuario + rol + nombre
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 2. Escuchamos cambios en la autenticación (Login/Logout)
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);

      if (currentUser) {
        // A. El usuario hizo login (tiene UID y Email)
        console.log("Usuario autenticado. UID:", currentUser.uid);

        try {
          // B. Vamos a Firestore a buscar el documento con el mismo UID
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            console.log("Datos encontrados en Firestore:", userDocSnap.data());

            // C. ¡Aquí ocurre la magia! Fusionamos Auth + BBDD
            setUser({
              uid: currentUser.uid,
              email: currentUser.email,
              ...userDocSnap.data() // Esto inyecta { role: '...', username: '...' }
            });
          } else {
            console.log("Usuario sin registro en base de datos");
            setUser(currentUser); // Solo tenemos info básica
          }

        } catch (error) {
          console.error("Error buscando rol del usuario:", error);
          setUser(currentUser);
        }
      } else {
        // D. Usuario cerró sesión
        console.log("Sesión cerrada");
        setUser(null);
      }

      setLoading(false);
    });

    return unsubscribe; // Limpieza del observador
  }, []);
  const logout = async () => {
    try {
      await signOut(auth);
      console.log("Usuario ha cerrado sesión");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuthGlobal = () => useContext(AuthContext);