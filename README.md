# Entrenos-v1 🚀

¡Bienvenido a **Entrenos-v1**! Una aplicación móvil moderna diseñada para la gestión y seguimiento de entrenamientos, optimizada para atletas y entrenadores.

## 📋 Descripción

Entrenos-v1 es una plataforma integral que conecta a entrenadores con atletas para facilitar la planificación, ejecución y análisis de rutinas de ejercicio. Construida con tecnologías de vanguardia, ofrece una experiencia fluida, segura y altamente personalizada.

## ✨ Características Principales

-   **Autenticación Segura:** Registro e inicio de sesión integrados con Firebase.
-   **Roles de Usuario:** Diferenciación clara entre perfiles de **Atleta** y **Entrenador**.
-   **Dashboard Personalizado:** Inicio dinámico que muestra información relevante según el rol del usuario.
-   **Navegación Intuitiva:** Implementación de Expo Router para una navegación basada en archivos eficiente.
-   **Diseño Premium:** Componentes estilizados y responsivos para una mejor experiencia de usuario.

## 🛠️ Tecnologías Utilizadas

-   **[React Native](https://reactnative.dev/):** Framework para el desarrollo de aplicaciones móviles nativas.
-   **[Expo](https://expo.dev/):** Plataforma y ecosistema para facilitar el desarrollo con React Native.
-   **[Firebase](https://firebase.google.com/):** Backend-as-a-Service para autenticación y base de datos en tiempo real.
-   **[Expo Router](https://docs.expo.dev/router/introduction/):** Navegación moderna basada en el sistema de archivos.
-   **[Context API](https://react.dev/learn/passing-data-deeply-with-context):** Gestión del estado global, especialmente para la autenticación.

## 📂 Estructura del Proyecto

```text
Entrenos-v1/
├── app/               # Rutas y navegación (Expo Router)
├── assets/            # Imágenes, fuentes y recursos estáticos
├── src/
│   ├── components/    # Componentes reutilizables (Botones, Headers, etc.)
│   ├── config/        # Configuraciones (Firebase, constantes)
│   ├── context/       # Estados globales (AuthContext)
│   ├── features/      # Módulos principales (Auth, Atleta, Entrenador, Inicio)
│   ├── hooks/         # Hooks personalizados
│   ├── theme/         # Sistema de diseño y estilos globales
│   └── utils/         # Funciones de utilidad
├── app.json           # Configuración de Expo
└── package.json       # Dependencias y scripts
```

## 🚀 Instalación y Configuración

Sigue estos pasos para ejecutar el proyecto localmente:

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/tu-usuario/entrenos-v1.git
    cd entrenos-v1
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Configurar variables de entorno:**
    Crea un archivo `.env` en la raíz del proyecto y añade tus credenciales de Firebase:
    ```env
    EXPO_PUBLIC_FIREBASE_API_KEY=tu_api_key
    EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_auth_domain
    # ... otras variables necesarias
    ```

4.  **Iniciar la aplicación:**
    ```bash
    npx expo start
    ```

5.  **Abrir en dispositivo/emulador:**
    -   Presiona `a` para Android.
    -   Presiona `i` para iOS.
    -   Escanea el código QR con la app **Expo Go**.

## 🤝 Contribución

Si deseas contribuir a este proyecto, por favor:
1. Haz un Fork del proyecto.
2. Crea una rama para tu característica (`git checkout -b feature/NuevaFuncionalidad`).
3. Haz commit de tus cambios (`git commit -m 'Añade NuevaFuncionalidad'`).
4. Haz Push a la rama (`git push origin feature/NuevaFuncionalidad`).
5. Abre un Pull Request.

---
Desarrollado para deportistas y preparadores físicos.
