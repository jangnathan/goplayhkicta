import { auth, authState, db } from "./firebase.svelte";
import {
    collection,
    addDoc,
    query,
    getDocs,
    limit,
    serverTimestamp,
    where,
    doc,
    updateDoc,
    arrayUnion
} from "firebase/firestore";

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
        constraints.push(where('creatorID', '==', filter.creatorID))
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
    // add user UID to the joinedPlayers array of the match document
    const uid = authState.user?.uid;
    if (!uid) throw new Error("Not authenticated");

    console.log(`Joining match ${matchID} for user ${uid}`);

    const matchRef = doc(db, "matches", matchID);
    await updateDoc(matchRef, {
        joinedPlayers: arrayUnion(uid)
    });
}