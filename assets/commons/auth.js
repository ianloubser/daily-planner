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
    getGoogleApiToken: async () => {
        const oauthProvider = new GoogleAuthProvider();
        oauthProvider.addScope('https://www.googleapis.com/auth/calendar.readonly');
        oauthProvider.addScope('https://www.googleapis.com/auth/calendar.events');
        oauthProvider.addScope('https://www.googleapis.com/auth/calendar');
        
        oauthProvider.setCustomParameters({
            login_hint: authContext.currentUser.email
        });
        const a = await signInWithPopup(authContext, oauthProvider)
        return a._tokenResponse
    },
    signIn: () => signInWithPopup(authContext, provider),
    signOut: () => authContext.signOut(),
    subscribe: (cb) => authContext.onAuthStateChanged(cb)
}