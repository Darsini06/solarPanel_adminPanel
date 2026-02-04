"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Database, BarChart3, ShieldCheck, Globe, TrendingUp } from "lucide-react";

export default function AssetManagementPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="pt-32 pb-20 bg-slate-950 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1200')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="px-4 py-1.5 bg-orange-600 rounded-md text-xs font-bold mb-8 tracking-[0.2em] uppercase inline-block">
                                Enterprise Portfolio Intelligence
                            </div>
                            <h1 className="text-6xl md:text-8xl font-bold mb-8 tracking-tight leading-[1.1]">
                                Master Your <span className="text-orange-400">Portfolio</span>
                            </h1>
                            <p className="text-xl text-slate-300 mb-12 leading-relaxed max-w-2xl mx-auto">
                                Consolidate your global solar footprint into one digital ecosystem. The definitive source of truth for energy yields, financial health, and institutional compliance.
                            </p>
                            <div className="flex flex-wrap gap-5 justify-center">
                                <Link href="/booking" className="px-12 py-6 bg-white text-slate-900 rounded-xl font-bold text-lg hover:bg-slate-100 transition-all shadow-2xl active:scale-95">
                                    Book Enterprise Demo
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Core Pillars */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                        <div>
                            <h2 className="text-5xl font-bold text-slate-900 tracking-tight mb-4">Institutional Grade</h2>
                            <p className="text-xl text-slate-500 max-w-xl">Beyond simple monitoring. We provide an integrated layer of intelligence for every tier of your asset hierarchy.</p>
                        </div>
                        <div className="flex items-center gap-2 text-orange-600 font-bold uppercase text-xs tracking-[0.2em] bg-orange-50 px-4 py-2 rounded-lg">
                            Asset Lifecycle Management
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Pillar 1 */}
                        <div className="p-12 bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all group overflow-hidden relative">
                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-orange-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-orange-600/20">
                                    <BarChart3 size={32} />
                                </div>
                                <h3 className="text-3xl font-bold text-slate-900 mb-6 group-hover:text-orange-600 transition-colors">Financial Intelligence</h3>
                                <p className="text-slate-600 text-lg leading-relaxed mb-10">
                                    Integrate energy production data directly with financial KPIs. Track ROI, IRR, and LCOE across multiple currencies and tax regimes automatically.
                                </p>
                            </div>
                            <div className="aspect-video relative rounded-2xl overflow-hidden shadow-2xl border border-white/50">
                                <Image src="https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Financial Dashboard" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                            </div>
                        </div>

                        {/* Pillar 2 */}
                        <div className="p-12 bg-slate-950 text-white rounded-[2.5rem] flex flex-col justify-between h-full relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/10 rounded-full blur-[80px]"></div>
                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-orange-400 mb-8 border border-white/10">
                                    <Globe size={32} />
                                </div>
                                <h3 className="text-3xl font-bold mb-6 group-hover:text-orange-400 transition-colors">Global Compliance</h3>
                                <p className="text-slate-400 text-lg leading-relaxed mb-10">
                                    Manage warranties, land leases, and environmental reporting in a unified document management system with intelligent AI deadline alerts.
                                </p>
                            </div>
                            <div className="aspect-video relative rounded-2xl overflow-hidden shadow-2xl border border-white/5">
                                <Image src="https://images.pexels.com/photos/1275393/pexels-photo-1275393.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Compliance Manager" fill className="object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Detailed Capabilities */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="space-y-12">
                            <div>
                                <h2 className="text-5xl font-bold text-slate-900 mb-6 tracking-tight">One Platform. <br /><span className="text-orange-600">Total Control.</span></h2>
                                <p className="text-xl text-slate-600 leading-relaxed">Stop managing assets via spreadsheets. Our platform brings every data point into a single, high-fidelity dashboard.</p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                {[
                                    { icon: Database, title: "Centralized Vault", desc: "Every drawing, permit, and invoice in one location." },
                                    { icon: ShieldCheck, title: "Warranty Hub", desc: "Automated tracking and RMA workflow for all equipment." },
                                    { icon: TrendingUp, title: "Performance Benchmarking", desc: "Compare site-to-site output to identify best practices." },
                                    { icon: CheckCircle, title: "Automated Reporting", desc: "Institutional ESG and yield reporting in seconds." }
                                ].map((item, i) => (
                                    <div key={i} className="group">
                                        <div className="text-orange-600 mb-4 inline-block transform group-hover:scale-110 transition-transform">
                                            <item.icon size={32} />
                                        </div>
                                        <h4 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h4>
                                        <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white p-12 rounded-[2.5rem] shadow-2xl relative border border-slate-100">
                            <div className="absolute -top-6 -right-6 w-24 h-24 bg-orange-600/5 rounded-full blur-2xl"></div>
                            <h3 className="text-4xl font-bold text-slate-900 mb-10 tracking-tight">Enterprise Infrastructure</h3>
                            <div className="space-y-2">
                                {[
                                    "O&M Real-time Integration",
                                    "SCADA & Metering Logic",
                                    "Automated Land Lease Tracker",
                                    "Proprietary Inverter API Bridge",
                                    "Live Market Pricing Connectivity"
                                ].map((li, i) => (
                                    <div key={i} className="flex items-center gap-4 py-5 border-b border-slate-50 last:border-0 group">
                                        <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center group-hover:bg-orange-600 transition-colors">
                                            <div className="w-2 h-2 bg-slate-300 rounded-full group-hover:bg-white"></div>
                                        </div>
                                        <span className="font-bold text-slate-700 text-lg group-hover:text-orange-600 transition-colors">{li}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Elite CTA */}
            <section className="py-24 bg-slate-950 text-center relative overflow-hidden">
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-orange-500/30 to-transparent"></div>
                <div className="max-w-4xl mx-auto px-4 relative z-10">
                    <h2 className="text-5xl font-bold text-white mb-8 tracking-tight">Ready to Modernize Your Operations?</h2>
                    <p className="text-2xl text-slate-400 mb-16 leading-relaxed">
                        Join the world's leading energy firms who trust SolarMark to manage their most critical infrastructure assets.
                    </p>
                    <Link href="/booking" className="px-16 py-8 bg-orange-600 text-white rounded-2xl font-bold text-xl hover:bg-orange-700 transition-all shadow-2xl shadow-orange-900/40 active:scale-95 inline-block">
                        Request a Personalized Walkthrough
                    </Link>
                </div>
            </section>
        </div>
    );
}

