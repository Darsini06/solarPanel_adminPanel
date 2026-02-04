"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Smartphone, Users, ClipboardList, Clock } from "lucide-react";

export default function WorkManagementPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="pt-32 pb-20 bg-gradient-to-br from-indigo-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="inline-block px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-xs font-black mb-8 tracking-widest uppercase">
                                Operations Management
                            </div>
                            <h1 className="text-5xl md:text-8xl font-black text-slate-900 mb-8 tracking-tighter leading-[0.9]">
                                Operations <br /><span className="text-indigo-600">Simplified</span>
                            </h1>
                            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-lg">
                                Close the loop between maintenance needs and field action. Our work management platform automates work orders, optimizes technician routing, and tracks time-to-repair.
                            </p>
                            <div className="flex gap-4">
                                <Link href="/booking" className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200">
                                    Get Started Free
                                </Link>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative"
                        >
                            <div className="aspect-[4/5] rounded-[60px] overflow-hidden shadow-2xl relative">
                                <Image
                                    src="https://images.pexels.com/photos/159888/pexels-photo-159888.jpeg?auto=compress&cs=tinysrgb&w=800"
                                    alt="Technician Operations"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-x-0 bottom-0 p-10 bg-gradient-to-t from-slate-900/80 to-transparent text-white">
                                    <div className="text-3xl font-bold mb-2">40% Faster Repair</div>
                                    <p className="text-slate-300 text-sm">Average reduction in MTTR (Mean Time To Repair) for our enterprise clients.</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Feature Blocks */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: Smartphone, title: "Mobile O&M", desc: "Field-ready app for inspections, tickets, and time tracking." },
                            { icon: ClipboardList, title: "Automated Tickets", desc: "Tickets are auto-generated from sensor alarms and inspection findings." },
                            { icon: Users, title: "Vendor Portal", desc: "Securely manage 3rd party contractors and service level agreements (SLAs)." },
                            { icon: Clock, title: "Real-Time Tracking", desc: "GPS visibility of your teams and assets across your entire territory." }
                        ].map((item, i) => (
                            <div key={i} className="p-10 rounded-[40px] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-2xl transition-all h-full">
                                <div className="w-12 h-12 text-indigo-600 mb-8">
                                    <item.icon size={48} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-4">{item.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Dashboard View */}
            <section className="py-24 bg-slate-900 overflow-hidden text-white relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-4xl md:text-5xl font-black mb-8 tracking-tighter">Command and Control</h2>
                        <p className="text-xl text-slate-400">A unified view for asset managers to oversee performance and dispatch maintenance teams from one central location.</p>
                    </div>

                    <div className="relative aspect-[16/10] bg-slate-800 rounded-[40px] overflow-hidden shadow-[0_45px_100px_-20px_rgba(0,0,0,0.5)] border border-white/5">
                        <Image src="https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Work Management Dashboard" fill className="object-cover opacity-50" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="px-8 py-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 text-white font-bold text-2xl">
                                LIVE OPERATIONS HUB
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-white text-center">
                <h2 className="text-5xl font-black text-slate-900 mb-8 tracking-tighter">Empower Your Workforce</h2>
                <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
                    Reduce administrative overhead and let your technicians focus on what they do best: maintaining high-yield solar assets.
                </p>
                <Link href="/booking" className="px-12 py-6 bg-indigo-600 text-white rounded-3xl font-black text-xl hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200 active:scale-95 inline-block">
                    Start Optimizing Workflows
                </Link>
            </section>
        </div>
    );
}
