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
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center space-x-2 bg-orange-100 text-orange-700 px-5 py-2 rounded-lg font-bold text-xs mb-8 uppercase tracking-widest"
                    >
                        <Sun size={14} />
                        <span>Our Specialized Expertise</span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-bold text-slate-900 mb-8 leading-tight tracking-tight"
                    >
                        What we <span className="text-orange-600">offers</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl md:text-2xl text-slate-600 mb-10 leading-relaxed font-medium"
                    >
                        Cutting-edge solar inspection solutions designed to protect your investment and optimize energy generation.
                    </motion.p>
                </div>
            </section>

            {/* Offers Grid */}
            <section className="bg-slate-50 py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {offers.map((offer, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-300"
                            >
                                <div className="w-20 h-20 rounded-2xl bg-slate-50 flex items-center justify-center mb-8 transition-all duration-500">
                                    {offer.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">{offer.title}</h3>
                                <p className="text-slate-600 mb-8 leading-relaxed font-medium">
                                    {offer.description}
                                </p>
                                <ul className="space-y-4 mb-8">
                                    {offer.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-center text-slate-700 font-bold text-sm">
                                            <CheckCircle className="w-5 h-5 text-orange-500 mr-3" />
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
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-orange-100 text-orange-600 text-[10px] font-bold uppercase tracking-widest mb-6">
                                <FileUp size={14} />
                                Actionable Insights
                            </div>
                            <h2 className="text-4xl md:text-6xl font-bold text-slate-900 mb-10 leading-tight tracking-tight">
                                Comprehensive <br />
                                <span className="text-orange-600">Inspection Reports</span>
                            </h2>
                            <p className="text-xl text-slate-600 mb-12 leading-relaxed font-medium">
                                Our reports don't just list problems; they provide solutions. Every inspection concludes with a detailed document containing:
                            </p>

                            <div className="space-y-8">
                                {[
                                    { title: "High-Res Thermal Maps", desc: "Precise coordinates of every detected hotspot or string failure." },
                                    { title: "ROI Impact Analysis", desc: "Estimated energy loss and financial recovery projections." },
                                    { title: "Prioritized Action Plan", desc: "Maintenance tasks categorized by urgency (Critical, Major, Minor)." },
                                    { title: "Historical Comparisons", desc: "Detailed tracking of system degradation over time." }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex gap-6">
                                        <div className="flex-shrink-0 w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center text-orange-600 border border-slate-100 shadow-sm">
                                            <CheckCircle size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-lg mb-1 tracking-tight">{item.title}</h4>
                                            <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-16">
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="absolute inset-0 bg-orange-600/5 blur-[120px] rounded-full" />
                            <div className="relative bg-slate-950 rounded-[3.5rem] p-6 shadow-2xl overflow-hidden border border-slate-800">
                                {/* Mock Report UI */}
                                <div className="bg-white rounded-[2.5rem] overflow-hidden">
                                    <div className="bg-orange-600 p-10 text-white">
                                        <div className="flex justify-between items-center mb-8">
                                            <Sun size={40} />
                                            <div className="text-right text-[10px] font-bold uppercase tracking-widest opacity-80">Ref: #SR-2024-089</div>
                                        </div>
                                        <h3 className="text-3xl font-bold mb-3 tracking-tight">Solar Health Audit</h3>
                                        <p className="text-orange-100 font-bold">Facility: GreenVibe Industrial Park</p>
                                    </div>

                                    <div className="p-10 space-y-10">
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                                <div className="text-[10px] text-slate-400 font-bold uppercase mb-2 tracking-widest">Overall Health</div>
                                                <div className="text-3xl font-bold text-emerald-500">84%</div>
                                            </div>
                                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                                <div className="text-[10px] text-slate-400 font-bold uppercase mb-2 tracking-widest">Active Faults</div>
                                                <div className="text-3xl font-bold text-red-500">12</div>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                                                <div className="h-full w-3/4 bg-orange-500" />
                                            </div>
                                            <div className="flex justify-between text-[10px] font-bold text-slate-400 tracking-widest">
                                                <span>EFFICIENCY TREND</span>
                                                <span>PERIOD: 12 MONTHS</span>
                                            </div>
                                        </div>

                                        <div className="border-t border-slate-100 pt-8">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                                                <span className="text-xs font-bold text-slate-900 uppercase tracking-widest">Critical Finding #01</span>
                                            </div>
                                            <div className="bg-slate-900 rounded-2xl aspect-video relative flex items-center justify-center overflow-hidden">
                                                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-500 via-transparent to-transparent " />
                                                <Zap className="text-orange-500 opacity-20" size={100} />
                                                <div className="absolute bottom-4 left-6 text-[10px] font-mono text-white/50 tracking-widest font-bold">LAT: 34.0522° N | LONG: 118.2437° W</div>
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
                <div className="bg-slate-900 rounded-[3rem] p-12 md:p-24 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-[120px] -mr-48 -mt-48" />
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <h2 className="text-3xl md:text-6xl font-bold text-white mb-10 leading-tight tracking-tight">
                                Not sure which service <br />
                                <span className="text-orange-500">fits your needs?</span>
                            </h2>
                            <p className="text-slate-400 text-xl mb-12 leading-relaxed font-medium">
                                Our experts are ready to analyze your solar infrastructure and recommend the best inspection strategy tailored to your specific site conditions and budget.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-6">
                                <Link
                                    href="/booking"
                                    className="px-10 py-5 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-all text-center uppercase tracking-widest shadow-xl shadow-orange-900/40"
                                >
                                    Book Now
                                </Link>
                                <Link
                                    href="/contact"
                                    className="px-10 py-5 bg-white/5 text-white border border-white/20 rounded-xl font-bold hover:bg-white/10 transition-all text-center uppercase tracking-widest"
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
                                <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-8 text-center backdrop-blur-sm">
                                    <div className="text-4xl font-bold text-orange-500 mb-2 tracking-tight">{pill.val}</div>
                                    <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{pill.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
