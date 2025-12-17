

export const loginUser = async (email, password) => {
  // Simulación básica
  if (email === "test@test.com" && password === "1234") {
    return { name: "Usuario", role: "entrenador" };
  }
  throw new Error("Credenciales inválidas");
};