'use client';

import { usePathname } from 'next/navigation';
import Sidebar from "../components/Sidebar";
import "./globals.css";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  
  // Hide sidebar on root path (login page)
  const isLoginPage = pathname === '/';
  
  return (
    <html lang="en">
      <body className="antialiased bg-[#f8fafc]">
        {!isLoginPage ? (
          // Show sidebar for all pages except root (login)
          <div className="flex">
            <Sidebar />
            <main className="flex-1 ml-64 min-h-screen">
              {children}
            </main>
          </div>
        ) : (
          // For root path (login), show only the login content (no sidebar)
          <main>{children}</main>
        )}
      </body>
    </html>
  );
}