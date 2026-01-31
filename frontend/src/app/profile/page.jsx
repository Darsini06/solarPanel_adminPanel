'use client';

import React, { useState, useEffect } from "react";
import {
    User, Mail, HardDrive, Calendar,
    Download, ExternalLink, FileText,
    Eye, File, Loader2, AlertCircle,
    RefreshCw, Home, Folder, CheckCircle,
    Link as LinkIcon,
    AlertTriangle, Clock, ClipboardList,
    CheckCircle2, XCircle, MapPin, Phone,
    ShieldCheck, Trash2, Lock, CreditCard,
    X, GitCompare, ArrowUpDown, BarChart3, CheckSquare, Square
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { authAPI } from "@/lib/api";

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [bookings, setBookings] = useState([]);

    // Data States
    const [pdfs, setPdfs] = useState([]);
    const [stats, setStats] = useState({
        total_pdfs: 0,
        total_bookings: 0,
        total_size: 0
    });
    const [downloadingPdf, setDownloadingPdf] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedPdf, setSelectedPdf] = useState(null);

    // Comparison States
    const [selectedReports, setSelectedReports] = useState([]);
    const [showComparisonModal, setShowComparisonModal] = useState(false);
    const [comparisonResult, setComparisonResult] = useState(null);
    const [comparingReports, setComparingReports] = useState(false);
    const [sortBy, setSortBy] = useState('uploaded_at');
    const [sortOrder, setSortOrder] = useState('desc');

    // SIMPLEST FIX: Just use getMyPDFs
    const fetchProfileData = async () => {
        try {
            setError("");

            // Check authentication
            if (!authAPI.isAuthenticated()) {
                router.push("/login");
                return;
            }

            // Get user info from storage
            const userInfo = authAPI.getCurrentUser();
            setUser(userInfo);

            // Fetch data in parallel
            try {
                // Get Bookings instead of links
                const bookingsResponse = await authAPI.getMyBookings();
                const bookingsData = bookingsResponse.data || [];
                setBookings(bookingsData);

                // Get PDFs
                const pdfsData = await authAPI.getAllMyPDFs();
                setPdfs(pdfsData);

                // Calculate statistics
                const totalSize = pdfsData.reduce((sum, pdf) => sum + (pdf.file_size || 0), 0);
                setStats({
                    total_pdfs: pdfsData.length,
                    total_bookings: bookingsData.length,
                    total_size: Math.round(totalSize / (1024 * 1024) * 100) / 100
                });

            } catch (err) {
                console.error("Error fetching data:", err);
                setError(err.message || "Failed to load data");
                if (err.response?.status === 401) {
                    handleLogout();
                    return;
                }
            }

        } catch (err) {
            console.error("Error fetching profile data:", err);
            setError(err.message || "Failed to load profile data");
        } finally {
            setLoading(false);
        }
    };



    // Trigger payment flow for download
    const handleDownloadClick = (pdf) => {
        setSelectedPdf(pdf);
        setShowPaymentModal(true);
    };

    // Actual download after "payment"
    const processDownload = async () => {
        if (!selectedPdf) return;

        const pdf = selectedPdf;
        setShowPaymentModal(false);

        try {
            setDownloadingPdf(pdf.pdf_id);
            setError("");

            const response = await authAPI.downloadPDF(pdf.pdf_id);

            // Create blob from response
            const blob = new Blob([response.data], { type: 'application/pdf' });

            // Create download link
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = pdf.filename || 'document.pdf';
            document.body.appendChild(a);
            a.click();

            // Cleanup
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

        } catch (err) {
            console.error('Error downloading PDF:', err);
            if (err.response?.status === 401) {
                handleLogout();
            } else {
                setError(err.message || "Failed to download PDF");
            }
        } finally {
            setDownloadingPdf(null);
        }
    };

    const handleLogout = () => {
        authAPI.clearAuthData();
        router.push('/login');
    };

    const handleDeleteBooking = async (bookingId) => {
        if (!window.confirm("Are you sure you want to delete this booking? It will be removed from your list and the admin records.")) {
            return;
        }

        try {
            setLoading(true);
            await authAPI.deleteBooking(bookingId);
            // Re-fetch data to update UI
            await fetchProfileData();
        } catch (err) {
            console.error("Error deleting booking:", err);
            setError(err.response?.data?.detail || err.message || "Failed to delete booking");
            setLoading(false);
        }
    };

    // Comparison Handlers
    const toggleReportSelection = (pdfId) => {
        setSelectedReports(prev => {
            if (prev.includes(pdfId)) {
                return prev.filter(id => id !== pdfId);
            } else {
                return [...prev, pdfId];
            }
        });
    };

    const handleCompareReports = async () => {
        if (selectedReports.length < 2) {
            setError("Please select at least 2 reports to compare");
            return;
        }

        try {
            setComparingReports(true);
            setError("");

            const result = await authAPI.compareReports(selectedReports, sortBy, sortOrder);
            setComparisonResult(result);
            setShowComparisonModal(true);
        } catch (err) {
            console.error("Error comparing reports:", err);
            setError(err.response?.data?.detail || "Failed to compare reports");
        } finally {
            setComparingReports(false);
        }
    };

    const clearComparison = () => {
        setSelectedReports([]);
        setComparisonResult(null);
        setShowComparisonModal(false);
    };

    const handleDownloadComparisonReport = async () => {
        if (selectedReports.length < 2) {
            setError("Please select at least 2 reports to download comparison");
            return;
        }

        try {
            setComparingReports(true);
            setError("");

            const blob = await authAPI.downloadComparisonReport(selectedReports, sortBy, sortOrder);

            // Create download link
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
            a.download = `report_comparison_${selectedReports.length}_reports_${timestamp}.pdf`;
            document.body.appendChild(a);
            a.click();

            // Cleanup
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

        } catch (err) {
            console.error("Error downloading comparison report:", err);
            setError(err.response?.data?.detail || "Failed to download comparison report");
        } finally {
            setComparingReports(false);
        }
    };

    useEffect(() => {
        fetchProfileData();
    }, [router]);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatFileSize = (bytes) => {
        if (!bytes) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getUserInitials = (userName) => {
        if (!userName || userName === 'Anonymous User') return 'AU';
        const names = userName.split(' ');
        if (names.length >= 2) {
            return `${names[0][0]}${names[1][0]}`.toUpperCase();
        }
        return userName[0]?.toUpperCase() || 'U';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                        </div>
                    </div>
                    <span className="mt-6 text-gray-600 font-medium">Loading your profile...</span>
                    <p className="text-gray-500 text-sm mt-2">Please wait while we fetch your data</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 pt-24 pb-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Error Banner */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between"
                    >
                        <div className="flex items-center">
                            <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
                            <span className="text-red-700 font-medium">{error}</span>
                        </div>
                        <button
                            onClick={() => setError("")}
                            className="text-red-500 hover:text-red-700"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </motion.div>
                )}

                {/* Header with Actions */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900">My Profile</h1>
                        <p className="text-slate-600 mt-2">Manage your bookings and inspection reports</p>
                    </div>
                </div>

                {/* Profile Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 mb-8"
                >
                    <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                        <div className="w-24 h-24 md:w-28 md:h-28 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white shadow-xl">
                            <span className="text-3xl font-bold">{getUserInitials(user?.name || 'User')}</span>
                        </div>

                        <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900">{user?.name || 'User'}</h2>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <Mail size={16} />
                                        <span>{user?.email || "No email provided"}</span>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                <FileText className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-blue-700">{stats.total_pdfs}</div>
                                <div className="text-sm font-medium text-blue-600">Reports</div>
                                <div className="text-xs text-blue-500 mt-1">{stats.total_size} MB total</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                <ClipboardList className="w-6 h-6 text-orange-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-orange-700">{stats.total_bookings}</div>
                                <div className="text-sm font-medium text-orange-600">Total Bookings</div>
                                <div className="text-xs text-orange-500 mt-1">{bookings.filter(b => b.status === 'pending').length} pending</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                <ShieldCheck className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-green-700">{bookings.filter(b => b.status === 'completed' || b.status === 'confirmed').length}</div>
                                <div className="text-sm font-medium text-green-600">Approved Actions</div>
                                <div className="text-xs text-green-500 mt-1">Reflecting admin responses</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Booking Status */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-24">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg">
                                    <Clock size={20} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">Booking Status</h3>
                                    <p className="text-slate-500 text-sm">Real-time admin actions</p>
                                </div>
                            </div>

                            {bookings.length > 0 ? (
                                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                    {bookings.map((booking) => (
                                        <div key={booking.id} className="p-5 rounded-xl bg-slate-50 border border-slate-200 hover:border-orange-300 transition-all group">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-2">
                                                    {booking.status === 'pending' && (
                                                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center">
                                                            <Clock size={10} className="mr-1" />
                                                            Pending
                                                        </span>
                                                    )}
                                                    {booking.status === 'confirmed' && (
                                                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center">
                                                            <CheckCircle2 size={10} className="mr-1" />
                                                            Confirmed
                                                        </span>
                                                    )}
                                                    {booking.status === 'completed' && (
                                                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center">
                                                            <CheckCircle2 size={10} className="mr-1" />
                                                            Completed
                                                        </span>
                                                    )}
                                                    {booking.status === 'cancelled' && (
                                                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center">
                                                            <XCircle size={10} className="mr-1" />
                                                            Cancelled
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-medium text-slate-400">
                                                        #{booking.id?.slice(-6).toUpperCase()}
                                                    </span>
                                                    <button
                                                        onClick={() => handleDeleteBooking(booking.id)}
                                                        className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                                        title="Delete Booking"
                                                    >
                                                        <Trash2 size={12} />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <h4 className="font-bold text-slate-900 text-sm leading-tight">
                                                    {booking.service_type}
                                                </h4>

                                                <div className="flex items-center gap-2 text-xs text-slate-600">
                                                    <Calendar size={14} className="text-slate-400" />
                                                    <span>{booking.date} at {booking.time}</span>
                                                </div>

                                                {booking.location && (
                                                    <div className="flex items-center gap-2 text-xs text-slate-600">
                                                        <MapPin size={14} className="text-slate-400" />
                                                        <span className="truncate">{booking.location}</span>
                                                    </div>
                                                )}

                                                {booking.contact_phone && (
                                                    <div className="flex items-center gap-2 text-xs text-slate-600">
                                                        <Phone size={14} className="text-slate-400" />
                                                        <span>{booking.contact_phone}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="mt-4 pt-4 border-t border-slate-200">
                                                <div className="text-[10px] text-slate-500 flex justify-between items-center">
                                                    <span>Booked on {new Date(booking.created_at).toLocaleDateString()}</span>
                                                    <motion.div
                                                        animate={booking.status === 'pending' ? { scale: [1, 1.1, 1] } : {}}
                                                        transition={{ repeat: Infinity, duration: 2 }}
                                                        className={`w-2 h-2 rounded-full ${booking.status === 'pending' ? 'bg-yellow-400' :
                                                            booking.status === 'completed' ? 'bg-green-500' :
                                                                booking.status === 'cancelled' ? 'bg-red-500' : 'bg-blue-500'
                                                            }`}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                        <ClipboardList size={24} className="text-slate-400" />
                                    </div>
                                    <p className="text-slate-500 font-medium">No bookings found</p>
                                    <p className="text-slate-400 text-sm mt-1">Book a service to see status</p>
                                    <button
                                        onClick={() => router.push('/booking')}
                                        className="mt-4 px-4 py-2 text-sm bg-orange-50 text-orange-600 hover:bg-orange-100 rounded-lg transition-colors font-medium border border-orange-200"
                                    >
                                        Book Now
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: PDF Files */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <div className="flex flex-col gap-4 mb-8">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg">
                                            <FileText size={20} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900">Reports</h3>
                                            <p className="text-slate-500 text-sm">All your generated inspection reports</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-slate-500">
                                            <span className="font-medium">{pdfs.length}</span> Reports
                                        </span>
                                        {stats.total_size > 0 && (
                                            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                                                {stats.total_size} MB total
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Comparison Controls */}
                                {pdfs.length > 1 && (
                                    <div className="flex flex-wrap items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                                        <div className="flex items-center gap-2">
                                            <GitCompare className="w-5 h-5 text-blue-600" />
                                            <span className="text-sm font-semibold text-blue-900">Compare Reports</span>
                                        </div>

                                        {selectedReports.length > 0 && (
                                            <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
                                                {selectedReports.length} Selected
                                            </span>
                                        )}

                                        <div className="flex items-center gap-2 ml-auto">
                                            <select
                                                value={sortBy}
                                                onChange={(e) => setSortBy(e.target.value)}
                                                className="text-xs px-3 py-1.5 border border-blue-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="uploaded_at">Sort by Date</option>
                                                <option value="filename">Sort by Name</option>
                                                <option value="file_size">Sort by Size</option>
                                            </select>

                                            <button
                                                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                                                className="p-1.5 border border-blue-200 rounded-lg bg-white hover:bg-blue-50 transition-colors"
                                                title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                                            >
                                                <ArrowUpDown className="w-4 h-4 text-blue-600" />
                                            </button>

                                            {selectedReports.length > 0 && (
                                                <button
                                                    onClick={clearComparison}
                                                    className="px-3 py-1.5 text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors"
                                                >
                                                    Clear
                                                </button>
                                            )}

                                            <button
                                                onClick={handleCompareReports}
                                                disabled={selectedReports.length < 2 || comparingReports}
                                                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${selectedReports.length >= 2
                                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md'
                                                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                                    }`}
                                            >
                                                {comparingReports ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                        Comparing...
                                                    </>
                                                ) : (
                                                    <>
                                                        <BarChart3 className="w-4 h-4" />
                                                        Compare ({selectedReports.length >= 2 ? selectedReports.length : 'Select 2+'})
                                                    </>
                                                )}
                                            </button>

                                            <button
                                                onClick={handleDownloadComparisonReport}
                                                disabled={selectedReports.length < 2 || comparingReports}
                                                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${selectedReports.length >= 2
                                                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-md'
                                                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                                    }`}
                                                title="Download merged comparison report as PDF"
                                            >
                                                {comparingReports ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                        Generating...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Download className="w-4 h-4" />
                                                        Download PDF
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {pdfs.length > 0 ? (
                                <div className="space-y-4">
                                    {pdfs.map((pdf) => {
                                        const isSelected = selectedReports.includes(pdf.pdf_id);
                                        return (
                                            <div key={pdf.pdf_id} className={`group flex items-center justify-between p-4 rounded-lg border transition-all ${isSelected
                                                ? 'border-blue-500 bg-blue-50/50 shadow-md'
                                                : 'border-slate-200 hover:border-orange-300 hover:bg-orange-50/20'
                                                }`}>
                                                {/* Selection Checkbox */}
                                                <button
                                                    onClick={() => toggleReportSelection(pdf.pdf_id)}
                                                    className="flex-shrink-0 mr-3 p-1 hover:bg-slate-100 rounded transition-colors"
                                                    title={isSelected ? "Deselect for comparison" : "Select for comparison"}
                                                >
                                                    {isSelected ? (
                                                        <CheckSquare className="w-5 h-5 text-blue-600" />
                                                    ) : (
                                                        <Square className="w-5 h-5 text-slate-400 group-hover:text-blue-400" />
                                                    )}
                                                </button>

                                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                                    <div className="relative">
                                                        <div className="w-10 h-12 bg-red-100 rounded flex items-center justify-center">
                                                            <FileText size={20} className="text-red-600" />
                                                        </div>
                                                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                                                            <span className="text-[10px] text-white font-bold">PDF</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h4 className="font-semibold text-slate-900 truncate">
                                                                {pdf.filename || pdf.pdf_filename || "Unnamed PDF"}
                                                            </h4>
                                                        </div>

                                                        <div className="flex flex-wrap items-center gap-2 mt-2">
                                                            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded flex items-center">
                                                                <Calendar size={10} className="mr-1" />
                                                                {formatDate(pdf.uploaded_at)}
                                                            </span>
                                                            <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                                                                {formatFileSize(pdf.file_size || 0)}
                                                            </span>
                                                            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded flex items-center">
                                                                <User size={10} className="mr-1" />
                                                                {pdf.uploaded_by?.user_name || 'You'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 ml-4">
                                                    <button
                                                        onClick={() => handleDownloadClick(pdf)}
                                                        className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 rounded-lg transition-colors group/btn flex items-center gap-2 text-xs font-bold shadow-md shadow-orange-100"
                                                        title="Pay to Download"
                                                    >
                                                        <Lock size={12} />
                                                        Access Report
                                                        <Download size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="w-20 h-20 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-6">
                                        <FileText size={32} className="text-slate-400" />
                                    </div>
                                    <h4 className="text-lg font-semibold text-slate-900 mb-2">No Reports Yet</h4>
                                    <p className="text-slate-600 mb-6 max-w-md mx-auto">
                                        You don't have any inspection reports yet.
                                    </p>
                                    <button
                                        onClick={() => router.push('/')}
                                        className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-medium shadow-sm"
                                    >
                                        Go to Home
                                    </button>
                                </div>
                            )}

                            {/* Summary Footer */}
                            {pdfs.length > 0 && (
                                <div className="mt-8 pt-6 border-t border-slate-200">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="text-sm text-slate-600">
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center">
                                                    <FileText size={14} className="mr-2 text-slate-400" />
                                                    <span>{pdfs.length} Reports</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <HardDrive size={14} className="mr-2 text-slate-400" />
                                                    <span>{stats.total_size} MB total</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Data Summary */}
                {(bookings.length > 0 || pdfs.length > 0) && (
                    <div className="mt-8 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h4 className="text-lg font-semibold text-slate-900 mb-4">Account Summary</h4>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="p-4 bg-blue-50 rounded-lg">
                                <div className="text-sm font-medium text-blue-600">Total Reports</div>
                                <div className="text-2xl font-bold text-blue-700">{pdfs.length}</div>
                                <div className="text-xs text-blue-500 mt-1">
                                    {stats.total_size} MB total storage
                                </div>
                            </div>
                            <div className="p-4 bg-green-50 rounded-lg">
                                <div className="text-sm font-medium text-green-600">Active Bookings</div>
                                <div className="text-2xl font-bold text-green-700">{bookings.filter(b => b.status === 'pending' || b.status === 'confirmed').length}</div>
                                <div className="text-xs text-green-500 mt-1">
                                    Updating in real-time
                                </div>
                            </div>
                            <div className="p-4 bg-orange-50 rounded-lg">
                                <div className="text-sm font-medium text-orange-600">Completed Actions</div>
                                <div className="text-2xl font-bold text-orange-700">
                                    {bookings.filter(b => b.status === 'completed').length}
                                </div>
                                <div className="text-xs text-orange-500 mt-1">Total history</div>
                            </div>
                            <div className="p-4 bg-purple-50 rounded-lg">
                                <div className="text-sm font-medium text-purple-600">Member Since</div>
                                <div className="text-2xl font-bold text-purple-700">
                                    {user?.created_at ? new Date(user.created_at).getFullYear() : '2025'}
                                </div>
                                <div className="text-xs text-purple-500 mt-1">
                                    Premium User
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Payment Modal */}
            {showPaymentModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        onClick={() => setShowPaymentModal(false)}
                    />
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
                    >
                        <div className="p-1 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-600" />

                        <div className="p-8 text-center">
                            <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CreditCard size={40} />
                            </div>

                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Premium Report Download</h3>
                            <p className="text-slate-600 mb-6">
                                This inspection report is a premium document. Please complete the one-time payment to download the high-resolution PDF.
                            </p>

                            <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100">
                                <div className="text-sm font-medium text-slate-500 mb-1">Total to Pay</div>
                                <div className="text-4xl font-black text-slate-900">$10.00</div>
                                <div className="text-xs text-slate-400 mt-2">Includes lifetime access to this report</div>
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={processDownload}
                                    className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-orange-200 transition-all flex items-center justify-center gap-2"
                                >
                                    <ShieldCheck size={20} />
                                    Pay & Download Now
                                </button>

                                <button
                                    onClick={() => setShowPaymentModal(false)}
                                    className="w-full py-3 bg-white text-slate-500 hover:text-slate-700 font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>

                        <div className="bg-slate-50 p-4 flex items-center justify-center gap-6 border-t border-slate-100">
                            <div className="flex items-center gap-1 grayscale opacity-50 text-[10px] font-bold text-slate-400">
                                VISA
                            </div>
                            <div className="flex items-center gap-1 grayscale opacity-50 text-[10px] font-bold text-slate-400">
                                MASTERCARD
                            </div>
                            <div className="flex items-center gap-1 grayscale opacity-50 text-[10px] font-bold text-slate-400">
                                PAYPAL
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Comparison Modal */}
            {showComparisonModal && comparisonResult && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"
                        onClick={clearComparison}
                    />
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden my-8"
                    >
                        {/* Header */}
                        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 z-10">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/20 rounded-lg">
                                        <GitCompare className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold">Report Comparison</h2>
                                        <p className="text-blue-100 text-sm mt-1">
                                            {comparisonResult.algorithm_used} • {comparisonResult.total_reports} Reports Analyzed
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={clearComparison}
                                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                            {/* Summary Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                                    <div className="text-xs font-medium text-blue-600 mb-1">Total Reports</div>
                                    <div className="text-2xl font-bold text-blue-700">
                                        {comparisonResult.comparison_summary.total_reports}
                                    </div>
                                </div>
                                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                                    <div className="text-xs font-medium text-purple-600 mb-1">Total Size</div>
                                    <div className="text-2xl font-bold text-purple-700">
                                        {comparisonResult.comparison_summary.total_size_mb} MB
                                    </div>
                                </div>
                                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                                    <div className="text-xs font-medium text-green-600 mb-1">Average Size</div>
                                    <div className="text-2xl font-bold text-green-700">
                                        {formatFileSize(comparisonResult.comparison_summary.average_size_bytes)}
                                    </div>
                                </div>
                                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
                                    <div className="text-xs font-medium text-orange-600 mb-1">Uploaders</div>
                                    <div className="text-2xl font-bold text-orange-700">
                                        {comparisonResult.comparison_summary.unique_uploaders}
                                    </div>
                                </div>
                            </div>

                            {/* Size Comparison */}
                            <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-200">
                                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                                    <BarChart3 className="w-4 h-4" />
                                    Size Analysis
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-xs text-slate-600 mb-1">Smallest Report</div>
                                        <div className="text-sm font-semibold text-slate-900">
                                            {comparisonResult.comparison_summary.smallest_report.filename}
                                        </div>
                                        <div className="text-xs text-green-600">
                                            {formatFileSize(comparisonResult.comparison_summary.smallest_report.size)}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-slate-600 mb-1">Largest Report</div>
                                        <div className="text-sm font-semibold text-slate-900">
                                            {comparisonResult.comparison_summary.largest_report.filename}
                                        </div>
                                        <div className="text-xs text-red-600">
                                            {formatFileSize(comparisonResult.comparison_summary.largest_report.size)}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sorted Reports List */}
                            <div className="mb-4">
                                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    Sorted Reports (by {comparisonResult.sorted_by})
                                </h3>
                                <div className="space-y-2">
                                    {comparisonResult.reports.map((report, index) => (
                                        <div
                                            key={report.pdf_id}
                                            className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 hover:border-blue-300 transition-colors"
                                        >
                                            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-bold">
                                                {index + 1}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-semibold text-slate-900 truncate">
                                                    {report.filename}
                                                </div>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-xs text-slate-500">
                                                        {formatFileSize(report.file_size)}
                                                    </span>
                                                    <span className="text-xs text-slate-400">•</span>
                                                    <span className="text-xs text-slate-500">
                                                        {formatDate(report.uploaded_at)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between">
                            <div className="text-xs text-slate-600">
                                <span className="font-semibold">Algorithm:</span> {comparisonResult.algorithm_used}
                            </div>
                            <button
                                onClick={clearComparison}
                                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-semibold transition-all shadow-md"
                            >
                                Close
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}