"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Plane, Camera, Zap, Shield, Globe } from "lucide-react";

export default function DronesPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Dark Hero Section */}
            <section className="pt-32 pb-20 bg-slate-950 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/433308/pexels-photo-433308.jpeg?auto=compress&cs=tinysrgb&w=1200')] bg-cover bg-center opacity-25 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="px-4 py-1.5 bg-orange-600 rounded-md text-xs font-bold mb-8 tracking-[0.2em] uppercase inline-block font-sans">
                                Platform Technology
                            </div>
                            <h1 className="text-6xl md:text-8xl font-bold mb-8 tracking-tight leading-[1.1]">
                                Autonomous <br /><span className="text-orange-400">Capture</span>
                            </h1>
                            <p className="text-xl text-slate-300 mb-12 leading-relaxed max-w-2xl mx-auto">
                                Leverage military-grade drone hardware and robotics for safer, faster, and more comprehensive solar asset data collection.
                            </p>
                            <div className="flex flex-wrap gap-5 justify-center">
                                <Link href="/booking" className="px-12 py-6 bg-orange-600 text-white rounded-xl font-bold text-lg hover:bg-orange-700 transition-all shadow-xl shadow-orange-900/40">
                                    Book Data Run
                                </Link>
                                <Link href="/contact" className="px-12 py-6 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-xl font-bold text-lg hover:bg-white/20 transition-all">
                                    Hardware Specs
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Capability Grid */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                            { icon: Plane, title: "Precision Navigation", desc: "Proprietary flight controllers ensure centimeter-level stability even in high-wind conditions." },
                            { icon: Camera, title: "Multi-Payload Imaging", desc: "Simultaneous 45MP RGB and high-fidelity radiometric thermal capture in one pass." },
                            { icon: Zap, title: "Rapid Turnaround", desc: "Inspect up to 500MW of solar assets per week with our global pilot network." }
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
                        <div className="relative">
                            <div className="aspect-video rounded-[3rem] overflow-hidden shadow-2xl border border-slate-100 bg-slate-100">
                                <Image src="https://images.pexels.com/photos/1105379/pexels-photo-1105379.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Drone technology" fill className="object-cover" />
                            </div>
                            <div className="absolute -top-8 -left-8 bg-slate-950 p-8 rounded-[2rem] shadow-2xl text-white">
                                <Shield className="text-orange-600 mb-2" size={32} />
                                <div className="text-sm font-bold uppercase tracking-widest">Fully Insured</div>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-5xl font-bold text-slate-900 mb-8 tracking-tight">Enterprise Scaling <br /><span className="text-orange-600">Global Coverage</span></h2>
                            <p className="text-xl text-slate-600 mb-10 leading-relaxed">
                                Don't manage complicated flight logistics. SolarMark provides 'Drones-as-a-Service' with a global network of certified pilots and autonomous charging stations.
                            </p>
                            <div className="space-y-4">
                                {[
                                    "BVLoS (Beyond Visual Line of Sight) ready",
                                    "Automatic drone-in-a-box solutions",
                                    "FAA Part 107 and EASA certified pilots",
                                    "Real-time telemetry and mission monitoring",
                                    "Autonomous RTK base-station integration"
                                ].map((li, i) => (
                                    <div key={i} className="flex items-center gap-4 py-4 border-b border-slate-100 last:border-0 group cursor-default">
                                        <div className="w-10 h-1 bg-slate-100 group-hover:bg-orange-600 transition-all rounded-full"></div>
                                        <span className="font-bold text-slate-700 text-lg group-hover:text-slate-950 transition-colors">{li}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-slate-950 text-center relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-orange-500/30 to-transparent"></div>
                <div className="max-w-4xl mx-auto px-4 relative z-10 text-white text-center">
                    <h2 className="text-5xl font-bold mb-8 tracking-tight">Capture Better Data.</h2>
                    <p className="text-2xl text-slate-400 mb-16 leading-relaxed font-medium">
                        Your AI insights are only as good as the data you capture. Experience high-fidelity solar robotics today.
                    </p>
                    <Link href="/booking" className="px-16 py-8 bg-orange-600 text-white rounded-xl font-bold text-xl hover:bg-orange-700 transition-all shadow-2xl shadow-orange-900/40 active:scale-95 inline-block">
                        Request a Flight Demo
                    </Link>
                </div>
            </section>
        </div>
    );
}

