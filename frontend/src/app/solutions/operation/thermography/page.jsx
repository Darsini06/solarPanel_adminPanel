"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Target, Zap, TrendingUp, ShieldAlert } from "lucide-react";

export default function ThermographyPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="pt-32 pb-20 bg-slate-950 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/9875415/pexels-photo-9875415.jpeg?auto=compress&cs=tinysrgb&w=1200')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="px-4 py-1.5 bg-orange-600 rounded-md text-xs font-bold mb-8 tracking-[0.2em] uppercase inline-block">
                                Advanced Inspection
                            </div>
                            <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight tracking-tight">
                                See What Others <span className="text-orange-400">Miss</span>
                            </h1>
                            <p className="text-xl text-slate-300 mb-12 leading-relaxed max-w-2xl mx-auto">
                                SolarMark's thermal imaging suite identifies diode failures, micro-cracks, and string issues with military-grade precision. Stop wasting energy today.
                            </p>
                            <div className="flex flex-wrap gap-4 justify-center">
                                <Link href="/booking" className="px-10 py-5 bg-white text-slate-900 rounded-xl font-bold text-lg hover:bg-slate-100 transition-all shadow-xl">
                                    Get an Inspection Quote
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Benefits Grid */}
            <section className="py-24 bg-white text-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: Target, title: "String-Level Accuracy", desc: "Identify underperforming strings instantly with localized heating detection." },
                            { icon: ShieldAlert, title: "Defect Prioritization", desc: "Our AI ranks defects based on energy loss potential and safety risk." },
                            { icon: Zap, title: "Fast Reporting", desc: "Receive comprehensive thermal reports within 72 hours of inspection." }
                        ].map((item, i) => (
                            <div key={i} className="p-12 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all group">
                                <div className="w-16 h-16 bg-orange-600 text-white rounded-xl flex items-center justify-center mb-8 mx-auto shadow-lg shadow-orange-600/20">
                                    <item.icon size={32} />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-4">{item.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Large Image Breakdown */}
            <section className="py-24 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="relative">
                            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-slate-100">
                                <Image src="https://images.pexels.com/photos/4340919/pexels-photo-4340919.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Thermal Scan" fill className="object-cover" />
                            </div>
                            <div className="absolute top-8 right-8 bg-orange-600 text-white p-6 rounded-2xl shadow-xl border border-white/20">
                                <Zap size={32} />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-5xl font-bold text-slate-900 mb-8 tracking-tight">IEC 62446-3 Compliant</h2>
                            <p className="text-xl text-slate-600 mb-10 leading-relaxed">
                                Don't settle for blurry photos. We use high-resolution radiometry to capture absolute temperature data for every pixel, allowing for bank-grade validation of asset health.
                            </p>
                            <div className="space-y-4">
                                {[
                                    "Automatic anomaly detection and classification",
                                    "GPS-tagged thermal and visual imagery",
                                    "Temperature delta (ΔT) analysis for every panel",
                                    "Comparative year-over-year inspection logs"
                                ].map((li, i) => (
                                    <div key={i} className="flex items-center gap-4 py-4 border-b border-slate-100">
                                        <CheckCircle className="text-orange-600 flex-shrink-0" size={24} />
                                        <span className="font-semibold text-slate-800 text-lg">{li}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 text-center bg-slate-50">
                <div className="max-w-3xl mx-auto px-4">
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8 tracking-tight">Ready for Your Thermal Audit?</h2>
                    <p className="text-xl text-slate-600 mb-12 font-medium">
                        Stop the invisible revenue leak. Identify performance issues before they impact your P&L.
                    </p>
                    <Link href="/booking" className="px-14 py-6 bg-slate-900 text-white rounded-2xl font-bold text-xl hover:bg-slate-800 transition-all shadow-2xl active:scale-95 inline-block">
                        Book My Free Site Scan
                    </Link>
                </div>
            </section>
        </div>
    );
}
