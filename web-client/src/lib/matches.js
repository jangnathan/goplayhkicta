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
    getDoc,
    updateDoc,
    deleteDoc,
    arrayUnion,
    arrayRemove
} from "firebase/firestore";

export const MAX_MATCH_SPOTS = 20;

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
    if (filter.joinedPlayerID) {
        constraints.push(where('joinedPlayers', 'array-contains', filter.joinedPlayerID))
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

export async function fetchMatchById(matchID) {
    const matchRef = doc(db, 'matches', matchID);
    const matchSnap = await getDoc(matchRef);
    if (!matchSnap.exists()) {
        throw new Error('Match not found');
    }
    return {
        id: matchSnap.id,
        ...matchSnap.data()
    };
}

export async function updateMatch(matchID, updateData) {
    const matchRef = doc(db, 'matches', matchID);
    await updateDoc(matchRef, updateData);
}

export async function removeMatchMember(matchID, memberUID) {
    const matchRef = doc(db, 'matches', matchID);
    await updateDoc(matchRef, {
        joinedPlayers: arrayRemove(memberUID)
    });
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

export async function leaveMatch(matchID, userUID) {
    if (!userUID) throw new Error("Not authenticated");

    console.log(`Leaving match ${matchID} for user ${userUID}`);
    const matchRef = doc(db, "matches", matchID);
    await updateDoc(matchRef, {
        joinedPlayers: arrayRemove(userUID)
    });
}

export async function deleteMatch(matchID) {
    const matchRef = doc(db, "matches", matchID);
    await deleteDoc(matchRef);
}

// HELPER

export function formatMatchDate(value) {
    if (!value) return 'Unknown date';

    const date =
        value.toDate?.() ??
        (value.seconds ? new Date(value.seconds * 1000) : null) ??
        (typeof value === 'string' ? new Date(value) : null) ??
        (value instanceof Date ? value : null);

    if (!date || Number.isNaN(date.getTime())) {
        return 'Unknown date';
    }

    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    }).format(date);
}