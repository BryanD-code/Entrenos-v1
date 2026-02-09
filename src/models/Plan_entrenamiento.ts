import { Ejercicio } from './Ejercicio';

export type EjercicioEnPlan = {
    ejercicio: Ejercicio;
    series: string;
    repeticiones: string;
    descanso?: string;
    observaciones?: string;
};

export type Plan_entrenamiento = {
    id?: string;
    dia: string; // Ej: "Lunes" o "Día 1"
    tituloSesion: string; // Ej: "Pierna Hipertrofia"
    orden: number; // Para ordenar las sesiones (1, 2, 3...)
    ejercicios: EjercicioEnPlan[];
    atletaId: string; // ID del atleta asignado
    creadoPor: string; // ID del entrenador
    fechaCreacion?: Object; // Timestamp de Firestore
};