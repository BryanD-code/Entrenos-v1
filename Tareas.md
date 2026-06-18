# Control de Tareas - Entrenos-v1

En este archivo iremos registrando y haciendo el seguimiento de las tareas del proyecto.

## Lista de Tareas

- [x] Leer el `README.md` y entender el funcionamiento de la aplicación leyendo el código del proyecto.
- [x] Crear e integrar formulario de feedback (peso usado, esfuerzo RPE 1-10, comentarios) por ejercicio en la pantalla del atleta y persistir en Firestore.
- [x] Integrar exportación automática y manual a Google Sheets mediante webhook de Google Apps Script.
- [x] Si el entrenamiento está completado, bloquear campos de progreso de la sesión y habilitar botón de edición. Al completarse todas las sesiones semanales del atleta, archivar la semana en la colección 'entrenamientos_completados' por fecha y vaciar los campos de 'planes_entrenamiento' para reiniciar la rutina semanal.
- [x] Deshabilitar el botón de guardar de cada sesión si no se han completado los campos requeridos (peso usado y esfuerzo) para cada ejercicio de la sesión.
- [x] Para la exportación a Google Sheets de la semana completa, validar que todas las sesiones de esa semana estén marcadas como completadas (en true).
- [x] Definir los siguientes pasos del desarrollo.
- [x] Mejorar la interfaz (UI) con un diseño visual premium: implementar un sistema de tema claro/oscuro con Context API, microinteracciones más sofisticadas en las tarjetas de entrenamiento y rediseñar la pantalla de Login y Registro para que se sientan sumamente profesionales con la paleta de colores actual.
- [x] Permitir al usuario cambiar su avatar de perfil presionando sobre el mismo en el Header, con opciones para tomar una foto con la cámara o seleccionar una imagen desde su galería, subiéndolo a Firebase Storage.


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

---

## Siguientes Pasos del Desarrollo

Proponemos los siguientes pasos para continuar la evolución de la aplicación:
1. **Validaciones en el Backend (Reglas de Seguridad de Firestore):** Asegurar que un atleta solo pueda modificar su propio feedback y que un entrenador no pueda modificar el progreso del atleta una vez completada la semana.
2. **Estadísticas e Historial del Atleta:** Crear una vista de estadísticas en la pantalla del Atleta que muestre el progreso de peso y esfuerzo (RPE) por ejercicio a lo largo del tiempo usando gráficos.
3. **Notificaciones Push:** Integrar Firebase Cloud Messaging (FCM) o Expo Notifications para alertar al atleta cuando el entrenador asigne una nueva rutina, y al entrenador cuando el atleta complete su semana.
4. **Diseño Visual y Temas:** Mejorar la UI usando un sistema de diseño premium, con un tema oscuro/claro y microinteracciones más sofisticadas en las tarjetas de entrenamiento.
