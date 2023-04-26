import { getApps } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const fbApp = getApps()[0]

const provider = new GoogleAuthProvider();
const authContext = getAuth(fbApp);
provider.setCustomParameters({
    prompt: 'select_account'
});

export const auth = {
    currentUser: () => authContext.currentUser,
    signIn: () => signInWithPopup(authContext, provider),
    signOut: () => authContext.signOut(),
    subscribe: (cb) => authContext.onAuthStateChanged(cb)
}