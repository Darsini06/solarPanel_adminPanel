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
            <section className="pt-32 pb-20 bg-slate-50 border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="inline-block px-4 py-1.5 bg-orange-100 text-orange-600 rounded-md text-xs font-bold mb-8 tracking-[0.2em] uppercase">
                                Solutions / Construction / Quality Control
                            </div>
                            <h1 className="text-6xl md:text-7xl font-bold text-slate-900 mb-8 tracking-tight leading-tight">
                                Automated <br /><span className="text-orange-600">Quality Control</span>
                            </h1>
                            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-lg font-medium">
                                Eliminate human error. Our AI-driven quality control system validates installation standards, torque values, and electrical connections at scale.
                            </p>
                            <div className="flex gap-4">
                                <Link
                                    href="/booking"
                                    className="px-8 py-4 bg-orange-600 text-white rounded-xl font-bold text-lg hover:bg-orange-700 transition-all inline-flex items-center gap-2 group shadow-xl shadow-orange-100"
                                >
                                    Book a Demo
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link
                                    href="/contact"
                                    className="px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all"
                                >
                                    Download Standards
                                </Link>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="relative"
                        >
                            <div className="aspect-square rounded-full overflow-hidden border-[12px] border-white shadow-2xl relative z-10 w-full max-w-[500px] mx-auto">
                                <Image
                                    src="https://images.pexels.com/photos/9875415/pexels-photo-9875415.jpeg?auto=compress&cs=tinysrgb&w=800"
                                    alt="Solar Quality Control"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="absolute top-10 right-10 bg-white p-6 rounded-2xl shadow-2xl z-20 border border-slate-50">
                                <Shield size={32} className="text-green-500 mb-2" />
                                <div className="text-sm font-bold text-slate-900 uppercase tracking-widest">100% Validated</div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Standards Grid */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-bold text-slate-900 mb-6 tracking-tight">Industrial Grade Standards</h2>
                        <p className="text-xl text-slate-600 font-medium">We inspect for 500+ specific quality points during construction.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { icon: Shield, title: "Torque Verification", desc: "Automated logging of every bolt torque value using digital wrenches." },
                            { icon: Award, title: "Module Health", desc: "EL imaging to detect micro-cracks before they are installed." },
                            { icon: ClipboardCheck, title: "Digital QC Sheets", desc: "Customized digital checklists for every construction phase." },
                            { icon: Zap, title: "Wiring Validation", desc: "AI visual check of cable management and connector seating." },
                            { icon: CheckCircle, title: "Safety Audits", desc: "Integrated safety documentation and site perimeter monitoring." },
                            { icon: ArrowRight, title: "Predictive QC", desc: "Historical error mapping to predict future quality hotspots." }
                        ].map((card, i) => (
                            <div key={i} className="group p-12 bg-slate-50 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-2xl transition-all duration-300">
                                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-orange-600 mb-8 shadow-sm">
                                    <card.icon size={28} />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-4">{card.title}</h3>
                                <p className="text-slate-600 leading-relaxed font-medium text-sm">{card.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Showcase Feature */}
            <section className="py-24 bg-slate-50 border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="relative">
                            <Image src="https://images.pexels.com/photos/8853517/pexels-photo-8853517.jpeg?auto=compress&cs=tinysrgb&w=800" alt="QC Software Interface" width={800} height={600} className="rounded-3xl shadow-2xl border-4 border-white" />
                        </div>
                        <div>
                            <h2 className="text-4xl font-bold text-slate-900 mb-8 tracking-tight">AI Vision Defect Detection</h2>
                            <p className="text-xl text-slate-600 mb-10 leading-relaxed font-medium">
                                Our AI models are trained on millions of images to detect module defects, racking misalignment, and loose cabling with 99.8% precision.
                            </p>
                            <div className="space-y-4">
                                {["Panel surface micro-cracks", "Mounting bracket misalignment", "Improper cable stringing", "Grounding wire connectivity"].map((li, i) => (
                                    <div key={i} className="flex items-center gap-4 py-4 border-b border-slate-200">
                                        <div className="w-10 h-1 rounded-full bg-orange-600"></div>
                                        <span className="font-bold text-slate-800 text-lg">{li}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-white text-center">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="bg-slate-900 text-white p-20 md:p-24 rounded-[40px] relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/20 shadow-[0_0_100px_40px_rgba(234,88,12,0.1)] blur-[80px] pointer-events-none"></div>
                        <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight">Zero Defect Construction</h2>
                        <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto font-medium">
                            Join the developers world-wide who use SolarMark to ensure their solar assets are built to last 25+ years.
                        </p>
                        <Link href="/booking" className="px-12 py-6 bg-orange-600 text-white rounded-xl font-bold text-xl hover:bg-orange-700 transition-all shadow-2xl active:scale-95 inline-block">
                            Optimize Your QC Process
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
