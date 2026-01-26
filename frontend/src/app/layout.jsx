import "./globals.css";

export const metadata = {
  title: "Solar Panel App",
  description: "Next.js + Tailwind",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
