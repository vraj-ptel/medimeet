import Header from "@/components/Header";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Inter({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Inter({ subsets: ["latin"], variable: "--font-geist-mono" });
export const metadata: Metadata = {
  title: "Doctor Apoitment app",
  description: "Connect With Doctor Any Time",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{baseTheme:dark}}>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistMono.variable} ${geistSans.variable} antialiased`}
        >
          {/* headerss  */}

          <Header />

          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <main className="min-h-screen">{children}</main>
            <Toaster richColors/>
          </ThemeProvider>
          <footer className="bg-muted/50 py-6">
            <div className="container mx-auto px-4 text-center text-gray-200">
              <p>Made with ❤️ </p>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
