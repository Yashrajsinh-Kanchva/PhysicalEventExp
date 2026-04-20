import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getAuth, 
    GoogleAuthProvider, 
    signInWithPopup, 
    signOut, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// This config should be populated via your .env or a config fetch
// For hackathon simplicity, we can fetch it from an endpoint or use window.ENV
let auth;
let provider;

const initializeFirebase = async () => {
    try {
        const response = await fetch('/api/config/firebase');
        const config = await response.json();
        
        const required = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
        const missing = required.filter(k => !config[k] || config[k].includes('YOUR_'));

        if (missing.length > 0) {
            console.warn("Firebase config incomplete. Missing:", missing.join(', '));
            return null;
        }

        const app = initializeApp(config);
        auth = getAuth(app);
        provider = new GoogleAuthProvider();
        return auth;
    } catch (e) {
        console.error("Failed to initialize Firebase Auth:", e);
        return null;
    }
};

const authPromise = initializeFirebase();

export const loginWithGoogle = async () => {
    await authPromise;
    if (!auth) return alert("Firebase Auth not configured. check your .env file.");
    try {
        const result = await signInWithPopup(auth, provider);
        return result.user;
    } catch (error) {
        console.error("Auth Error:", error);
        return null;
    }
};

export const logout = async () => {
    await authPromise;
    if (auth) signOut(auth);
};

export const subscribeToAuthChanges = async (callback) => {
    const authInstance = await authPromise;
    if (authInstance) onAuthStateChanged(authInstance, callback);
};

