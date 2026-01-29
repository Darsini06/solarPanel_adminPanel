"use client";

import React from "react";
import Link from "next/link";
import {
    Facebook,
    Twitter,
    Linkedin,
    Instagram,
    Mail,
    Phone,
    MapPin,
    ArrowRight,
    Sun,
    Shield,
    Zap
} from "lucide-react";
import { motion } from "framer-motion";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        Company: [
            { name: "About Us", href: "/about" },
            { name: "What We Offers", href: "/offers" },
            { name: "Booking", href: "/booking" },
            { name: "Contact", href: "/contact" },
            { name: "Case Studies", href: "/cases" },
            { name: "Careers", href: "/careers" },
        ],
        Support: [
            { name: "Help Center", href: "/help" },
            { name: "Methodology", href: "/methodology" },
            { name: "Privacy Policy", href: "/privacy" },
            { name: "Terms of Service", href: "/terms" },
        ],
    };

    const socialLinks = [
        { icon: <Facebook size={20} />, href: "#", label: "Facebook" },
        { icon: <Twitter size={20} />, href: "#", label: "Twitter" },
        { icon: <Linkedin size={20} />, href: "#", label: "LinkedIn" },
        { icon: <Instagram size={20} />, href: "#", label: "Instagram" },
    ];

    return (
        <footer className="relative bg-slate-950 text-slate-300 pt-20 pb-10 overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">

                    {/* Brand Section */}
                    <div className="lg:col-span-4">
                        <Link href="/" className="flex items-center gap-2 mb-6 group">
                            <div className="p-2 bg-orange-500 rounded-lg group-hover:rotate-12 transition-transform duration-300">
                                <Sun className="text-white fill-white" size={24} />
                            </div>
                            <span className="text-2xl font-bold text-white tracking-tight">
                                Solar<span className="text-orange-500 italic">Inspection</span>
                            </span>
                        </Link>
                        <p className="text-slate-400 mb-8 max-w-sm leading-relaxed">
                            Pioneering the future of solar energy maintenance through advanced thermographic drone inspections and AI-driven diagnostic solutions.
                        </p>
                        <div className="flex gap-4">
                            {socialLinks.map((social, index) => (
                                <motion.a
                                    key={index}
                                    href={social.href}
                                    whileHover={{ y: -4, scale: 1.1 }}
                                    className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-300 shadow-lg"
                                    aria-label={social.label}
                                >
                                    {social.icon}
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Links Sections */}
                    {Object.entries(footerLinks).map(([title, links]) => (
                        <div key={title} className="lg:col-span-2">
                            <h3 className="text-white font-bold mb-6 tracking-wider uppercase text-xs opacity-80">{title}</h3>
                            <ul className="space-y-4">
                                {links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-slate-400 hover:text-orange-500 hover:translate-x-1 flex items-center gap-2 transition-all duration-200"
                                        >
                                            <ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 transition-all duration-200" />
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Contact Section */}
                    <div className="lg:col-span-2">
                        <h3 className="text-white font-bold mb-6 tracking-wider uppercase text-xs opacity-80">Contact</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin className="text-orange-500 flex-shrink-0" size={18} />
                                <span className="text-slate-400 text-sm">123 Solar Way, Tech Valley, CA 94043</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="text-orange-500 flex-shrink-0" size={18} />
                                <span className="text-slate-400 text-sm">+1 (555) 123-4567</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="text-orange-500 flex-shrink-0" size={18} />
                                <span className="text-slate-400 text-sm">info@solarvision.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Newsletter Banner */}
                <div className="bg-gradient-to-r from-orange-600 to-orange-400 rounded-3xl p-8 mb-16 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-orange-500/20">
                    <div className="text-center md:text-left">
                        <h2 className="text-2xl font-bold text-white mb-2">Ready to optimize your solar assets?</h2>
                        <p className="text-orange-50/80">Subscribe to our newsletter for the latest in solar technology.</p>
                    </div>
                    <div className="flex w-full md:w-auto bg-white/10 backdrop-blur-md border border-white/20 p-1.5 rounded-2xl">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="bg-transparent border-none focus:ring-0 text-white placeholder:text-orange-100/50 px-4 py-2 w-full md:w-64 outline-none"
                        />
                        <button className="bg-white text-orange-600 px-6 py-2 rounded-xl font-bold hover:bg-orange-50 transition-colors duration-200 whitespace-nowrap shadow-md">
                            Join Now
                        </button>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-slate-500 text-sm">
                        © {currentYear} <span className="text-slate-300 font-medium">Solar Inspection Inc</span>. All rights reserved.
                    </p>
                    <div className="flex items-center gap-8 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                        <div className="flex items-center gap-2">
                            <Shield size={16} />
                            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Secure Payments</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Zap size={16} />
                            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Fast Diagnostics</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
