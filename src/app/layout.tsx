import type { Metadata } from "next";
import { Fraunces, Heebo } from "next/font/google";
import "./globals.css";

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "600", "700"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "שוק בחצר | Home Market — ירקות ופירות בחצר הבניין",
  description:
    "פלטфорמה לשוק ירקות ופירות בחצר הבית בישראל. הוועד מגדיר תוכנית — כל מי שרוצה יכול לארגן.",
  openGraph: {
    title: "שוק בחצר — ירקות ופירות בחצר הבניין",
    description: "Courtyard produce markets in Israel. Vaad sets the plan.",
    locale: "he_IL",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className={`${heebo.variable} ${fraunces.variable} h-full`}>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
