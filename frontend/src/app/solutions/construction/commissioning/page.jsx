"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, FileCheck, Zap, BarChart3, ShieldCheck } from "lucide-react";

export default function CommissioningPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="pt-32 pb-20 bg-slate-50 border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-block px-4 py-1.5 bg-blue-600 text-white rounded-md text-xs font-bold mb-8 tracking-[0.2em] uppercase">
                                Final Handover
                            </div>
                            <h1 className="text-6xl md:text-7xl font-bold text-slate-900 mb-8 tracking-tight leading-tight">
                                Flawless <br /><span className="text-blue-600">Commissioning</span>
                            </h1>
                            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-lg">
                                Ensure a smooth transition from construction to operations. Our digital commissioning platform automates testing, documentation, and handover reporting.
                            </p>
                            <div className="flex gap-4">
                                <Link href="/booking" className="px-10 py-5 bg-slate-900 text-white rounded-xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl">
                                    Request Demo
                                </Link>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative"
                        >
                            <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
                                <Image
                                    src="https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg?auto=compress&cs=tinysrgb&w=800"
                                    alt="Commissioning Testing"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-8 -left-8 bg-white p-8 rounded-2xl shadow-xl border border-slate-100 max-w-[280px]">
                                <div className="flex items-center gap-3 text-green-600 font-bold mb-4">
                                    <ShieldCheck size={24} />
                                    <span>IEC 62446 Ready</span>
                                </div>
                                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                    Automated generation of commissioning reports following global IEC standards.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section className="py-24 bg-white relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-bold text-slate-900 mb-20 text-center tracking-tight">Streamlined Verification Process</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center text-balance">
                        {[
                            { icon: Zap, title: "I-V Curve Testing", desc: "Automated logging and comparison of module performance against STC." },
                            { icon: FileCheck, title: "Digital Handover", desc: "Instant generation of O&M manuals and as-built documentation packages." },
                            { icon: BarChart3, title: "Heatmap Validation", desc: "Final thermal scan to confirm zero hotspots before site acceptance." },
                            { icon: CheckCircle, title: "Compliance Check", desc: "Verification against local grid codes and safety regulations." }
                        ].map((step, i) => (
                            <div key={i} className="flex flex-col items-center group">
                                <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center text-blue-600 mb-8 border border-slate-100 shadow-sm">
                                    <step.icon size={36} />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-4">{step.title}</h3>
                                <p className="text-slate-500 leading-relaxed text-sm">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Detail Section */}
            <section className="py-24 bg-slate-900 text-white border-y border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="order-2 lg:order-1">
                            <h2 className="text-4xl font-bold mb-8 tracking-tight">Digital Acceptance Testing</h2>
                            <p className="text-xl text-slate-400 mb-10 leading-relaxed">
                                Say goodbye to paper-based checklists. Our mobile-first commissioning platform guides field technicians through the entire testing workflow.
                            </p>
                            <div className="space-y-4">
                                {[
                                    "Automated test equipment data sync",
                                    "In-app photo and document capture",
                                    "Real-time pass/fail logic based on IEC-62446",
                                    "Instant PDF report generation for stakeholders",
                                    "Project manager dashboard for multi-site approval"
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 bg-white/5 p-5 rounded-xl border border-white/5">
                                        <CheckCircle className="text-blue-500 flex-shrink-0" size={20} />
                                        <span className="font-semibold">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="order-1 lg:order-2">
                            <div className="aspect-[4/3] rounded-3xl overflow-hidden border-4 border-slate-700 shadow-2xl">
                                <Image src="https://images.pexels.com/photos/159888/pexels-photo-159888.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Technical check" fill className="object-cover" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Box */}
            <section className="py-24 bg-white text-center">
                <h2 className="text-5xl font-bold text-slate-900 mb-12 max-w-2xl mx-auto tracking-tight">Accept Your Site with <span className="text-blue-600">Full Confidence</span></h2>
                <Link href="/booking" className="px-12 py-6 bg-blue-600 text-white rounded-xl font-bold text-xl hover:bg-blue-700 transition-all shadow-xl active:scale-95 inline-block">
                    Explore Handover Solutions
                </Link>
            </section>
        </div>
    );
}
