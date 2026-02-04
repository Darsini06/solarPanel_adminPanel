"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowRight, Zap, Shield, Globe, Sun, FileUp, Database,
  HardDrive, CheckCircle, User, Mail, Phone, MapPin,
  Settings, MessageSquare, Send, CloudUpload, Activity,
  Target, TrendingUp, BarChart3, Eye, Wrench, ClipboardCheck
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { authAPI } from "@/lib/api";

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [driveLink1, setDriveLink1] = useState("");
  const [driveLink2, setDriveLink2] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({ type: "", message: "" });
  const [pdfs, setPdfs] = useState([]);
  const [loadingPdfs, setLoadingPdfs] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    workEmail: "",
    jobTitle: "",
    phone: "",
    country: "",
    companyName: "",
    companyType: "",
    solarCapacity: "",
    referralSource: "",
    additionalInfo: ""
  });

  useEffect(() => {
    const name = localStorage.getItem("user_name");
    const token = localStorage.getItem("auth_token");
    if (token && name) {
      setUser({ name, token });
    }
  }, []);

  const handleDriveLinkSubmit = async (e) => {
    e.preventDefault();
    if (!driveLink1.trim()) {
      setUploadStatus({ type: "error", message: "Please provide the primary Google Drive link." });
      return;
    }
    const isValidLink = (link) => link.includes("drive.google.com") || link.includes("docs.google.com");
    if (!isValidLink(driveLink1)) {
      setUploadStatus({ type: "error", message: "Please enter a valid Google Drive link for Link 1." });
      return;
    }
    setUploading(true);
    setUploadStatus({ type: "info", message: "Saving your drive links..." });
    try {
      const response = await authAPI.saveLinks({
        drive_link_1: driveLink1,
        drive_link_2: driveLink2
      });
      setUploadStatus({
        type: "success",
        message: `Drive links successfully saved! Link ID: ${response.data.id}`
      });
      setDriveLink1("");
      setDriveLink2("");
    } catch (err) {
      setUploadStatus({
        type: "error",
        message: err.response?.data?.detail || "Failed to save links. Please try again."
      });
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    alert("Thank you! Your request has been received.");
    setFormData({
      firstName: "", lastName: "", workEmail: "", jobTitle: "",
      phone: "", country: "", companyName: "", companyType: "",
      solarCapacity: "", referralSource: "", additionalInfo: ""
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section - Dark & Premium */}
      <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 bg-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.pexels.com/photos/9875415/pexels-photo-9875415.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="Solar Farm Ambient"
            fill
            className="object-cover opacity-20 mix-blend-overlay"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 rounded-md text-xs font-bold uppercase tracking-[0.2em] mb-10"
          >
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            Trusted by 500+ Global Solar Firms
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-8xl lg:text-[7rem] font-bold mb-8 leading-[1] tracking-tight max-w-6xl mx-auto"
          >
            The Next Frontier of <br />
            <span className="text-orange-400">Solar Intelligence.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-slate-300 mb-14 leading-relaxed max-w-3xl mx-auto font-medium"
          >
            Maximize performance and financial returns across your entire portfolio with our centralized platform for planning, construction, and institutional O&M.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-6 justify-center"
          >
            <Link
              href="#inspection-form"
              className="group px-12 py-6 bg-orange-600 text-white rounded-xl font-bold text-xl hover:bg-orange-700 transition-all shadow-2xl shadow-orange-900/40 flex items-center gap-3 active:scale-95"
            >
              Launch Enterprise Platform
              <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-12 bg-white border-b border-slate-50 overflow-hidden uppercase font-bold text-slate-400 text-xs tracking-[0.3em]">
        <div className="max-w-7xl mx-auto px-4 text-center">
          Institutional Partners & Industry Standards
        </div>
      </section>

      {/* Core Solutions Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-slate-900 tracking-tight">Full Lifecycle Control</h2>
            <p className="text-xl text-slate-500 mt-4 max-w-2xl mx-auto">From initial terrain analysis to 25th-year performance audits, SolarMark is your single source of truth.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                phase: "Planning Phase",
                title: "60% Faster Site Assessment",
                image: "https://images.pexels.com/photos/8853502/pexels-photo-8853502.jpeg?auto=compress&cs=tinysrgb&w=800",
                href: "/solutions/planning/site-assessment"
              },
              {
                phase: "Construction Phase",
                title: "Zero Defect Commissioning",
                image: "https://images.pexels.com/photos/2850347/pexels-photo-2850347.jpeg?auto=compress&cs=tinysrgb&w=800",
                href: "/solutions/construction/quality-control"
              },
              {
                phase: "Operation Phase",
                title: "99.9% Portfolio Health",
                image: "https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg?auto=compress&cs=tinysrgb&w=800",
                href: "/solutions/operation/thermography"
              }
            ].map((solution, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-slate-50 rounded-[2.5rem] overflow-hidden border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all cursor-pointer group"
              >
                <div className="aspect-[4/3] w-full overflow-hidden relative">
                  <Image
                    src={solution.image}
                    alt={solution.phase}
                    fill
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-6 left-6 px-3 py-1 bg-white/90 backdrop-blur-md rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-sm">
                    {solution.phase}
                  </div>
                </div>
                <div className="p-10">
                  <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight group-hover:text-orange-600 transition-colors">{solution.title}</h3>
                  <Link href={solution.href} className="inline-flex items-center text-orange-600 font-bold hover:translate-x-2 transition-all text-sm uppercase tracking-widest">
                    Explore Solution <ArrowRight size={16} className="ml-2" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Engine Highlight */}
      <section className="py-32 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-orange-500/50 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-5xl md:text-7xl font-bold mb-8 leading-none tracking-tight">
                AI Powered <br /> <span className="text-orange-400">Diagnostics</span>
              </h2>
              <p className="text-xl text-slate-400 mb-12 leading-relaxed font-medium">
                Our computer vision engine is trained on billions of data points to identify anomalies that the human eye misses. From micro-cracks to string failures, we categorize defects by severity and financial impact.
              </p>

              <div className="space-y-6">
                {[
                  { icon: Zap, title: "String-Level IV Analysis", desc: "Automated identification of underperforming strings." },
                  { icon: Eye, title: "Thermal Segmentation", desc: "Identify diode heat patterns with military-grade radiometric data." },
                  { icon: TrendingUp, title: "Yield Forecasting", desc: "Predict future energy loss based on current defect degradation." }
                ].map((feature, idx) => (
                  <motion.div
                    key={idx}
                    className="flex gap-6 p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group"
                  >
                    <div className="w-14 h-14 bg-orange-600 text-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                      <feature.icon size={28} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2 tracking-tight group-hover:text-orange-400 transition-colors uppercase text-sm tracking-widest">{feature.title}</h3>
                      <p className="text-slate-500 font-medium leading-relaxed text-sm">{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-white/5 backdrop-blur-3xl rounded-[3rem] p-12 border border-white/10 shadow-3xl">
                <div className="grid grid-cols-2 gap-8">
                  {[
                    { label: "Validated Inspections", value: "2,500+", icon: Eye },
                    { label: "Diagnostic Accuracy", value: "99.9%", icon: Target },
                    { label: "Assets Under Management", value: "85GW+", icon: Database },
                    { label: "Safety Compliance", value: "100%", icon: Activity }
                  ].map((stat, idx) => (
                    <div key={idx} className="bg-slate-900 rounded-2xl p-8 border border-white/5 hover:border-orange-500/50 transition-all group">
                      <stat.icon size={32} className="text-orange-500 mb-4 group-hover:scale-110 transition-transform" />
                      <div className="text-4xl font-bold text-white mb-2 tracking-tight">{stat.value}</div>
                      <div className="text-[10px] text-orange-400 font-bold uppercase tracking-[0.2em]">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Form */}
      <section id="inspection-form" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="px-4 py-1 bg-orange-50 text-orange-600 rounded-md text-xs font-bold uppercase tracking-widest inline-block mb-8">
                Enterprise Partnership
              </div>
              <h2 className="text-5xl md:text-7xl font-bold text-slate-900 mb-8 leading-tight tracking-tight">
                Request a <span className="text-orange-600">Site Survey</span>
              </h2>
              <p className="text-slate-500 text-xl mb-10 leading-relaxed max-w-xl">
                Experience the gold standard in solar O&M. Our technical team provides custom auditing solutions for utility-scale portfolios worldwide.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { icon: CheckCircle, text: "Bank-grade validation" },
                  { icon: CheckCircle, text: "Full thermal radiometric audits" },
                  { icon: CheckCircle, text: "Financial risk prioritization" },
                  { icon: CheckCircle, text: "24-hour report turnaround" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-slate-900 font-bold">
                    <item.icon className="text-orange-600 w-5 h-5 flex-shrink-0" />
                    <span className="text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-slate-50 p-12 rounded-[3rem] shadow-2xl border border-slate-100"
            >
              <form onSubmit={handleFormSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">First name*</label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-5 py-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-600 focus:border-transparent outline-none transition-all shadow-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Last name*</label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-5 py-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-600 focus:border-transparent outline-none transition-all shadow-sm font-bold"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Work Email*</label>
                  <input
                    type="email"
                    name="workEmail"
                    required
                    className="w-full px-5 py-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-600 focus:border-transparent outline-none transition-all shadow-sm font-bold"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-6 bg-orange-600 text-white rounded-xl font-bold text-xl shadow-xl shadow-orange-900/20 hover:bg-orange-700 transition-all flex items-center justify-center gap-3 active:scale-95"
                >
                  Confirm Request <Send size={22} />
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Cloud Asset Sync Section - Only for logged-in users */}
      {user && (
        <section id="drive-section" className="py-24 bg-slate-950 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <motion.div>
                <div className="px-4 py-1 bg-orange-600 rounded-md text-xs font-bold uppercase tracking-widest inline-block mb-8">
                  Cloud Integration
                </div>
                <h2 className="text-5xl font-bold text-white mb-8 tracking-tight">Connect your asset data</h2>
                <p className="text-xl text-slate-400 mb-10 leading-relaxed font-medium">
                  Bridge your Google Drive or cloud storage containing site photographs and installation documentation. Our AI will automatically index and prepare them for military-grade analysis.
                </p>
                <div className="space-y-4">
                  {[
                    { icon: Globe, label: "Real-time synchronization" },
                    { icon: Shield, label: "End-to-end encrypted transfer" },
                    { icon: Database, label: "Automatic asset classification" },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 text-white p-6 bg-white/5 rounded-2xl border border-white/10 group hover:bg-white/10 transition-all">
                      <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <item.icon size={24} className="text-white" />
                      </div>
                      <span className="font-bold text-lg">{item.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div className="bg-white rounded-[2.5rem] p-12 border border-slate-200 shadow-3xl text-slate-900">
                <form onSubmit={handleDriveLinkSubmit} className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Primary Google Drive Hub*</label>
                    <input
                      type="text"
                      placeholder="https://drive.google.com/..."
                      className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent transition-all font-bold"
                      value={driveLink1}
                      onChange={(e) => setDriveLink1(e.target.value)}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="w-full bg-slate-950 text-white px-8 py-6 rounded-2xl font-bold text-xl hover:bg-orange-600 transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-2xl"
                  >
                    {uploading ? "Establishing Link..." : "Bridge Cloud Storage"}
                    <CloudUpload size={24} />
                  </button>
                </form>
              </motion.div>
            </div>
          </div>
        </section>
      )
      }

      {/* Final Premium CTA */}
      <section className="py-40 bg-white text-center relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 relative z-10 text-center">
          <h2 className="text-6xl md:text-8xl font-bold text-slate-950 mb-10 tracking-tight">
            Join the Future of <br /> <span className="text-orange-600">Energy O&M</span>
          </h2>
          <p className="text-2xl text-slate-500 mb-16 max-w-2xl mx-auto font-medium leading-relaxed">
            The world's most disciplined energy firms trust SolarMark to manage their most critical infrastructure assets.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center px-16 py-8 bg-slate-950 text-white rounded-2xl font-bold text-2xl hover:bg-orange-600 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.2)] gap-4 group"
          >
            Get Started Now
            <ArrowRight size={28} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}