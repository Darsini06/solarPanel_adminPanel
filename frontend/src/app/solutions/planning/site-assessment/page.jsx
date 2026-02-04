"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Map, Sun, Zap, Shield, FileText } from "lucide-react";

export default function SiteAssessmentPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="pt-32 pb-20 bg-slate-50 relative overflow-hidden flex items-center min-h-[80vh]">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.pexels.com/photos/9875415/pexels-photo-9875415.jpeg?auto=compress&cs=tinysrgb&w=1200"
                        alt="Solar Site Assessment"
                        fill
                        className="object-cover opacity-20"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-slate-50/80 to-transparent"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                    <div className="max-w-3xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold uppercase tracking-wider mb-8">
                                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                                Planning Phase / Engineering Excellence
                            </div>
                            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-8 tracking-tight leading-tight">
                                High-Fidelity <span className="text-orange-600">Site Intelligence</span>
                            </h1>
                            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl font-medium">
                                Transform raw terrain into optimized solar assets. Our AI-driven site assessments reduce planning time by 60% while maximizing total energy yield.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link href="/booking" className="px-10 py-5 bg-slate-900 text-white rounded-xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl">
                                    Book a Site Survey
                                </Link>
                                <Link href="/contact" className="px-10 py-5 bg-white text-slate-900 border border-slate-200 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all">
                                    Download Sample Report
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Core Capability Grid */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { icon: Map, title: "Topographic Mapping", desc: "Centimeter-accurate contour maps to optimize racking placement and minimize grading." },
                            { icon: Sun, title: "Irradiance Modeling", desc: "Advanced shading analysis using 20 years of historical meteorological data." },
                            { icon: Zap, title: "Grid Capacity Review", desc: "Instant evaluation of local substation proximity and interconnection feasibility." },
                            { icon: Shield, title: "Environmental Risk", desc: "Automated identification of wetlands, protected habitats, and soil stability issues." },
                            { icon: FileText, title: "Hydrological Study", desc: "Comprehensive drainage and runoff simulation to prevent long-term erosion." },
                            { icon: CheckCircle, title: "Permit Readiness", desc: "All reports formatted for immediate submission to local jurisdictions." }
                        ].map((item, i) => (
                            <div key={i} className="p-10 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all border-b-4 hover:border-b-orange-600">
                                <item.icon className="text-orange-600 mb-6" size={32} />
                                <h3 className="text-xl font-bold text-slate-900 mb-4">{item.title}</h3>
                                <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Split Feature Content */}
            <section className="py-24 bg-slate-50 border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="relative">
                            <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
                                <Image src="https://images.pexels.com/photos/8853502/pexels-photo-8853502.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Assessment detail" fill className="object-cover" />
                            </div>
                            <div className="absolute -bottom-8 -right-8 bg-orange-600 text-white p-10 rounded-2xl shadow-xl">
                                <div className="text-4xl font-black mb-1">60%</div>
                                <div className="text-sm font-bold opacity-80 uppercase tracking-widest">Faster Planning</div>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-4xl font-bold text-slate-900 mb-8 tracking-tight">Data-Driven Design Decisions</h2>
                            <p className="text-xl text-slate-600 mb-10 leading-relaxed font-medium">
                                Stop guessing. Our digital-first approach provides the precise data needed for optimal layout design, ensuring you never leave megawatts on the table.
                            </p>
                            <div className="space-y-4">
                                {[
                                    { title: "LiDAR Integration", desc: "Terrestrial and aerial LiDAR for extreme topographic precision." },
                                    { title: "Geotechnical Sync", desc: "Soil data integration for structural engineering and post-pulling." }
                                ].map((li, i) => (
                                    <div key={i} className="flex gap-4 p-6 bg-white rounded-2xl border border-slate-200">
                                        <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 flex-shrink-0">
                                            <CheckCircle size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-lg mb-1">{li.title}</h4>
                                            <p className="text-slate-500 text-sm">{li.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-slate-900 rounded-3xl p-12 lg:p-20 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-orange-600/20 to-transparent"></div>
                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-4xl font-bold mb-8 tracking-tight">The SolarMark Advantage</h2>
                                <p className="text-xl text-slate-300 mb-10 leading-relaxed font-medium">
                                    Our assessments aren't just PDF reports. They are dynamic datasets that feed directly into your design and construction workflows.
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                {[
                                    { label: "Accuracy", val: "99.8%" },
                                    { label: "Sites Analyzed", val: "500+" },
                                    { label: "Total capacity", val: "12 GW" },
                                    { label: "Design Iterations", val: "Infinite" }
                                ].map((stat, i) => (
                                    <div key={i} className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                                        <div className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-2">{stat.label}</div>
                                        <div className="text-3xl font-bold">{stat.val}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-slate-50 text-center">
                <div className="max-w-4xl mx-auto px-4">
                    <h2 className="text-4xl font-bold text-slate-900 mb-8 tracking-tight">Start Your Project on Solid Ground</h2>
                    <p className="text-xl text-slate-600 mb-12 font-medium">
                        Request a comprehensive site assessment quote and receive a free preliminary yield estimate.
                    </p>
                    <Link href="/booking" className="px-14 py-6 bg-orange-600 text-white rounded-xl font-bold text-xl hover:bg-orange-700 transition-all shadow-2xl shadow-orange-200 active:scale-95 inline-block">
                        Schedule Site Visit
                    </Link>
                </div>
            </section>
        </div>
    );
}
