"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Plug, RefreshCw, Layers } from "lucide-react";

export default function IntegrationsPage() {
    return (
        <div className="min-h-screen bg-white">
            <section className="pt-32 pb-20 bg-gradient-to-br from-slate-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                            <div className="inline-block px-4 py-2 bg-orange-100 text-orange-600 rounded-full text-sm font-semibold mb-6">Platform</div>
                            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">Integrations</h1>
                            <p className="text-xl text-slate-600 mb-8">Connect seamlessly with your existing tools and systems. Our platform integrates with leading ERP, CMMS, and monitoring solutions.</p>
                            <div className="flex gap-4">
                                <Link href="/booking" className="px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-all inline-flex items-center gap-2">Book a Demo <ArrowRight size={18} /></Link>
                            </div>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="aspect-video rounded-2xl overflow-hidden border border-slate-200 shadow-xl">
                            <Image src="https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Integrations" width={1200} height={675} className="w-full h-full object-cover" />
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-slate-900 mb-4">Connect Your Ecosystem</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: Plug, title: "Pre-Built Connectors", description: "Ready-to-use integrations with SAP, Oracle, Salesforce, and more." },
                            { icon: RefreshCw, title: "Real-Time Sync", description: "Bidirectional data flow keeps all systems up to date automatically." },
                            { icon: Layers, title: "API Access", description: "RESTful APIs and webhooks for custom integrations and workflows." }
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
                    <h2 className="text-4xl font-bold text-white mb-6">Unify your solar operations</h2>
                    <Link href="/booking" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-orange-600 rounded-lg font-semibold hover:bg-orange-50 transition-all">Book Your Free Demo <ArrowRight size={20} /></Link>
                </div>
            </section>
        </div>
    );
}
