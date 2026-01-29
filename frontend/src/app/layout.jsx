import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata = {
  title: "Solar Inspection | Professional Diagnostic Solutions",
  description: "Advanced Drone & Thermographic Solar Inspection Solutions",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased font-sans bg-slate-50 text-slate-900">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
