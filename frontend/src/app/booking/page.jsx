"use client";

import React, { useState } from "react";
import { Send, Loader2, Star } from "lucide-react";
import { motion } from "framer-motion";

export default function BookingPage() {
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

    const [submitting, setSubmitting] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
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

            const data = await response.json();
            console.log("Booking successful:", data);

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

    return (
        <div className="pt-24 pb-24 bg-white min-h-screen">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="text-center mb-16 pt-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-100 rounded-lg text-xs font-bold text-orange-700 mb-6 uppercase tracking-widest"
                    >
                        <Star size={14} className="fill-orange-600 text-orange-600" />
                        Professional Industry Rating
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-bold text-slate-900 mb-8 tracking-tight"
                    >
                        Book Your <span className="text-orange-600">Inspection</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-6 font-medium"
                    >
                        Our solar inspection solutions empower Asset Owners and O&M teams throughout the full lifecycle of their solar installations.
                    </motion.p>
                </div>

                {/* Form Section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="max-w-3xl mx-auto"
                >
                    <div className="bg-slate-50 rounded-[2.5rem] p-8 md:p-16 border border-slate-200 shadow-2xl shadow-slate-200/40">
                        <p className="text-slate-500 mb-12 text-center font-bold uppercase tracking-widest text-xs">
                            Please complete the form below
                        </p>

                        {status.message && (
                            <div className={`mb-10 p-6 rounded-xl text-center shadow-sm ${status.type === 'success'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                : 'bg-red-50 text-red-700 border border-red-100'
                                }`}>
                                <p className="font-bold text-sm tracking-tight">{status.message}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-10">
                            {/* First Name & Last Name */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-slate-800 ml-1">
                                        First Name*
                                    </label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        required
                                        placeholder="Jane"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="w-full px-6 py-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none shadow-sm font-medium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-slate-800 ml-1">
                                        Last Name*
                                    </label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        required
                                        placeholder="Doe"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="w-full px-6 py-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none shadow-sm font-medium"
                                    />
                                </div>
                            </div>

                            {/* Work Email & Job Title */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-slate-800 ml-1">
                                        Work Email*
                                    </label>
                                    <input
                                        type="email"
                                        name="workEmail"
                                        required
                                        placeholder="jane@company.com"
                                        value={formData.workEmail}
                                        onChange={handleChange}
                                        className="w-full px-6 py-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none shadow-sm font-medium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-slate-800 ml-1">
                                        Job Title*
                                    </label>
                                    <input
                                        type="text"
                                        name="jobTitle"
                                        required
                                        placeholder="Operations Manager"
                                        value={formData.jobTitle}
                                        onChange={handleChange}
                                        className="w-full px-6 py-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none shadow-sm font-medium"
                                    />
                                </div>
                            </div>

                            {/* Phone Number & Country */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-slate-800 ml-1">
                                        Phone Number*
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        placeholder="+1 (555) 000-0000"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full px-6 py-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none shadow-sm font-medium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-slate-800 ml-1">
                                        Country*
                                    </label>
                                    <div className="relative">
                                        <select
                                            name="country"
                                            required
                                            value={formData.country}
                                            onChange={handleChange}
                                            className="w-full px-6 py-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none shadow-sm appearance-none font-medium text-slate-700"
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

                            {/* Company Name */}
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-800 ml-1">
                                    Company Name*
                                </label>
                                <input
                                    type="text"
                                    name="companyName"
                                    required
                                    placeholder="SolarMark Industries"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    className="w-full px-6 py-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none shadow-sm font-medium"
                                />
                            </div>

                            {/* Company Type */}
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-800 ml-1">
                                    Which of the following best describes your company?*
                                </label>
                                <div className="relative">
                                    <select
                                        name="companyType"
                                        required
                                        value={formData.companyType}
                                        onChange={handleChange}
                                        className="w-full px-6 py-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none shadow-sm appearance-none font-medium text-slate-700"
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

                            {/* Solar Capacity */}
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-800 ml-1">
                                    How much solar do you have today and/or in your pipeline?*
                                </label>
                                <div className="relative">
                                    <select
                                        name="solarCapacity"
                                        required
                                        value={formData.solarCapacity}
                                        onChange={handleChange}
                                        className="w-full px-6 py-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none shadow-sm appearance-none font-medium text-slate-700"
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

                            {/* Referral Source */}
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-800 ml-1">
                                    Where did you last hear about us?*
                                </label>
                                <div className="relative">
                                    <select
                                        name="referralSource"
                                        required
                                        value={formData.referralSource}
                                        onChange={handleChange}
                                        className="w-full px-6 py-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none shadow-sm appearance-none font-medium text-slate-700"
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

                            {/* Additional Information */}
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-800 ml-1">
                                    Additional information you want to share with us
                                </label>
                                <textarea
                                    name="additionalInfo"
                                    rows="5"
                                    placeholder="Tell us about your specific requirements..."
                                    value={formData.additionalInfo}
                                    onChange={handleChange}
                                    className="w-full px-6 py-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none resize-none shadow-sm font-medium"
                                ></textarea>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-5 bg-orange-600 text-white rounded-xl font-bold text-xl shadow-2xl shadow-orange-900/10 hover:bg-orange-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="animate-spin w-6 h-6" />
                                        Submitting Request...
                                    </>
                                ) : (
                                    <>
                                        Submit Request
                                        <Send size={24} />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Privacy Note */}
                        <p className="text-xs text-slate-400 text-center mt-12 font-medium">
                            By submitting this form, you agree to our{" "}
                            <a href="/privacy" className="text-orange-600 hover:underline font-bold">Privacy Policy</a>
                            {" "}and{" "}
                            <a href="/terms" className="text-orange-600 hover:underline font-bold">Terms of Service</a>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}