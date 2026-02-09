
export const fetchWelcomeData = async () => {
  // Simulación de una llamada a la API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ title: "Bienvenido a la App", version: "1.0.0" });
    }, 1000);
  });
};