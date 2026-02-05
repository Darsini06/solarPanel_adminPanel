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
  Clock,
  FileText,
  X,
  Mail,
  Users,
  Hash,
  Folder,
  AlertCircle,
  Upload,
  Trash2,
  Download,
  ChevronDown,
  ChevronUp,
  Search
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DriveLinksPage() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedLink, setCopiedLink] = useState('');
  const [selectedUser, setSelectedUser] = useState('all');
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminInfo, setAdminInfo] = useState(null);
  const [expandedRows, setExpandedRows] = useState({});
  const [linkPDFs, setLinkPDFs] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedUserGroups, setExpandedUserGroups] = useState({}); // Track which user groups are expanded

  // PDF Upload states
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [selectedItemForUpload, setSelectedItemForUpload] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Delete states
  const [deletingLink, setDeletingLink] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState(null);

  // Loading PDFs state
  const [loadingPDFs, setLoadingPDFs] = useState({});

  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  useEffect(() => {
    checkAdminAuth();
    fetchLinks();
  }, []);

  const checkAdminAuth = () => {
    setIsAdmin(true);
    let name = localStorage.getItem('admin_name');
    if (!name || name === 'Admin User' || name === 'System Admin') {
      name = 'Princilla Savier';
      localStorage.setItem('admin_name', name);
    }
    setAdminInfo({
      name: name,
      loginTime: localStorage.getItem('admin_login_time') || Date.now()
    });
  };

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/drive-links`);

      if (!response.ok) {
        throw new Error('Failed to fetch links');
      }

      const data = await response.json();
      const sortedData = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setLinks(sortedData);
      setError('');

      // Fetch PDFs for all links to show status immediately
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
      for (const link of sortedData) {
        try {
          const pdfResponse = await fetch(`${API_URL}/drive-links/${link.id}/pdfs`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (pdfResponse.ok) {
            const pdfData = await pdfResponse.json();
            setLinkPDFs(prev => ({ ...prev, [link.id]: pdfData }));
          }
        } catch (err) {
          console.error(`Error fetching PDFs for link ${link.id}:`, err);
          // Continue fetching other PDFs even if one fails
        }
      }

    } catch (err) {
      setError('Error loading links. Please try again.');
      console.error('Error fetching links:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteDriveLink = async (linkId) => {
    try {
      setDeletingLink(linkId);
      setError('');

      const token = localStorage.getItem('auth_token') || localStorage.getItem('token');

      const response = await fetch(`${API_URL}/drive-links/${linkId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to delete link');
      }

      const result = await response.json();
      setLinks(prevLinks => prevLinks.filter(link => link.id !== linkId));
      alert(`✅ ${result.message || 'Link deleted successfully!'}`);

    } catch (err) {
      console.error('Error deleting link:', err);
      setError(`Failed to delete link: ${err.message}`);
    } finally {
      setDeletingLink(null);
      setShowDeleteConfirm(false);
      setLinkToDelete(null);
    }
  };

  const fetchLinkPDFs = async (linkId) => {
    try {
      setLoadingPDFs(prev => ({ ...prev, [linkId]: true }));
      setError('');

      const token = localStorage.getItem('auth_token') || localStorage.getItem('token');

      const response = await fetch(`${API_URL}/drive-links/${linkId}/pdfs`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          setError('Authentication required to view PDFs.');
          return;
        }
        throw new Error('Failed to fetch PDFs');
      }

      const data = await response.json();
      setLinkPDFs(prev => ({ ...prev, [linkId]: data }));

    } catch (err) {
      console.error('Error fetching PDFs:', err);
      setError(`Failed to load PDFs: ${err.message}`);
    } finally {
      setLoadingPDFs(prev => ({ ...prev, [linkId]: false }));
    }
  };

  const toggleRow = async (linkId) => {
    const isExpanded = expandedRows[linkId];
    setExpandedRows(prev => ({ ...prev, [linkId]: !isExpanded }));

    if (!isExpanded && !linkPDFs[linkId]) {
      await fetchLinkPDFs(linkId);
    }
  };

  const toggleUserGroup = (userId) => {
    setExpandedUserGroups(prev => ({ ...prev, [userId]: !prev[userId] }));
  };

  const confirmDelete = (link) => {
    if (!isAdmin) {
      setError('Admin login required to delete links');
      return;
    }

    setLinkToDelete(link);
    setShowDeleteConfirm(true);
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLink(text);
      setTimeout(() => setCopiedLink(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';

    let dateToParse = dateString;
    if (typeof dateString === 'string' && !dateString.endsWith('Z') && !dateString.includes('+')) {
      dateToParse = `${dateString}Z`;
    }

    const date = new Date(dateToParse);
    if (isNaN(date.getTime())) return 'Invalid Date';

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

  const uniqueUsers = [
    { id: 'all', name: 'All Users', email: '' },
    ...Array.from(new Map(links.map(link => [
      link.user_id,
      { id: link.user_id, name: link.user_name || `User ${link.user_id?.slice(-4) || 'unknown'}`, email: link.user_email }
    ])).values())
  ];

  const filteredLinks = links.filter(link => {
    const matchesUser = selectedUser === 'all' || link.user_id === selectedUser;
    const matchesSearch = !searchTerm ||
      link.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.drive_link_1?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.drive_link_2?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesUser && matchesSearch;
  });

  const totalLinks = links.length;
  const totalUsers = new Set(links.map(link => link.user_id).filter(id => id && id !== 'anonymous')).size;
  const totalPDFs = links.reduce((sum, link) => sum + (linkPDFs[link.id]?.length || 0), 0);

  // Group links by user for grouped view
  const groupedLinks = filteredLinks.reduce((acc, link) => {
    const userId = link.user_id || 'anonymous';
    if (!acc[userId]) {
      acc[userId] = {
        user_id: userId,
        user_name: link.user_name,
        user_email: link.user_email,
        links: []
      };
    }
    acc[userId].links.push(link);
    return acc;
  }, {});

  const groupedLinksArray = Object.values(groupedLinks).sort((a, b) =>
    b.links.length - a.links.length // Sort by number of links descending
  );

  const handlePdfUpload = async (event, item) => {
    const file = event.target.files[0];

    if (!file) return;

    if (!file.type.includes('pdf') && !file.name.toLowerCase().endsWith('.pdf')) {
      setError('Please select a PDF file (.pdf extension required)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('PDF file size should be less than 10MB');
      return;
    }

    try {
      setUploadingPdf(true);
      setSelectedItemForUpload(item);
      setUploadProgress(0);
      setError('');

      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      const formData = new FormData();
      formData.append('pdf', file);
      formData.append('link_id', item.id);
      formData.append('drive_link_1', item.drive_link_1);
      formData.append('drive_link_2', item.drive_link_2);

      const response = await fetch(`${API_URL}/drive-links/upload-pdf`, {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          setError('Upload requires admin authentication.');
        } else {
          const errorText = await response.text();
          throw new Error(errorText || 'Failed to upload PDF');
        }
        return;
      }

      const data = await response.json();
      setError('');

      setLinks(prevLinks =>
        prevLinks.map(link =>
          link.id === item.id
            ? {
              ...link,
              has_pdf: true,
              pdf_id: data.pdf_id,
              pdf_filename: data.filename,
              pdf_uploaded_at: data.uploaded_at
            }
            : link
        )
      );

      if (expandedRows[item.id]) {
        await fetchLinkPDFs(item.id);
      }

      alert(`✅ PDF uploaded successfully!\nFile: ${data.filename}`);

      setTimeout(() => {
        setUploadingPdf(false);
        setSelectedItemForUpload(null);
        setUploadProgress(0);
      }, 1000);

    } catch (err) {
      console.error('Error uploading PDF:', err);
      setError(`Failed to upload PDF: ${err.message}`);
      setUploadingPdf(false);
      setSelectedItemForUpload(null);
      setUploadProgress(0);
    } finally {
      event.target.value = '';
    }
  };

  const downloadPDF = async (pdfId, filename) => {
    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token');

      const response = await fetch(`${API_URL}/drive-links/pdf/download/${pdfId}`, {
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
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

    } catch (err) {
      console.error('Error downloading PDF:', err);
      setError('Failed to download PDF');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-50 rounded-lg">
                <Folder className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h1 className="text-sm font-semibold text-gray-900">Drive Links Repository</h1>
                <p className="text-[11px] text-gray-400 font-medium">Manage all portfolio links</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                {adminInfo?.name || 'Admin'}
              </div>
              <button
                onClick={fetchLinks}
                disabled={loading}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg text-xs font-semibold hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center"
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

      {/* Error Banner */}
      {error && (
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
              <span className="text-red-700 font-medium text-sm">{error}</span>
            </div>
            <button
              onClick={() => setError('')}
              className="text-red-500 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && linkToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Confirm Deletion</h3>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setLinkToDelete(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-gray-600 mb-6 text-sm">
                Are you sure you want to delete this drive link?
                <br />
                <span className="font-medium block mt-2 text-xs text-gray-800 truncate">{linkToDelete.drive_link_1?.substring(0, 50)}...</span>
                <span className="text-xs text-red-600 mt-2 block">
                  ⚠️ This will also delete all associated PDF files!
                </span>
              </p>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setLinkToDelete(null);
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteDriveLink(linkToDelete.id)}
                  disabled={deletingLink === linkToDelete.id}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-sm font-semibold"
                >
                  {deletingLink === linkToDelete.id ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Link
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Links', count: totalLinks, color: 'text-blue-600', bg: 'bg-white', icon: <LinkIcon className="w-5 h-5" /> },
            { label: 'Active Users', count: totalUsers, color: 'text-green-600', bg: 'bg-white', icon: <Users className="w-5 h-5" /> },
            { label: 'Uploaded PDFs', count: totalPDFs, color: 'text-purple-600', bg: 'bg-white', icon: <FileText className="w-5 h-5" /> },
            { label: 'Filtered Results', count: filteredLinks.length, color: 'text-orange-600', bg: 'bg-white', icon: <Hash className="w-5 h-5" /> },
          ].map((stat, i) => (
            <div key={i} className={`${stat.bg} p-5 rounded-xl border border-gray-200 shadow-sm transition-all hover:shadow-md`}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{stat.label}</p>
                  <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.count}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color.replace('text-', 'bg-')}/10`}>
                  <div className={stat.color}>{stat.icon}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Table Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
          {/* Table Toolbar */}
          <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-white">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by user, email, or link..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="relative w-full md:w-64">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all appearance-none"
              >
                {uniqueUsers.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.id === 'all' ? '👥 All Users' : `👤 ${user.name}`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Table Area */}
          <div className="flex-grow overflow-x-auto">
            <table className="w-full text-left border-collapse table-fixed min-w-[1400px]">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest w-[220px]">User Info</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest w-[400px]">Drive Links</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest w-[180px]">Upload Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest w-[180px]">PDF Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest w-[250px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center">
                        <Loader2 className="w-8 h-8 text-orange-500 animate-spin mb-3" />
                        <span className="text-sm font-medium text-gray-500">Loading drive links...</span>
                      </div>
                    </td>
                  </tr>
                ) : groupedLinksArray.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                          <LinkIcon className="w-6 h-6 text-gray-300" />
                        </div>
                        <h3 className="text-sm font-bold text-gray-900">No drive links found</h3>
                        <p className="text-xs text-gray-400 mt-1">Try adjusting your filters or search terms.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  groupedLinksArray.map((group) => (
                    <>
                      {/* User Group Header */}
                      <tr
                        key={`group-header-${group.user_id}`}
                        className="bg-blue-50/40 border-t-2 border-blue-200 hover:bg-blue-50/60 cursor-pointer transition-colors"
                        onClick={() => toggleUserGroup(group.user_id)}
                      >
                        <td colSpan="5" className="px-6 py-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-sm ${group.user_name && group.user_name !== 'Anonymous User'
                                ? 'bg-gradient-to-br from-blue-500 to-blue-600'
                                : 'bg-gradient-to-br from-gray-400 to-gray-500'
                                }`}>
                                <span className="text-white font-semibold text-sm">
                                  {getUserInitials(group.user_name)}
                                </span>
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-bold text-gray-900">
                                  {group.user_name || 'Anonymous User'}
                                </div>
                                <div className="flex items-center text-xs text-gray-500 mt-0.5">
                                  <Mail className="w-3 h-3 mr-1" />
                                  <span>{group.user_email || 'anonymous@example.com'}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="px-3 py-1.5 bg-orange-100 text-orange-700 rounded-full text-xs font-bold border border-orange-200">
                                {group.links.length} {group.links.length === 1 ? 'Submission' : 'Submissions'}
                              </span>
                              {expandedUserGroups[group.user_id] ? (
                                <ChevronUp className="w-5 h-5 text-gray-500" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-gray-500" />
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>

                      {/* Individual Links for this User - Only show when expanded */}
                      {expandedUserGroups[group.user_id] && group.links.map((item, linkIndex) => (
                        <>
                          {/* Main Row - Individual Link */}
                          <tr
                            key={`link-${item.id}`}
                            className="hover:bg-gray-50/80 transition-colors group cursor-pointer bg-white"
                            onClick={() => toggleRow(item.id)}
                          >
                            {/* Number Column (instead of user) */}
                            <td className="px-6 py-4">
                              <div className="pl-6 flex items-center">
                                <span className="text-xs font-bold text-gray-400">#{linkIndex + 1}</span>
                              </div>
                            </td>

                            {/* Links Column */}
                            <td className="px-6 py-4">
                              <div className="space-y-2">
                                {/* Link 1 */}
                                <div className="flex items-center space-x-2">
                                  <div className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                                    <span className="text-[10px] font-bold text-blue-600">1</span>
                                  </div>
                                  <a
                                    href={item.drive_link_1}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 text-xs font-medium truncate max-w-[250px] hover:underline"
                                    titleTitle={item.drive_link_1}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {item.drive_link_1}
                                  </a>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      copyToClipboard(item.drive_link_1);
                                    }}
                                    className={`p-1 rounded transition-all ${copiedLink === item.drive_link_1
                                      ? 'bg-green-100 text-green-600'
                                      : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
                                      }`}
                                    title="Copy"
                                  >
                                    <Copy className="w-3 h-3" />
                                  </button>
                                </div>
                                {/* Link 2 */}
                                <div className="flex items-center space-x-2">
                                  <div className="w-5 h-5 bg-green-100 rounded flex items-center justify-center flex-shrink-0">
                                    <span className="text-[10px] font-bold text-green-600">2</span>
                                  </div>
                                  <a
                                    href={item.drive_link_2}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-green-600 hover:text-green-800 text-xs font-medium truncate max-w-[250px] hover:underline"
                                    title={item.drive_link_2}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {item.drive_link_2}
                                  </a>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      copyToClipboard(item.drive_link_2);
                                    }}
                                    className={`p-1 rounded transition-all ${copiedLink === item.drive_link_2
                                      ? 'bg-green-100 text-green-600'
                                      : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                                      }`}
                                    title="Copy"
                                  >
                                    <Copy className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            </td>

                            {/* Date Column */}
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center text-sm text-gray-600">
                                <Calendar className="w-3.5 h-3.5 mr-2 text-gray-400" />
                                <span className="text-xs">{formatDate(item.created_at)}</span>
                              </div>
                            </td>

                            {/* PDF Status */}
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center text-xs">
                                {linkPDFs[item.id]?.length > 0 ? (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-700 border border-green-200 uppercase tracking-wider">
                                    <FileText className="w-3 h-3 mr-1" />
                                    {linkPDFs[item.id].length} PDF(s)
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold bg-gray-100 text-gray-500 border border-gray-200 uppercase tracking-wider">
                                    No PDFs
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Actions Column */}
                            <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center gap-2">
                                {/* Upload PDF */}
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
                                    className={`inline-flex items-center px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${uploadingPdf && selectedItemForUpload?.id === item.id
                                      ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                                      : 'bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-500 hover:text-white'
                                      }`}
                                    title="Upload PDF"
                                  >
                                    {uploadingPdf && selectedItemForUpload?.id === item.id ? (
                                      <>
                                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                        {uploadProgress}%
                                      </>
                                    ) : (
                                      <>
                                        <Upload className="w-3 h-3 mr-1" />
                                        ADD PDF
                                      </>
                                    )}
                                  </label>
                                </div>

                                {/* View PDFs */}
                                <button
                                  onClick={() => toggleRow(item.id)}
                                  className="inline-flex items-center px-3 py-1.5 rounded-lg text-[10px] font-bold bg-purple-50 text-purple-600 border border-purple-100 hover:bg-purple-500 hover:text-white transition-all"
                                  title="View PDFs"
                                >
                                  {expandedRows[item.id] ? (
                                    <>
                                      <ChevronUp className="w-3 h-3 mr-1" />
                                      HIDE
                                    </>
                                  ) : (
                                    <>
                                      <ChevronDown className="w-3 h-3 mr-1" />
                                      VIEW
                                    </>
                                  )}
                                </button>

                                {/* Delete */}
                                <button
                                  onClick={() => confirmDelete(item)}
                                  className="inline-flex items-center px-3 py-1.5 rounded-lg text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-500 hover:text-white transition-all"
                                  title="Delete Link"
                                >
                                  <Trash2 className="w-3 h-3 mr-1" />
                                  DELETE
                                </button>
                              </div>
                            </td>
                          </tr>

                          {/* Expanded Row - PDFs */}
                          {expandedRows[item.id] && (
                            <tr className="bg-gray-50">
                              <td colSpan="5" className="px-6 py-4">
                                <div className="bg-white rounded-lg border border-gray-200 p-4 ml-12">
                                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center">
                                    <FileText className="w-4 h-4 mr-2 text-purple-600" />
                                    Attached PDF Files
                                  </h4>

                                  {loadingPDFs[item.id] ? (
                                    <div className="flex items-center justify-center py-8">
                                      <Loader2 className="w-5 h-5 text-gray-400 animate-spin mr-2" />
                                      <span className="text-xs text-gray-500">Loading PDFs...</span>
                                    </div>
                                  ) : linkPDFs[item.id]?.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                      {linkPDFs[item.id].map((pdf) => (
                                        <div
                                          key={pdf.id}
                                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50/50 transition-all group"
                                        >
                                          <div className="flex items-center min-w-0 flex-1">
                                            <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center flex-shrink-0">
                                              <FileText className="w-4 h-4 text-red-600" />
                                            </div>
                                            <div className="ml-3 min-w-0 flex-1">
                                              <p className="text-xs font-semibold text-gray-900 truncate" title={pdf.filename}>
                                                {pdf.filename}
                                              </p>
                                              <p className="text-[10px] text-gray-500">
                                                {formatFileSize(pdf.file_size)} • {formatDate(pdf.uploaded_at)}
                                              </p>
                                            </div>
                                          </div>
                                          <button
                                            onClick={() => downloadPDF(pdf.pdf_id, pdf.filename)}
                                            className="ml-2 p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-100 rounded transition-all flex-shrink-0"
                                            title="Download PDF"
                                          >
                                            <Download className="w-4 h-4" />
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="text-center py-8">
                                      <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                      <p className="text-xs text-gray-500">No PDFs uploaded yet</p>
                                      <p className="text-[10px] text-gray-400 mt-1">Use the "ADD PDF" button to upload files</p>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
                      ))}
                    </>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          {!loading && filteredLinks.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between mt-auto">
              <div className="flex items-center text-xs text-gray-500 font-medium">
                Showing <span className="mx-1 text-gray-900 font-bold">{filteredLinks.length}</span> of
                <span className="mx-1 text-gray-900 font-bold">{totalLinks}</span> total links
              </div>
              <div className="text-xs text-gray-500 bg-white px-3 py-1.5 rounded-lg border border-gray-200">
                <span className="font-medium">Live Data</span> • Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}