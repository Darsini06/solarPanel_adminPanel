"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sun, Menu, X, LogOut, User as UserIcon, HardDrive } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        // Check if user is logged in
        const token = localStorage.getItem("auth_token");
        setIsLoggedIn(!!token);

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [pathname]);

    const handleLogout = () => {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_name");
        setIsLoggedIn(false);
        router.push("/login");
    };

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "About", href: "/about" },
        { name: "What We Offers", href: "/offers" },
        { name: "Booking", href: "/booking" },
        { name: "Contact", href: "/contact" },
    ];

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-300 ${isScrolled
                ? "bg-white/80 backdrop-blur-md shadow-md py-4"
                : "bg-transparent py-6"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    <Link href="/" className="flex items-center space-x-2">
                        <Sun className="h-8 w-8 text-orange-500" />
                        <span className={`text-2xl font-bold ${isScrolled ? "text-slate-900" : "text-slate-800"}`}>
                            Solar<span className="text-orange-500"> Inspection</span>
                        </span>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`font-medium transition-colors hover:text-orange-500 ${pathname === link.href
                                    ? "text-orange-500 font-semibold"
                                    : isScrolled ? "text-slate-700" : "text-slate-800"
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}

                        <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
                            {isLoggedIn ? (
                                <div className="flex items-center space-x-6">
                                    <Link href="/profile" className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 cursor-pointer hover:bg-orange-200 transition-colors">
                                        <UserIcon size={20} />
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center space-x-2 text-slate-600 hover:text-red-500 font-medium transition-colors"
                                    >
                                        <LogOut size={18} />
                                        <span className="hidden lg:inline">Logout</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-4">
                                    <Link
                                        href="/login"
                                        className={`font-medium transition-colors hover:text-orange-500 ${pathname === "/login"
                                            ? "text-orange-500 font-semibold"
                                            : isScrolled ? "text-slate-700" : "text-slate-800"
                                            }`}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="px-5 py-2 rounded-full bg-slate-900 text-white font-medium hover:bg-slate-800 shadow-lg transition-all"
                                    >
                                        Get Started
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className={`${isScrolled ? "text-slate-900" : "text-slate-800"}`}
                        >
                            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white absolute top-full left-0 w-full shadow-xl border-t border-slate-100 animate-in slide-in-from-top duration-300">
                    <div className="px-4 pt-2 pb-6 space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsMenuOpen(false)}
                                className={`block px-3 py-4 text-base font-medium rounded-lg transition-colors ${pathname === link.href
                                    ? "text-orange-600 bg-orange-50"
                                    : "text-slate-700 hover:bg-orange-50 hover:text-orange-600"
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div className="pt-4 flex flex-col space-y-3">
                            {isLoggedIn ? (
                                <>
                                    <Link
                                        href="/profile"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="w-full text-center py-3 rounded-lg border border-orange-200 text-orange-600 font-medium hover:bg-orange-50"
                                    >
                                        Profile
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-center py-3 rounded-lg border border-red-200 text-red-600 font-medium"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        onClick={() => setIsMenuOpen(false)}
                                        className={`w-full text-center py-3 rounded-lg border font-medium transition-colors ${pathname === "/login"
                                            ? "border-orange-500 text-orange-500 bg-orange-50"
                                            : "border-slate-200 text-slate-700 hover:border-orange-500 hover:text-orange-500"
                                            }`}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/register"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="w-full text-center py-3 rounded-lg bg-orange-600 text-white font-medium shadow-lg"
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
