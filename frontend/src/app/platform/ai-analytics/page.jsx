"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Brain, BarChart3, Target, ShieldCheck, Zap } from "lucide-react";

export default function AIAnalyticsPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Dark Hero Section */}
            <section className="pt-32 pb-20 bg-slate-950 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg?auto=compress&cs=tinysrgb&w=1200')] bg-cover bg-center opacity-25 mix-blend-overlay"></div>
                <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-slate-950 to-transparent"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="px-4 py-1.5 bg-orange-600 rounded-md text-xs font-bold mb-8 tracking-[0.2em] uppercase inline-block font-sans">
                                Intelligence Layer
                            </div>
                            <h1 className="text-6xl md:text-8xl font-bold mb-8 tracking-tight leading-[1.1]">
                                Insight <br /><span className="text-orange-400">At Scale</span>
                            </h1>
                            <p className="text-xl text-slate-300 mb-12 leading-relaxed max-w-2xl mx-auto">
                                Transform raw visual data into actionable asset intelligence. Our proprietary computer vision engine identifies defects with 99%+ accuracy.
                            </p>
                            <div className="flex flex-wrap gap-5 justify-center">
                                <Link href="/booking" className="px-12 py-6 bg-orange-600 text-white rounded-xl font-bold text-lg hover:bg-orange-700 transition-all shadow-xl shadow-orange-900/40">
                                    Analyze Your Portfolio
                                </Link>
                                <Link href="/contact" className="px-12 py-6 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-xl font-bold text-lg hover:bg-white/20 transition-all">
                                    Technical Whitepaper
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Core Pillars */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                            { icon: Brain, title: "Pattern Engine", desc: "Trained on over 1.2 billion solar inspection images to detect even the most subtle thermal anomalies." },
                            { icon: Target, title: "Defect Scoring", desc: "Automated prioritization based on estimated KWh loss and safety risk severity levels." },
                            { icon: BarChart3, title: "Insight Dashboard", desc: "Cross-portfolio analytics to benchmark yield performance against regional institutional data." }
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
                        <div>
                            <h2 className="text-5xl font-bold text-slate-900 mb-8 tracking-tight">Enterprise Data <br /><span className="text-orange-600">Normalization</span></h2>
                            <p className="text-xl text-slate-600 mb-10 leading-relaxed font-medium">
                                We handle the heavy lifting of data cleanup. Our engine automatically tag, geo-locates, and prioritizes inspection findings from legacy formats.
                            </p>
                            <div className="space-y-4">
                                {[
                                    "Automated meta-data extraction",
                                    "GPS-drift correction software",
                                    "Y-o-Y (Year over Year) health comparison",
                                    "Sub-pixel anomaly segmentation",
                                    "Automated PDF & JSON reporting export"
                                ].map((li, i) => (
                                    <div key={i} className="flex items-center gap-4 py-4 border-b border-slate-100 last:border-0 group cursor-default">
                                        <div className="bg-orange-600/10 p-1.5 rounded-full">
                                            <ShieldCheck className="text-orange-600" size={20} />
                                        </div>
                                        <span className="font-bold text-slate-700 text-lg group-hover:text-slate-950 transition-colors">{li}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative">
                            <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl border-[12px] border-slate-50 relative bg-slate-900">
                                <Image src="https://images.pexels.com/photos/8853502/pexels-photo-8853502.jpeg?auto=compress&cs=tinysrgb&w=800" alt="AI Analytics Interface" fill className="object-cover opacity-70" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Elite CTA */}
            <section className="py-24 bg-slate-950 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-orange-600/5 blur-[100px]"></div>
                <div className="max-w-4xl mx-auto px-4 relative z-10 text-white text-center">
                    <h2 className="text-5xl font-bold mb-8 tracking-tight">Turn Pixels Into Power.</h2>
                    <p className="text-2xl text-slate-400 mb-16 leading-relaxed font-medium">
                        Don't drown in data. Experience the AI engine that manages over 80GW of global renewable assets.
                    </p>
                    <Link href="/booking" className="px-16 py-8 bg-orange-600 text-white rounded-xl font-bold text-xl hover:bg-orange-700 transition-all shadow-2xl shadow-orange-900/40 active:scale-95 inline-block">
                        Request a Full AI Audit
                    </Link>
                </div>
            </section>
        </div>
    );
}

