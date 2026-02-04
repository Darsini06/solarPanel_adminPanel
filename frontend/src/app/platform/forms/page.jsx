"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, FileText, Smartphone, ClipboardCheck, Zap, ShieldCheck, Globe } from "lucide-react";

export default function FormsPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Dark Hero Section */}
            <section className="pt-32 pb-20 bg-slate-950 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/544268/pexels-photo-544268.jpeg?auto=compress&cs=tinysrgb&w=1200')] bg-cover bg-center opacity-25 mix-blend-overlay"></div>
                <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-slate-950 to-transparent"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="px-4 py-1.5 bg-orange-600 rounded-md text-xs font-bold mb-8 tracking-[0.2em] uppercase inline-block font-sans">
                                Field Engagement
                            </div>
                            <h1 className="text-6xl md:text-8xl font-bold mb-8 tracking-tight leading-[1.1]">
                                Digital <br /><span className="text-orange-400">Documentation</span>
                            </h1>
                            <p className="text-xl text-slate-300 mb-12 leading-relaxed max-w-2xl mx-auto">
                                Eliminate paper workflows. Our intelligent forms and ticketing engine connects field technicians to home office in real-time with offline support.
                            </p>
                            <div className="flex flex-wrap gap-5 justify-center">
                                <Link href="/booking" className="px-12 py-6 bg-orange-600 text-white rounded-xl font-bold text-lg hover:bg-orange-700 transition-all shadow-xl shadow-orange-900/40">
                                    Start Digital Workflows
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Core Capability Grid */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                            { icon: Smartphone, title: "Offline Mobile", desc: "Native iOS & Android apps that work in remote sites with intelligent sync protocols." },
                            { icon: ClipboardCheck, title: "Smart Logic", desc: "Build dynamic forms with conditional logic and automated validation rules." },
                            { icon: FileText, title: "Automated Reports", desc: "Turn field data into professional, branded PDF reports for clients in seconds." }
                        ].map((item, i) => (
                            <div key={i} className="p-12 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:shadow-2xl transition-all group">
                                <div className="w-16 h-16 bg-orange-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-orange-600/20 group-hover:scale-110 transition-transform">
                                    <item.icon size={32} />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-orange-600 transition-colors uppercase text-sm tracking-widest">{item.title}</h3>
                                <p className="text-slate-500 leading-relaxed text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Split Showcase */}
            <section className="py-24 bg-white overflow-hidden border-t border-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="relative">
                            <div className="aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl border border-slate-100 bg-slate-100">
                                <Image src="https://images.pexels.com/photos/8853507/pexels-photo-8853507.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Mobile App Usage" fill className="object-cover" />
                            </div>
                            <div className="absolute -bottom-8 -right-8 bg-slate-950 p-8 rounded-3xl shadow-2xl text-white border border-white/10 hidden md:block">
                                <div className="text-4xl font-bold text-orange-400 mb-1">100%</div>
                                <div className="text-sm font-bold uppercase tracking-widest text-slate-400">Digital Compliance</div>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-5xl font-bold text-slate-900 mb-8 tracking-tight">Structured Data <br /><span className="text-orange-600">Field Mobility</span></h2>
                            <p className="text-xl text-slate-600 mb-10 leading-relaxed font-medium">
                                Give your field team the tool they actually want to use. Our mobile-first interface is designed for high-glare environments and glove-friendly interaction.
                            </p>
                            <div className="space-y-4">
                                {[
                                    "Customizable form builder",
                                    "Barcode and QR scanning",
                                    "GPS and timestamp validation",
                                    "Rich media (Photo/Video) upload",
                                    "Digital signature capture"
                                ].map((li, i) => (
                                    <div key={i} className="flex items-center gap-4 py-4 border-b border-slate-100 last:border-0 group cursor-default">
                                        <div className="w-10 h-1 bg-slate-100 group-hover:bg-orange-600 transition-all rounded-full"></div>
                                        <span className="font-bold text-slate-700 text-lg group-hover:text-slate-950 transition-colors">{li}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Elite CTA */}
            <section className="py-24 bg-slate-950 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-orange-600/5 blur-[100px]"></div>
                <div className="max-w-4xl mx-auto px-4 relative z-10 text-white text-center">
                    <h2 className="text-5xl font-bold mb-8 tracking-tight">Stop the Paper Trail.</h2>
                    <p className="text-2xl text-slate-400 mb-16 leading-relaxed font-medium">
                        Standardize your field operations with the most versatile reporting engine in the solar industry.
                    </p>
                    <Link href="/booking" className="px-16 py-8 bg-orange-600 text-white rounded-xl font-bold text-xl hover:bg-orange-700 transition-all shadow-2xl shadow-orange-900/40 active:scale-95 inline-block">
                        Build My First Form
                    </Link>
                </div>
            </section>
        </div>
    );
}

