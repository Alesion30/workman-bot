import { initializeApp } from 'https://cdn.skypack.dev/firebase@9.9.2/app';
import {
  collection,
  doc,
  getFirestore,
} from 'https://cdn.skypack.dev/firebase@9.9.2/firestore';
import {
  FIREBASE_API_KEY,
  FIREBASE_APP_ID,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
} from './env.ts';

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
};
export const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);

export const userCollection = collection(db, 'users');
export const getUserDoc = (uid: string) => doc(userCollection, uid);
