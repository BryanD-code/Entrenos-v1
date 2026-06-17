# Control de Tareas - Entrenos-v1

En este archivo iremos registrando y haciendo el seguimiento de las tareas del proyecto.

## Lista de Tareas

- [x] Leer el `README.md` y entender el funcionamiento de la aplicación leyendo el código del proyecto.
- [ ] Definir los siguientes pasos del desarrollo.

---

## Resumen del Proyecto

### ¿Qué es Entrenos-v1?
Es una aplicación móvil nativa desarrollada con **React Native** y **Expo** para la gestión y seguimiento de entrenamientos personalizados, facilitando la conexión directa entre **Entrenadores** y **Atletas**.

### Arquitectura y Tecnologías Clave:
1. **Desarrollo Frontend**: **React Native** junto con el ecosistema de **Expo**.
2. **Navegación**: **Expo Router**, que utiliza una estructura basada en el sistema de archivos (directorios `app/(auth)` y `app/(tabs)`).
3. **Servicios de Backend**:
   - **Firebase Auth**: Maneja el registro e inicio de sesión de los usuarios.
   - **Cloud Firestore**: Base de datos NoSQL en tiempo real. Almacena los perfiles de usuario (con su rol e información básica) en la colección `users`, y los entrenamientos asignados en la colección `planes_entrenamiento`.
4. **Gestión de Estado Global**: **Context API** (`AuthContext.jsx`) para escuchar los cambios en la sesión de Firebase y propagar el usuario autenticado y su rol por toda la app.

### Flujo de Trabajo y Roles:
*   **Inicio y Redirección**:
    *   La app inicia en `app/index.jsx`, el cual espera a que `RootLayout` (`app/_layout.tsx`) termine de cargar el estado de autenticación.
    *   Si el usuario no está autenticado, es redirigido automáticamente a la pantalla de login `app/(auth)/login.tsx`.
    *   Si está autenticado, se le redirige a la pestaña principal en `app/(tabs)/index.tsx`.
*   **Pantalla según el Rol**:
    *   **Atleta (`AtletaScreen.jsx`)**: Consume la función `getMisPlanes` para listar los entrenamientos ordenados por día. El atleta puede ver los ejercicios detallados (series, repeticiones, descanso), leer observaciones específicas de su entrenador y reproducir videos instructivos de los ejercicios usando `expo-video`.
    *   **Entrenador (`EntrenadorScreen.jsx`)**: Consume la lista de atletas registrados y permite seleccionar a uno. Ofrece un formulario para crear una nueva sesión de entrenamiento (día, título, orden) y agregar ejercicios de forma manual, importar una estructura mediante JSON o modificar la sesión activa de un atleta a través del componente `SesionActiva.jsx`.
