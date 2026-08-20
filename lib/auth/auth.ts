import type { Auth, ConfirmationResult, RecaptchaVerifier } from 'firebase/auth';
import { firebaseConfig, isConfigured, LIVE_AUTH } from './firebase-config';

export type AuthMode = 'demo' | 'firebase';

export interface AuthUser {
  uid: string;
  phone: string | null;
}

const LIVE = isConfigured() && LIVE_AUTH;
export const AUTH_MODE: AuthMode = LIVE ? 'firebase' : 'demo';

const STORE_KEY = 'tf.user';

let user: AuthUser | null | undefined = LIVE ? undefined : readStored();
let listeners: ((u: AuthUser | null | undefined) => void)[] = [];

function readStored(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

function emit() {
  for (const cb of listeners) cb(user);
}

export function currentUser(): AuthUser | null {
  return user ?? null;
}

export function onAuth(cb: (u: AuthUser | null | undefined) => void): () => void {
  listeners.push(cb);
  cb(user);
  if (LIVE) warmUpWhenIdle();
  return () => {
    listeners = listeners.filter((x) => x !== cb);
  };
}

async function loadSdk() {
  const [app, auth] = await Promise.all([import('firebase/app'), import('firebase/auth')]);
  return { app, auth };
}

type Sdk = Awaited<ReturnType<typeof loadSdk>>;

let ready: Promise<{ auth: Auth; sdk: Sdk }> | null = null;
let confirmation: ConfirmationResult | null = null;
let verifier: RecaptchaVerifier | null = null;

function initFirebase() {
  ready ??= (async () => {
    const sdk = await loadSdk();
    const app = sdk.app.getApps().length
      ? sdk.app.getApp()
      : sdk.app.initializeApp(firebaseConfig);
    const auth = sdk.auth.getAuth(app);

    sdk.auth.onAuthStateChanged(auth, (u) => {
      user = u ? { uid: u.uid, phone: u.phoneNumber ?? null } : null;
      emit();
    });

    return { auth, sdk };
  })();
  return ready;
}

function warmUpWhenIdle() {
  if (typeof window === 'undefined') return;
  const start = () => void initFirebase();
  const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => void })
    .requestIdleCallback;
  if (ric) ric(start, { timeout: 2500 });
  else window.setTimeout(start, 1200);
}

export function resetVerifier(): void {
  try {
    verifier?.clear?.();
  } catch {
  }
  verifier = null;
  confirmation = null;
}

const FIREBASE_ERRORS: Record<string, string> = {
  'auth/invalid-phone-number': 'Enter a valid mobile number.',
  'auth/missing-phone-number': 'Enter a mobile number to continue.',
  'auth/invalid-verification-code': "That code isn't right. Try again.",
  'auth/code-expired': 'Code expired — request a new one.',
  'auth/too-many-requests': 'Too many attempts. Try again in a few minutes.',
  'auth/invalid-app-credential': "Sign-in isn't configured for this domain.",
  'auth/network-request-failed': 'Network problem — check your connection.',
  'auth/quota-exceeded': 'The SMS limit has been reached. Try again later.',
  'auth/operation-not-allowed': 'Phone sign-in is unavailable.',
  'auth/captcha-check-failed': 'The verification check failed. Reload and try again.',
};

function humanise(e: unknown, fallback: string): Error {
  const code = (e as { code?: string })?.code ?? '';
  const raw = e instanceof Error ? e.message : String(e ?? '');

  if (typeof console !== 'undefined') {
    console.warn('[auth]', code || 'no-code', '|', raw, '| project:', firebaseConfig.projectId);
  }

  if (FIREBASE_ERRORS[code]) return new Error(FIREBASE_ERRORS[code]);
  if (code || raw.startsWith('Firebase:')) return new Error(fallback);
  return new Error(raw || fallback);
}

let demoPending: { code: string; phone: string } | null = null;

export interface SendResult {
  devCode?: string;
}

export async function sendOtp(phoneE164: string): Promise<SendResult> {
  if (!/^\+\d{8,15}$/.test(phoneE164)) throw new Error('Enter a valid mobile number.');

  if (!LIVE) {
    await new Promise((r) => setTimeout(r, 400));
    const code = String(Math.floor(100000 + Math.random() * 900000));
    demoPending = { code, phone: phoneE164 };
    return { devCode: code };
  }

  try {
    const { auth, sdk } = await initFirebase();

    if (!verifier) {
      verifier = new sdk.auth.RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
      });
    }

    confirmation = await sdk.auth.signInWithPhoneNumber(auth, phoneE164, verifier);
    return {};
  } catch (e) {
    resetVerifier();
    throw humanise(e, 'Could not send the code. Please try again.');
  }
}

export async function verifyOtp(code: string): Promise<AuthUser> {
  if (!LIVE) {
    await new Promise((r) => setTimeout(r, 400));
    if (!demoPending) throw new Error('Request a code first.');
    if (code !== demoPending.code) throw new Error("That code isn't right. Try again.");
    user = { uid: `demo-${demoPending.phone}`, phone: demoPending.phone };
    demoPending = null;
    try {
      window.localStorage.setItem(STORE_KEY, JSON.stringify(user));
    } catch {
    }
    emit();
    return user;
  }

  if (!confirmation) throw new Error('Request a code first.');
  try {
    const cred = await confirmation.confirm(code);
    return { uid: cred.user.uid, phone: cred.user.phoneNumber ?? null };
  } catch (e) {
    throw humanise(e, 'Verification failed. Please try again.');
  }
}

export async function getIdToken(): Promise<string | null> {
  if (!LIVE) return null;
  const { auth } = await initFirebase();
  return auth.currentUser ? auth.currentUser.getIdToken() : null;
}

export async function signOutUser(): Promise<void> {
  if (!LIVE) {
    user = null;
    try {
      window.localStorage.removeItem(STORE_KEY);
    } catch {
    }
    emit();
    return;
  }
  const { auth, sdk } = await initFirebase();
  await sdk.auth.signOut(auth);
  confirmation = null;
}
