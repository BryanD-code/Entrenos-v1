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

export const savePlanFeedback = async (planId, planData, updatedEjercicios) => {
    try {
        // 1. Guardar la sesión completada en una nueva colección 'entrenamientos_completados'
        const completedRef = collection(db, 'entrenamientos_completados');
        await addDoc(completedRef, {
            planId: planId,
            atletaId: planData.atletaId || '',
            dia: planData.dia || '',
            tituloSesion: planData.tituloSesion || '',
            ejercicios: updatedEjercicios,
            fechaCompletado: serverTimestamp()
        });

        // 2. Vaciamos los campos de feedback en la sesión original (planes_entrenamiento)
        const planRef = doc(db, 'planes_entrenamiento', planId);
        
        // Vaciamos el feedback de cada ejercicio
        const resetEjercicios = updatedEjercicios.map(item => ({
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

        return resetEjercicios;
    } catch (error) {
        console.error("Error saving plan feedback and resetting template:", error);
        throw error;
    }
};
