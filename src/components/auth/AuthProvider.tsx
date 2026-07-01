"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import type { UserProfile, UserRole } from "@/types/user";
import { getFirebaseAuth } from "@/lib/firebase/client";
import { createUserProfile, getUserProfile } from "@/lib/firestore/users";

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signInEmail: (email: string, password: string) => Promise<void>;
  signUpEmail: (
    email: string,
    password: string,
    displayName: string,
    role: UserRole,
  ) => Promise<void>;
  signInGoogle: (role: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadProfile(firebaseUser: User) {
    const existing = await getUserProfile(firebaseUser.uid);
    setProfile(existing);
    return existing;
  }

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) {
      setLoading(false);
      return;
    }

    return onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await loadProfile(firebaseUser);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
  }, []);

  async function signInEmail(email: string, password: string) {
    const auth = getFirebaseAuth();
    if (!auth) throw new Error("Firebase not configured");
    await signInWithEmailAndPassword(auth, email, password);
  }

  async function signUpEmail(
    email: string,
    password: string,
    displayName: string,
    role: UserRole,
  ) {
    const auth = getFirebaseAuth();
    if (!auth) throw new Error("Firebase not configured");
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const newProfile = await createUserProfile(cred.user.uid, {
      email,
      displayName,
      role,
    });
    setProfile(newProfile);
  }

  async function signInGoogle(role: UserRole) {
    const auth = getFirebaseAuth();
    if (!auth) throw new Error("Firebase not configured");
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    const existing = await getUserProfile(cred.user.uid);
    if (!existing) {
      const newProfile = await createUserProfile(cred.user.uid, {
        email: cred.user.email ?? "",
        displayName: cred.user.displayName ?? "User",
        role,
      });
      setProfile(newProfile);
    }
  }

  async function signOut() {
    const auth = getFirebaseAuth();
    if (!auth) return;
    await firebaseSignOut(auth);
  }

  async function refreshProfile() {
    if (!user) return;
    await loadProfile(user);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signInEmail,
        signUpEmail,
        signInGoogle,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
