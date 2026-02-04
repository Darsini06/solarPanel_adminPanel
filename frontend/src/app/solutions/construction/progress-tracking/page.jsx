"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Smartphone, Camera, Calendar, Play } from "lucide-react";

export default function ProgressTrackingPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="pt-32 pb-20 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-900 rounded-full text-xs font-bold uppercase tracking-wider mb-8">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                Construction Phase / Real-Time Tracking
                            </div>
                            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-8 tracking-tight">
                                Visibility on <span className="text-orange-600">Every Inch</span> of Progress
                            </h1>
                            <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
                                Connect your field teams and data. Track construction milestones, equipment arrival, and installation speed with millimetric precision from your dashboard.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                                <Link href="/booking" className="px-10 py-5 bg-orange-600 text-white rounded-xl font-bold text-lg hover:bg-orange-700 transition-all shadow-xl shadow-orange-200">
                                    Watch the Demo
                                </Link>
                            </div>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-50"
                    >
                        <Image
                            src="https://images.pexels.com/photos/2850347/pexels-photo-2850347.jpeg?auto=compress&cs=tinysrgb&w=1200"
                            alt="Construction Progress Visualization"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-slate-900/10 flex items-center justify-center">
                            <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center text-white border-2 border-white/50 cursor-pointer hover:scale-105 transition-transform">
                                <Play fill="white" size={28} />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Stats Breakdown */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-1">
                            <h2 className="text-4xl font-bold text-slate-900 mb-6 tracking-tight">Stay Ahead of the Schedule</h2>
                            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                                Stop relying on weekly reports. Get minute-by-minute updates on installation progress across all sites.
                            </p>
                            <Link href="/contact" className="inline-flex items-center gap-2 text-orange-600 font-bold hover:translate-x-1 transition-all">
                                Learn about automated reporting <ArrowRight size={20} />
                            </Link>
                        </div>
                        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[
                                { icon: Smartphone, title: "Mobile Field App", desc: "Technicians log progress directly from the field with photo evidence." },
                                { icon: Camera, title: "Aerial Validation", desc: "Drone imagery automatically counts panels and confirms placement." },
                                { icon: Calendar, title: "Gantt Integration", desc: "Syncs directly with your project schedule for live slippage alerts." },
                                { icon: CheckCircle, title: "Automated Sign-off", desc: "Workflow-based approvals for each construction milestone." }
                            ].map((card, i) => (
                                <div key={i} className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all h-full">
                                    <card.icon className="text-orange-600 mb-6" size={32} />
                                    <h3 className="text-xl font-bold text-slate-900 mb-4">{card.title}</h3>
                                    <p className="text-slate-600 text-sm leading-relaxed">{card.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Visual Timeline Feature */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-slate-900 rounded-3xl p-12 lg:p-20 text-white overflow-hidden relative">
                        <div className="absolute bottom-0 right-0 w-1/2 h-full opacity-30 select-none pointer-events-none">
                            <Image src="https://images.pexels.com/photos/159888/pexels-photo-159888.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Detail view" fill className="object-contain" />
                        </div>
                        <div className="relative z-10 max-w-xl">
                            <h2 className="text-4xl font-bold mb-8 tracking-tight">Digital Twin Synchronization</h2>
                            <p className="text-xl text-slate-400 mb-10 leading-relaxed">
                                We overlay your 3D design file with actual site imagery to show discrepancies in real-time. Catch errors before they are cemented into the project.
                            </p>
                            <ul className="space-y-4">
                                {["BIM / 3D Model integration", "As-built vs Design comparison", "Millimeter-level deviation detection", "Photogrammetry based site updates"].map((li, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-orange-600 rounded-full flex-shrink-0"></div>
                                        <span className="font-medium text-slate-200">{li}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 text-center">
                <h2 className="text-4xl font-bold text-slate-900 mb-12 tracking-tight">Ready to see your site from anywhere?</h2>
                <Link href="/booking" className="px-12 py-6 bg-slate-100 text-slate-900 rounded-xl font-bold text-xl hover:bg-slate-200 transition-all active:scale-95 shadow-md">
                    Experience Live Site Tracking
                </Link>
            </section>
        </div>
    );
}
