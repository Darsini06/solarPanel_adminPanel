"use client";

import React from "react";
import {
    Zap, Shield, Globe, Sun, ArrowRight,
    BarChart3, Camera, Cloud, Battery, Wrench,
    FileUp, CheckCircle
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function OffersPage() {
    const offers = [
        {
            icon: <Zap className="text-orange-500" size={32} />,
            title: "Thermographic Analysis",
            description: "Utilizing high-resolution thermal imaging to detect hotspots, micro-cracks, and bypassed diodes that significantly reduce energy output.",
            features: ["Cell-level diagnostics", "Inverter thermal check", "String imbalance detection"]
        },
        {
            icon: <Shield className="text-blue-500" size={32} />,
            title: "Drone-Based Surveys",
            description: "Fast and safe aerial monitoring for large-scale solar farms. We cover hundreds of acres in hours, not days.",
            features: ["Automated flight paths", "High-res RGB mapping", "3D terrain modeling"]
        },
        {
            icon: <BarChart3 className="text-emerald-500" size={32} />,
            title: "Performance Audits",
            description: "Comprehensive data-driven reports comparing actual vs. expected yield, helping you maximize your ROI.",
            features: ["Yield analysis", "Degradation tracking", "Financial impact reports"]
        },
        {
            icon: <Battery className="text-purple-500" size={32} />,
            title: "System Optimization",
            description: "Beyond just inspecting, we provide guidance on cleaning schedules and hardware tuning to boost performance.",
            features: ["Cleaning recommendations", "Hardware health checks", "System balancing"]
        },
        {
            icon: <Camera className="text-yellow-500" size={32} />,
            title: "Site Documentation",
            description: "High-quality visual evidence for warranty claims and insurance purposes. We document every inch of your installation.",
            features: ["Insurance-ready reports", "Warranty claim support", "Time-lapse monitoring"]
        },
        {
            icon: <Cloud className="text-sky-500" size={32} />,
            title: "Cloud Asset Management",
            description: "Store and access all your site photographs, blueprints, and inspection reports in our secure, organized cloud platform.",
            features: ["Instant data access", "Collaborative workspace", "Mobile-ready logs"]
        }
    ];

    return (
        <div className="pt-32 pb-20 min-h-screen bg-white">
            {/* Header Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
                <div className="text-center max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center space-x-2 bg-orange-100 text-orange-700 px-4 py-1.5 rounded-full font-bold text-sm mb-6 uppercase tracking-wider"
                    >
                        <Sun size={16} />
                        <span>Our Service Portfolio</span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 leading-tight"
                    >
                        What We <span className="text-orange-600">Offers</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-slate-600 mb-10 leading-relaxed"
                    >
                        Cutting-edge solar inspection solutions designed to protect your investment and optimize energy generation.
                    </motion.p>
                </div>
            </section>

            {/* Offers Grid */}
            <section className="bg-slate-50 py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {offers.map((offer, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group bg-white p-10 rounded-[2.5rem] border border-slate-100 hover:shadow-2xl hover:shadow-orange-100 hover:-translate-y-2 transition-all duration-300"
                            >
                                <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-orange-50 transition-all duration-500">
                                    {offer.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-4">{offer.title}</h3>
                                <p className="text-slate-600 mb-8 leading-relaxed italic font-medium">
                                    {offer.description}
                                </p>
                                <ul className="space-y-3 mb-8">
                                    {offer.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-center text-slate-500 font-semibold text-sm">
                                            <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mr-2" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Detailed Reporting Section */}
            <section className="py-24 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-bold uppercase tracking-widest mb-6">
                                <FileUp size={16} />
                                Actionable Insights
                            </div>
                            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-8 leading-tight">
                                Comprehensive <br />
                                <span className="text-orange-600 italic">Inspection Reports</span>
                            </h2>
                            <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                                Our reports don't just list problems; they provide solutions. Every inspection concludes with a detailed PDF document containing:
                            </p>

                            <div className="space-y-6">
                                {[
                                    { title: "High-Res Thermal Maps", desc: "Precise coordinates of every detected hotspot or string failure." },
                                    { title: "ROI Impact Analysis", desc: "Estimated energy loss and financial recovery projections." },
                                    { title: "Prioritized Action Plan", desc: "Maintenance tasks categorized by urgency (Critical, Major, Minor)." },
                                    { title: "Historical Comparisons", desc: "Detailed tracking of system degradation over time." }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex gap-4">
                                        <div className="flex-shrink-0 w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-orange-600 border border-slate-100 shadow-sm">
                                            <CheckCircle size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 mb-1">{item.title}</h4>
                                            <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-12">
                                <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center gap-3 hover:bg-slate-800 transition-all shadow-xl">
                                    <FileUp size={20} />
                                    Download Sample Report
                                </button>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
                            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="absolute inset-0 bg-orange-200/20 blur-[100px] rounded-full" />
                            <div className="relative bg-slate-950 rounded-[3rem] p-4 shadow-2xl overflow-hidden border border-slate-800">
                                {/* Mock Report UI */}
                                <div className="bg-white rounded-[2.5rem] overflow-hidden">
                                    <div className="bg-orange-600 p-8 text-white">
                                        <div className="flex justify-between items-center mb-6">
                                            <Sun size={32} />
                                            <div className="text-right text-xs font-bold uppercase tracking-widest opacity-80">Ref: #SR-2024-089</div>
                                        </div>
                                        <h3 className="text-2xl font-bold mb-2">Solar Health Audit</h3>
                                        <p className="text-orange-100 text-sm italic font-medium">Facility: GreenVibe Industrial Park</p>
                                    </div>

                                    <div className="p-8 space-y-8">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                                <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Overall Health</div>
                                                <div className="text-2xl font-black text-emerald-500">84%</div>
                                            </div>
                                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                                <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Active Faults</div>
                                                <div className="text-2xl font-black text-red-500">12</div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                                <div className="h-full w-3/4 bg-orange-500" />
                                            </div>
                                            <div className="flex justify-between text-[10px] font-bold text-slate-400">
                                                <span>EFFICIENCY TREND</span>
                                                <span>PERIOD: 12 MONTHS</span>
                                            </div>
                                        </div>

                                        <div className="border-t border-slate-100 pt-6">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                                <span className="text-xs font-bold text-slate-900 uppercase">Critical Finding #01</span>
                                            </div>
                                            <div className="bg-slate-900 rounded-2xl aspect-video relative flex items-center justify-center overflow-hidden">
                                                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-500 via-transparent to-transparent " />
                                                <Zap className="text-orange-500 opacity-20" size={80} />
                                                <div className="absolute bottom-3 left-4 text-[10px] font-mono text-white/60">LAT: 34.0522° N | LONG: 118.2437° W</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* FAQ/CTA Style Section */}
            <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-slate-900 rounded-[4rem] p-12 md:p-20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-[100px] -mr-48 -mt-48" />
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight">
                                Not sure which service <br />
                                <span className="text-orange-500">fits your needs?</span>
                            </h2>
                            <p className="text-slate-400 text-lg mb-10 leading-relaxed italic">
                                Our experts are ready to analyze your solar infrastructure and recommend the best inspection strategy tailored to your specific site conditions and budget.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    href="/booking"
                                    className="px-8 py-4 bg-orange-600 text-white rounded-2xl font-bold hover:bg-orange-700 transition-all text-center uppercase tracking-widest shadow-lg shadow-orange-500/20"
                                >
                                    Book Consultation
                                </Link>
                                <Link
                                    href="/contact"
                                    className="px-8 py-4 bg-white/10 text-white border border-white/20 rounded-2xl font-bold hover:bg-white/20 transition-all text-center uppercase tracking-widest"
                                >
                                    Contact Us
                                </Link>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            {[
                                { label: "Precision", val: "99.9%" },
                                { label: "Experience", val: "8+ Yrs" },
                                { label: "Certified", val: "100%" },
                                { label: "Support", val: "24/7" },
                            ].map((pill, i) => (
                                <div key={i} className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center">
                                    <div className="text-3xl font-extrabold text-orange-500 mb-1">{pill.val}</div>
                                    <div className="text-slate-400 text-xs font-bold uppercase tracking-widest">{pill.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
