"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Plane, Camera, Zap } from "lucide-react";

export default function DronesPage() {
    return (
        <div className="min-h-screen bg-white">
            <section className="pt-32 pb-20 bg-gradient-to-br from-slate-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                            <div className="inline-block px-4 py-2 bg-orange-100 text-orange-600 rounded-full text-sm font-semibold mb-6">Platform</div>
                            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">Drones & Robotics</h1>
                            <p className="text-xl text-slate-600 mb-8">Leverage cutting-edge drone technology and robotics for faster, safer, and more comprehensive solar site inspections.</p>
                            <div className="flex gap-4">
                                <Link href="/booking" className="px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-all inline-flex items-center gap-2">Book a Demo <ArrowRight size={18} /></Link>
                                <Link href="/contact" className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:border-orange-600 hover:text-orange-600 transition-all">Contact Sales</Link>
                            </div>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="aspect-video rounded-2xl overflow-hidden border border-slate-200 shadow-xl">
                            <Image src="https://images.pexels.com/photos/433308/pexels-photo-433308.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Drones" width={1200} height={675} className="w-full h-full object-cover" />
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-slate-900 mb-4">Autonomous Inspection Technology</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: Plane, title: "Automated Flight Plans", description: "Pre-programmed routes ensure complete coverage and consistent data collection." },
                            { icon: Camera, title: "Multi-Sensor Capture", description: "RGB, thermal, and multispectral imaging in a single flight." },
                            { icon: Zap, title: "Rapid Deployment", description: "Inspect hundreds of megawatts in hours, not weeks." }
                        ].map((benefit, idx) => (
                            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-slate-50 rounded-xl p-8 hover:shadow-lg transition-all">
                                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 mb-6"><benefit.icon size={24} /></div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{benefit.title}</h3>
                                <p className="text-slate-600">{benefit.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 bg-gradient-to-br from-orange-600 to-orange-700">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl font-bold text-white mb-6">Experience the future of solar inspections</h2>
                    <Link href="/booking" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-orange-600 rounded-lg font-semibold hover:bg-orange-50 transition-all">Book Your Free Demo <ArrowRight size={20} /></Link>
                </div>
            </section>
        </div>
    );
}
