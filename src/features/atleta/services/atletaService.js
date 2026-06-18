import { collection, query, where, getDocs, orderBy, doc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../config/firebase';

export const getMisPlanes = async (atletaId) => {
    try {
        const plansRef = collection(db, 'planes_entrenamiento');
        // Filtramos por el ID del atleta y ordenamos por el campo 'orden'
        const q = query(
            plansRef,
            where('atletaId', '==', atletaId),
            orderBy('orden', 'asc')
        );

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Error fetching mis planes:", error);
        throw error;
    }
};

export const savePlanFeedbackSingle = async (planId, updatedEjercicios) => {
    try {
        const planRef = doc(db, 'planes_entrenamiento', planId);
        await updateDoc(planRef, {
            ejercicios: updatedEjercicios,
            completado: true,
            fechaCompletado: serverTimestamp()
        });
    } catch (error) {
        console.error("Error saving single plan feedback:", error);
        throw error;
    }
};

export const archiveAllPlansAndReset = async (atletaId, atletaInfo, planes, currentPlanId, updatedEjercicios) => {
    try {
        // 1. Mapeamos todas las sesiones para recopilar todo el entrenamiento con feedback
        const completedSessions = planes.map(p => {
            const exercises = p.id === currentPlanId ? updatedEjercicios : p.ejercicios;
            return {
                planId: p.id,
                dia: p.dia || '',
                tituloSesion: p.tituloSesion || '',
                ejercicios: exercises,
                completado: p.id === currentPlanId ? true : (p.completado || false)
            };
        });

        // 2. Guardamos la semana completa en la colección 'entrenamientos_completados'
        const completedRef = collection(db, 'entrenamientos_completados');
        await addDoc(completedRef, {
            atletaId: atletaId,
            atletaName: atletaInfo.username || '',
            atletaEmail: atletaInfo.email || '',
            fechaCompletado: serverTimestamp(),
            sesiones: completedSessions
        });

        // 3. Reseteamos todos los planes en la base de datos (planes_entrenamiento)
        const resetPromises = planes.map(async (p) => {
            const planRef = doc(db, 'planes_entrenamiento', p.id);
            const exercisesToReset = p.id === currentPlanId ? updatedEjercicios : p.ejercicios;
            const resetEjercicios = exercisesToReset.map(item => ({
                ...item,
                feedback: {
                    peso: '',
                    esfuerzo: null,
                    comentarios: ''
                }
            }));

            await updateDoc(planRef, {
                ejercicios: resetEjercicios,
                completado: false,
                fechaCompletado: null
            });
        });

        await Promise.all(resetPromises);
    } catch (error) {
        console.error("Error archiving all plans and resetting:", error);
        throw error;
    }
};

export const getEntrenamientosCompletados = async (atletaId) => {
    try {
        const completedRef = collection(db, 'entrenamientos_completados');
        const q = query(
            completedRef,
            where('atletaId', '==', atletaId)
        );
        const querySnapshot = await getDocs(q);
        const list = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Ordenamos en memoria para evitar el requisito de crear un índice compuesto en Firestore
        list.sort((a, b) => {
            const timeA = a.fechaCompletado?.seconds || 0;
            const timeB = b.fechaCompletado?.seconds || 0;
            return timeB - timeA; // descendente (más recientes primero)
        });

        return list;
    } catch (error) {
        console.error("Error fetching completed workouts:", error);
        throw error;
    }
};
