import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { GlobalContextProvider } from "./Context/GlobalContext";
import { AuthProvider } from "./Context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Code Sync",
  description: "A real-time collaborative code editor built with Next.js and Socket.IO.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased `}>
        <GlobalContextProvider>
          <AuthProvider>

            <Toaster
              position="top-center"
              toastOptions={{
                duration: 1500,
              }}
            />
            {children}
          </AuthProvider>
        </GlobalContextProvider>
      </body>
    </html>
  );
}
