import { FirebaseError } from "firebase/app";

export function getAuthErrorMessage(error: unknown, fallback: string, authNotEnabled: string): string {
  if (!(error instanceof FirebaseError)) return fallback;

  const code = error.code;
  const message = error.message ?? "";

  if (
    code === "auth/internal-error" &&
    message.includes("CONFIGURATION_NOT_FOUND")
  ) {
    return authNotEnabled;
  }

  if (code === "auth/operation-not-allowed") {
    return authNotEnabled;
  }

  if (code === "auth/invalid-credential" || code === "auth/wrong-password") {
    return "אימייל או סיסמה שגויים";
  }

  if (code === "auth/email-already-in-use") {
    return "האימייל כבר רשום — נסו התחברות";
  }

  if (code === "auth/weak-password") {
    return "סיסמה חלשה — לפחות 6 תווים";
  }

  if (code === "auth/popup-closed-by-user") {
    return "חלון Google נסגר — נסו שוב";
  }

  return fallback;
}

export const FIREBASE_AUTH_SETUP_URL =
  "https://console.firebase.google.com/project/home-market-il/authentication/providers";
