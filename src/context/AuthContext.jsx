import React, { createContext, useState, useEffect, useContext } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../config/firebase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Aquí guardaremos usuario + rol + nombre + photoURL
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //  Escuchamos cambios en la autenticación (Login/Logout)
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);

      if (currentUser) {
        //  El usuario hizo login (tiene UID y Email)
        console.log("Usuario autenticado. UID:", currentUser.uid);

        try {
          //  Vamos a Firestore a buscar el documento con el mismo UID
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            console.log("Datos encontrados en Firestore:", userDocSnap.data());

            //  Fusionamos Auth + BBDD
            setUser({
              uid: currentUser.uid,
              email: currentUser.email,
              ...userDocSnap.data() // Esto inyecta { role: '...', username: '...', photoURL: '...' }
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
        // Usuario cerró sesión
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

  const updateProfileImage = async (uri) => {
    if (!user) return;
    try {
      // 1. Obtener la referencia de la imagen y convertirla a blob
      const response = await fetch(uri);
      const blob = await response.blob();
      
      // 2. Definir la ruta en Storage: avatars/uid.jpg
      const fileRef = ref(storage, `avatars/${user.uid}.jpg`);
      
      // 3. Subir el archivo
      await uploadBytes(fileRef, blob);
      
      // 4. Obtener la URL de descarga
      const downloadUrl = await getDownloadURL(fileRef);

      // 5. Actualizar la referencia en la colección 'users' de Firestore
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        photoURL: downloadUrl
      });

      // 6. Actualizar el estado local global
      setUser(prev => ({
        ...prev,
        photoURL: downloadUrl
      }));

      return downloadUrl;
    } catch (error) {
      console.error("Error al actualizar la imagen de perfil:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, updateProfileImage }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuthGlobal = () => useContext(AuthContext);