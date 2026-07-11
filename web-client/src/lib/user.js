import { authState } from "./firebase.svelte.js";
import { db } from "./firebase.svelte.js";
import { serverTimestamp, doc, setDoc, getDoc } from "firebase/firestore";

export async function ensureUserProfile(user) {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const snapshot = await getDoc(userRef);

    if (snapshot.exists()) {
        return;
    }

    await setDoc(
        userRef,
        {
            uid: user.uid,
            email: user.email || "",
            displayName: user.displayName || "",
            photoURL: user.photoURL || "",
            bio: "",
            createdAt: serverTimestamp()
        },
        { merge: true }
    );
}

export async function changeUserPassword(currentPassword, newPassword) {
    const user = authState.user;
    if (!user || !user.email) throw new Error("No authenticated user.");

    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);
}