// Stub — used locally when firebase package is not installed.
// On Vercel and after npm install firebase, the real firebase/firestore is used.
export const collection     = () => null;
export const addDoc         = async () => ({ id: 'stub' });
export const doc            = () => null;
export const updateDoc      = async () => {};
export const onSnapshot     = () => () => {};
export const query          = () => null;
export const orderBy        = () => null;
export const arrayUnion     = (...args) => args;
export const serverTimestamp = () => new Date();
export const getFirestore   = () => null;
