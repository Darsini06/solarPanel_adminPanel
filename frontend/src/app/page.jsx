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

  const fetchPDFsForLink = async (linkId) => {
    try {
      setLoadingPdfs(true);
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_URL}/drive-links/${linkId}/pdfs`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch PDFs');
      }

      const data = await response.json();
      setPdfs(data);
    } catch (err) {
      console.error('Error fetching PDFs:', err);
    } finally {
      setLoadingPdfs(false);
    }
  };

  const downloadPDF = async (pdfId, filename) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_URL}/drive-links/pdf/${pdfId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to download PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || 'document.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading PDF:', err);
      alert('Failed to download PDF');
    }
  };

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

    if (driveLink2.trim() && !isValidLink(driveLink2)) {
      setUploadStatus({ type: "error", message: "Please enter a valid Google Drive link for Link 2." });
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
      console.error("Save error:", err);
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
    console.log("Form submitted:", formData);
    alert("Thank you! Your inspection request has been received. Someone from our team will be in touch with you shortly.");
    // Reset form
    setFormData({
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
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section - Sitemark Style */}
      <section className="relative pt-24 pb-32 bg-slate-50 border-b border-slate-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto pt-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-100 rounded-full text-sm font-semibold text-orange-700 mb-8"
            >
              <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
              Solar Performance Management
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold text-slate-900 mb-8 leading-tight tracking-tight"
            >
              Maximize performance <br />across the <span className="text-orange-600">solar lifecycle</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-slate-600 mb-12 leading-relaxed max-w-3xl mx-auto font-medium"
            >
              Ensure peak performance and financial returns across your solar portfolio — overseeing planning, construction, and operations from one centralized platform.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                href="#inspection-form"
                className="px-10 py-5 bg-orange-600 text-white rounded-xl font-bold text-lg hover:bg-orange-700 transition-all shadow-xl shadow-orange-100 inline-flex items-center gap-2"
              >
                Book a Demo
                <ArrowRight size={22} />
              </Link>
              <Link
                href="/about"
                className="px-10 py-5 bg-white text-slate-900 border border-slate-200 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all inline-flex items-center gap-2"
              >
                Learn More
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Value Propositions - Sitemark Style */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                image: "https://images.pexels.com/photos/433308/pexels-photo-433308.jpeg?auto=compress&cs=tinysrgb&w=800",
                title: "Prevent Revenue Loss",
                description: "Proactively identify and prioritize issues before they escalate, minimizing losses and maximizing energy yield."
              },
              {
                image: "https://images.pexels.com/photos/9875415/pexels-photo-9875415.jpeg?auto=compress&cs=tinysrgb&w=800",
                title: "Ensure Lasting Quality",
                description: "Maintain high standards during construction to prevent costly rework and ensure long-term asset health and reliability."
              },
              {
                image: "https://images.pexels.com/photos/159888/pexels-photo-159888.jpeg?auto=compress&cs=tinysrgb&w=800",
                title: "Centralized Oversight",
                description: "Consolidate all data into a single platform for streamlined reporting, benchmarking, and decision-making across your portfolio."
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group"
              >
                <div className="mb-8 rounded-2xl overflow-hidden border border-slate-100 aspect-video shadow-sm">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={800}
                    height={450}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed font-medium">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cloud Asset Sync Section - Only for logged-in users */}
      {user && (
        <section id="drive-section" className="py-24 bg-slate-50 border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider mb-6 border border-orange-200">
                  Cloud Integration
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8 leading-tight tracking-tight">
                  Connect your asset data
                </h2>
                <p className="text-xl text-slate-600 mb-10 leading-relaxed font-medium">
                  Integrate your Google Drive or cloud storage containing site photographs and installation documentation. Our AI will automatically index and prepare them for analysis.
                </p>

                <div className="space-y-4">
                  {[
                    { icon: Globe, label: "Real-time synchronization" },
                    { icon: Shield, label: "End-to-end encrypted transfer" },
                    { icon: Database, label: "Automatic asset classification" },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 text-slate-700 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                      <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                        <item.icon size={20} className="text-orange-600" />
                      </div>
                      <span className="font-bold text-lg">{item.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl p-10 border border-slate-200 shadow-2xl"
              >
                <div className="flex items-center gap-5 mb-10">
                  <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
                    <HardDrive size={28} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-xl tracking-tight">Cloud Storage Link</h3>
                    <p className="text-slate-500 font-medium">Connect your Google Drive</p>
                  </div>
                </div>

                {uploadStatus.message && (
                  <div className={`mb-8 p-5 rounded-xl flex items-center gap-4 ${uploadStatus.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                    uploadStatus.type === "error" ? "bg-red-50 text-red-700 border border-red-100" :
                      "bg-orange-50 text-orange-700 border border-orange-100"
                    }`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${uploadStatus.type === "success" ? "bg-emerald-100" :
                      uploadStatus.type === "error" ? "bg-red-100" : "bg-orange-100"
                      }`}>
                      {uploadStatus.type === "success" ? <CheckCircle size={20} /> :
                        uploadStatus.type === "error" ? "✕" :
                          uploading ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-current border-t-transparent"></div> : "!"}
                    </div>
                    <span className="font-bold text-sm">{uploadStatus.message}</span>
                  </div>
                )}

                <form onSubmit={handleDriveLinkSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-800 mb-3">Primary Drive Link</label>
                    <input
                      type="text"
                      placeholder="https://drive.google.com/..."
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm font-medium"
                      value={driveLink1}
                      onChange={(e) => setDriveLink1(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-800 mb-3">Secondary Drive Link (Optional)</label>
                    <input
                      type="text"
                      placeholder="https://drive.google.com/..."
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm font-medium"
                      value={driveLink2}
                      onChange={(e) => setDriveLink2(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={uploading}
                    className="w-full bg-orange-600 text-white px-8 py-5 rounded-xl font-bold text-lg hover:bg-orange-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl shadow-orange-100"
                  >
                    {uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        Connecting...
                      </>
                    ) : (
                      <>
                        <CloudUpload size={22} />
                        Connect Storage
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-8 pt-8 border-t border-slate-100">
                  <p className="text-xs text-slate-400 text-center leading-relaxed">
                    <span className="font-bold text-slate-500">Note:</span> Ensure your drive link is set to public or <br />has proper sharing permissions.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Solutions Across Lifecycle - Sitemark Style */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 text-balance">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
              Solutions across the entire solar lifecycle
            </h2>
            <p className="text-xl text-slate-600 font-medium">From initial topography to 25th-year O&M audits.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                phase: "Planning",
                title: "Speed up design and maximize yield potential",
                image: "https://images.pexels.com/photos/8853502/pexels-photo-8853502.jpeg?auto=compress&cs=tinysrgb&w=800"
              },
              {
                phase: "Construction",
                title: "Stay on schedule and avoid costly mistakes",
                image: "https://images.pexels.com/photos/2850347/pexels-photo-2850347.jpeg?auto=compress&cs=tinysrgb&w=800"
              },
              {
                phase: "Operation",
                title: "Maximize production and profitability",
                image: "https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg?auto=compress&cs=tinysrgb&w=800"
              }
            ].map((solution, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-slate-50 rounded-3xl overflow-hidden border border-slate-100 hover:shadow-2xl transition-all cursor-pointer group"
              >
                <div className="aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={solution.image}
                    alt={solution.phase}
                    width={800}
                    height={450}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-10">
                  <h3 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">{solution.phase}</h3>
                  <p className="text-slate-600 mb-8 leading-relaxed font-medium">{solution.title}</p>
                  <Link href="/about" className="inline-flex items-center text-orange-600 font-bold hover:translate-x-2 transition-all">
                    Learn more <ArrowRight size={20} className="ml-2" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-24 bg-slate-900 text-white rounded-t-[60px] relative z-10 -mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight tracking-tight">
                Advanced <br />inspection tech
              </h2>
              <p className="text-xl text-slate-400 mb-12 leading-relaxed font-medium">
                Leverage cutting-edge technology to identify issues before they impact your bottom line. Our comprehensive platform combines AI analytics, drone technology, and expert analysis.
              </p>

              <div className="space-y-8">
                {[
                  {
                    icon: Zap,
                    title: "Thermographic Analysis",
                    desc: "High-resolution thermal imaging to detect micro-cracks and hot spots"
                  },
                  {
                    icon: Eye,
                    title: "Drone Inspections",
                    desc: "Rapid aerial surveys for large-scale installations"
                  },
                  {
                    icon: TrendingUp,
                    title: "Performance Analytics",
                    desc: "AI-powered insights and predictive maintenance recommendations"
                  }
                ].map((feature, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex gap-6 p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all"
                  >
                    <div className="w-14 h-14 bg-orange-600 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-lg">
                      <feature.icon size={28} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2 tracking-tight">{feature.title}</h3>
                      <p className="text-slate-400 font-medium leading-relaxed">{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-white/10 backdrop-blur-3xl rounded-[40px] p-10 border border-white/10 shadow-2xl">
                <div className="grid grid-cols-2 gap-8">
                  {[
                    { label: "Inspections", value: "2,500+", icon: Eye },
                    { label: "Accuracy", value: "99.9%", icon: Target },
                    { label: "Assets Managed", value: "15k+", icon: Database },
                    { label: "Uptime", value: "24/7", icon: Activity }
                  ].map((stat, idx) => (
                    <div key={idx} className="bg-white/5 rounded-2xl p-8 border border-white/5 hover:bg-white/10 transition-all group">
                      <stat.icon size={32} className="text-orange-500 mb-4 group-hover:scale-110 transition-transform" />
                      <div className="text-4xl font-bold text-white mb-2 tracking-tight">{stat.value}</div>
                      <div className="text-xs text-orange-400 font-bold uppercase tracking-widest">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Inspection Request Form */}
      <section id="inspection-form" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-orange-600 font-bold tracking-widest uppercase text-xs mb-6 block border-l-4 border-orange-600 pl-4">Get Started</span>
              <h2 className="text-4xl md:text-6xl font-bold text-slate-900 mb-8 leading-tight tracking-tight text-balance">
                Request a <span className="text-orange-600">Custom Inspection</span>
              </h2>
              <p className="text-slate-600 text-xl mb-10 leading-relaxed font-medium">
                Our team will review your request and provide a customized quote within 24 hours. Get expert insights into your solar asset performance.
              </p>

              <div className="space-y-4">
                {[
                  { icon: CheckCircle, text: "Professional thermal imaging" },
                  { icon: CheckCircle, text: "Comprehensive diagnostic reports" },
                  { icon: CheckCircle, text: "Actionable maintenance recommendations" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 text-slate-800 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <item.icon className="text-orange-600 w-6 h-6 flex-shrink-0" />
                    <span className="font-bold text-lg">{item.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-10 md:p-12 rounded-[40px] shadow-2xl border border-slate-100"
            >
              <form onSubmit={handleFormSubmit} className="space-y-8">
                {/* First Name & Last Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-bold text-slate-800 mb-3">
                      First name*
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-800 mb-3">
                      Last name*
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none shadow-sm"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-5 bg-orange-600 text-white rounded-xl font-bold text-xl shadow-xl shadow-orange-100 hover:bg-orange-700 transition-all flex items-center justify-center gap-3 active:scale-95"
                >
                  Confirm Request
                  <Send size={22} />
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/10 to-transparent"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-7xl font-bold mb-8 tracking-tight">
            Join the future <br />of solar management
          </h2>
          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
            Our team is ready to answer your questions and show you our platform first-hand.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href={user ? "#drive-section" : "/register"}
              className="inline-flex items-center px-12 py-6 bg-orange-600 text-white rounded-xl font-bold text-xl hover:bg-orange-700 transition-all shadow-2xl shadow-orange-900/40 gap-3"
            >
              {user ? "Connect Your Assets" : "Get Started Now"}
              <ArrowRight size={24} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center px-12 py-6 bg-white/5 border border-white/10 text-white rounded-xl font-bold text-xl hover:bg-white/10 transition-all gap-3"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}