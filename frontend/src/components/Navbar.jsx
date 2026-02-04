"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sun, Menu, X, LogOut, User as UserIcon, ChevronDown } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

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

    const solutionsMenu = [
        {
            phase: "Operation Phase",
            items: [
                { name: "Thermography", href: "/solutions/operation/thermography" },
                { name: "Work Management", href: "/solutions/operation/work-management" },
                { name: "Asset Management", href: "/solutions/operation/asset-management" },
            ]
        },
        {
            phase: "Construction Phase",
            items: [
                { name: "Progress Tracking", href: "/solutions/construction/progress-tracking" },
                { name: "Quality Control", href: "/solutions/construction/quality-control" },
                { name: "Commissioning", href: "/solutions/construction/commissioning" },
            ]
        },
        {
            phase: "Planning Phase",
            items: [
                { name: "Site Assessment", href: "/solutions/planning/site-assessment" },
            ]
        },
    ];

    const platformMenu = [
        { name: "Drones & Robotics", href: "/platform/drones" },
        { name: "AI & Analytics", href: "/platform/ai-analytics" },
        { name: "Forms & Ticketing", href: "/platform/forms" },
        { name: "Integrations", href: "/platform/integrations" },
    ];

    const toggleDropdown = (menu) => {
        setOpenDropdown(openDropdown === menu ? null : menu);
    };

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-300 ${isScrolled
                ? "bg-white/95 backdrop-blur-md shadow-lg shadow-slate-200/20 py-3"
                : "bg-white/80 backdrop-blur-md py-5"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center group-hover:bg-orange-700 transition-all duration-300 shadow-lg shadow-orange-200">
                            <Sun className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-slate-900">
                            Solar<span className="text-orange-600">Mark</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-2">
                        {/* Home Link */}
                        <Link
                            href="/"
                            className={`px-4 py-2 text-sm font-bold transition-all duration-300 ${pathname === "/"
                                ? "text-orange-600"
                                : "text-slate-600 hover:text-orange-600"
                                }`}
                        >
                            Home
                        </Link>

                        {isLoggedIn && (
                            <>
                                {/* Solutions Dropdown */}
                                <div className="relative group">
                                    <button
                                        onMouseEnter={() => setOpenDropdown('solutions')}
                                        className="flex items-center gap-1 px-4 py-2 text-sm font-bold text-slate-600 hover:text-orange-600 transition-all duration-300"
                                    >
                                        Solutions
                                        <ChevronDown size={14} className="transition-transform group-hover:rotate-180" />
                                    </button>
                                    <div
                                        onMouseEnter={() => setOpenDropdown('solutions')}
                                        onMouseLeave={() => setOpenDropdown(null)}
                                        className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[480px] bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 transition-all duration-300 ${openDropdown === 'solutions' ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4'
                                            }`}
                                    >
                                        <div className="grid grid-cols-3 gap-8">
                                            {solutionsMenu.map((phase) => (
                                                <div key={phase.phase}>
                                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                                                        {phase.phase}
                                                    </div>
                                                    <div className="space-y-3">
                                                        {phase.items.map((item) => (
                                                            <Link
                                                                key={item.name}
                                                                href={item.href}
                                                                className="block text-sm font-bold text-slate-600 hover:text-orange-600 transition-colors"
                                                            >
                                                                {item.name}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Platform Dropdown */}
                                <div className="relative group">
                                    <button
                                        onMouseEnter={() => setOpenDropdown('platform')}
                                        className="flex items-center gap-1 px-4 py-2 text-sm font-bold text-slate-600 hover:text-orange-600 transition-all duration-300"
                                    >
                                        Platform
                                        <ChevronDown size={14} className="transition-transform group-hover:rotate-180" />
                                    </button>
                                    <div
                                        onMouseEnter={() => setOpenDropdown('platform')}
                                        onMouseLeave={() => setOpenDropdown(null)}
                                        className={`absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 transition-all duration-300 ${openDropdown === 'platform' ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4'
                                            }`}
                                    >
                                        {platformMenu.map((item) => (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                className="block px-4 py-3 text-sm font-bold text-slate-600 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition-all duration-300"
                                            >
                                                {item.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Regular Links */}
                        <Link
                            href="/about"
                            className={`px-4 py-2 text-sm font-bold transition-all duration-300 ${pathname === "/about"
                                ? "text-orange-600"
                                : "text-slate-600 hover:text-orange-600"
                                }`}
                        >
                            About
                        </Link>
                        <Link
                            href="/offers"
                            className={`px-4 py-2 text-sm font-bold transition-all duration-300 ${pathname === "/offers"
                                ? "text-orange-600"
                                : "text-slate-600 hover:text-orange-600"
                                }`}
                        >
                            Offers
                        </Link>
                        <Link
                            href="/contact"
                            className={`px-4 py-2 text-sm font-bold transition-all duration-300 ${pathname === "/contact"
                                ? "text-orange-600"
                                : "text-slate-600 hover:text-orange-600"
                                }`}
                        >
                            Contact
                        </Link>
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden lg:flex items-center gap-6">
                        {isLoggedIn ? (
                            <>
                                <Link
                                    href="/profile"
                                    className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200 transition-all duration-300"
                                >
                                    <UserIcon size={20} />
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-red-600 transition-colors"
                                >
                                    <LogOut size={18} />
                                    <span>Logout</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="text-sm font-bold text-slate-600 hover:text-orange-600 transition-colors"
                                >
                                    Log In
                                </Link>
                                <Link
                                    href="/booking"
                                    className="px-6 py-3 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-all duration-300 shadow-xl shadow-slate-200"
                                >
                                    Book Now
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="lg:hidden p-2 text-slate-700 hover:text-orange-600 transition-colors"
                    >
                        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="lg:hidden mt-6 pb-8 border-t border-slate-100 pt-6 space-y-2">
                        {/* Home Mobile */}
                        <Link
                            href="/"
                            className="block px-4 py-3 text-base font-bold text-slate-700 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition-all"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Home
                        </Link>

                        {isLoggedIn && (
                            <>
                                {/* Solutions Mobile */}
                                <div className="space-y-1">
                                    <button
                                        onClick={() => toggleDropdown('solutions-mobile')}
                                        className="flex items-center justify-between w-full px-4 py-3 text-base font-bold text-slate-700 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition-all"
                                    >
                                        Solutions
                                        <ChevronDown size={18} className={`transition-transform duration-300 ${openDropdown === 'solutions-mobile' ? 'rotate-180' : ''}`} />
                                    </button>
                                    {openDropdown === 'solutions-mobile' && (
                                        <div className="pl-6 space-y-4 py-2 border-l-2 border-orange-100 ml-4 mt-1">
                                            {solutionsMenu.map((phase) => (
                                                <div key={phase.phase}>
                                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                                                        {phase.phase}
                                                    </div>
                                                    <div className="space-y-3">
                                                        {phase.items.map((item) => (
                                                            <Link
                                                                key={item.name}
                                                                href={item.href}
                                                                className="block text-sm font-bold text-slate-600 hover:text-orange-600"
                                                                onClick={() => setIsMenuOpen(false)}
                                                            >
                                                                {item.name}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Platform Mobile */}
                                <div className="space-y-1">
                                    <button
                                        onClick={() => toggleDropdown('platform-mobile')}
                                        className="flex items-center justify-between w-full px-4 py-3 text-base font-bold text-slate-700 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition-all"
                                    >
                                        Platform
                                        <ChevronDown size={18} className={`transition-transform duration-300 ${openDropdown === 'platform-mobile' ? 'rotate-180' : ''}`} />
                                    </button>
                                    {openDropdown === 'platform-mobile' && (
                                        <div className="pl-6 py-2 border-l-2 border-orange-100 ml-4 mt-1 space-y-3">
                                            {platformMenu.map((item) => (
                                                <Link
                                                    key={item.name}
                                                    href={item.href}
                                                    className="block text-sm font-bold text-slate-600 hover:text-orange-600"
                                                    onClick={() => setIsMenuOpen(false)}
                                                >
                                                    {item.name}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        <Link
                            href="/about"
                            className="block px-4 py-3 text-base font-bold text-slate-700 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition-all"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            About
                        </Link>
                        <Link
                            href="/offers"
                            className="block px-4 py-3 text-base font-bold text-slate-700 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition-all"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Offers
                        </Link>
                        <Link
                            href="/contact"
                            className="block px-4 py-3 text-base font-bold text-slate-700 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition-all"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Contact
                        </Link>

                        {/* Mobile Actions */}
                        <div className="mt-8 px-4 space-y-3">
                            {isLoggedIn ? (
                                <>
                                    <Link
                                        href="/profile"
                                        className="block w-full py-4 text-center bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Profile
                                    </Link>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setIsMenuOpen(false);
                                        }}
                                        className="block w-full py-4 text-center text-red-600 font-bold"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="block w-full py-4 text-center bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Log In
                                    </Link>
                                    <Link
                                        href="/booking"
                                        className="block w-full py-4 text-center bg-orange-600 text-white rounded-xl font-bold shadow-lg shadow-orange-200 hover:bg-orange-700 transition-all"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Book Now
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav >
    );
}
