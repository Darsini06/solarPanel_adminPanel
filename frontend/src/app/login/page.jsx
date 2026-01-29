"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sun, Mail, Lock, ArrowRight, Github, Loader2, CheckCircle2 } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await axios.post(
                "http://localhost:8000/api/login",
                formData,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.access_token) {
                localStorage.setItem("auth_token", response.data.access_token);
                localStorage.setItem("refresh_token", response.data.refresh_token);
                localStorage.setItem("user_name", response.data.user.first_name);
                localStorage.setItem("user_email", formData.email);
                setLoggedIn(true);
                setTimeout(() => {
                    router.push("/profile");
                }, 1500);
            }
        } catch (err) {
            console.error("Login error:", err);
            setError(err.response?.data?.detail || "Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 pt-20 md:pt-0">
            {/* Left Side - Visual */}
            <div className="hidden md:flex md:w-1/2 bg-orange-600 relative overflow-hidden items-center justify-center p-12">
                <div className="absolute top-0 left-0 w-full h-full opacity-10">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border-[60px] border-white rounded-full"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border-[40px] border-white rounded-full"></div>
                </div>
                <div className="relative z-10 text-white max-w-md">
                    <h2 className="text-4xl font-extrabold mb-6 leading-tight">Welcome back to the future of auditing.</h2>
                    <p className="text-orange-100 text-lg mb-8 italic">Access your dashboard to monitor your solar assets and track your inspection reports in real-time.</p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex items-center justify-center p-6 md:p-20">
                <div className="w-full max-w-md">
                    <div className="text-center mb-10">
                        <Link href="/" className="inline-flex items-center space-x-2 mb-8 group">
                            <Sun className="h-10 w-10 text-orange-500 group-hover:rotate-45 transition-transform duration-500" />
                            <span className="text-3xl font-bold">Solar<span className="text-orange-600"> Inspection</span></span>
                        </Link>
                        <h1 className="text-2xl font-bold text-slate-900">Sign in to your account</h1>
                        <p className="text-slate-500 mt-2">Professional solar management at your fingertips</p>
                    </div>

                    {loggedIn ? (
                        <div className="bg-orange-50 border border-orange-200 text-orange-700 p-8 rounded-[2rem] text-center">
                            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                                <CheckCircle2 className="text-orange-600" size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Welcome Back!</h3>
                            <p className="text-sm">Signing you in...</p>
                        </div>
                    ) : (
                        <form className="space-y-5" onSubmit={handleSubmit}>
                            {error && (
                                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={20} />
                                    <input
                                        required
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        type="email"
                                        className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all shadow-sm"
                                        placeholder="name@company.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-sm font-semibold text-slate-700">Password</label>
                                    <Link href="#" className="text-xs font-bold text-orange-600 hover:text-orange-700">Forgot your password?</Link>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={20} />
                                    <input
                                        required
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        type="password"
                                        className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all shadow-sm"
                                        placeholder="••••••••"
                                        minLength="6"
                                    />
                                </div>
                            </div>

                            <button
                                disabled={loading}
                                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center space-x-2 mt-4 group"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : (
                                    <>
                                        <span>Continue</span>
                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>

                            <div className="relative py-4 flex items-center">
                                <div className="flex-grow border-t border-slate-200"></div>
                                <span className="flex-shrink mx-4 text-slate-400 text-xs font-bold uppercase tracking-widest">Or login with</span>
                                <div className="flex-grow border-t border-slate-200"></div>
                            </div>

                            <div className="flex space-x-4">
                                <button type="button" className="flex-1 py-3 px-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center space-x-2">
                                    <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
                                    <span className="text-sm font-semibold text-slate-700">Google</span>
                                </button>
                                <button type="button" className="flex-1 py-3 px-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center space-x-2">
                                    <Github size={18} className="text-slate-900" />
                                    <span className="text-sm font-semibold text-slate-700">GitHub</span>
                                </button>
                            </div>
                        </form>
                    )}

                    <p className="text-center mt-10 text-slate-600">
                        Don't have an account? <Link href="/register" className="text-orange-600 font-bold hover:underline">Sign up for free</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}