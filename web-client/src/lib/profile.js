import { db, authState } from "./firebase.svelte";
import { serverTimestamp, doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import {
    updatePassword,
    updateProfile,
    EmailAuthProvider,
    reauthenticateWithCredential
} from "firebase/auth";

export async function deleteProfile(uid) {
    const userRef = doc(db, "users", uid);

    await deleteDoc(
        userRef,
    );
}

export async function setUserProfile(options) {
    const user = authState.user;
    if (!user) throw new Error("No authenticated user.");

    const userRef = doc(db, "users", user.uid);

    await setDoc(
        userRef,
        {
            displayName: options.displayName,
            photoURL: user.photoURL || "",
            bio: options.bio
        },
        { merge: true }
    );

    if (options.displayName && options.displayName !== user.displayName) {
        await updateProfile(user, { displayName: options.displayName });
    }
}

export async function fetchUserProfile(uid) {
    const userRef = doc(db, "users", uid);
    const snapshot = await getDoc(userRef);
    return snapshot.data();
}
