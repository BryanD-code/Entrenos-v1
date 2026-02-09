import { useState, useEffect } from 'react';

export const useHome = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulamos una carga de datos (esto vendría de un service)
    setTimeout(() => {
      setUser({
        name: "Juan Pérez",
        role: "entrenador", // Puede ser 'entrenador' o 'atleta'
      });
      setLoading(false);
    }, 1000);
  }, []);

  return { user, loading };
};