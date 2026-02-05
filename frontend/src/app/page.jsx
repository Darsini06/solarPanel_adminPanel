
"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowRight, Zap, Shield, Globe, Sun, FileUp, Database,
  HardDrive, CheckCircle, User, Mail, Phone, MapPin,
  Settings, MessageSquare, Send, CloudUpload, Activity, Loader2, ShieldCheck, Star
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { authAPI } from "@/lib/api";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [driveLink1, setDriveLink1] = useState("");
  const [driveLink2, setDriveLink2] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({ type: "", message: "" });
  const [pdfs, setPdfs] = useState([]);
  const [loadingPdfs, setLoadingPdfs] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

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

  const companyTypes = [
    "Asset Owner",
    "EPC Contractor",
    "O&M Team",
    "Drone Service Provider",
    "Developer",
    "Other"
  ];

  const solarCapacities = [
    "Less than 1 MW",
    "1-10 MW",
    "10-50 MW",
    "50-100 MW",
    "100-500 MW",
    "500+ MW"
  ];

  const referralSources = [
    "Google Search",
    "LinkedIn",
    "Industry Event",
    "Referral",
    "Social Media",
    "Other"
  ];

  const countries = [
    "United States",
    "Canada",
    "United Kingdom",
    "Germany",
    "France",
    "Spain",
    "Italy",
    "Australia",
    "India",
    "Other"
  ];

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

  // Add this function to download PDF
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

    if (uploading) return;

    setUploading(true);
    setUploadStatus({ type: "info", message: "Saving your drive links..." });

    try {
      // Backend extracts user_id from the auth token
      const payload = {
        drive_link_1: driveLink1,
        drive_link_2: driveLink2 || "" // Ensure it's a string even if empty
      };

      const response = await authAPI.saveLinks(payload);

      setUploadStatus({
        type: "success",
        message: `Drive links successfully saved! Link ID: ${response.data.id}`
      });

      // Fetch PDFs for the newly created link
      if (response.data.id) {
        // Use a timeout to allow backend processing time if needed
        setTimeout(() => fetchPDFsForLink(response.data.id), 1000);
      }

      setDriveLink1("");
      setDriveLink2("");

    } catch (err) {
      console.error("Save error:", err);
      // Detailed error logging
      if (err.response) {
        console.error("Response data:", err.response.data);
        console.error("Response status:", err.response.status);
      }
      setUploadStatus({
        type: "error",
        message: err.response?.data?.detail || `Failed to save links. Status: ${err.response?.status || 'Unknown'}`
      });
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      router.push('/login');
      return;
    }

    setSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      // Combine first and last name for the API
      const payload = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.workEmail,
        contact_phone: formData.phone,
        location: formData.country,
        service_type: formData.companyType,
        system_size: formData.solarCapacity,
        notes: `Job Title: ${formData.jobTitle}\nCompany: ${formData.companyName}\nReferral Source: ${formData.referralSource}\n\nAdditional Info: ${formData.additionalInfo}`,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('en-US', { hour12: false })
      };

      const response = await fetch(`${API_URL}/bookings/guest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to submit booking');
      }

      setStatus({
        type: 'success',
        message: 'Thank you! Your request has been received. Someone from our team will be in touch with you shortly.'
      });

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

    } catch (error) {
      console.error("Error submitting booking:", error);
      setStatus({
        type: 'error',
        message: error.message || 'Something went wrong. Please try again later.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full -z-10 bg-gradient-to-tr from-orange-50 to-blue-50"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-24 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-700 px-4 py-1.5 rounded-full font-medium text-sm mb-6 animate-bounce">
              <Sun size={16} />
              <span>Next-Gen Solar Technology</span>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-8"
            >
              Expert <span className="text-orange-600">Solar Inspection</span> Services
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-slate-600 mb-10 leading-relaxed"
            >
              Ensure your solar infrastructure is operating at peak performance with our professional drone-based inspection solutions.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4"
            >
              <>
                <Link
                  href="#inspection-form"
                  className="w-full sm:w-auto px-8 py-4 bg-orange-600 text-white rounded-xl font-semibold shadow-lg shadow-orange-200 hover:bg-orange-700 hover:-translate-y-1 transition-all flex items-center justify-center uppercase tracking-wider"
                >
                  Book Inspection <ArrowRight className="ml-2" size={20} />
                </Link>
                <Link
                  href="/about"
                  className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-xl font-semibold hover:bg-slate-50 transition-all flex items-center justify-center shadow-sm uppercase tracking-wider"
                >
                  Learn More
                </Link>
              </>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Cloud Asset Sync Section */}
      {user && (
        <section id="drive-section" className="py-24 bg-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-50/50 rounded-full blur-[120px] -mr-64 -mt-64" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-50/30 rounded-full blur-[120px] -ml-64 -mb-64" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="lg:col-span-5"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-bold uppercase tracking-widest mb-6 border border-orange-200">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-600"></span>
                  </span>
                  Cloud Diagnostics Active
                </div>
                <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
                  Synchronize Your <br />
                  <span className="bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent italic">Site Assets</span>
                </h2>
                <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-lg">
                  Connect your Google Drive or cloud storage containing site photographs and installation plans. Our AI will automatically index and prepare them for inspection.
                </p>

                <div className="space-y-4">
                  {[
                    { icon: Globe, label: "Real-time synchronization" },
                    { icon: Shield, label: "End-to-end encrypted transfer" },
                    { icon: Database, label: "Automatic asset classification" },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-slate-700 font-semibold group">
                      <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg group-hover:bg-orange-50 group-hover:border-orange-100 transition-colors">
                        <item.icon size={18} className="text-orange-600" />
                      </div>
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="lg:col-span-7"
              >
                <div className="bg-slate-900 rounded-[3rem] p-1 md:p-1.5 shadow-2xl shadow-slate-200">
                  <div className="bg-white rounded-[2.8rem] p-8 md:p-12 border border-slate-100">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl">
                          <HardDrive size={30} />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-xl tracking-tight italic">Secure Linkage</h3>
                        </div>
                      </div>
                    </div>

                    {/* Status Message */}
                    {uploadStatus.message && (
                      <div className={`mb-6 p-4 rounded-2xl flex items-center space-x-3 ${uploadStatus.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-100/50" :
                        uploadStatus.type === "error" ? "bg-red-50 text-red-700 border border-red-100/50" :
                          "bg-orange-50 text-orange-700 border border-orange-100/50"
                        }`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${uploadStatus.type === "success" ? "bg-emerald-100" :
                          uploadStatus.type === "error" ? "bg-red-100" : "bg-orange-100"
                          }`}>
                          {uploadStatus.type === "success" ? <CheckCircle size={18} /> :
                            uploadStatus.type === "error" ? "✕" :
                              uploading ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div> : "!"}
                        </div>
                        <span className="font-bold text-sm">{uploadStatus.message}</span>
                      </div>
                    )}

                    <form onSubmit={handleDriveLinkSubmit}>
                      <div className="space-y-8">
                        {/* Drive Link 1 */}
                        <div className="relative group">
                          <div className="flex items-center justify-between mb-3 pl-1">
                            <label className="text-sm font-semibold text-slate-700">Drive Link</label>
                          </div>
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="Paste Google Drive link ..."
                              className="w-full pl-6 pr-32 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 focus:bg-white transition-all text-sm font-semibold text-slate-700 placeholder:text-slate-300"
                              value={driveLink1}
                              onChange={(e) => setDriveLink1(e.target.value)}
                              required
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              <button
                                type="submit"
                                disabled={uploading}
                                className="bg-orange-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-orange-700 active:scale-95 transition-all shadow-lg shadow-orange-500/20 flex items-center gap-2 disabled:opacity-70"
                              >
                                {uploading ? (
                                  <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white bo    rder-t-transparent"></div>
                                    Saving...
                                  </>
                                ) : (
                                  <>
                                    <CloudUpload size={16} />
                                    Import
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Drive Link 2 */}
                        <div className="relative group pt-4 border-t border-slate-50">
                          <div className="flex items-center justify-between mb-3 pl-1">
                            <label className="text-sm font-semibold text-slate-700">Drive Link 2</label>
                          </div>
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="Paste Google Drive link ..."
                              className="w-full pl-6 pr-32 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all text-sm font-semibold text-slate-700 placeholder:text-slate-300"
                              value={driveLink2}
                              onChange={(e) => setDriveLink2(e.target.value)}
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              <button
                                type="submit"
                                disabled={uploading}
                                className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-800 active:scale-95 transition-all shadow-lg flex items-center gap-2 disabled:opacity-70"
                              >
                                {uploading ? (
                                  <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                    Saving...
                                  </>
                                ) : (
                                  <>
                                    <CloudUpload size={16} />
                                    Import
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                    <div className="mt-8 pt-6 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-slate-500">
                          <span className="font-semibold text-slate-700">Note:</span> Ensure your drive link in public.
                        </div>
                        <div className="flex items-center space-x-3">

                        </div>
                      </div>
                    </div>
                    <div className="mt-10 pt-6 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-slate-500">

                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}
      {/* Display Uploaded PDFs Section */}
      {pdfs.length > 0 && (
        <section className="py-12 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-slate-900">Uploaded Documents</h3>
                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
                  {pdfs.length} PDF(s)
                </span>
              </div>

              {loadingPdfs ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pdfs.map((pdf) => (
                    <div key={pdf.pdf_id} className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start space-x-3">
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="w-6 h-6 text-red-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-900 truncate">{pdf.filename}</p>
                          <div className="flex items-center space-x-2 text-sm text-slate-500 mt-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(pdf.uploaded_at).toLocaleDateString()}</span>
                          </div>
                          <div className="text-xs text-slate-500 mt-2">
                            Size: {(pdf.file_size / 1024 / 1024).toFixed(2)} MB
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex space-x-2">
                        <button
                          onClick={() => downloadPDF(pdf.pdf_id, pdf.filename)}
                          className="flex-1 px-3 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors"
                        >
                          Download
                        </button>
                        <button
                          onClick={() => window.open(`${API_URL}/drive-links/pdf/${pdf.pdf_id}`, '_blank')}
                          className="px-3 py-2 border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {pdfs.length === 0 && !loadingPdfs && (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">No PDFs uploaded yet</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Our Inspection Excellence</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto italic font-medium">
              Precision auditing to maximize your solar asset's lifespan and output.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="text-orange-500" />,
                title: "Thermographic Analysis",
                desc: "Identify micro-cracks and hot spots within cells that are invisible to the naked eye using high-res thermal imaging.",
              },
              {
                icon: <Shield className="text-blue-500" />,
                title: "Drone-Based Surveys",
                desc: "Rapid, safe, and cost-effective aerial inspections for large-scale solar farms and hard-to-reach rooftop installations.",
              },
              {
                icon: <Globe className="text-emerald-500" />,
                title: "Performance Audits",
                desc: "Comprehensive diagnostic reports that provide actionable insights to improve overall system efficiency.",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-3xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-2xl hover:shadow-orange-100 hover:-translate-y-2 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed italic">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Inspection Form Section */}
      <section id="inspection-form" className="py-16 bg-slate-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-orange-200/20 rounded-full blur-[100px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-orange-600 font-bold tracking-widest uppercase text-sm mb-4 block">Request Service</span>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8 leading-tight">
                Get Your Solar Panels <br />
                <span className="text-orange-600 italic">Inspected Today.</span>
              </h2>
              <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                Fill out the form to schedule a professional thermographic inspection. Our team will get back to you within 24 hours with a customized quote and deployment plan.
              </p>

              <div className="space-y-6">
                {[
                  { icon: CheckCircle, text: "High-Resolution Thermal Imaging" },
                  { icon: CheckCircle, text: "AI-Powered Fault Analysis" },
                  { icon: CheckCircle, text: "Detailed ROI Impact Reports" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center space-x-3 text-slate-700 font-medium">
                    <item.icon className="text-orange-500 w-5 h-5" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-6 md:p-8 rounded-[2rem] shadow-2xl shadow-orange-100 border border-slate-100"
            >
              {status.message && (
                <div className={`mb-6 p-4 rounded-xl text-center shadow-sm ${status.type === 'success'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                  : 'bg-red-50 text-red-700 border border-red-100'
                  }`}>
                  <p className="font-bold text-sm tracking-tight flex items-center justify-center gap-2">
                    {status.type === 'success' && <CheckCircle size={18} />}
                    {status.message}
                  </p>
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-4">
                {/* First Name & Last Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 group">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 group-focus-within:text-orange-600 transition-colors">
                      First Name*
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      placeholder="Jane"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none shadow-sm font-medium text-slate-900 placeholder:text-slate-400 group-hover:bg-white"
                    />
                  </div>
                  <div className="space-y-2 group">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 group-focus-within:text-orange-600 transition-colors">
                      Last Name*
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none shadow-sm font-medium text-slate-900 placeholder:text-slate-400 group-hover:bg-white"
                    />
                  </div>
                </div>

                {/* Work Email & Job Title */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 group">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 group-focus-within:text-orange-600 transition-colors">
                      Work Email*
                    </label>
                    <input
                      type="email"
                      name="workEmail"
                      required
                      placeholder="jane@company.com"
                      value={formData.workEmail}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none shadow-sm font-medium text-slate-900 placeholder:text-slate-400 group-hover:bg-white"
                    />
                  </div>
                  <div className="space-y-2 group">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 group-focus-within:text-orange-600 transition-colors">
                      Job Title*
                    </label>
                    <input
                      type="text"
                      name="jobTitle"
                      required
                      placeholder="Operations Manager"
                      value={formData.jobTitle}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none shadow-sm font-medium text-slate-900 placeholder:text-slate-400 group-hover:bg-white"
                    />
                  </div>
                </div>

                {/* Phone Number & Country */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 group">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 group-focus-within:text-orange-600 transition-colors">
                      Phone Number*
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none shadow-sm font-medium text-slate-900 placeholder:text-slate-400 group-hover:bg-white"
                    />
                  </div>
                  <div className="space-y-2 group">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 group-focus-within:text-orange-600 transition-colors">
                      Country*
                    </label>
                    <div className="relative">
                      <select
                        name="country"
                        required
                        value={formData.country}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none shadow-sm appearance-none font-medium text-slate-700 group-hover:bg-white"
                      >
                        <option value="">Please Select</option>
                        {countries.map((country) => (
                          <option key={country} value={country}>{country}</option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Company Name & Company Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 group">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 group-focus-within:text-orange-600 transition-colors">
                      Company Name*
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      required
                      placeholder="SolarMark"
                      value={formData.companyName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none shadow-sm font-medium text-slate-900 placeholder:text-slate-400 group-hover:bg-white"
                    />
                  </div>

                  <div className="space-y-2 group">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 group-focus-within:text-orange-600 transition-colors">
                      Company Type*
                    </label>
                    <div className="relative">
                      <select
                        name="companyType"
                        required
                        value={formData.companyType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none shadow-sm appearance-none font-medium text-slate-700 group-hover:bg-white"
                      >
                        <option value="">Please Select</option>
                        {companyTypes.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Solar Capacity & Referral Source */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 group">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 group-focus-within:text-orange-600 transition-colors">
                      Solar Capacity*
                    </label>
                    <div className="relative">
                      <select
                        name="solarCapacity"
                        required
                        value={formData.solarCapacity}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none shadow-sm appearance-none font-medium text-slate-700 group-hover:bg-white"
                      >
                        <option value="">Please Select</option>
                        {solarCapacities.map((capacity) => (
                          <option key={capacity} value={capacity}>{capacity}</option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 group">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 group-focus-within:text-orange-600 transition-colors">
                      Referral Source*
                    </label>
                    <div className="relative">
                      <select
                        name="referralSource"
                        required
                        value={formData.referralSource}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none shadow-sm appearance-none font-medium text-slate-700 group-hover:bg-white"
                      >
                        <option value="">Please Select</option>
                        {referralSources.map((source) => (
                          <option key={source} value={source}>{source}</option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-2 group">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 group-focus-within:text-orange-600 transition-colors">
                    Additional Information you want to share with us
                  </label>
                  <textarea
                    name="additionalInfo"
                    rows="4"
                    placeholder=""
                    value={formData.additionalInfo}
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none resize-none shadow-sm font-medium text-slate-900 placeholder:text-slate-400 group-hover:bg-white"
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-5 bg-orange-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-orange-200 hover:bg-orange-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="animate-spin w-6 h-6" />
                        Processing Request...
                      </>
                    ) : (
                      <>
                        Submit Inspection Request
                        <Send size={24} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      {/* <section className="py-20 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
          <Sun className="absolute -top-20 -right-20 w-80 h-80 text-orange-400" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { label: "Installations", value: "2,500+" },
              { label: "CO2 Saved", value: "15k Tons" },
              { label: "Customer Rating", value: "4.9/5" },
              { label: "Maintenance", value: "24/7" },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-4xl md:text-5xl font-extrabold text-orange-500 mb-2">{stat.value}</div>
                <div className="text-slate-400 font-medium uppercase tracking-wider text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      {!user && (
        <section className="py-24 bg-orange-600 relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-8 uppercase tracking-tight">
              Ready to switch to cleaner, cheaper energy?
            </h2>
            <p className="text-orange-100 text-xl mb-10 font-medium italic">
              Join thousands of satisfied homeowners who have already made the switch.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center px-10 py-5 bg-white text-orange-600 rounded-2xl font-bold text-lg shadow-xl hover:scale-105 active:scale-95 transition-all uppercase tracking-widest"
            >
              Start Your Journey <ArrowRight className="ml-2" />
            </Link>
          </div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 translate-y-1/3"></div>
        </section>
      )}
    </div>
  );
}