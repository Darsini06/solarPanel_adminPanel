"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Smartphone, Users, ClipboardList, Clock, ShieldCheck, Zap } from "lucide-react";

export default function WorkManagementPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="pt-32 pb-20 bg-slate-950 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/159888/pexels-photo-159888.jpeg?auto=compress&cs=tinysrgb&w=1200')] bg-cover bg-center opacity-20 mix-blend-luminosity"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="px-4 py-1.5 bg-orange-600 rounded-md text-xs font-bold mb-8 tracking-[0.2em] uppercase inline-block font-sans">
                                Professional O&M
                            </div>
                            <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-[1.1] tracking-tight">
                                Solar Operations <br /><span className="text-orange-400">Simplified</span>
                            </h1>
                            <p className="text-xl text-slate-300 mb-12 leading-relaxed max-w-2xl mx-auto">
                                Close the loop between discovery and repair. Our work management platform automates ticketing, optimizes routing, and provides real-time GPS visibility.
                            </p>
                            <div className="flex flex-wrap gap-4 justify-center">
                                <Link href="/booking" className="px-10 py-5 bg-orange-600 text-white rounded-xl font-bold text-lg hover:bg-orange-700 transition-all shadow-xl shadow-orange-900/20">
                                    Start Optimizing Today
                                </Link>
                                <Link href="#dashboard" className="px-10 py-5 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-xl font-bold text-lg hover:bg-white/20 transition-all">
                                    Watch Demo
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Feature Blocks */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: Smartphone, title: "Mobile O&M App", desc: "Field-ready mobile application for onsite inspections and real-time data sync." },
                            { icon: ClipboardList, title: "Smart Ticketing", desc: "Automated work order generation triggered by AI anomaly detection." },
                            { icon: Users, title: "Vendor Coordination", desc: "Unified portal to manage 3rd party contractors and monitor SLA performance." },
                            { icon: Clock, title: "GPS Tracking", desc: "Live location monitoring of field teams for optimized dispatch and safety." }
                        ].map((item, i) => (
                            <div key={i} className="p-10 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all group">
                                <div className="w-14 h-14 bg-orange-600 text-white rounded-xl flex items-center justify-center mb-8 shadow-lg shadow-orange-600/20">
                                    <item.icon size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-4">{item.title}</h3>
                                <p className="text-slate-500 leading-relaxed text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Split Section */}
            <section className="py-24 bg-white overflow-hidden border-t border-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="relative order-2 lg:order-1">
                            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-slate-100 bg-slate-100">
                                <Image
                                    src="https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg?auto=compress&cs=tinysrgb&w=1200"
                                    alt="Live Operations"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="absolute top-8 left-8 bg-orange-600 text-white p-4 rounded-xl shadow-xl flex items-center gap-3">
                                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                <span className="font-bold text-sm uppercase tracking-widest">Live Operations</span>
                            </div>
                        </div>
                        <div className="order-1 lg:order-2">
                            <h2 className="text-5xl font-bold text-slate-900 mb-8 tracking-tight">Full Visibility <br /><span className="text-orange-600">Command Center</span></h2>
                            <p className="text-xl text-slate-600 mb-10 leading-relaxed">
                                Experience bank-grade infrastructure oversight. Our cloud hub provides asset managers with a single source of truth for portfolio health, field status, and financial impact.
                            </p>
                            <div className="space-y-4">
                                {[
                                    "Real-time technician dispatch & routing",
                                    "Automated compliance and safety reports",
                                    "Centralized inventory and parts management",
                                    "Integrated sensor and drone data streams"
                                ].map((li, i) => (
                                    <div key={i} className="flex items-center gap-4 py-4 border-b border-slate-100">
                                        <div className="bg-orange-600/10 p-1 rounded-full">
                                            <CheckCircle className="text-orange-600" size={20} />
                                        </div>
                                        <span className="font-semibold text-slate-800">{li}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-slate-950 relative overflow-hidden text-center">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-orange-500/50 to-transparent"></div>
                <div className="max-w-4xl mx-auto px-4 relative z-10">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight">Boost Your Efficiency by 40%</h2>
                    <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                        Data-driven work management reduces your Mean Time To Repair (MTTR) and protects your asset performance for the long term.
                    </p>
                    <Link href="/booking" className="px-14 py-6 bg-orange-600 text-white rounded-xl font-bold text-xl hover:bg-orange-700 transition-all shadow-2xl shadow-orange-900/40 active:scale-95 inline-block">
                        Schedule a Demo
                    </Link>
                </div>
            </section>
        </div>
    );
}
