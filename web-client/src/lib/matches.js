import { auth, authState, db } from "./firebase.svelte";
import { collection, addDoc, query, getDocs, limit, serverTimestamp, where } from "firebase/firestore";

export async function createMatch(formData) {
    const matchesCollection = collection(db, 'matches');

    try {
        const matchPayload = {
            title: formData.title,
            description: formData.description,
            sport: formData.sport,

            locationID: formData.locationID,
            spotsTotal: Number(formData.spotsTotal),
            joinedPlayers: [authState.user?.uid],

            // CRITICAL: Must match request.auth.uid in your Security Rule
            creatorID: authState.user?.uid,

            createdAt: serverTimestamp()
        };

        const addDocResult = await addDoc(matchesCollection, matchPayload);

        return addDocResult.id;

    } catch (error) {
        console.error("Firestore Write Failed:", error);
        throw new Error(error.message);
    }
}

export async function fetchMatches(filter) {
    let matchesQuery;
    let constraints = [];

    if (filter.creatorID) {
        constraints.push(where('creatorID','==',filter.creatorID))
    }

    constraints.push(limit(10))

    matchesQuery = query(
        collection(db, 'matches'),
        ...constraints
    );

    const querySnapshot = await getDocs(matchesQuery);
    const matches = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
    return matches;
}

export async function joinMatch(matchID) {

}