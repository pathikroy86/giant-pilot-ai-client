import "./globals.css";
import CustomNavbar from "@/components/CustomNavbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "GrantPilot AI",
  description:
    "Find relevant grants, evaluate fit, and draft stronger evidence-based proposals with AI.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-slate-50 text-slate-950">
        <CustomNavbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
