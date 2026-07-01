"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { appCopy } from "@/lib/i18n/app-copy";

export function AppShell({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  const { profile, signOut } = useAuth();
  const c = appCopy.dashboard;

  return (
    <div className="min-h-screen bg-cream-50">
      <header className="border-b border-olive-800/10 bg-cream-50/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div>
            <Link href="/dashboard" className="font-display text-xl text-olive-900">
              שוק בחצר
            </Link>
            {title && (
              <p className="mt-0.5 text-sm text-olive-700/70">{title}</p>
            )}
          </div>
          <div className="flex items-center gap-3 text-sm">
            {profile && (
              <span className="hidden text-olive-700 sm:inline">
                {profile.displayName} · {profile.role}
              </span>
            )}
            <button
              type="button"
              onClick={() => signOut()}
              className="rounded-full border border-olive-800/15 px-3 py-1.5 text-olive-800 hover:border-terracotta-500"
            >
              {c.signOut}
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  );
}
