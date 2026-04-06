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
  apiKey:            "AIzaSyDohZPDg0g0FNLjSWm0mmEmbq3FsZg9Vto",
  authDomain:        "bach-hotline.firebaseapp.com",
  projectId:         "bach-hotline",
  storageBucket:     "bach-hotline.firebasestorage.app",
  messagingSenderId: "106310396575",
  appId:             "1:106310396575:web:325406d9c665fdab5ad0aa",
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
