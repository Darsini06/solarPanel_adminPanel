"use client";

import { motion } from "framer-motion";
import {
    ShieldCheck, Zap, BarChart3, Users, Target, Globe, Award, Rocket,
    Camera, Thermometer, AlertTriangle, CheckCircle2, TrendingUp,
    Clock, MapPin, Wifi, Battery, Sun, CloudRain, Wind, Activity
} from "lucide-react";
import Image from "next/image";

const stats = [
    { label: "Solar Panels Inspected", value: "2.5M+", icon: Zap },
    { label: "Efficiency Increase", value: "18%", icon: BarChart3 },
    { label: "Global Clients", value: "500+", icon: Globe },
    { label: "Fault Detection Accuracy", value: "99.9%", icon: ShieldCheck },
];

const inspectionProcess = [
    {
        step: "01",
        title: "Pre-Flight Planning",
        description: "Our certified pilots analyze site layout, weather conditions, and optimal flight paths using advanced mapping software.",
        icon: MapPin,
        color: "from-blue-500 to-cyan-500",
        details: ["Site survey & risk assessment", "Weather analysis", "Flight path optimization", "Safety protocols"]
    },
    {
        step: "02",
        title: "Thermal Data Capture",
        description: "High-resolution thermal cameras mounted on drones capture infrared imagery of every panel at optimal angles.",
        icon: Camera,
        color: "from-orange-500 to-red-500",
        details: ["FLIR 640×512 resolution", "Multiple angle capture", "Real-time monitoring", "GPS-tagged imagery"]
    },
    {
        step: "03",
        title: "AI-Powered Analysis",
        description: "Our proprietary algorithms process thermal data to identify hotspots, cold spots, and anomalies with 99.9% accuracy.",
        icon: Activity,
        color: "from-purple-500 to-pink-500",
        details: ["Machine learning detection", "Anomaly classification", "Severity assessment", "Performance metrics"]
    },
    {
        step: "04",
        title: "Detailed Reporting",
        description: "Comprehensive reports with thermal maps, fault locations, severity ratings, and actionable maintenance recommendations.",
        icon: BarChart3,
        color: "from-green-500 to-emerald-500",
        details: ["Visual thermal maps", "GPS coordinates", "Priority rankings", "ROI calculations"]
    },
];

const faultTypes = [
    {
        name: "Hotspot Detection",
        description: "Identifies overheating cells that reduce efficiency and pose fire risks",
        icon: Thermometer,
        severity: "Critical",
        color: "bg-red-50 border-red-200 text-red-700"
    },
    {
        name: "Cell Degradation",
        description: "Detects aging or damaged cells showing reduced power output",
        icon: Battery,
        severity: "High",
        color: "bg-orange-50 border-orange-200 text-orange-700"
    },
    {
        name: "Bypass Diode Failure",
        description: "Locates faulty diodes causing string performance issues",
        icon: Zap,
        severity: "Medium",
        color: "bg-yellow-50 border-yellow-200 text-yellow-700"
    },
    {
        name: "Soiling & Shading",
        description: "Maps dirt accumulation and shadow patterns affecting output",
        icon: CloudRain,
        severity: "Low",
        color: "bg-blue-50 border-blue-200 text-blue-700"
    },
];

const benefits = [
    {
        title: "10x Faster Inspections",
        description: "Complete large-scale solar farms in hours, not weeks",
        icon: Clock,
        stat: "90% Time Saved"
    },
    {
        title: "Zero Safety Risks",
        description: "No personnel exposed to heights or electrical hazards",
        icon: ShieldCheck,
        stat: "100% Safe"
    },
    {
        title: "Precision Detection",
        description: "Identify micro-faults invisible to manual inspection",
        icon: Target,
        stat: "0.5°C Accuracy"
    },
    {
        title: "Maximize ROI",
        description: "Prevent costly failures and optimize energy production",
        icon: TrendingUp,
        stat: "18% Efficiency Gain"
    },
];

const values = [
    {
        title: "Precision Engineering",
        description: "We leverage military-grade thermal sensors and custom AI algorithms to identify faults invisible to the human eye.",
        icon: Target,
        color: "bg-blue-50 text-blue-600",
    },
    {
        title: "Sustainable Future",
        description: "Every kilowatt-hour saved is a step toward a greener planet. We're committed to maximizing renewable potential.",
        icon: Rocket,
        color: "bg-green-50 text-green-600",
    },
    {
        title: "Industry Excellence",
        description: "Setting the gold standard for thermographic inspections with certified pilots and world-class analysis.",
        icon: Award,
        color: "bg-orange-50 text-orange-600",
    },
    {
        title: "Global Reach",
        description: "Our distributed network of pilots ensures we can deploy to any solar farm on Earth within 48 hours.",
        icon: Globe,
        color: "bg-purple-50 text-purple-600",
    },
];

const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
};

