import { authState, db } from "./firebase.svelte";
import { collection, addDoc, query, getDocs, limit } from "firebase/firestore";

export async function createMatch(formData) {
    const matchesCollection = collection(db, 'matches');

    try {
        const matchPayload = {
            title: formData.title,
            description: formData.description,
            sport: formData.sport,

            locationID: formData.locationID,
            spotsTotal: Number(formData.spotsTotal),

            // CRITICAL: Must match request.auth.uid in your Security Rule
            creatorId: authState.user?.uid,

            createdAt: new Date().toISOString()
        };

        const addDocResult = await addDoc(matchesCollection, matchPayload);

        return addDocResult.id;

    } catch (error) {
        console.error("Firestore Write Failed:", error);
        throw new Error(error.message);
    }
}

export async function fetchMatches(selectedFilter) {
    let matchesQuery;

    if (selectedFilter = 'all') {
        matchesQuery = query(
            collection(db, 'matches'),
            limit(10)
        );
    }

    const querySnapshot = await getDocs(matchesQuery);
    const matches = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
    return matches;
}