"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Smartphone, Camera, Calendar, Play, Globe, Target } from "lucide-react";

export default function ProgressTrackingPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="pt-32 pb-20 bg-slate-950 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/2850347/pexels-photo-2850347.jpeg?auto=compress&cs=tinysrgb&w=1200')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="px-4 py-1.5 bg-orange-600 rounded-md text-xs font-bold mb-8 tracking-[0.2em] uppercase inline-block">
                            Real-Time Site Lifecycle
                        </div>
                        <h1 className="text-6xl md:text-8xl font-bold mb-8 tracking-tight leading-[1.1]">
                            Total Site <span className="text-orange-400">Visibility</span>
                        </h1>
                        <p className="text-xl text-slate-300 mb-12 leading-relaxed max-w-3xl mx-auto">
                            Connect your site managers and data streams. Track every construction milestone, equipment arrival, and installation speed with millimetric precision from your command center.
                        </p>
                        <div className="flex flex-wrap gap-5 justify-center mb-20">
                            <Link href="/booking" className="px-12 py-6 bg-orange-600 text-white rounded-xl font-bold text-lg hover:bg-orange-700 transition-all shadow-xl shadow-orange-900/40">
                                Launch Site Dashboard
                            </Link>
                        </div>
                    </motion.div>


                </div>
            </section>

            {/* Core Capabilities */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: Target, title: "Precision Location", desc: "GPS-tagged installation tracking for every single solar module." },
                            { icon: Camera, title: "Aerial Validation", desc: "AI count automated checks using high-res drone photogrammetry." },
                            { icon: Globe, title: "Remote Oversight", desc: "Access live site conditions and photos from anywhere in the world." },
                            { icon: Calendar, title: "Milestone Sync", desc: "Digital schedule integration with automated slippage alerts." }
                        ].map((item, i) => (
                            <div key={i} className="p-10 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all group">
                                <div className="w-14 h-14 bg-orange-600 text-white rounded-xl flex items-center justify-center mb-8 shadow-lg shadow-orange-600/20 group-hover:scale-110 transition-transform">
                                    <item.icon size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-orange-600 transition-colors">{item.title}</h3>
                                <p className="text-slate-500 leading-relaxed text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Feature Split */}
            <section className="py-24 bg-slate-950 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="text-white">
                            <h2 className="text-5xl font-bold mb-8 tracking-tight">The Digital <span className="text-orange-400">Twin Edge</span></h2>
                            <p className="text-xl text-slate-400 mb-10 leading-relaxed font-medium">
                                We overlay your 3D design files with high-fidelity site imagery to show discrepancies in real-time. Detect as-built deviations before they impact commissioning.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {[
                                    "BIM/3D Design Overlay",
                                    "Millimeter accuracy",
                                    "Daily progress logs",
                                    "Anomaly auto-tagging"
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl group hover:bg-white/10 transition-all">
                                        <div className="w-2 h-2 bg-orange-600 rounded-full group-hover:scale-150 transition-transform"></div>
                                        <span className="font-bold text-slate-200">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative">
                            <div className="aspect-video rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white/5 relative bg-slate-900">
                                <Image
                                    src="https://images.pexels.com/photos/159888/pexels-photo-159888.jpeg?auto=compress&cs=tinysrgb&w=800"
                                    alt="Site Logistics"
                                    fill
                                    className="object-cover opacity-60"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Elite CTA */}
            <section className="py-24 bg-white text-center relative">
                <div className="max-w-4xl mx-auto px-4">
                    <h2 className="text-5xl font-bold text-slate-900 mb-8 tracking-tight">Stop Flying Blind.</h2>
                    <p className="text-2xl text-slate-500 mb-16 leading-relaxed">
                        Join the infrastructure leaders who manage 50GW+ of projects with SolarMark's live tracking engine.
                    </p>
                    <Link href="/booking" className="px-16 py-8 bg-slate-950 text-white rounded-2xl font-bold text-xl hover:bg-slate-800 transition-all shadow-2xl active:scale-95 inline-block">
                        Request Site Access Demo
                    </Link>
                </div>
            </section>
        </div>
    );
}
