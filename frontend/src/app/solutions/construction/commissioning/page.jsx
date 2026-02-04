"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Zap, ShieldCheck, Activity, FileCheck } from "lucide-react";

export default function CommissioningPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="pt-32 pb-20 bg-slate-950 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/159888/pexels-photo-159888.jpeg?auto=compress&cs=tinysrgb&w=1200')] bg-cover bg-center opacity-25 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="px-4 py-1.5 bg-orange-600 rounded-md text-xs font-bold mb-8 tracking-[0.2em] uppercase inline-block font-sans">
                            Final Assurance Phase
                        </div>
                        <h1 className="text-6xl md:text-8xl font-bold mb-8 tracking-tight leading-[1.1]">
                            Precision <span className="text-orange-400">Commissioning</span>
                        </h1>
                        <p className="text-xl text-slate-300 mb-12 leading-relaxed max-w-2xl mx-auto">
                            Transform handovers into high-fidelity data validation. Our system ensures every string, inverter, and sensor meets design specifications before operation begins.
                        </p>
                        <div className="flex flex-wrap gap-5 justify-center">
                            <Link href="/booking" className="px-12 py-6 bg-orange-600 text-white rounded-xl font-bold text-lg hover:bg-orange-700 transition-all shadow-xl shadow-orange-900/40">
                                Launch Commissioning Guide
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Core Pillars */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: Zap, title: "String Testing", desc: "Automated IV-curve tracing and string-level performance validation." },
                            { icon: Activity, title: "SCADA Sync", desc: "Verifying communication between field devices and central control systems." },
                            { icon: ShieldCheck, title: "Safety Protocol", desc: "Rigorous testing of high-voltage safety and emergency shutdown systems." },
                            { icon: FileCheck, title: "Handover Docs", desc: "Instant generation of 'as-built' logs and warranty certificates." }
                        ].map((item, i) => (
                            <div key={i} className="p-10 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all group">
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

            {/* Split Content */}
            <section className="py-24 bg-white overflow-hidden border-t border-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="relative">
                            <div className="aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl border border-slate-100 bg-slate-100">
                                <Image
                                    src="https://images.pexels.com/photos/9875415/pexels-photo-9875415.jpeg?auto=compress&cs=tinysrgb&w=800"
                                    alt="Technical commissioning"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-8 -right-8 bg-orange-600 p-8 rounded-[2.5rem] shadow-2xl text-white transform hover:scale-105 transition-transform">
                                <Activity className="mb-4" size={32} />
                                <div className="text-4xl font-bold mb-1">200+</div>
                                <div className="text-sm font-bold uppercase tracking-widest opacity-80">Validation Points</div>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-5xl font-bold text-slate-900 mb-8 tracking-tight">Standardized <br /><span className="text-orange-600">Site-Acceptance</span></h2>
                            <p className="text-xl text-slate-600 mb-10 leading-relaxed">
                                Don't rely on paper checklists. SolarMark provides digital SAT (Site Acceptance Test) workflows that ensure 100% data fidelity for your permanent assets.
                            </p>
                            <div className="space-y-4">
                                {[
                                    "Inverter performance mapping",
                                    "Transformer health validation",
                                    "Array grounding & insulation testing",
                                    "Meteorological station calibration",
                                    "Remote SCADA connectivity verification"
                                ].map((li, i) => (
                                    <div key={i} className="flex items-center gap-4 py-4 border-b border-slate-100 last:border-0 group cursor-default">
                                        <div className="w-10 h-1 bg-slate-100 group-hover:bg-orange-600 transition-all rounded-full"></div>
                                        <span className="font-bold text-slate-700 text-lg group-hover:text-slate-900 transition-colors">{li}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Elite CTA */}
            <section className="py-24 bg-slate-950 text-center relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-orange-500/30 to-transparent"></div>
                <div className="max-w-4xl mx-auto px-4 relative z-10 text-white text-center">
                    <h2 className="text-5xl font-bold mb-8 tracking-tight">Ready for Energization?</h2>
                    <p className="text-2xl text-slate-400 mb-16 leading-relaxed">
                        Ensure your assets start their life at peak performance. Download our comprehensive commissioning toolkit today.
                    </p>
                    <Link href="/booking" className="px-16 py-8 bg-orange-600 text-white rounded-xl font-bold text-xl hover:bg-orange-700 transition-all shadow-2xl shadow-orange-900/40 active:scale-95 inline-block">
                        Get Started Free
                    </Link>
                </div>
            </section>
        </div>
    );
}
