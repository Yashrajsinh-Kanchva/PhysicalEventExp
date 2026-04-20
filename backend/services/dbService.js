const admin = require('firebase-admin');
require('dotenv').config();

// Fallback logic for Hackathon demo if FIREBASE_CONFIG is missing
const useFirestore = !!process.env.FIREBASE_SERVICE_ACCOUNT;

if (useFirestore) {
    try {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    } catch (e) {
        console.error("Firebase Init Error (Check env FIREBASE_SERVICE_ACCOUNT):", e.message);
    }
}

const db = useFirestore ? admin.firestore() : null;

// Mock local store if DB is unavailable (ensure logic remains async)
let localHistory = [];

const saveCheckData = async (data) => {
    if (db) {
        const docRef = db.collection('checks').doc();
        await docRef.set({ ...data, createdAt: admin.firestore.FieldValue.serverTimestamp() });
        return { id: docRef.id };
    } else {
        localHistory.unshift(data);
        if (localHistory.length > 20) localHistory = localHistory.slice(0, 20);
        return { success: true, mode: 'local' };
    }
};

const getHistoryData = async (limit = 10) => {
    if (db) {
        const snapshot = await db.collection('checks').orderBy('createdAt', 'desc').limit(limit).get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } else {
        return localHistory;
    }
};

module.exports = { saveCheckData, getHistoryData };
