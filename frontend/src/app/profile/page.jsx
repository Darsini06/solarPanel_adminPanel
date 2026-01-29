'use client';

import React, { useState, useEffect } from "react";
import {
    User, Mail, HardDrive, Calendar,
    Download, ExternalLink, FileText,
    Eye, File, Loader2, AlertCircle,
    RefreshCw, Home, Folder, CheckCircle,
    Link as LinkIcon,
    AlertTriangle
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { authAPI } from "@/lib/api";

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [refreshing, setRefreshing] = useState(false);
    const [debugInfo, setDebugInfo] = useState("");

    // Data States
    const [pdfs, setPdfs] = useState([]);
    const [links, setLinks] = useState([]);
    const [combinedData, setCombinedData] = useState([]);
    const [stats, setStats] = useState({ 
        total_pdfs: 0, 
        total_links: 0,
        total_size: 0 
    });
    const [downloadingPdf, setDownloadingPdf] = useState(null);

 // SIMPLEST FIX: Just use getMyPDFs
const fetchProfileData = async () => {
    try {
        setError("");
        setDebugInfo("Starting to fetch profile data...");
        
        // Check authentication
        if (!authAPI.isAuthenticated()) {
            setDebugInfo("Not authenticated, redirecting to login");
            router.push("/login");
            return;
        }

        // Get user info from storage
        const userInfo = authAPI.getCurrentUser();
        setUser(userInfo);
        setDebugInfo(`User info loaded: ${userInfo.name}`);

        // Fetch data in parallel
        setDebugInfo("Fetching links and PDFs...");
        
        try {
            // Get links
            const linksResponse = await authAPI.getMyLinks();
            const linksData = linksResponse.data || [];
            setLinks(linksData);
            setDebugInfo(prev => prev + `\nLinks fetched: ${linksData.length}`);
            console.log("Links data:", linksData);
            
            // Get PDFs
            const pdfsResponse = await authAPI.getMyPDFs(); // Use existing function
            const pdfsData = pdfsResponse.data || [];
            setPdfs(pdfsData);
            setDebugInfo(prev => prev + `\nPDFs fetched: ${pdfsData.length}`);
            console.log("PDFs data:", pdfsData);
            
            // Calculate statistics
            const totalSize = pdfsData.reduce((sum, pdf) => sum + (pdf.file_size || 0), 0);
            setStats({
                total_pdfs: pdfsData.length,
                total_links: linksData.length,
                total_size: Math.round(totalSize / (1024 * 1024) * 100) / 100
            });
            
            // Combine links with PDFs for display
            const combined = linksData.map(link => ({
                ...link,
                pdfs: pdfsData.filter(pdf => pdf.link_id === link.id)
            }));
            setCombinedData(combined);
            setDebugInfo(prev => prev + `\nCombined data: ${combined.length} items`);
            
        } catch (err) {
            console.error("Error fetching data:", err);
            setError(err.message || "Failed to load data");
            if (err.response?.status === 401) {
                handleLogout();
                return;
            }
        }

        setDebugInfo(prev => prev + "\nProfile data loaded successfully!");

    } catch (err) {
        console.error("Error fetching profile data:", err);
        setDebugInfo(prev => prev + `\nError: ${err.message}`);
        setError(err.message || "Failed to load profile data");
    } finally {
        setLoading(false);
        setRefreshing(false);
    }
};

    // Refresh data
    const handleRefresh = () => {
        setRefreshing(true);
        fetchProfileData();
    };

    // Download PDF file
    const downloadPDF = async (pdf) => {
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

    // View PDF in new tab
    const viewPDF = async (pdf) => {
        try {
            setError("");
            
            const response = await authAPI.downloadPDF(pdf.pdf_id);
            
            // Create blob and open in new tab
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            window.open(url, '_blank');

        } catch (err) {
            console.error('Error viewing PDF:', err);
            if (err.response?.status === 401) {
                handleLogout();
            } else {
                setError(err.message || "Failed to view PDF");
            }
        }
    };

    const handleLogout = () => {
        authAPI.clearAuthData();
        router.push('/login');
    };

    const handleGoToDashboard = () => {
        router.push('/');
    };

    const runDebugTest = async () => {
        try {
            setDebugInfo("Running debug test...");
            
            // Test 1: Check authentication
            const isAuth = authAPI.isAuthenticated();
            setDebugInfo(prev => prev + `\n1. Authenticated: ${isAuth}`);
            
            // Test 2: Get current user
            const currentUser = authAPI.getCurrentUser();
            setDebugInfo(prev => prev + `\n2. Current user: ${JSON.stringify(currentUser)}`);
            
            // Test 3: Test API endpoints
            setDebugInfo(prev => prev + "\n3. Testing API endpoints...");
            
            const endpoints = [
                { name: 'My Links', func: () => authAPI.getMyLinks() },
                { name: 'My PDFs', func: () => authAPI.getMyPDFs() }
            ];
            
            for (const endpoint of endpoints) {
                try {
                    const response = await endpoint.func();
                    setDebugInfo(prev => prev + `\n   ${endpoint.name}: ${response.data?.length || 0} items`);
                } catch (err) {
                    setDebugInfo(prev => prev + `\n   ${endpoint.name} ERROR: ${err.message}`);
                }
            }
            
            setDebugInfo(prev => prev + "\nDebug test completed!");
            
        } catch (err) {
            setDebugInfo(prev => prev + `\nDebug test error: ${err.message}`);
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

                {/* Debug Panel (can be hidden in production) */}
                {process.env.NODE_ENV === 'development' && (
                    <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-semibold text-gray-700">Debug Information</h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={runDebugTest}
                                    className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                                >
                                    Run Debug Test
                                </button>
                                <button
                                    onClick={() => setDebugInfo("")}
                                    className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                                >
                                    Clear
                                </button>
                            </div>
                        </div>
                        <pre className="text-xs text-gray-600 bg-white p-3 rounded border max-h-32 overflow-y-auto whitespace-pre-wrap">
                            {debugInfo || "No debug information"}
                        </pre>
                    </div>
                )}

                {/* Header with Actions */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900">My Profile</h1>
                        <p className="text-slate-600 mt-2">Manage your drive links and uploaded files</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleGoToDashboard}
                            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium flex items-center"
                        >
                            <Home className="w-4 h-4 mr-2" />
                            Dashboard
                        </button>
                        
                        <button
                            onClick={handleRefresh}
                            disabled={refreshing}
                            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium flex items-center disabled:opacity-50"
                        >
                            {refreshing ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <RefreshCw className="w-4 h-4 mr-2" />
                            )}
                            Refresh
                        </button>
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
                                        <span className="px-3 py-1 bg-gradient-to-r from-green-100 to-green-50 text-green-700 rounded-full text-sm font-medium">
                                            Verified
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <Mail size={16} />
                                        <span>{user?.email || "No email provided"}</span>
                                    </div>
                                    <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                                        <div className="bg-blue-50 rounded-lg p-3">
                                            <div className="text-sm text-blue-600 font-medium">User ID</div>
                                            <div className="text-xs font-mono text-gray-600 truncate">{user?.id?.slice(-8) || 'N/A'}</div>
                                        </div>
                                        <div className="bg-green-50 rounded-lg p-3">
                                            <div className="text-sm text-green-600 font-medium">Status</div>
                                            <div className="text-xs text-green-700">Active</div>
                                        </div>
                                    </div>
                                </div>
                                
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg font-medium transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                <FileText className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-blue-700">{stats.total_pdfs}</div>
                                <div className="text-sm font-medium text-blue-600">PDF Files</div>
                                <div className="text-xs text-blue-500 mt-1">{stats.total_size} MB total</div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                <Folder className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-green-700">{stats.total_links}</div>
                                <div className="text-sm font-medium text-green-600">Drive Links</div>
                                <div className="text-xs text-green-500 mt-1">{combinedData.filter(link => link.pdfs?.length > 0).length} with PDFs</div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                <HardDrive className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-purple-700">{stats.total_size} MB</div>
                                <div className="text-sm font-medium text-purple-600">Total Storage</div>
                                <div className="text-xs text-purple-500 mt-1">
                                    {pdfs.length > 0 ? `${(stats.total_size / pdfs.length).toFixed(2)} MB avg/file` : 'No files'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Connected Links */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg">
                                    <HardDrive size={20} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">Connected Links</h3>
                                    <p className="text-slate-500 text-sm">All your Google Drive links</p>
                                </div>
                            </div>

                            {links.length > 0 ? (
                                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                                    {links.map((link) => (
                                        <div key={link.id} className="p-4 rounded-lg bg-slate-50 border border-slate-200 hover:border-blue-300 transition-colors group">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-xs font-medium text-slate-500">
                                                    ID: {link.id?.slice(-8) || 'N/A'}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    {link.has_pdf ? (
                                                        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full flex items-center">
                                                            <CheckCircle size={10} className="mr-1" />
                                                            Has PDF
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">
                                                            No PDF
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-2 mb-3">
                                                <a 
                                                    href={link.drive_link_1} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 truncate group-hover:underline"
                                                >
                                                    <LinkIcon size={12} />
                                                    <span className="truncate" title={link.drive_link_1}>
                                                        {link.drive_link_1.length > 30 
                                                            ? `${link.drive_link_1.substring(0, 30)}...` 
                                                            : link.drive_link_1}
                                                    </span>
                                                    <ExternalLink size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </a>
                                                <a 
                                                    href={link.drive_link_2} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 text-sm text-green-600 hover:text-green-800 truncate group-hover:underline"
                                                >
                                                    <LinkIcon size={12} />
                                                    <span className="truncate" title={link.drive_link_2}>
                                                        {link.drive_link_2.length > 30 
                                                            ? `${link.drive_link_2.substring(0, 30)}...` 
                                                            : link.drive_link_2}
                                                    </span>
                                                    <ExternalLink size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </a>
                                            </div>
                                            
                                            <div className="pt-3 border-t border-slate-200">
                                                <div className="flex justify-between items-center text-xs text-slate-500">
                                                    <div>
                                                        <Calendar size={10} className="inline mr-1" />
                                                        {formatDate(link.created_at)}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <FileText size={10} />
                                                        <span className="font-medium">
                                                            {pdfs.filter(p => p.link_id === link.id).length} PDFs
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                        <HardDrive size={24} className="text-slate-400" />
                                    </div>
                                    <p className="text-slate-500 font-medium">No drive links connected</p>
                                    <p className="text-slate-400 text-sm mt-1">Add links from the dashboard</p>
                                    <button
                                        onClick={handleGoToDashboard}
                                        className="mt-4 px-4 py-2 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                    >
                                        Go to Dashboard
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: PDF Files */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg">
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900">Uploaded PDF Files</h3>
                                        <p className="text-slate-500 text-sm">All your uploaded inspection reports</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-slate-500">
                                        <span className="font-medium">{pdfs.length}</span> files
                                    </span>
                                    {stats.total_size > 0 && (
                                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                                            {stats.total_size} MB total
                                        </span>
                                    )}
                                </div>
                            </div>

                            {pdfs.length > 0 ? (
                                <div className="space-y-4">
                                    {pdfs.map((pdf) => {
                                        const associatedLink = links.find(link => link.id === pdf.link_id);
                                        
                                        return (
                                            <div key={pdf.pdf_id} className="group flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-orange-300 hover:bg-orange-50/20 transition-all">
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
                                                                {pdf.filename || "Unnamed PDF"}
                                                            </h4>
                                                            {associatedLink && (
                                                                <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-600 rounded">
                                                                    Link {associatedLink.drive_link_1 ? '1' : '2'}
                                                                </span>
                                                            )}
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
                                                            {pdf.link_id && (
                                                                <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded">
                                                                    Link ID: {pdf.link_id?.slice(-8)}
                                                                </span>
                                                            )}
                                                        </div>
                                                        
                                                        {associatedLink && (
                                                            <div className="mt-2">
                                                                <div className="text-xs text-slate-400 truncate" title={associatedLink.drive_link_1}>
                                                                    Link: {associatedLink.drive_link_1?.length > 40 
                                                                        ? `${associatedLink.drive_link_1.substring(0, 40)}...` 
                                                                        : associatedLink.drive_link_1}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 ml-4">
                                                    <button
                                                        onClick={() => viewPDF(pdf)}
                                                        className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="View PDF"
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                    
                                                    <button
                                                        onClick={() => downloadPDF(pdf)}
                                                        disabled={downloadingPdf === pdf.pdf_id}
                                                        className="p-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 rounded-lg transition-colors disabled:opacity-50"
                                                        title="Download PDF"
                                                    >
                                                        {downloadingPdf === pdf.pdf_id ? (
                                                            <Loader2 size={18} className="animate-spin" />
                                                        ) : (
                                                            <Download size={18} />
                                                        )}
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
                                    <h4 className="text-lg font-semibold text-slate-900 mb-2">No PDF Files Yet</h4>
                                    <p className="text-slate-600 mb-6 max-w-md mx-auto">
                                        You haven't uploaded any PDF files yet. Upload PDFs to your drive links from the dashboard.
                                    </p>
                                    <button
                                        onClick={handleGoToDashboard}
                                        className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-medium shadow-sm"
                                    >
                                        Go to Dashboard
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
                                                    <span>{pdfs.length} PDF files</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <HardDrive size={14} className="mr-2 text-slate-400" />
                                                    <span>{stats.total_size} MB total</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            Last updated: {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                
                {/* Data Summary */}
                {(links.length > 0 || pdfs.length > 0) && (
                    <div className="mt-8 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h4 className="text-lg font-semibold text-slate-900 mb-4">Data Summary</h4>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="p-4 bg-blue-50 rounded-lg">
                                <div className="text-sm font-medium text-blue-600">Total Links</div>
                                <div className="text-2xl font-bold text-blue-700">{links.length}</div>
                                <div className="text-xs text-blue-500 mt-1">
                                    {links.filter(l => l.has_pdf).length} with PDFs
                                </div>
                            </div>
                            <div className="p-4 bg-green-50 rounded-lg">
                                <div className="text-sm font-medium text-green-600">Total PDFs</div>
                                <div className="text-2xl font-bold text-green-700">{pdfs.length}</div>
                                <div className="text-xs text-green-500 mt-1">
                                    {stats.total_size} MB total
                                </div>
                            </div>
                            <div className="p-4 bg-orange-50 rounded-lg">
                                <div className="text-sm font-medium text-orange-600">Avg File Size</div>
                                <div className="text-2xl font-bold text-orange-700">
                                    {pdfs.length > 0 ? formatFileSize(stats.total_size * 1024 * 1024 / pdfs.length) : '0 KB'}
                                </div>
                                <div className="text-xs text-orange-500 mt-1">per file</div>
                            </div>
                            <div className="p-4 bg-purple-50 rounded-lg">
                                <div className="text-sm font-medium text-purple-600">Last Upload</div>
                                <div className="text-2xl font-bold text-purple-700">
                                    {pdfs.length > 0 ? formatDate(pdfs[0].uploaded_at).split(',')[0] : 'Never'}
                                </div>
                                <div className="text-xs text-purple-500 mt-1">
                                    {pdfs.length > 0 ? formatDate(pdfs[0].uploaded_at).split(',')[1] : 'No uploads'}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}