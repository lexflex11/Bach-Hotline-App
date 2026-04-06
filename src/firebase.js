// ─────────────────────────────────────────────────────────────────────────────
// HOW TO SET UP FIREBASE (free — no credit card needed):
//
// 1. Go to https://console.firebase.google.com
// 2. Click "Add project" → name it "Bach Hotline" → click through the steps
// 3. Click the "</>" (web) icon → name it "Bach Hotline App" → Register app
// 4. Copy the firebaseConfig values into this file below
// 5. Back in Firebase console: Build → Firestore Database → Create database
//    → Start in test mode → pick your region → Done
// ─────────────────────────────────────────────────────────────────────────────

import { initializeApp }  from 'firebase/app';
import {
  getFirestore,
  collection, addDoc, doc, updateDoc,
  onSnapshot, query, orderBy, arrayUnion, serverTimestamp,
} from 'firebase/firestore';

export const firebaseConfig = {
  apiKey:            "PASTE_YOUR_API_KEY_HERE",
  authDomain:        "PASTE_YOUR_AUTH_DOMAIN_HERE",
  projectId:         "PASTE_YOUR_PROJECT_ID_HERE",
  storageBucket:     "PASTE_YOUR_STORAGE_BUCKET_HERE",
  messagingSenderId: "PASTE_YOUR_MESSAGING_SENDER_ID_HERE",
  appId:             "PASTE_YOUR_APP_ID_HERE",
};

export const isConfigured = !firebaseConfig.apiKey.startsWith("PASTE_");

let _db = null;
export function getDb() {
  if (!isConfigured) return null;
  if (!_db) {
    try {
      const app = initializeApp(firebaseConfig);
      _db = getFirestore(app);
    } catch { _db = null; }
  }
  return _db;
}

export { collection, addDoc, doc, updateDoc, onSnapshot, query, orderBy, arrayUnion, serverTimestamp };
