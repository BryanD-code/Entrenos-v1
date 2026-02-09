import { collection, query, where, getDocs, addDoc, serverTimestamp, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';

export const getAtletas = async () => {
    try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('role', '==', 'atleta'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Error fetching atletas:", error);
        throw error;
    }
};

export const createTrainingPlan = async (planData) => {
    try {
        const plansRef = collection(db, 'planes_entrenamiento');
        const docRef = await addDoc(plansRef, {
            ...planData,
            fechaCreacion: serverTimestamp()
        });
        return docRef.id;
    } catch (error) {
        console.error("Error creating training plan:", error);
        throw error;
    }
};

export const getTrainerPlanes = async (atletaId) => {
    try {
        const plansRef = collection(db, 'planes_entrenamiento');
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
        console.error("Error fetching plans for trainer:", error);
        throw error;
    }
};

export const updateTrainingPlan = async (planId, updateData) => {
    try {
        const planRef = doc(db, 'planes_entrenamiento', planId);
        await updateDoc(planRef, {
            ...updateData,
            fechaActualizacion: serverTimestamp()
        });
    } catch (error) {
        console.error("Error updating training plan:", error);
        throw error;
    }
};

export const deleteTrainingPlan = async (planId) => {
    try {
        const planRef = doc(db, 'planes_entrenamiento', planId);
        await deleteDoc(planRef);
    } catch (error) {
        console.error("Error deleting training plan:", error);
        throw error;
    }
};
