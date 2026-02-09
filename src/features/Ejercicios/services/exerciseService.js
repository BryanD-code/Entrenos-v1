import { collection, getDocs, query, orderBy, addDoc, doc, updateDoc, deleteDoc, serverTimestamp, where, limit } from 'firebase/firestore';
import { db } from '../../../config/firebase';

import { MUSCLE_GROUPS } from '../data/muscleGroups';

export const getEjercicios = async () => {
    try {
        const ejerciciosRef = collection(db, 'ejercicios');

        // Creamos un array de promesas, una por cada grupo muscular
        const promises = MUSCLE_GROUPS.map(async (grupo) => {
            const q = query(
                ejerciciosRef,
                where('grupo', '==', grupo),
                orderBy('nombre'),
                //limito a 100 ejercicios por grupo por el limite de firebase
                limit(100)
            );
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        });

        // Esperamos a que todas las consultas terminen
        const results = await Promise.all(promises);

        // un solo array de ejercicios
        // Usamos un Map para eliminar duplicados por ID, por si acaso un ejercicio tuviera múltiples grupos (aunque aquí filtramos por igualdad estricta)
        const ejerciciosMap = new Map();
        results.flat().forEach(ejercicio => {
            ejerciciosMap.set(ejercicio.id, ejercicio);
        });

        return Array.from(ejerciciosMap.values());
    } catch (error) {
        console.error("Error fetching ejercicios:", error);
        throw error;
    }
};

export const addEjercicio = async (ejercicioData) => {
    try {
        const ejerciciosRef = collection(db, 'ejercicios');
        const docRef = await addDoc(ejerciciosRef, {
            ...ejercicioData,
            createdAt: serverTimestamp()
        });
        return { id: docRef.id, ...ejercicioData };
    } catch (error) {
        console.error("Error adding ejercicio:", error);
        throw error;
    }
};

export const updateEjercicio = async (id, updateData) => {
    try {
        const ejercicioRef = doc(db, 'ejercicios', id);
        await updateDoc(ejercicioRef, {
            ...updateData,
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error("Error updating ejercicio:", error);
        throw error;
    }
};

export const deleteEjercicio = async (id) => {
    try {
        const ejercicioRef = doc(db, 'ejercicios', id);
        await deleteDoc(ejercicioRef);
    } catch (error) {
        console.error("Error deleting ejercicio:", error);
        throw error;
    }
};
