"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Settings, Link as LinkIcon, Share2, ShieldCheck, Zap, Database } from "lucide-react";

export default function IntegrationsPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Dark Hero Section */}
            <section className="pt-32 pb-20 bg-slate-950 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=1200')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
                <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-orange-600/10 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="px-4 py-1.5 bg-orange-600 rounded-md text-xs font-bold mb-8 tracking-[0.2em] uppercase inline-block font-sans">
                                Ecosystem Synergy
                            </div>
                            <h1 className="text-6xl md:text-8xl font-bold mb-8 tracking-tight leading-[1.1]">
                                Seamless <br /><span className="text-orange-400">Connectivity</span>
                            </h1>
                            <p className="text-xl text-slate-300 mb-12 leading-relaxed max-w-2xl mx-auto">
                                Your data shouldn't live in a silo. Connect SolarMark to your existing ERP, CMMS, and SCADA systems with our enterprise-grade API suite.
                            </p>
                            <div className="flex flex-wrap gap-5 justify-center">
                                <Link href="/booking" className="px-12 py-6 bg-orange-600 text-white rounded-xl font-bold text-lg hover:bg-orange-700 transition-all shadow-xl shadow-orange-900/40">
                                    Explore API Docs
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Core Capability Grid */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                            { icon: LinkIcon, title: "Pre-built Connectors", desc: "Native integrations for SAP, Salesforce, and industry-standard CMMS tools." },
                            { icon: Database, title: "Bi-Directional Sync", desc: "Push inspection data out and pull operational work orders in automatically." },
                            { icon: ShieldCheck, title: "Auth Protocols", desc: "Secure, enterprise-grade authentication with OAuth 2.0 and SAML support." }
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
                            <h2 className="text-5xl font-bold text-slate-900 mb-8 tracking-tight">Built For <br /><span className="text-orange-600">Developers</span></h2>
                            <p className="text-xl text-slate-600 mb-10 leading-relaxed font-medium">
                                We provide a clean, RESTful API and detailed documentation so your engineering team can build custom apps on top of the SolarMark engine.
                            </p>
                            <div className="space-y-4">
                                {[
                                    "RESTful API with high rate limits",
                                    "Webhooks for real-time status updates",
                                    "Sandboxed testing environments",
                                    "Detailed SDKs for Node, Python, and Go",
                                    "Comprehensive event logging and monitoring"
                                ].map((li, i) => (
                                    <div key={i} className="flex items-center gap-4 py-4 border-b border-slate-100 last:border-0 group cursor-default">
                                        <div className="bg-orange-600/10 p-1.5 rounded-full">
                                            <Share2 className="text-orange-600" size={20} />
                                        </div>
                                        <span className="font-bold text-slate-700 text-lg group-hover:text-slate-950 transition-colors">{li}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative">
                            <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 relative bg-slate-900 group">
                                <div className="bg-slate-800/50 px-6 py-4 border-b border-white/5 flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                                    <div className="w-3 h-3 rounded-full bg-orange-500/50"></div>
                                    <div className="w-3 h-3 rounded-full bg-emerald-500/50"></div>
                                    <div className="ml-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">API Response: Asset_Health</div>
                                </div>
                                <pre className="p-10 text-orange-400 font-mono text-sm leading-relaxed overflow-hidden bg-slate-900/50 backdrop-blur-xl">
                                    <span className="text-emerald-400">GET</span> /api/v1/assets/SOL-92
                                    <br />
                                    {`{
  "status": "active",
  "anomaly_detected": `}<span className="text-red-400">false</span>{`,
  "last_inspection": "2024-05-12",
  "health_score": `}<span className="text-emerald-400">98.4</span>{`,
  "location": {
    "lat": 34.0522,
    "lng": -118.2437
  }
}`}
                                </pre>
                                <div className="absolute bottom-6 right-6 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                    <span className="text-[10px] font-bold text-emerald-500/70 uppercase tracking-widest">Live Connection</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Elite CTA */}
            <section className="py-24 bg-slate-950 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-orange-600/5 blur-[100px]"></div>
                <div className="max-w-4xl mx-auto px-4 relative z-10 text-white text-center">
                    <h2 className="text-5xl font-bold mb-8 tracking-tight">Connect Your Data World.</h2>
                    <p className="text-2xl text-slate-400 mb-16 leading-relaxed font-medium">
                        Don't build everything from scratch. Leverage the solar industry's most robust data integration engine.
                    </p>
                    <Link href="/booking" className="px-16 py-8 bg-orange-600 text-white rounded-xl font-bold text-xl hover:bg-orange-700 transition-all shadow-2xl shadow-orange-900/40 active:scale-95 inline-block">
                        View API Reference
                    </Link>
                </div>
            </section>
        </div>
    );
}