const stagger = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative pt-24 pb-16 overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-amber-50/30 to-white -z-10" />
                <div className="absolute top-20 left-10 w-72 h-72 bg-orange-400/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="initial"
                        animate="animate"
                        variants={stagger}
                        className="text-center max-w-5xl mx-auto mb-12"
                    >
                        {/* Main Heading */}
                        <motion.h1
                            variants={fadeIn}
                            className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight"
                        >
                            Advanced Drone-Based
                            <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500">
                                Solar Panel Inspection
                            </span>
                        </motion.h1>

                        {/* Subheading */}
                        <motion.p
                            variants={fadeIn}
                            className="text-lg md:text-xl text-slate-600 leading-relaxed mb-8 max-w-3xl mx-auto"
                        >
                            Maximize your solar farm's efficiency with cutting-edge thermal imaging technology.
                            We detect faults, prevent failures, and optimize energy production with 99.9% accuracy.
                        </motion.p>

                        {/* Key Features Pills */}
                        <motion.div
                            variants={fadeIn}
                            className="flex flex-wrap items-center justify-center gap-3 mb-10"
                        >
                            {[
                                { icon: Camera, text: "Thermal Imaging" },
                                { icon: Activity, text: "AI Detection" },
                                { icon: Clock, text: "Fast Results" },
                                { icon: ShieldCheck, text: "99.9% Accurate" }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md border border-slate-200 hover:border-orange-300 hover:shadow-lg transition-all">
                                    <item.icon className="w-4 h-4 text-orange-600" />
                                    <span className="text-sm font-semibold text-slate-700">{item.text}</span>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 md:p-10 bg-gradient-to-br from-white to-slate-50 rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100"
                    >
                        {stats.map((stat, i) => (
                            <motion.div
                                key={i}
                                className="text-center group cursor-pointer"
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <div className="inline-flex items-center justify-center w-14 h-14 mb-3 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30 group-hover:shadow-xl group-hover:shadow-orange-500/40 transition-all duration-300">
                                    <stat.icon className="w-7 h-7" />
                                </div>
                                <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-1 group-hover:text-orange-600 transition-colors">{stat.value}</div>
                                <div className="text-xs md:text-sm font-medium text-slate-500 uppercase tracking-wide">{stat.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Inspection Process Section */}
            <section className="py-20 bg-gradient-to-b from-white to-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <span className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold tracking-wider text-orange-600 uppercase bg-orange-100 rounded-full">
                            How It Works
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                            Our Inspection <span className="text-orange-600">Process</span>
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            A proven 4-step methodology combining cutting-edge technology with expert analysis
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {inspectionProcess.map((process, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="relative group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-white to-slate-50 rounded-3xl shadow-lg group-hover:shadow-2xl transition-all duration-300" />
                                <div className="relative p-8">
                                    {/* Step Number */}
                                    <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-slate-900 to-slate-700 rounded-2xl flex items-center justify-center shadow-xl">
                                        <span className="text-2xl font-bold text-orange-500">{process.step}</span>
                                    </div>

                                    {/* Icon */}
                                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${process.color} text-white mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                                        <process.icon className="w-7 h-7" />
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-2xl font-bold text-slate-900 mb-3">{process.title}</h3>
                                    <p className="text-slate-600 mb-6 leading-relaxed">{process.description}</p>

                                    {/* Details List */}
                                    <ul className="space-y-2">
                                        {process.details.map((detail, idx) => (
                                            <li key={idx} className="flex items-center gap-2 text-sm text-slate-700">
                                                <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                <span>{detail}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-20 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl font-bold text-slate-900 mb-4">
                            Why Choose <span className="text-orange-600">Thermal Inspection?</span>
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Drone-based thermal imaging delivers unmatched advantages over traditional methods
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {benefits.map((benefit, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -8 }}
                                className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-orange-300 hover:shadow-xl transition-all duration-300"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg">
                                        <benefit.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="text-2xl font-bold text-orange-600">{benefit.stat}</span>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">{benefit.title}</h3>
                                <p className="text-sm text-slate-600">{benefit.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Fault Detection Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <span className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold tracking-wider text-orange-600 uppercase bg-orange-100 rounded-full">
                            Detection Capabilities
                        </span>
                        <h2 className="text-4xl font-bold text-slate-900 mb-4">
                            What We <span className="text-orange-600">Detect</span>
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Our AI-powered thermal analysis identifies critical faults before they become costly failures
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {faultTypes.map((fault, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className={`rounded-2xl p-6 border-2 ${fault.color} hover:shadow-lg transition-all duration-300`}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <fault.icon className="w-8 h-8" />
                                    <span className="px-3 py-1 bg-white/80 rounded-full text-xs font-bold uppercase tracking-wide">
                                        {fault.severity}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold mb-2">{fault.name}</h3>
                                <p className="text-sm opacity-90">{fault.description}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Technology Highlight */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mt-16 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-10 text-white relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl" />
                        <div className="relative z-10 grid md:grid-cols-3 gap-8 text-center">
                            <div>
                                <div className="text-4xl font-bold text-orange-500 mb-2">0.5°C</div>
                                <div className="text-slate-300">Thermal Accuracy</div>
                            </div>
                            <div>
                                <div className="text-4xl font-bold text-orange-500 mb-2">640×512</div>
                                <div className="text-slate-300">FLIR Resolution</div>
                            </div>
                            <div>
                                <div className="text-4xl font-bold text-orange-500 mb-2">99.9%</div>
                                <div className="text-slate-300">Detection Rate</div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative"
                        >
                            <div className="absolute -inset-4 bg-orange-200/30 rounded-[3rem] blur-3xl -z-10" />
                            <div className="rounded-[2.5rem] overflow-hidden shadow-2xl group">
                                <img
                                    src="https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=1000&auto=format&fit=crop"
                                    alt="Solar Farm"
                                    className="w-full aspect-[4/5] object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                                <div className="absolute bottom-8 left-8 right-8 text-white">
                                    <p className="text-lg font-medium opacity-90 italic">"Ensuring every sunbeam is converted into progress."</p>
                                </div>
                            </div>
                        </motion.div>

                        <div>
                            <motion.span
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                className="text-orange-600 font-bold tracking-widest uppercase text-sm mb-4 block"
                            >
                                Our Mission
                            </motion.span>
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="text-4xl font-bold text-slate-900 mb-8 leading-tight"
                            >
                                Revolutionizing Solar Farm
                                <span className="block text-orange-600 mt-2">Maintenance & Inspection</span>
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="text-slate-600 text-lg mb-6 leading-relaxed"
                            >
                                Traditional solar panel inspections are time-consuming, expensive, and often miss critical faults. Our drone-based thermal imaging technology transforms this process.
                            </motion.p>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="text-slate-600 text-lg mb-10 leading-relaxed"
                            >
                                We combine aerospace-grade thermal cameras with AI-powered analysis to detect hotspots, cell degradation, and electrical faults before they impact your energy production.
                            </motion.p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {values.map((v, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.2 + (i * 0.1) }}
                                        className="p-6 bg-white rounded-3xl border border-slate-100 hover:shadow-xl hover:shadow-orange-100/20 transition-all duration-300 group"
                                    >
                                        <div className={`w-12 h-12 rounded-2xl ${v.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                                            <v.icon className="w-6 h-6" />
                                        </div>
                                        <h3 className="font-bold text-slate-900 mb-2">{v.title}</h3>
                                        <p className="text-sm text-slate-500 leading-relaxed">{v.description}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="max-w-7xl mx-auto rounded-[4rem] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-12 md:p-20 text-center relative overflow-hidden border border-slate-700"
                >
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-orange-600/20 rounded-full blur-[100px]" />
                    <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]" />

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-5 py-2 mb-6 bg-orange-500/20 backdrop-blur-sm rounded-full border border-orange-500/30">
                            <Thermometer className="w-4 h-4 text-orange-400" />
                            <span className="text-sm font-bold text-orange-300 tracking-wide">Thermal Inspection Services</span>
                        </div>

                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                            Protect Your Solar Investment
                            <span className="block mt-3 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500">
                                Detect Faults Before They Cost You
                            </span>
                        </h2>

                        <p className="text-slate-300 text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
                            Schedule a professional drone-based thermal inspection and discover hidden issues affecting your solar farm's performance. Get detailed reports with actionable insights.
                        </p>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mb-12">
                            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                                <div className="text-2xl font-bold text-orange-500 mb-1">48hrs</div>
                                <div className="text-xs text-slate-400 uppercase tracking-wide">Response Time</div>
                            </div>
                            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                                <div className="text-2xl font-bold text-orange-500 mb-1">99.9%</div>
                                <div className="text-xs text-slate-400 uppercase tracking-wide">Accuracy</div>
                            </div>
                            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                                <div className="text-2xl font-bold text-orange-500 mb-1">18%</div>
                                <div className="text-xs text-slate-400 uppercase tracking-wide">Avg. Efficiency Gain</div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button className="group px-10 py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-full font-bold text-lg transition-all hover:scale-105 shadow-2xl shadow-orange-500/30 uppercase tracking-wide flex items-center gap-2">
                                <Camera className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                Book Inspection Now
                            </button>
                            <button className="px-10 py-4 border-2 border-slate-600 hover:border-orange-500 text-white rounded-full font-bold text-lg transition-all hover:bg-slate-800/50 uppercase tracking-wide flex items-center gap-2">
                                <Users className="w-5 h-5" />
                                Contact Our Team
                            </button>
                        </div>
                    </div>
                </motion.div>
            </section>
        </div>
    );
}