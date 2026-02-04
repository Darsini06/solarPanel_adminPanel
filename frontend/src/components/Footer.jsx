"use client";

import React from "react";
import Link from "next/link";
import {
    Facebook,
    Twitter,
    Linkedin,
    Instagram,
    Mail,
    Sun
} from "lucide-react";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerSections = {
        "Solutions": [
            { name: "Planning", href: "/about" },
            { name: "Construction", href: "/offers" },
            { name: "Operations", href: "/offers" },
        ],
        "Company": [
            { name: "About", href: "/about" },
            { name: "Contact", href: "/contact" },
            { name: "Careers", href: "#" },
        ],
        "Resources": [
            { name: "Blog", href: "#" },
            { name: "Help Center", href: "#" },
            { name: "Case Studies", href: "#" },
        ],
        "Legal": [
            { name: "Privacy Policy", href: "/privacy" },
            { name: "Terms of Service", href: "/terms" },
        ],
    };

    const socialLinks = [
        { icon: <Facebook size={18} />, href: "#", label: "Facebook" },
        { icon: <Twitter size={18} />, href: "#", label: "Twitter" },
        { icon: <Linkedin size={18} />, href: "#", label: "LinkedIn" },
        { icon: <Instagram size={18} />, href: "#", label: "Instagram" },
    ];

    return (
        <footer className="bg-white border-t border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Main Footer Content */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
                    {/* Brand */}
                    <div className="col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                                <Sun className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-lg font-bold text-slate-900">
                                Solar<span className="text-orange-600">Mark</span>
                            </span>
                        </Link>
                        <p className="text-sm text-slate-600 mb-6 max-w-xs">
                            Maximize performance across the solar lifecycle with AI-powered insights and automated tracking.
                        </p>
                        <div className="flex gap-3">
                            {socialLinks.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.href}
                                    className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-orange-600 hover:text-white transition-colors"
                                    aria-label={social.label}
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Sections */}
                    {Object.entries(footerSections).map(([title, links]) => (
                        <div key={title}>
                            <h3 className="text-sm font-semibold text-slate-900 mb-4">{title}</h3>
                            <ul className="space-y-3">
                                {links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-slate-600 hover:text-orange-600 transition-colors"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-slate-200">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-slate-600">
                            © {currentYear} SolarMark. All rights reserved.
                        </p>
                        <div className="flex items-center gap-6">
                            <Link href="/privacy" className="text-sm text-slate-600 hover:text-orange-600 transition-colors">
                                Privacy Policy
                            </Link>
                            <Link href="/terms" className="text-sm text-slate-600 hover:text-orange-600 transition-colors">
                                Terms
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
