import { getApps } from "firebase/app";
import { getFirestore, doc, collection, addDoc, updateDoc, deleteDoc, onSnapshot } from "firebase/firestore"; 
import { getAuth } from "firebase/auth";

const fbApp = getApps()[0]
const db = getFirestore(fbApp);
const auth = getAuth(fbApp)

export const tasks = {
    add: async (value) => {
        try {
            await addDoc(collection(db, "user", auth.currentUser.uid, "tasks"), {
                done: false,
                text: value,
                created: new Date().getTime()
            });
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    },
    remove: async (docId) => {
        await deleteDoc(doc(db, "user", auth.currentUser.uid, "tasks", docId));
    },
    update: async (document) => {
        const { id, ...data } = document
        const docRef = doc(db, "user", auth.currentUser.uid, "tasks", id)
        
        await updateDoc(docRef, data);
    },
    subscribe: (cb) => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                onSnapshot(collection(db, "user", user.uid, "tasks"), (snapshot) => {
                    const allDocs = snapshot.docs.map(d => ({...d.data(), id: d.id}))
                    allDocs.sort((a, b) => b.created - a.created)
                    cb(allDocs)
                });
            } else {
                cb([])
            }
        })
    }
}