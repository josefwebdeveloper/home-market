"use client";

import { useState, useEffect, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { appCopy } from "@/lib/i18n/app-copy";
import { FIREBASE_AUTH_SETUP_URL, getAuthErrorMessage } from "@/lib/auth/errors";
import type { UserRole } from "@/types/user";

export default function LoginPage() {
  const c = appCopy.login;
  const router = useRouter();
  const { signInEmail, signUpEmail, signInGoogle, user, loading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [role, setRole] = useState<UserRole>("organizer");
  const [error, setError] = useState("");
  const [showAuthSetup, setShowAuthSetup] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [loading, user, router]);

  if (loading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream-50 text-olive-700">
        …
      </div>
    );
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setShowAuthSetup(false);
    setPending(true);

    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email"));
    const password = String(fd.get("password"));
    const displayName = String(fd.get("displayName") || email.split("@")[0]);

    try {
      if (mode === "signin") {
        await signInEmail(email, password);
      } else {
        await signUpEmail(email, password, displayName, role);
      }
      router.push("/dashboard");
    } catch (err) {
      const msg = getAuthErrorMessage(err, c.error, c.authNotEnabled);
      setError(msg);
      setShowAuthSetup(msg === c.authNotEnabled);
    } finally {
      setPending(false);
    }
  }

  async function handleGoogle() {
    setError("");
    setShowAuthSetup(false);
    setPending(true);
    try {
      await signInGoogle(role);
      router.push("/dashboard");
    } catch (err) {
      const msg = getAuthErrorMessage(err, c.error, c.authNotEnabled);
      setError(msg);
      setShowAuthSetup(msg === c.authNotEnabled);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream-50 px-6">
      <div className="w-full max-w-md rounded-2xl border border-olive-800/10 bg-white p-8 shadow-lg shadow-olive-900/5">
        <Link href="/" className="font-display text-2xl text-olive-900">
          שוק בחצר
        </Link>
        <h1 className="mt-6 font-display text-3xl text-olive-950">{c.title}</h1>
        <p className="mt-2 text-sm text-olive-700/80">{c.subtitle}</p>

        <div className="mt-6">
          <label className="mb-1.5 block text-sm font-medium text-olive-800">
            {c.role}
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            className="w-full rounded-xl border border-olive-800/15 px-4 py-3"
          >
            <option value="vaad">{c.roles.vaad}</option>
            <option value="organizer">{c.roles.organizer}</option>
            <option value="vendor">{c.roles.vendor}</option>
          </select>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {mode === "signup" && (
            <input
              name="displayName"
              placeholder="שם"
              className="w-full rounded-xl border border-olive-800/15 px-4 py-3"
            />
          )}
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder={c.email}
            className="w-full rounded-xl border border-olive-800/15 px-4 py-3"
          />
          <input
            name="password"
            type="password"
            required
            minLength={6}
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            placeholder={c.password}
            className="w-full rounded-xl border border-olive-800/15 px-4 py-3"
          />

          {error && <p className="text-sm text-red-700">{error}</p>}
          {showAuthSetup && (
            <a
              href={FIREBASE_AUTH_SETUP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl border border-terracotta-500/30 bg-sun-100/50 px-4 py-3 text-center text-sm font-medium text-olive-900 underline"
            >
              {c.authSetupLink} →
            </a>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-full bg-olive-900 py-3 text-sm font-semibold text-cream-50 hover:bg-terracotta-600 disabled:opacity-60"
          >
            {mode === "signin" ? c.signIn : c.signUp}
          </button>
        </form>

        <button
          type="button"
          onClick={handleGoogle}
          disabled={pending}
          className="mt-3 w-full rounded-full border border-olive-800/15 py-3 text-sm font-semibold text-olive-900"
        >
          {c.google}
        </button>

        <p className="mt-6 text-center text-sm text-olive-700">
          {mode === "signin" ? c.noAccount : c.hasAccount}{" "}
          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="font-semibold text-terracotta-600 underline"
          >
            {mode === "signin" ? c.switchSignUp : c.switchSignIn}
          </button>
        </p>
      </div>
    </div>
  );
}
