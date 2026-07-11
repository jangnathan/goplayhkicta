import { db, authState } from "./firebase.svelte";
import { serverTimestamp, doc, setDoc } from "firebase/firestore";
import {
    updatePassword,
    updateProfile,
    EmailAuthProvider,
    reauthenticateWithCredential
} from "firebase/auth";

export async function signUpCreateProfile(options) {
    const userRef = doc(db, "users", options.uid);

    await setDoc(
        userRef,
        {
            uid: options.uid,
            displayName: options.displayName,
            createdAt: serverTimestamp(),
            bio: options.bio || ""
        },
        { merge: true }
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