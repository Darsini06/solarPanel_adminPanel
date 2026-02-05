"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Shield, Award, ClipboardCheck, Zap } from "lucide-react";

export default function QualityControlPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="pt-32 pb-20 bg-slate-950 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/9875415/pexels-photo-9875415.jpeg?auto=compress&cs=tinysrgb&w=1200')] bg-cover bg-center opacity-25 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="px-4 py-1.5 bg-orange-600 rounded-md text-xs font-bold mb-8 tracking-[0.2em] uppercase inline-block">
                                Quality Assurance Layer
                            </div>
                            <h1 className="text-6xl md:text-8xl font-bold mb-8 tracking-tight leading-[1.1]">
                                Zero Defect <span className="text-orange-400">Construction</span>
                            </h1>
                            <p className="text-xl text-slate-300 mb-12 leading-relaxed max-w-2xl mx-auto">
                                Catch errors before they are cemented. Our AI-driven quality control system validates installation standards, torque values, and electrical connections with millmetric precision.
                            </p>
                            <div className="flex flex-wrap gap-5 justify-center">
                                <Link href="/booking" className="px-12 py-6 bg-orange-600 text-white rounded-xl font-bold text-lg hover:bg-orange-700 transition-all shadow-xl shadow-orange-900/40">
                                    Optimize Your QC Process
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Standards Grid */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { icon: Shield, title: "Torque Validation", desc: "Automated logging of every bolt torque value using proprietary digital torque links." },
                            { icon: Award, title: "Module Integrity", desc: "Digital EL imaging to detect micro-cracks before they hit the mounting structure." },
                            { icon: ClipboardCheck, title: "Live QC Workflows", desc: "Customized digital audit sheets for every construction milestone and team." },
                            { icon: Zap, title: "Electrical Verification", desc: "AI visual check of cable management and high-voltage connector seating." },
                            { icon: CheckCircle, title: "Final Compliance", desc: "Integrated safety documentation and site perimeter security monitoring." },
                            { icon: ArrowRight, title: "Historical hotspots", desc: "Compare project errors across your portfolio to predict quality risks." }
                        ].map((card, i) => (
                            <div key={i} className="group p-12 bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:bg-white hover:shadow-2xl transition-all duration-500">
                                <div className="w-16 h-16 bg-orange-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-orange-600/20 group-hover:scale-110 transition-transform">
                                    <card.icon size={32} />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-orange-600 transition-colors">{card.title}</h3>
                                <p className="text-slate-500 leading-relaxed text-sm">{card.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Split Section */}
            <section className="py-24 bg-white overflow-hidden border-t border-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="relative">
                            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-slate-100 bg-slate-100">
                                <Image
                                    src="https://images.pexels.com/photos/4320478/pexels-photo-4320478.jpeg?auto=compress&cs=tinysrgb&w=1200"
                                    alt="Technical Inspection"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-8 -right-8 bg-slate-950 p-8 rounded-3xl shadow-2xl text-white border border-white/10 hidden md:block">
                                <div className="text-4xl font-bold text-orange-400 mb-1">99.8%</div>
                                <div className="text-sm font-bold uppercase tracking-widest text-slate-400">Detection Accuracy</div>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-5xl font-bold text-slate-900 mb-8 tracking-tight">AI Vision <br /><span className="text-orange-600">Defect Engine</span></h2>
                            <p className="text-xl text-slate-600 mb-10 leading-relaxed">
                                Our computer vision models are trained on millions of high-resolution images to detect racking misalignment, and loose cabling with unparalleled precision.
                            </p>
                            <div className="space-y-4">
                                {[
                                    "Automated anomaly detection and classification",
                                    "GPS-tagged thermal and visual imagery",
                                    "Temperature delta (ΔT) analysis for every panel",
                                    "Comparative year-over-year inspection logs"
                                ].map((li, i) => (
                                    <div key={i} className="flex items-center gap-4 py-4 border-b border-slate-100 last:border-0 hover:translate-x-2 transition-transform cursor-default">
                                        <div className="bg-orange-600/10 p-1.5 rounded-full">
                                            <CheckCircle className="text-orange-600" size={22} />
                                        </div>
                                        <span className="font-bold text-slate-800 text-lg">{li}</span>
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
                <div className="max-w-4xl mx-auto px-4 relative z-10 text-white">
                    <h2 className="text-5xl font-bold mb-8 tracking-tight">Build for the Next 25 Years</h2>
                    <p className="text-2xl text-slate-400 mb-16 leading-relaxed">
                        Join the world's most disciplined developers who use SolarMark to ensure their solar assets are built right from day one.
                    </p>
                    <Link href="/booking" className="px-16 py-8 bg-orange-600 text-white rounded-xl font-bold text-xl hover:bg-orange-700 transition-all shadow-2xl shadow-orange-900/40 active:scale-95 inline-block">
                        Download Quality Standards
                    </Link>
                </div>
            </section>
        </div>
    );
}
