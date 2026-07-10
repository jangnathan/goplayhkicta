import { db, authState } from "./firebase.svelte";
import { serverTimestamp, doc, setDoc } from "firebase/firestore";

export async function signUpCreateProfile(options) {
    const userRef = doc(db, 'users', options.uid);
    console.log(authState.user?.uid, options.uid);

    await setDoc(userRef, {
        uid: options.uid,
        displayName: options.displayName,
        createdAt: serverTimestamp(),
        bio: options.bio || ""
    }, { merge: true });
}   

export async function setUserProfile(options) {
    const userRef = doc(db, 'users', userAuthInstance.uid);
    await setDoc(userRef, {
        displayName: options.displayName,
        photoURL: userAuthInstance.photoURL || "",
        bio: options.bio
    }, { merge: true });
}