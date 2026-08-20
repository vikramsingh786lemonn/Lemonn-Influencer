export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? 'AIzaSyC3IvDYHWGfTvsMbM4o_pZuFqvFrXny2Ms',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? 'lemonn-influencer.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? 'lemonn-influencer',
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? 'lemonn-influencer.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '143860567891',
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? '1:143860567891:web:74ec7c4a810c0e4c6e1ba6',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? 'G-F9S22H0RJP',
};

export function isConfigured(): boolean {
  return !!(firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.appId);
}

export const LIVE_AUTH = process.env.NEXT_PUBLIC_AUTH_DEMO !== '1';
