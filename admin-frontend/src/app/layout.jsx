import "./globals.css";
import Sidebar from "../components/Sidebar";

export const metadata = {
  title: "Solar Panel Admin",
  description: "Next.js + Tailwind",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#f8fafc]">
        <div className="flex">
          <Sidebar />
          <main className="flex-1 ml-64 min-h-screen">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}