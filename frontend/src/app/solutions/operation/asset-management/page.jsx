"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Database, BarChart3, ShieldCheck, Globe } from "lucide-react";

export default function AssetManagementPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="pt-32 pb-20 bg-slate-900 text-white relative overflow-hidden">
                {/* Abstract shapes */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-orange-600/10 rounded-full blur-[120px] -mr-96 -mt-96"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] -ml-72 -mb-72"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="px-5 py-2 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold mb-8 tracking-[0.2em] uppercase border border-white/20">
                                Asset Intelligence
                            </div>
                            <h1 className="text-6xl md:text-8xl font-bold mb-8 tracking-tight leading-tight">
                                Master Your <span className="text-orange-600">Portfolio</span>
                            </h1>
                            <p className="text-xl text-slate-400 mb-12 leading-relaxed max-w-2xl mx-auto">
                                Consolidate your global solar footprint into one digital ecosystem. SolarMark Asset Management provides the definitive source of truth for energy yields, financial health, and compliance.
                            </p>
                            <div className="flex flex-wrap gap-5 justify-center">
                                <Link href="/booking" className="px-12 py-6 bg-white text-slate-900 rounded-xl font-bold text-lg hover:bg-slate-100 transition-all shadow-2xl active:scale-95">
                                    Explore Enterprise Platform
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Analytics Grid */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8 text-center md:text-left">
                        <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Beyond Monitoring</h2>
                        <div className="flex items-center gap-2 text-slate-500 font-bold uppercase text-xs tracking-[0.2em]">
                            <div className="w-8 h-px bg-slate-200"></div>
                            Single Source of Truth
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="p-12 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col justify-between h-full">
                            <div>
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-orange-600 mb-8 shadow-sm">
                                    <BarChart3 size={32} />
                                </div>
                                <h3 className="text-3xl font-bold text-slate-900 mb-6">Financial Intelligence</h3>
                                <p className="text-slate-600 text-lg leading-relaxed mb-8">
                                    Integrate energy production data directly with financial KPIs. Track ROI, IRR, and LCOE across multiple currencies and tax regimes automatically.
                                </p>
                            </div>
                            <div className="aspect-video relative rounded-2xl overflow-hidden shadow-2xl">
                                <Image src="https://images.pexels.com/photos/159888/pexels-photo-159888.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Financial Dashboard" fill className="object-cover" />
                            </div>
                        </div>

                        <div className="p-12 bg-slate-900 text-white rounded-3xl flex flex-col justify-between h-full relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px]"></div>
                            <div>
                                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-blue-400 mb-8 border border-white/10">
                                    <Globe size={32} />
                                </div>
                                <h3 className="text-3xl font-bold mb-6">Global Compliance</h3>
                                <p className="text-slate-400 text-lg leading-relaxed mb-8">
                                    Manage warranties, land leases, and environmental reporting in a unified document management system with intelligent deadline alerts.
                                </p>
                            </div>
                            <div className="aspect-video relative rounded-2xl overflow-hidden shadow-2xl border border-white/5">
                                <Image src="https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Compliance Manager" fill className="object-cover opacity-60" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature List */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                        <div>
                            <h2 className="text-4xl font-bold text-slate-900 mb-12">The Comprehensive Toolkit</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-12 gap-x-8">
                                {[
                                    { icon: Database, title: "Centralized Vault", desc: "Every drawing, permit, and invoice in one searchable location." },
                                    { icon: ShieldCheck, title: "Warranty Management", desc: "Automated tracking and RMA workflow for all equipment." },
                                    { icon: BarChart3, title: "Benchmarking", desc: "Compare site-to-site performance to identify best practices." },
                                    { icon: ArrowRight, title: "ESG Reporting", desc: "Automated sustainability metrics for corporate disclosure." }
                                ].map((item, i) => (
                                    <div key={i} className="group">
                                        <div className="text-orange-600 mb-4 inline-block">
                                            <item.icon size={28} />
                                        </div>
                                        <h4 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h4>
                                        <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white p-12 rounded-3xl shadow-xl relative">
                            <h3 className="text-5xl font-bold text-slate-900 mb-8 tracking-tight">Everything <br />Connected.</h3>
                            <div className="space-y-6">
                                {[
                                    "O&M Integration",
                                    "Metering Data Sync",
                                    "Land Lease Tracker",
                                    "Inverter API Bridge",
                                    "Grid Market Pricing"
                                ].map((li, i) => (
                                    <div key={i} className="flex items-center gap-4 py-4 border-b border-slate-50">
                                        <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                                        <span className="font-semibold text-slate-800 text-lg">{li}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-white text-center">
                <div className="max-w-4xl mx-auto px-4">
                    <h2 className="text-5xl font-bold text-slate-900 mb-8 tracking-tight">Own Your Data.</h2>
                    <p className="text-2xl text-slate-600 mb-16 leading-relaxed">
                        Don't let your asset data sit in silos. Unify your operations today.
                    </p>
                    <Link href="/booking" className="px-16 py-8 bg-slate-900 text-white rounded-2xl font-bold text-xl hover:bg-slate-800 transition-all shadow-2xl active:scale-95 inline-block">
                        Upgrade Your Asset Control
                    </Link>
                </div>
            </section>
        </div>
    );
}
