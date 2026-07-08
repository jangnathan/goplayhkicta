import { authState, db } from "./firebase.svelte";
import { collection, addDoc } from "firebase/firestore";

export async function createMatch(formData) {
    const matchesCollection = collection(db, 'matches');

    try {
        const matchPayload = {
            title: formData.title,
            description: formData.description,
            sport: formData.sport,

            location: {
                name: formData.locationName,
                lat: Number(formData.latitude),
                lng: Number(formData.longitude)
            },
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