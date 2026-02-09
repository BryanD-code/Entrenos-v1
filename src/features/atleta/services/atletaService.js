import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
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
