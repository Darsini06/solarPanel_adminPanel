'use client';

import { useState, useEffect } from 'react';
import { 
  ExternalLink, 
  Copy, 
  Calendar, 
  RefreshCw, 
  Loader2,
  Link as LinkIcon,
  User,
  File,
  Clock,
  BarChart3,
  FileText,
  CheckCircle,
  AlertTriangle,
  Download as DownloadIcon,
  X,
  Mail,
  Users,
  Hash,
  Folder,
  FileSearch,
  PieChart
} from 'lucide-react';

export default function HomePage() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedLink, setCopiedLink] = useState('');
  const [selectedUser, setSelectedUser] = useState('all');
  // PDF Upload states
const [uploadingPdf, setUploadingPdf] = useState(false);
const [selectedItemForUpload, setSelectedItemForUpload] = useState(null);
const [uploadProgress, setUploadProgress] = useState(0);
  
  // Report generation states
  const [generatingReport, setGeneratingReport] = useState(false);
  const [report, setReport] = useState(null);
  const [selectedLinkForReport, setSelectedLinkForReport] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [activeReportTab, setActiveReportTab] = useState('summary');

  // API base URL
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  // Fetch links from FastAPI backend
  const fetchLinks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/drive-links/`);
      if (!response.ok) {
        throw new Error('Failed to fetch links');
      }
      const data = await response.json();
      
      // Use actual user data from backend
      setLinks(data);
      setError('');
    } catch (err) {
      setError('Error loading links. Please try again.');
      console.error('Error fetching links:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchLinks();
  }, []);

  // Copy link to clipboard
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLink(text);
      setTimeout(() => setCopiedLink(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get user initials for avatar
  const getUserInitials = (userName) => {
    if (!userName || userName === 'Anonymous User') return 'AU';
    const names = userName.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return userName[0]?.toUpperCase() || 'U';
  };

  // Get unique users for filter dropdown
  const uniqueUsers = [
    { id: 'all', name: 'All Users', email: '' },
    ...Array.from(new Map(links.map(link => [
      link.user_id, 
      { id: link.user_id, name: link.user_name || `User ${link.user_id?.slice(-4) || 'unknown'}`, email: link.user_email }
    ])).values())
  ];

  // Filter links by selected user
  const filteredLinks = selectedUser === 'all' 
    ? links 
    : links.filter(link => link.user_id === selectedUser);

  // Calculate statistics
  const totalLinks = links.length;
  const totalUsers = new Set(links.map(link => link.user_id).filter(id => id && id !== 'anonymous')).size;

  // Generate report function
  const generateReport = async (linkItem) => {
    try {
      setGeneratingReport(true);
      setSelectedLinkForReport(linkItem);
      
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      };
      
      const response = await fetch(`${API_URL}/drive-links/generate-report`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          link_id: linkItem.id,
          drive_link_1: linkItem.drive_link_1,
          drive_link_2: linkItem.drive_link_2
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate report');
      }
      
      const data = await response.json();
      setReport(data);
      setShowReportModal(true);
    } catch (err) {
      setError('Error generating report. Please try again.');
      console.error('Error generating report:', err);
    } finally {
      setGeneratingReport(false);
    }
  };

  // Download report function
  const downloadReport = () => {
    if (!report) return;
    
    const reportData = {
      title: `Drive Links Comparison Report - ${report.report_id}`,
      generatedAt: new Date(report.generated_at).toLocaleString(),
      ...report
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `drive-comparison-report-${report.report_id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  // Handle PDF upload
const handlePdfUpload = async (event, item) => {
  const file = event.target.files[0];
  
  if (!file) return;
  
  // Check if file is PDF
  if (!file.type.includes('pdf') && !file.name.endsWith('.pdf')) {
    setError('Please select a PDF file');
    return;
  }
  
  // Check file size (limit to 10MB)
  if (file.size > 10 * 1024 * 1024) {
    setError('PDF file size should be less than 10MB');
    return;
  }
  
  try {
    setUploadingPdf(true);
    setSelectedItemForUpload(item);
    setUploadProgress(0);
    setError('');
    
    // Create form data
    const formData = new FormData();
    formData.append('pdf', file);
    formData.append('link_id', item.id);
    formData.append('drive_link_1', item.drive_link_1);
    formData.append('drive_link_2', item.drive_link_2);
    
    // Simulate upload progress (remove this in real implementation)
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 100);
    
    // Upload to your backend API
    const response = await fetch(`${API_URL}/upload-pdf`, {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header for FormData - browser sets it automatically
    });
    
    clearInterval(progressInterval);
    setUploadProgress(100);
    
    if (!response.ok) {
      throw new Error('Failed to upload PDF');
    }
    
    const data = await response.json();
    
    // Show success message
    setError(''); // Clear any previous errors
    alert(`PDF uploaded successfully!\nFile: ${file.name}\nLink ID: ${item.id}`);
    
    // Reset after a short delay
    setTimeout(() => {
      setUploadingPdf(false);
      setSelectedItemForUpload(null);
      setUploadProgress(0);
    }, 1000);
    
  } catch (err) {
    console.error('Error uploading PDF:', err);
    setError('Failed to upload PDF. Please try again.');
    setUploadingPdf(false);
    setSelectedItemForUpload(null);
    setUploadProgress(0);
  } finally {
    // Reset file input
    event.target.value = '';
  }
};

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center mr-3">
                  <Folder className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Drive Links Manager</h1>
                  <p className="text-gray-600 text-sm">Real User Data Dashboard</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchLinks}
                disabled={loading}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-md text-sm font-medium flex items-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                Refresh
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center">
                  <LinkIcon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">{totalLinks}</h3>
                <p className="text-gray-600 text-sm font-medium">Total Links</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-green-50 to-green-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">{totalUsers}</h3>
                <p className="text-gray-600 text-sm font-medium">Active Users</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">
                  {links.length > 0 ? formatDate(links[0].created_at) : 'No data'}
                </h3>
                <p className="text-gray-600 text-sm font-medium">Latest Upload</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl flex items-center justify-center">
                  <Hash className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">{filteredLinks.length}</h3>
                <p className="text-gray-600 text-sm font-medium">Filtered Links</p>
              </div>
            </div>
          </div>
        </div>

        {/* Report Status Banner */}
        {report && (
          <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mr-4">
                  <FileSearch className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Latest Report Available</h3>
                  <p className="text-gray-600 text-sm">
                    Report ID: <span className="font-mono bg-white px-2 py-1 rounded text-xs border">{report.report_id}</span>
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    Generated on {new Date(report.generated_at).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex space-x-3 mt-4 md:mt-0">
                <button
                  onClick={() => setShowReportModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 text-sm font-medium shadow-sm"
                >
                  View Full Report
                </button>
                <button
                  onClick={downloadReport}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 text-sm font-medium flex items-center shadow-sm"
                >
                  <DownloadIcon className="w-4 h-4 mr-2" />
                  Export
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Table Header */}
          <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Drive Links Repository</h2>
                <p className="text-gray-600 text-sm mt-1">All uploaded Google Drive links from users</p>
              </div>
              
              <div className="mt-4 md:mt-0">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                      value={selectedUser}
                      onChange={(e) => setSelectedUser(e.target.value)}
                      className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white w-full md:w-64"
                    >
                      {uniqueUsers.map(user => (
                        <option key={user.id} value={user.id}>
                          {user.id === 'all' ? '👥 All Users' : `👤 ${user.name} (${user.email})`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex flex-col justify-center items-center py-20">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <span className="mt-6 text-gray-600 font-medium">Loading drive links...</span>
              <p className="text-gray-500 text-sm mt-2">Fetching data from the server</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto bg-red-50 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Data</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">{error}</p>
              <button
                onClick={fetchLinks}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-sm"
              >
                <RefreshCw className="w-4 h-4 inline mr-2" />
                Try Again
              </button>
            </div>
          ) : filteredLinks.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
                <LinkIcon className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">No Drive Links Found</h3>
              <p className="text-gray-600 max-w-md mx-auto mb-8">
                {selectedUser === 'all' 
                  ? 'No Google Drive links have been uploaded yet. Start by adding your first link pair.' 
                  : `No drive links found for the selected user. Try selecting "All Users" to see all links.`}
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setSelectedUser('all')}
                  className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Show All Users
                </button>
                <button
                  onClick={fetchLinks}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium"
                >
                  Refresh Data
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      User
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Drive Links
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Upload Date
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredLinks.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors duration-150">
                      {/* User Column */}
                      <td className="px-6 py-5">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-sm ${
                              item.user_name && item.user_name !== 'Anonymous User' 
                                ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                                : 'bg-gradient-to-br from-gray-400 to-gray-500'
                            }`}>
                              <span className="text-white font-semibold text-sm">
                                {getUserInitials(item.user_name)}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="flex items-center">
                              <div className="text-sm font-semibold text-gray-900">
                                {item.user_name || 'Anonymous User'}
                                {item.user_name && item.user_name !== 'Anonymous User' && (
                                  <span className="ml-2 px-2 py-0.5 text-xs bg-gradient-to-r from-green-100 to-green-50 text-green-700 rounded-full font-medium">
                                    Verified
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center text-xs text-gray-600 mt-1">
                              <Mail className="w-3 h-3 mr-1.5 flex-shrink-0" />
                              <span className="truncate max-w-[180px]" title={item.user_email}>
                                {item.user_email || 'anonymous@example.com'}
                              </span>
                            </div>
                            <div className="text-xs text-gray-400 mt-2">
                              <span className="font-mono bg-gray-50 px-2 py-0.5 rounded border">
                                ID: {item.user_id?.slice(-8) || 'anonymous'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      {/* Links Column */}
                      <td className="px-6 py-5">
                        <div className="space-y-4">
                          {/* Drive Link 1 */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                <div className="w-6 h-6 bg-gradient-to-br from-blue-100 to-blue-50 rounded-md flex items-center justify-center mr-2">
                                  <span className="text-xs font-bold text-blue-600">1</span>
                                </div>
                                <span className="text-xs font-semibold text-gray-700">Drive Link 1</span>
                              </div>
                              <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full">
                                Primary
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="flex-1 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 px-4 py-3 hover:border-blue-300 transition-colors">
                                <a
                                  href={item.drive_link_1}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 text-sm font-medium truncate block group"
                                  title={item.drive_link_1}
                                >
                                  <span className="group-hover:underline">{item.drive_link_1}</span>
                                  <ExternalLink className="w-3.5 h-3.5 inline ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </a>
                              </div>
                              <div className="flex space-x-1.5">
                                <button
                                  onClick={() => copyToClipboard(item.drive_link_1)}
                                  className={`p-2 rounded-lg transition-all duration-200 ${
                                    copiedLink === item.drive_link_1 
                                      ? 'bg-gradient-to-br from-green-100 to-green-50 text-green-600 shadow-sm' 
                                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                  }`}
                                  title="Copy link"
                                >
                                  <Copy className="w-4 h-4" />
                                </button>
                                <a
                                  href={item.drive_link_1}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Open link"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              </div>
                            </div>
                          </div>
                          
                          {/* Drive Link 2 */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                <div className="w-6 h-6 bg-gradient-to-br from-green-100 to-green-50 rounded-md flex items-center justify-center mr-2">
                                  <span className="text-xs font-bold text-green-600">2</span>
                                </div>
                                <span className="text-xs font-semibold text-gray-700">Drive Link 2</span>
                              </div>
                              <span className="text-xs px-2 py-1 bg-green-50 text-green-600 rounded-full">
                                Comparison
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="flex-1 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 px-4 py-3 hover:border-green-300 transition-colors">
                                <a
                                  href={item.drive_link_2}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-green-600 hover:text-green-800 text-sm font-medium truncate block group"
                                  title={item.drive_link_2}
                                >
                                  <span className="group-hover:underline">{item.drive_link_2}</span>
                                  <ExternalLink className="w-3.5 h-3.5 inline ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </a>
                              </div>
                              <div className="flex space-x-1.5">
                                <button
                                  onClick={() => copyToClipboard(item.drive_link_2)}
                                  className={`p-2 rounded-lg transition-all duration-200 ${
                                    copiedLink === item.drive_link_2 
                                      ? 'bg-gradient-to-br from-green-100 to-green-50 text-green-600 shadow-sm' 
                                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                  }`}
                                  title="Copy link"
                                >
                                  <Copy className="w-4 h-4" />
                                </button>
                                <a
                                  href={item.drive_link_2}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                  title="Open link"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      {/* Date Column */}
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900 font-medium">
                          <Calendar className="w-4 h-4 mr-2.5 text-gray-400 flex-shrink-0" />
                          {formatDate(item.created_at)}
                        </div>
                        <div className="text-xs text-gray-500 mt-3">
                          <div className="flex items-center">
                            <div className="w-6 h-6 bg-gradient-to-br from-gray-100 to-gray-50 rounded-md flex items-center justify-center mr-2">
                              <span className="text-xs font-bold text-gray-600">ID</span>
                            </div>
                            <span className="font-mono bg-gray-50 px-2 py-0.5 rounded border text-gray-600">
                              {item.id.slice(-8)}
                            </span>
                          </div>
                        </div>
                      </td>
                      
{/* Actions Column */}
<td className="px-6 py-5 whitespace-nowrap">
  <div className="flex flex-col space-y-3">
    <div className="flex space-x-2">
      {/* Upload PDF Button with hidden file input */}
      <div className="relative">
        <input
          type="file"
          id={`pdf-upload-${item.id}`}
          className="hidden"
          accept=".pdf,application/pdf"
          onChange={(e) => handlePdfUpload(e, item)}
          disabled={uploadingPdf && selectedItemForUpload?.id === item.id}
        />
        <label
          htmlFor={`pdf-upload-${item.id}`}
          className={`inline-flex items-center justify-center px-4 py-2 border rounded-lg text-sm font-medium transition-all duration-200 shadow-sm cursor-pointer ${
            uploadingPdf && selectedItemForUpload?.id === item.id
              ? 'border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed'
              : 'border-blue-600 text-blue-700 bg-gradient-to-r from-blue-50 to-blue-25 hover:from-blue-100 hover:to-blue-50 hover:border-blue-700'
          }`}
        >
          {uploadingPdf && selectedItemForUpload?.id === item.id ? (
            <>
              <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <FileText className="w-3.5 h-3.5 mr-1.5" />
              Upload PDF
            </>
          )}
        </label>
        
        {/* Upload Progress Indicator */}
        {uploadingPdf && selectedItemForUpload?.id === item.id && uploadProgress > 0 && (
          <div className="absolute -bottom-6 left-0 right-0">
            <div className="text-xs text-gray-500 text-center mb-1">
              {uploadProgress}%
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
      
      {/* Copy All Button */}
      <button
        onClick={() => {
          const combinedLinks = `Drive Link 1:\n${item.drive_link_1}\n\nDrive Link 2:\n${item.drive_link_2}`;
          copyToClipboard(combinedLinks);
        }}
        disabled={uploadingPdf && selectedItemForUpload?.id === item.id}
        className={`inline-flex items-center justify-center px-4 py-2 border rounded-lg text-sm font-medium transition-colors shadow-sm ${
          uploadingPdf && selectedItemForUpload?.id === item.id
            ? 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed'
            : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
        }`}
      >
        <Copy className="w-3.5 h-3.5 mr-1.5" />
        Copy All
      </button>
    </div>
  </div>
</td>        </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer Stats */}
        {!loading && filteredLinks.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center mr-2.5">
                    <LinkIcon className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{filteredLinks.length} link sets</div>
                    <div className="text-xs text-gray-500">Currently showing</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-50 to-green-100 rounded-lg flex items-center justify-center mr-2.5">
                    <User className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {selectedUser === 'all' 
                        ? `${totalUsers} active users` 
                        : `Filtered by: ${uniqueUsers.find(u => u.id === selectedUser)?.name}`}
                    </div>
                    <div className="text-xs text-gray-500">User filter applied</div>
                  </div>
                </div>
              </div>
              <div className="mt-4 md:mt-0">
                <div className="text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border">
                  <span className="font-medium">Live Data</span> • Last updated: {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-200 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center mb-4">
                <Folder className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Drive Links Management System</h3>
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                A comprehensive dashboard for managing and comparing Google Drive links with detailed analytics and reporting.
              </p>
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <LinkIcon className="w-3.5 h-3.5 mr-1.5" />
                  <span>{totalLinks} links</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-3.5 h-3.5 mr-1.5" />
                  <span>{totalUsers} users</span>
                </div>
                <div className="flex items-center">
                  <FileSearch className="w-3.5 h-3.5 mr-1.5" />
                  <span>{report ? 'Reports available' : 'No reports'}</span>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-gray-100 w-full">
                <p className="text-gray-500 text-sm">© {new Date().getFullYear()} Drive Links Manager • v2.0 • All data is securely stored</p>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Report Modal */}
      {showReportModal && report && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden animate-slideUp">
            {/* Report Header */}
            <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mr-4">
                  <FileSearch className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Drive Links Comparison Report</h2>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <span className="font-mono bg-white px-2 py-0.5 rounded border mr-3">{report.report_id}</span>
                    <span>Generated on {new Date(report.generated_at).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={downloadReport}
                  className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg flex items-center text-sm font-medium shadow-sm transition-all duration-200"
                >
                  <DownloadIcon className="w-4 h-4 mr-2" />
                  Export JSON
                </button>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Report Tabs */}
            <div className="px-8 pt-4 border-b border-gray-200 bg-white">
              <div className="flex space-x-1">
                <button
                  onClick={() => setActiveReportTab('summary')}
                  className={`px-4 py-3 text-sm font-medium rounded-t-lg transition-colors ${
                    activeReportTab === 'summary'
                      ? 'bg-gradient-to-b from-blue-50 to-white text-blue-700 border-t border-l border-r border-gray-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <BarChart3 className="w-4 h-4 inline mr-2" />
                  Summary
                </button>
                <button
                  onClick={() => setActiveReportTab('files')}
                  className={`px-4 py-3 text-sm font-medium rounded-t-lg transition-colors ${
                    activeReportTab === 'files'
                      ? 'bg-gradient-to-b from-blue-50 to-white text-blue-700 border-t border-l border-r border-gray-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <File className="w-4 h-4 inline mr-2" />
                  File Analysis
                </button>
                <button
                  onClick={() => setActiveReportTab('details')}
                  className={`px-4 py-3 text-sm font-medium rounded-t-lg transition-colors ${
                    activeReportTab === 'details'
                      ? 'bg-gradient-to-b from-blue-50 to-white text-blue-700 border-t border-l border-r border-gray-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <FileText className="w-4 h-4 inline mr-2" />
                  Details
                </button>
                <button
                  onClick={() => setActiveReportTab('recommendations')}
                  className={`px-4 py-3 text-sm font-medium rounded-t-lg transition-colors ${
                    activeReportTab === 'recommendations'
                      ? 'bg-gradient-to-b from-blue-50 to-white text-blue-700 border-t border-l border-r border-gray-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <CheckCircle className="w-4 h-4 inline mr-2" />
                  Recommendations
                </button>
              </div>
            </div>

            {/* Report Content */}
            <div className="overflow-y-auto max-h-[calc(95vh-220px)] p-8">
              {/* Summary Tab */}
              {activeReportTab === 'summary' && (
                <div className="space-y-8">
                  {/* Main Metrics */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Comparison Overview</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200">
                        <div className="text-center">
                          <div className="text-4xl font-bold text-blue-700 mb-2">
                            {report.comparison_summary?.similarity_score || 0}%
                          </div>
                          <div className="text-sm font-medium text-blue-600">Similarity Score</div>
                          <div className="text-xs text-blue-500 mt-2">
                            {report.comparison_summary?.common_files || 0} common files
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border border-green-200">
                        <div className="text-center">
                          <div className="text-4xl font-bold text-green-700 mb-2">
                            {report.comparison_summary?.total_files_link1 || 0}
                          </div>
                          <div className="text-sm font-medium text-green-600">Link 1 Files</div>
                          <div className="text-xs text-green-500 mt-2">
                            {report.comparison_summary?.total_size_link1 || '0 MB'}
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-5 border border-yellow-200">
                        <div className="text-center">
                          <div className="text-4xl font-bold text-yellow-700 mb-2">
                            {report.comparison_summary?.total_files_link2 || 0}
                          </div>
                          <div className="text-sm font-medium text-yellow-600">Link 2 Files</div>
                          <div className="text-xs text-yellow-500 mt-2">
                            {report.comparison_summary?.total_size_link2 || '0 MB'}
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 border border-purple-200">
                        <div className="text-center">
                          <div className="text-4xl font-bold text-purple-700 mb-2">
                            {(report.comparison_summary?.unique_to_link1 || 0) + (report.comparison_summary?.unique_to_link2 || 0)}
                          </div>
                          <div className="text-sm font-medium text-purple-600">Unique Files</div>
                          <div className="text-xs text-purple-500 mt-2">
                            Diff: {report.comparison_summary?.size_difference || '0 MB'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Similarity Score Visual */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-sm font-medium text-gray-700">Similarity Score Visualization</span>
                        <span className="text-sm font-bold text-blue-600">
                          {report.comparison_summary?.similarity_score || 0}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-5 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-5 rounded-full transition-all duration-1000"
                          style={{ width: `${report.comparison_summary?.similarity_score || 0}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-3">
                        <span className="font-medium">0% (No Match)</span>
                        <span className="font-medium">50% (Partial Match)</span>
                        <span className="font-medium">100% (Perfect Match)</span>
                      </div>
                    </div>
                  </div>

                  {/* Link URLs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-r from-blue-50 to-white rounded-xl border border-blue-100 p-5">
                      <h4 className="text-sm font-semibold text-blue-700 mb-3">Drive Link 1</h4>
                      <div className="flex items-center">
                        <div className="flex-1 bg-white rounded-lg border border-blue-200 px-4 py-3">
                          <a
                            href={report.drive_link_1}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium truncate block"
                            title={report.drive_link_1}
                          >
                            {report.drive_link_1}
                          </a>
                        </div>
                        <a
                          href={report.drive_link_1}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-3 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Open link"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-green-50 to-white rounded-xl border border-green-100 p-5">
                      <h4 className="text-sm font-semibold text-green-700 mb-3">Drive Link 2</h4>
                      <div className="flex items-center">
                        <div className="flex-1 bg-white rounded-lg border border-green-200 px-4 py-3">
                          <a
                            href={report.drive_link_2}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 hover:text-green-800 text-sm font-medium truncate block"
                            title={report.drive_link_2}
                          >
                            {report.drive_link_2}
                          </a>
                        </div>
                        <a
                          href={report.drive_link_2}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-3 p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Open link"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Files Analysis Tab */}
              {activeReportTab === 'files' && (
                <div className="space-y-8">
                  {/* File Type Analysis */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">File Type Distribution</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Link 1 File Types */}
                      <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex items-center mb-5">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-sm font-bold text-blue-600">1</span>
                          </div>
                          <h4 className="text-base font-semibold text-gray-900">Link 1 File Types</h4>
                        </div>
                        <div className="space-y-4">
                          {Object.entries(report.file_type_analysis?.link1 || {}).map(([type, count]) => (
                            <div key={type} className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center mr-3">
                                  <File className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                  <span className="text-sm font-medium text-gray-900 capitalize">{type}</span>
                                  <div className="text-xs text-gray-500">File category</div>
                                </div>
                              </div>
                              <span className="px-3 py-1.5 bg-blue-100 text-blue-700 text-sm font-semibold rounded-lg">
                                {count} {count === 1 ? 'file' : 'files'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Link 2 File Types */}
                      <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex items-center mb-5">
                          <div className="w-8 h-8 bg-gradient-to-br from-green-50 to-green-100 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-sm font-bold text-green-600">2</span>
                          </div>
                          <h4 className="text-base font-semibold text-gray-900">Link 2 File Types</h4>
                        </div>
                        <div className="space-y-4">
                          {Object.entries(report.file_type_analysis?.link2 || {}).map(([type, count]) => (
                            <div key={type} className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="w-8 h-8 bg-gradient-to-br from-green-50 to-green-100 rounded-lg flex items-center justify-center mr-3">
                                  <File className="w-4 h-4 text-green-600" />
                                </div>
                                <div>
                                  <span className="text-sm font-medium text-gray-900 capitalize">{type}</span>
                                  <div className="text-xs text-gray-500">File category</div>
                                </div>
                              </div>
                              <span className="px-3 py-1.5 bg-green-100 text-green-700 text-sm font-semibold rounded-lg">
                                {count} {count === 1 ? 'file' : 'files'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Common Files */}
                  {report.common_files && report.common_files.length > 0 && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
                      <div className="flex items-center mb-5">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                          <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="text-base font-semibold text-gray-900">Common Files</h4>
                          <p className="text-sm text-gray-600">
                            Files that exist in both drive links ({report.common_files.length} files)
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {report.common_files.map((fileName, idx) => (
                          <div
                            key={idx}
                            className="bg-white/80 backdrop-blur-sm rounded-lg border border-blue-100 px-4 py-3 flex items-center hover:border-blue-300 transition-colors"
                          >
                            <CheckCircle className="w-4 h-4 text-blue-500 mr-3 flex-shrink-0" />
                            <span className="text-sm text-gray-800 truncate" title={fileName}>
                              {fileName}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Unique Files */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Unique Files</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Unique to Link 1 */}
                      {report.unique_files_link1 && report.unique_files_link1.length > 0 && (
                        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border border-yellow-200 p-6">
                          <div className="flex items-center mb-5">
                            <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center mr-3">
                              <AlertTriangle className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h4 className="text-base font-semibold text-gray-900">Unique to Link 1</h4>
                              <p className="text-sm text-gray-600">
                                {report.unique_files_link1.length} files only in Link 1
                              </p>
                            </div>
                          </div>
                          <div className="space-y-3">
                            {report.unique_files_link1.slice(0, 6).map((fileName, idx) => (
                              <div key={idx} className="flex items-center bg-white/70 rounded-lg px-4 py-2.5">
                                <AlertTriangle className="w-4 h-4 text-yellow-500 mr-3 flex-shrink-0" />
                                <span className="text-sm text-gray-800 truncate" title={fileName}>
                                  {fileName}
                                </span>
                              </div>
                            ))}
                            {report.unique_files_link1.length > 6 && (
                              <div className="text-center pt-2">
                                <span className="text-sm text-yellow-600 font-medium">
                                  + {report.unique_files_link1.length - 6} more files
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Unique to Link 2 */}
                      {report.unique_files_link2 && report.unique_files_link2.length > 0 ? (
                        <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border border-purple-200 p-6">
                          <div className="flex items-center mb-5">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                              <AlertTriangle className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h4 className="text-base font-semibold text-gray-900">Unique to Link 2</h4>
                              <p className="text-sm text-gray-600">
                                {report.unique_files_link2.length} files only in Link 2
                              </p>
                            </div>
                          </div>
                          <div className="space-y-3">
                            {report.unique_files_link2.slice(0, 6).map((fileName, idx) => (
                              <div key={idx} className="flex items-center bg-white/70 rounded-lg px-4 py-2.5">
                                <AlertTriangle className="w-4 h-4 text-purple-500 mr-3 flex-shrink-0" />
                                <span className="text-sm text-gray-800 truncate" title={fileName}>
                                  {fileName}
                                </span>
                              </div>
                            ))}
                            {report.unique_files_link2.length > 6 && (
                              <div className="text-center pt-2">
                                <span className="text-sm text-purple-600 font-medium">
                                  + {report.unique_files_link2.length - 6} more files
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 p-6 flex flex-col items-center justify-center">
                          <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle className="w-6 h-6 text-gray-400" />
                          </div>
                          <h4 className="text-base font-semibold text-gray-900 mb-2">No Unique Files</h4>
                          <p className="text-sm text-gray-600 text-center">
                            All files in Link 2 are also present in Link 1
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Details Tab */}
              {activeReportTab === 'details' && (
                <div className="space-y-8">
                  {/* File Details Tables */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">File Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Link 1 Files */}
                      <div>
                        <div className="flex items-center mb-5">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-sm font-bold text-blue-600">1</span>
                          </div>
                          <h4 className="text-base font-semibold text-gray-900">Link 1 Files</h4>
                          <span className="ml-3 px-2.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                            {report.file_details?.link1?.length || 0} files
                          </span>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                                <tr>
                                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">File Name</th>
                                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Type</th>
                                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Size</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100">
                                {(report.file_details?.link1 || []).slice(0, 8).map((file, idx) => (
                                  <tr key={idx} className="hover:bg-gray-50/50">
                                    <td className="px-4 py-3 text-sm text-gray-900 truncate max-w-[200px]" title={file.name}>
                                      {file.name}
                                    </td>
                                    <td className="px-4 py-3">
                                      <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full capitalize">
                                        {file.type}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{file.size}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          {(report.file_details?.link1 || []).length > 8 && (
                            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-center">
                              <span className="text-sm text-gray-600">
                                Showing 8 of {(report.file_details?.link1 || []).length} files
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Link 2 Files */}
                      <div>
                        <div className="flex items-center mb-5">
                          <div className="w-8 h-8 bg-gradient-to-br from-green-50 to-green-100 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-sm font-bold text-green-600">2</span>
                          </div>
                          <h4 className="text-base font-semibold text-gray-900">Link 2 Files</h4>
                          <span className="ml-3 px-2.5 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                            {report.file_details?.link2?.length || 0} files
                          </span>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                                <tr>
                                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">File Name</th>
                                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Type</th>
                                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Size</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100">
                                {(report.file_details?.link2 || []).slice(0, 8).map((file, idx) => (
                                  <tr key={idx} className="hover:bg-gray-50/50">
                                    <td className="px-4 py-3 text-sm text-gray-900 truncate max-w-[200px]" title={file.name}>
                                      {file.name}
                                    </td>
                                    <td className="px-4 py-3">
                                      <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full capitalize">
                                        {file.type}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{file.size}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          {(report.file_details?.link2 || []).length > 8 && (
                            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-center">
                              <span className="text-sm text-gray-600">
                                Showing 8 of {(report.file_details?.link2 || []).length} files
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 p-6">
                    <h4 className="text-base font-semibold text-gray-900 mb-4">Report Metadata</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="space-y-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center mr-3">
                              <User className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">Generated By</div>
                              <div className="text-sm text-gray-600">{report.generated_by}</div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-50 to-green-100 rounded-lg flex items-center justify-center mr-3">
                              <Calendar className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">Generated At</div>
                              <div className="text-sm text-gray-600">
                                {new Date(report.generated_at).toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="space-y-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg flex items-center justify-center mr-3">
                              <Hash className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">Report ID</div>
                              <div className="text-sm font-mono text-gray-600">{report.report_id}</div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg flex items-center justify-center mr-3">
                              <LinkIcon className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">Link ID</div>
                              <div className="text-sm font-mono text-gray-600">{report.link_id}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Recommendations Tab */}
              {activeReportTab === 'recommendations' && (
                <div className="space-y-8">
                  <div>
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-50 to-green-100 rounded-xl flex items-center justify-center mr-4">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Analysis & Recommendations</h3>
                        <p className="text-gray-600 text-sm">
                          Based on the comparison of {report.comparison_summary?.total_files_link1 || 0} files in Link 1 
                          and {report.comparison_summary?.total_files_link2 || 0} files in Link 2
                        </p>
                      </div>
                    </div>

                    {/* Key Insights */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6 mb-8">
                      <h4 className="text-base font-semibold text-gray-900 mb-4">Key Insights</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white/80 rounded-lg p-4">
                          <div className="flex items-center mb-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg flex items-center justify-center mr-2">
                              <BarChart3 className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-900">Similarity Score</span>
                          </div>
                          <div className="text-2xl font-bold text-blue-700">
                            {report.comparison_summary?.similarity_score || 0}%
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {report.comparison_summary?.similarity_score || 0 >= 70 
                              ? 'High similarity between links'
                              : report.comparison_summary?.similarity_score || 0 >= 40
                              ? 'Moderate similarity'
                              : 'Low similarity'}
                          </div>
                        </div>
                        
                        <div className="bg-white/80 rounded-lg p-4">
                          <div className="flex items-center mb-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-green-50 rounded-lg flex items-center justify-center mr-2">
                              <FileSearch className="w-4 h-4 text-green-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-900">Common Files</span>
                          </div>
                          <div className="text-2xl font-bold text-green-700">
                            {report.comparison_summary?.common_files || 0}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {report.comparison_summary?.common_files || 0 === 0
                              ? 'No files in common'
                              : 'Files present in both links'}
                          </div>
                        </div>
                        
                        <div className="bg-white/80 rounded-lg p-4">
                          <div className="flex items-center mb-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg flex items-center justify-center mr-2">
                              <AlertTriangle className="w-4 h-4 text-purple-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-900">Unique Files</span>
                          </div>
                          <div className="text-2xl font-bold text-purple-700">
                            {(report.comparison_summary?.unique_to_link1 || 0) + (report.comparison_summary?.unique_to_link2 || 0)}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Files exclusive to one link
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 p-6">
                      <h4 className="text-base font-semibold text-gray-900 mb-5">Recommendations</h4>
                      <div className="space-y-4">
                        {report.recommendations && report.recommendations.filter(rec => rec && rec.trim()).map((rec, idx) => (
                          <div key={idx} className="flex items-start bg-white rounded-lg border border-gray-100 p-4 hover:border-blue-200 transition-colors">
                            <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-gray-800">{rec}</p>
                              <div className="flex items-center mt-2">
                                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                                  Recommendation #{idx + 1}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Action Items */}
                      <div className="mt-8 pt-6 border-t border-gray-200">
                        <h4 className="text-base font-semibold text-gray-900 mb-4">Suggested Actions</h4>
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                            <span className="text-sm text-gray-700">
                              Consider merging duplicate files to save storage space
                            </span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                            <span className="text-sm text-gray-700">
                              Review unique files in each link for potential consolidation
                            </span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                            <span className="text-sm text-gray-700">
                              Check file types distribution for organizational improvements
                            </span>
                          </div>
                          {report.comparison_summary?.similarity_score || 0 > 50 && (
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                              <span className="text-sm text-gray-700">
                                High similarity suggests possible redundancy - consider removing one link
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Report Footer */}
            <div className="px-8 py-5 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="text-sm text-gray-600">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2 text-gray-400" />
                    <span>Generated by: <span className="font-medium">{report.generated_by}</span></span>
                  </div>
                </div>
                <div className="mt-3 md:mt-0">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">
                      Report ID: <span className="font-mono">{report.report_id}</span>
                    </span>
                    <span className="text-sm text-gray-500">
                      Link ID: <span className="font-mono">{report.link_id?.slice(-8)}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}