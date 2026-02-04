"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sun, Mail, Lock, User, ArrowRight, ShieldCheck, Loader2 } from "lucide-react";
import axios from "axios";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError("");
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     setLoading(true);
    //     setError("");

    //     try {
    //        const response = await api.post("/register", formData);


    //         if (response.data.access_token) {
    //             localStorage.setItem("auth_token", response.data.access_token);
    //             localStorage.setItem("refresh_token", response.data.refresh_token);
    //             localStorage.setItem("user_name", response.data.user.first_name);
    //             localStorage.setItem("user_email", formData.email);
    //             setSuccess(true);
    //             setTimeout(() => {
    //                 router.push("/profile");
    //             }, 1500);
    //         }
    //     } catch (err) {
    //         console.error("Registration error:", err);
    //         setError(err.response?.data?.detail ||
    //             err.response?.data?.error ||
    //             "Something went wrong. Please try again.");
    //     } finally {
    //         setLoading(false);
    //     }
    // };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await api.post("/register", formData);

            if (response.data.access_token) {
                localStorage.setItem("auth_token", response.data.access_token);
                localStorage.setItem("refresh_token", response.data.refresh_token);
                localStorage.setItem("user_name", response.data.user.first_name);
                localStorage.setItem("user_email", formData.email);

                setSuccess(true);
                setTimeout(() => router.push("/profile"), 1500);
            }
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 pt-20 md:pt-0">
            {/* Left Side - Visual */}
            <div className="hidden md:flex md:w-1/2 bg-orange-600 relative overflow-hidden items-center justify-center p-12">
                <div className="absolute top-0 left-0 w-full h-full opacity-10">
                    <div className="absolute -top-20 -left-20 w-[400px] h-[400px] bg-white rounded-full blur-[100px]"></div>
                </div>
                <div className="relative z-10 text-white max-w-md">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-10">
                        <ShieldCheck size={32} className="text-white" />
                    </div>
                    <h2 className="text-5xl font-bold mb-10 leading-tight tracking-tight">Start your journey to energy independence.</h2>
                    <ul className="space-y-6 mb-8">
                        {[
                            "High-precision thermal audits",
                            "AI-powered fault detection",
                            "Certified drone pilots",
                            "Actionable efficiency reports"
                        ].map((item, i) => (
                            <li key={i} className="flex items-center space-x-4 text-orange-50 font-medium text-lg">
                                <div className="w-6 h-6 rounded-lg bg-orange-400 flex items-center justify-center text-[10px] font-bold">✓</div>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex items-center justify-center p-6 md:p-20">
                <div className="w-full max-w-md">
                    <div className="text-center mb-10">
                        <Link href="/" className="inline-flex items-center space-x-2 mb-8 group">
                            <Sun className="h-10 w-10 text-orange-500 transition-transform duration-500" />
                            <span className="text-3xl font-bold tracking-tight text-slate-900">Solar<span className="text-orange-600">Mark</span></span>
                        </Link>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Create your account</h1>
                        <p className="text-slate-500 mt-2 font-medium">Join the revolution of professional solar auditing</p>
                    </div>

                    {success ? (
                        <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 p-8 rounded-3xl text-center shadow-sm">
                            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <ShieldCheck className="text-emerald-600" size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Registration Successful!</h3>
                            <p className="text-sm font-medium">Redirecting you to dashboard...</p>
                        </div>
                    ) : (
                        <form className="space-y-5" onSubmit={handleSubmit}>
                            {error && (
                                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-bold">
                                    {error}
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-800 ml-1">First Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={18} />
                                        <input
                                            required
                                            name="first_name"
                                            value={formData.first_name}
                                            onChange={handleChange}
                                            type="text"
                                            className="w-full pl-11 pr-4 py-4 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all shadow-sm font-medium"
                                            placeholder="John"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-800 ml-1">Last Name</label>
                                    <input
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        type="text"
                                        className="w-full px-4 py-4 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all shadow-sm font-medium"
                                        placeholder="Doe"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-800 ml-1">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={18} />
                                    <input
                                        required
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        type="email"
                                        className="w-full pl-11 pr-4 py-4 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all shadow-sm font-medium"
                                        placeholder="name@company.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-800 ml-1">Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={18} />
                                    <input
                                        required
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        type="password"
                                        className="w-full pl-11 pr-4 py-4 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all shadow-sm font-medium"
                                        placeholder="••••••••"
                                        minLength="6"
                                    />
                                </div>
                            </div>

                            <div className="flex items-start space-x-3 py-2">
                                <input required type="checkbox" className="mt-1 w-5 h-5 text-orange-600 border-slate-300 rounded-md focus:ring-orange-500 cursor-pointer" />
                                <span className="text-xs text-slate-500 leading-relaxed font-medium">
                                    I agree to the <Link href="#" className="underline font-bold hover:text-orange-600">Terms of Service</Link> and <Link href="#" className="underline font-bold hover:text-orange-600">Privacy Policy</Link>.
                                </span>
                            </div>

                            <button
                                disabled={loading}
                                className="w-full py-5 bg-orange-600 text-white rounded-xl font-bold shadow-xl shadow-orange-100 hover:bg-orange-700 transition-all group mt-2 flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : (
                                    <>
                                        <span>Create Account</span>
                                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    )}

                    <p className="text-center mt-12 text-slate-600 font-medium">
                        Already have an account? <Link href="/login" className="text-orange-600 font-bold hover:underline">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}