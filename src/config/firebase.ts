import { initializeApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";

// Configuration Firebase
// Les variables d'environnement doivent être définies dans le fichier .env
// Copiez .env.example en .env et remplissez avec vos valeurs Firebase

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "demo.appspot.com",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "demo-app-id",
};

// Initialiser Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);

// Initialiser Firestore
export const db: Firestore = getFirestore(app);

export default app;
