import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "Notes App",
  description: "A beautiful notes management application",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-gray-950 text-gray-100 min-h-screen antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1f2937",
              color: "#f9fafb",
              border: "1px solid #374151",
              borderRadius: "12px",
            },
            success: { iconTheme: { primary: "#10b981", secondary: "#1f2937" } },
            error: { iconTheme: { primary: "#ef4444", secondary: "#1f2937" } },
          }}
        />
      </body>
    </html>
  );
}
