"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        message: ""
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
            const response = await fetch(`${API_URL}/contacts/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to send message');
            }

            setStatus({
                type: 'success',
                message: 'Thank you! Your message has been sent successfully. We will get back to you soon.'
            });

            setFormData({
                first_name: "",
                last_name: "",
                email: "",
                message: ""
            });

        } catch (error) {
            console.error("Error sending message:", error);
            setStatus({
                type: 'error',
                message: error.message || 'Something went wrong. Please try again later.'
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="pt-32 pb-20 bg-slate-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6"
                    >
                        Get in <span className="text-orange-600">Touch</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-slate-600 max-w-2xl mx-auto italic font-medium"
                    >
                        Have questions about our inspection technology or need a drone survey consultation? Our team is here to help you audit your solar infrastructure.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="lg:col-span-1 space-y-8"
                    >
                        {[
                            {
                                icon: <Mail className="text-orange-500" />,
                                title: "Email Us",
                                detail: "info@solarinspection.com",
                                sub: "Response within 24 hours"
                            },
                            {
                                icon: <Phone className="text-orange-500" />,
                                title: "Call Us",
                                detail: "9978564578",
                                sub: "Mon-Fri, 9am - 6pm EST"
                            },
                            {
                                icon: <MapPin className="text-orange-500" />,
                                title: "Our Office",
                                detail: "123 Solar Way, Energy District",
                                sub: "Clean City, CA 90210"
                            }
                        ].map((item, i) => (
                            <div key={i} className="flex items-start space-x-5 p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300">
                                <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
                                    {item.icon}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
                                    <p className="text-slate-800 font-medium">{item.detail}</p>
                                    <p className="text-slate-500 text-sm">{item.sub}</p>
                                </div>
                            </div>
                        ))}
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="lg:col-span-2"
                    >
                        <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {status.message && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className={`p-4 rounded-xl flex items-center gap-3 ${status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                                            }`}
                                    >
                                        {status.type === 'success' ? <CheckCircle className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
                                        <p className="text-sm font-medium">{status.message}</p>
                                    </motion.div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">First Name</label>
                                        <input
                                            type="text"
                                            name="first_name"
                                            required
                                            value={formData.first_name}
                                            onChange={handleChange}
                                            className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-slate-50/30"
                                            placeholder="Jane"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Last Name</label>
                                        <input
                                            type="text"
                                            name="last_name"
                                            required
                                            value={formData.last_name}
                                            onChange={handleChange}
                                            className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-slate-50/30"
                                            placeholder="Doe"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-slate-50/30"
                                        placeholder="jane@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
                                    <textarea
                                        name="message"
                                        required
                                        rows="4"
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none bg-slate-50/30"
                                        placeholder="How can we help you?"
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-4 bg-orange-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-orange-200 hover:bg-orange-700 hover:-translate-y-1 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 disabled:opacity-70 disabled:hover:translate-y-0"
                                >
                                    {submitting ? (
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                    ) : (
                                        <>
                                            <span>Send Message</span>
                                            <Send size={20} />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}