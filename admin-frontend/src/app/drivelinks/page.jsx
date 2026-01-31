// 'use client';

// import { useState, useEffect } from 'react';
// import {
//   ExternalLink,
//   Copy,
//   Calendar,
//   RefreshCw,
//   Loader2,
//   Link as LinkIcon,
//   User,
//   Clock,
//   FileText,
//   X,
//   Mail,
//   Users,
//   Hash,
//   Folder,
//   LogIn,
//   AlertCircle,
//   Upload
// } from 'lucide-react';
// import { useRouter } from 'next/navigation';

// export default function HomePage() {
//   const [links, setLinks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [copiedLink, setCopiedLink] = useState('');
//   const [selectedUser, setSelectedUser] = useState('all');
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [adminInfo, setAdminInfo] = useState(null);

//   // PDF Upload states
//   const [uploadingPdf, setUploadingPdf] = useState(false);
//   const [selectedItemForUpload, setSelectedItemForUpload] = useState(null);
//   const [uploadProgress, setUploadProgress] = useState(0);

//   const router = useRouter();
//   const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

//   // Check authentication on component mount
//   useEffect(() => {
//     checkAdminAuth();
//     fetchLinks();
//   }, []);

//   // Simple admin authentication check
//   const checkAdminAuth = () => {
//     const isAdminLoggedIn = localStorage.getItem('is_admin') === 'true';
//     if (isAdminLoggedIn) {
//       setIsAdmin(true);
//       setAdminInfo({
//         name: localStorage.getItem('admin_name') || 'Admin',
//         loginTime: localStorage.getItem('admin_login_time')
//       });
//     } else {
//       setIsAdmin(false);
//       setAdminInfo(null);
//     }
//   };

//   // Fetch links - NO AUTHENTICATION HEADER NEEDED!
//   const fetchLinks = async () => {
//     try {
//       setLoading(true);

//       // No Authorization header needed - backend should allow public access for GET
//       const response = await fetch(`${API_URL}/drive-links/`);

//       if (!response.ok) {
//         throw new Error('Failed to fetch links');
//       }

//       const data = await response.json();
//       setLinks(data);
//       setError('');

//     } catch (err) {
//       setError('Error loading links. Please try again.');
//       console.error('Error fetching links:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Copy link to clipboard
//   const copyToClipboard = async (text) => {
//     try {
//       await navigator.clipboard.writeText(text);
//       setCopiedLink(text);
//       setTimeout(() => setCopiedLink(''), 2000);
//     } catch (err) {
//       console.error('Failed to copy:', err);
//     }
//   };

//   // Format date
//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   // Get user initials for avatar
//   const getUserInitials = (userName) => {
//     if (!userName || userName === 'Anonymous User') return 'AU';
//     const names = userName.split(' ');
//     if (names.length >= 2) {
//       return `${names[0][0]}${names[1][0]}`.toUpperCase();
//     }
//     return userName[0]?.toUpperCase() || 'U';
//   };

//   // Get unique users for filter dropdown
//   const uniqueUsers = [
//     { id: 'all', name: 'All Users', email: '' },
//     ...Array.from(new Map(links.map(link => [
//       link.user_id,
//       { id: link.user_id, name: link.user_name || `User ${link.user_id?.slice(-4) || 'unknown'}`, email: link.user_email }
//     ])).values())
//   ];

//   // Filter links by selected user
//   const filteredLinks = selectedUser === 'all'
//     ? links
//     : links.filter(link => link.user_id === selectedUser);

//   // Calculate statistics
//   const totalLinks = links.length;
//   const totalUsers = new Set(links.map(link => link.user_id).filter(id => id && id !== 'anonymous')).size;

//   // FIXED: Handle PDF upload WITHOUT JWT token issues
//   const handlePdfUpload = async (event, item) => {
//     const file = event.target.files[0];

//     if (!file) return;

//     // Check if file is PDF
//     if (!file.type.includes('pdf') && !file.name.toLowerCase().endsWith('.pdf')) {
//       setError('Please select a PDF file (.pdf extension required)');
//       return;
//     }

//     // Check file size (limit to 10MB)
//     if (file.size > 10 * 1024 * 1024) {
//       setError('PDF file size should be less than 10MB');
//       return;
//     }

//     // Check if admin is logged in
//     if (!isAdmin) {
//       setError('Please login as admin to upload PDF files');
//       if (confirm('Admin login required. Go to login page?')) {
//         router.push('/login');
//       }
//       return;
//     }

//     try {
//       setUploadingPdf(true);
//       setSelectedItemForUpload(item);
//       setUploadProgress(0);
//       setError('');

//       // Simulate upload progress
//       const progressInterval = setInterval(() => {
//         setUploadProgress(prev => {
//           if (prev >= 90) {
//             clearInterval(progressInterval);
//             return 90;
//           }
//           return prev + 10;
//         });
//       }, 100);

//       // Create form data
//       const formData = new FormData();
//       formData.append('pdf', file);
//       formData.append('link_id', item.id);
//       formData.append('drive_link_1', item.drive_link_1);
//       formData.append('drive_link_2', item.drive_link_2);

//       // ✅ FIXED: Upload WITHOUT Authorization header
//       // Backend should accept uploads without JWT for admin panel
//       const response = await fetch(`${API_URL}/drive-links/upload-pdf`, {
//         method: 'POST',
//         body: formData,
//       });

//       clearInterval(progressInterval);
//       setUploadProgress(100);

//       if (!response.ok) {
//         // If 401/403, it means backend still requires auth
//         if (response.status === 401 || response.status === 403) {
//           setError('Upload requires admin authentication. Please ensure backend is configured correctly.');
//           console.warn('Backend still requires JWT auth. Update your FastAPI to accept uploads without tokens.');
//         } else {
//           const errorText = await response.text();
//           throw new Error(errorText || 'Failed to upload PDF');
//         }
//         return;
//       }

//       const data = await response.json();

//       // Show success message
//       setError('');

//       // Update the UI locally
//       setLinks(prevLinks =>
//         prevLinks.map(link =>
//           link.id === item.id
//             ? {
//               ...link,
//               has_pdf: true,
//               pdf_id: data.pdf_id,
//               pdf_filename: data.filename,
//               pdf_uploaded_at: data.uploaded_at
//             }
//             : link
//         )
//       );

//       // Show success alert
//       alert(`✅ PDF uploaded successfully!\nFile: ${data.filename}`);

//       // Reset after a short delay
//       setTimeout(() => {
//         setUploadingPdf(false);
//         setSelectedItemForUpload(null);
//         setUploadProgress(0);
//       }, 1000);

//     } catch (err) {
//       console.error('Error uploading PDF:', err);
//       setError(`Failed to upload PDF: ${err.message}`);
//       setUploadingPdf(false);
//       setSelectedItemForUpload(null);
//       setUploadProgress(0);
//     } finally {
//       // Reset file input
//       event.target.value = '';
//     }
//   };

//   // Logout function
//   const handleLogout = () => {
//     localStorage.removeItem('is_admin');
//     localStorage.removeItem('admin_name');
//     localStorage.removeItem('admin_login_time');
//     setIsAdmin(false);
//     setAdminInfo(null);
//     router.push('/login');
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center py-4">
//             <div className="flex items-center">
//               <div className="flex items-center">
//                 <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center mr-3">
//                   <Folder className="w-6 h-6 text-white" />
//                 </div>
//                 <div>
//                   <h1 className="text-2xl font-bold text-gray-900">Drive Links Manager</h1>
//                   <p className="text-gray-600 text-sm">Admin Dashboard</p>
//                 </div>
//               </div>
//             </div>

//             <div className="flex items-center space-x-4">
//               {/* Admin Status */}
//               {isAdmin ? (
//                 <div className="flex items-center space-x-3">
//                   <div className="text-right">
//                     <div className="text-sm font-medium text-gray-900">{adminInfo?.name || 'Admin'}</div>
//                     <div className="text-xs text-gray-500">Administrator</div>
//                   </div>
//                   <button
//                     onClick={handleLogout}
//                     className="px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
//                   >
//                     Logout
//                   </button>
//                 </div>
//               ) : (
//                 <button
//                   onClick={() => router.push('/login')}
//                   className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-md text-sm font-medium flex items-center transition-all duration-200 shadow-sm"
//                 >
//                   <LogIn className="w-4 h-4 mr-2" />
//                   Admin Login
//                 </button>
//               )}

//               <button
//                 onClick={fetchLinks}
//                 disabled={loading}
//                 className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-md text-sm font-medium flex items-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
//               >
//                 {loading ? (
//                   <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                 ) : (
//                   <RefreshCw className="w-4 h-4 mr-2" />
//                 )}
//                 Refresh
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Error Banner */}
//       {error && (
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
//           <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between">
//             <div className="flex items-center">
//               <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
//               <span className="text-red-700 font-medium">{error}</span>
//             </div>
//             <button
//               onClick={() => setError('')}
//               className="text-red-500 hover:text-red-700"
//             >
//               <X className="w-4 h-4" />
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Dashboard Content */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Statistics Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//           <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
//             <div className="flex items-center">
//               <div className="flex-shrink-0">
//                 <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center">
//                   <LinkIcon className="w-6 h-6 text-blue-600" />
//                 </div>
//               </div>
//               <div className="ml-4">
//                 <h3 className="text-2xl font-bold text-gray-900">{totalLinks}</h3>
//                 <p className="text-gray-600 text-sm font-medium">Total Links</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
//             <div className="flex items-center">
//               <div className="flex-shrink-0">
//                 <div className="w-12 h-12 bg-gradient-to-br from-green-50 to-green-100 rounded-xl flex items-center justify-center">
//                   <Users className="w-6 h-6 text-green-600" />
//                 </div>
//               </div>
//               <div className="ml-4">
//                 <h3 className="text-2xl font-bold text-gray-900">{totalUsers}</h3>
//                 <p className="text-gray-600 text-sm font-medium">Active Users</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
//             <div className="flex items-center">
//               <div className="flex-shrink-0">
//                 <div className="w-12 h-12 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl flex items-center justify-center">
//                   <Clock className="w-6 h-6 text-purple-600" />
//                 </div>
//               </div>
//               <div className="ml-4">
//                 <h3 className="text-2xl font-bold text-gray-900">
//                   {links.length > 0 ? formatDate(links[0].created_at) : 'No data'}
//                 </h3>
//                 <p className="text-gray-600 text-sm font-medium">Latest Upload</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
//             <div className="flex items-center">
//               <div className="flex-shrink-0">
//                 <div className="w-12 h-12 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl flex items-center justify-center">
//                   <Hash className="w-6 h-6 text-orange-600" />
//                 </div>
//               </div>
//               <div className="ml-4">
//                 <h3 className="text-2xl font-bold text-gray-900">{filteredLinks.length}</h3>
//                 <p className="text-gray-600 text-sm font-medium">Filtered Links</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//           {/* Table Header */}
//           <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
//             <div className="flex flex-col md:flex-row md:items-center justify-between">
//               <div>
//                 <h2 className="text-xl font-bold text-gray-900">Drive Links Repository</h2>
//                 <p className="text-gray-600 text-sm mt-1">All uploaded Google Drive links</p>
//               </div>

//               <div className="mt-4 md:mt-0">
//                 <div className="flex items-center space-x-4">
//                   <div className="relative">
//                     <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                     <select
//                       value={selectedUser}
//                       onChange={(e) => setSelectedUser(e.target.value)}
//                       className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white w-full md:w-64"
//                     >
//                       {uniqueUsers.map(user => (
//                         <option key={user.id} value={user.id}>
//                           {user.id === 'all' ? '👥 All Users' : `👤 ${user.name}`}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Loading State */}
//           {loading ? (
//             <div className="flex flex-col justify-center items-center py-20">
//               <div className="relative">
//                 <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
//                 <div className="absolute inset-0 flex items-center justify-center">
//                   <Loader2 className="w-8 h-8 text-blue-600" />
//                 </div>
//               </div>
//               <span className="mt-6 text-gray-600 font-medium">Loading drive links...</span>
//               <p className="text-gray-500 text-sm mt-2">Fetching data from the server</p>
//             </div>
//           ) : filteredLinks.length === 0 ? (
//             <div className="text-center py-20">
//               <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
//                 <LinkIcon className="w-10 h-10 text-gray-400" />
//               </div>
//               <h3 className="text-xl font-semibold text-gray-900 mb-3">No Drive Links Found</h3>
//               <p className="text-gray-600 max-w-md mx-auto mb-8">
//                 {selectedUser === 'all'
//                   ? 'No Google Drive links have been uploaded yet.'
//                   : `No drive links found for the selected user. Try selecting "All Users" to see all links.`}
//               </p>
//               <button
//                 onClick={fetchLinks}
//                 className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium"
//               >
//                 Refresh Data
//               </button>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead>
//                   <tr className="bg-gray-50">
//                     <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                       User
//                     </th>
//                     <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                       Drive Links
//                     </th>
//                     <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                       Upload Date
//                     </th>
//                     <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-100">
//                   {filteredLinks.map((item) => (
//                     <tr key={item.id} className="hover:bg-gray-50/50 transition-colors duration-150">
//                       {/* User Column */}
//                       <td className="px-6 py-5">
//                         <div className="flex items-center">
//                           <div className="flex-shrink-0">
//                             <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-sm ${item.user_name && item.user_name !== 'Anonymous User'
//                                 ? 'bg-gradient-to-br from-blue-500 to-blue-600'
//                                 : 'bg-gradient-to-br from-gray-400 to-gray-500'
//                               }`}>
//                               <span className="text-white font-semibold text-sm">
//                                 {getUserInitials(item.user_name)}
//                               </span>
//                             </div>
//                           </div>
//                           <div className="ml-4">
//                             <div className="flex items-center">
//                               <div className="text-sm font-semibold text-gray-900">
//                                 {item.user_name || 'Anonymous User'}
//                               </div>
//                             </div>
//                             <div className="flex items-center text-xs text-gray-600 mt-1">
//                               <Mail className="w-3 h-3 mr-1.5 flex-shrink-0" />
//                               <span className="truncate max-w-[180px]" title={item.user_email}>
//                                 {item.user_email || 'anonymous@example.com'}
//                               </span>
//                             </div>
//                           </div>
//                         </div>
//                       </td>

//                       {/* Links Column */}
//                       <td className="px-6 py-5">
//                         <div className="space-y-4">
//                           {/* Drive Link 1 */}
//                           <div>
//                             <div className="flex items-center justify-between mb-2">
//                               <div className="flex items-center">
//                                 <div className="w-6 h-6 bg-gradient-to-br from-blue-100 to-blue-50 rounded-md flex items-center justify-center mr-2">
//                                   <span className="text-xs font-bold text-blue-600">1</span>
//                                 </div>
//                                 <span className="text-xs font-semibold text-gray-700">Drive Link 1</span>
//                               </div>
//                             </div>
//                             <div className="flex items-center space-x-2">
//                               <div className="flex-1 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 px-4 py-3 hover:border-blue-300 transition-colors">
//                                 <a
//                                   href={item.drive_link_1}
//                                   target="_blank"
//                                   rel="noopener noreferrer"
//                                   className="text-blue-600 hover:text-blue-800 text-sm font-medium truncate block group"
//                                   title={item.drive_link_1}
//                                 >
//                                   <span className="group-hover:underline">{item.drive_link_1}</span>
//                                   <ExternalLink className="w-3.5 h-3.5 inline ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
//                                 </a>
//                               </div>
//                               <div className="flex space-x-1.5">
//                                 <button
//                                   onClick={() => copyToClipboard(item.drive_link_1)}
//                                   className={`p-2 rounded-lg transition-all duration-200 ${copiedLink === item.drive_link_1
//                                       ? 'bg-gradient-to-br from-green-100 to-green-50 text-green-600 shadow-sm'
//                                       : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
//                                     }`}
//                                   title="Copy link"
//                                 >
//                                   <Copy className="w-4 h-4" />
//                                 </button>
//                                 <a
//                                   href={item.drive_link_1}
//                                   target="_blank"
//                                   rel="noopener noreferrer"
//                                   className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                                   title="Open link"
//                                 >
//                                   <ExternalLink className="w-4 h-4" />
//                                 </a>
//                               </div>
//                             </div>
//                           </div>

//                           {/* Drive Link 2 */}
//                           <div>
//                             <div className="flex items-center justify-between mb-2">
//                               <div className="flex items-center">
//                                 <div className="w-6 h-6 bg-gradient-to-br from-green-100 to-green-50 rounded-md flex items-center justify-center mr-2">
//                                   <span className="text-xs font-bold text-green-600">2</span>
//                                 </div>
//                                 <span className="text-xs font-semibold text-gray-700">Drive Link 2</span>
//                               </div>
//                             </div>
//                             <div className="flex items-center space-x-2">
//                               <div className="flex-1 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 px-4 py-3 hover:border-green-300 transition-colors">
//                                 <a
//                                   href={item.drive_link_2}
//                                   target="_blank"
//                                   rel="noopener noreferrer"
//                                   className="text-green-600 hover:text-green-800 text-sm font-medium truncate block group"
//                                   title={item.drive_link_2}
//                                 >
//                                   <span className="group-hover:underline">{item.drive_link_2}</span>
//                                   <ExternalLink className="w-3.5 h-3.5 inline ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
//                                 </a>
//                               </div>
//                               <div className="flex space-x-1.5">
//                                 <button
//                                   onClick={() => copyToClipboard(item.drive_link_2)}
//                                   className={`p-2 rounded-lg transition-all duration-200 ${copiedLink === item.drive_link_2
//                                       ? 'bg-gradient-to-br from-green-100 to-green-50 text-green-600 shadow-sm'
//                                       : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
//                                     }`}
//                                   title="Copy link"
//                                 >
//                                   <Copy className="w-4 h-4" />
//                                 </button>
//                                 <a
//                                   href={item.drive_link_2}
//                                   target="_blank"
//                                   rel="noopener noreferrer"
//                                   className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
//                                   title="Open link"
//                                 >
//                                   <ExternalLink className="w-4 h-4" />
//                                 </a>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </td>

//                       {/* Date Column */}
//                       <td className="px-6 py-5 whitespace-nowrap">
//                         <div className="flex items-center text-sm text-gray-900 font-medium">
//                           <Calendar className="w-4 h-4 mr-2.5 text-gray-400 flex-shrink-0" />
//                           {formatDate(item.created_at)}
//                         </div>
//                         {item.has_pdf && (
//                           <div className="mt-3">
//                             <div className="text-xs text-gray-600 font-medium mb-1 flex items-center">
//                               <FileText className="w-3 h-3 mr-1" />
//                               PDF Uploaded
//                             </div>
//                             {item.pdf_filename && (
//                               <div className="text-xs text-gray-500 truncate" title={item.pdf_filename}>
//                                 {item.pdf_filename}
//                               </div>
//                             )}
//                           </div>
//                         )}
//                       </td>

//                       {/* Actions Column */}
//                       <td className="px-6 py-5 whitespace-nowrap">
//                         <div className="flex flex-col space-y-3">
//                           <div className="flex space-x-2">
//                             {/* Upload PDF Button with hidden file input */}
//                             <div className="relative">
//                               <input
//                                 type="file"
//                                 id={`pdf-upload-${item.id}`}
//                                 className="hidden"
//                                 accept=".pdf,application/pdf"
//                                 onChange={(e) => handlePdfUpload(e, item)}
//                                 disabled={uploadingPdf && selectedItemForUpload?.id === item.id}
//                               />
//                               <label
//                                 htmlFor={`pdf-upload-${item.id}`}
//                                 className={`inline-flex items-center justify-center px-4 py-2 border rounded-lg text-sm font-medium transition-all duration-200 shadow-sm cursor-pointer ${uploadingPdf && selectedItemForUpload?.id === item.id
//                                     ? 'border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed'
//                                     : isAdmin && item.has_pdf
//                                       ? 'border-green-600 text-green-700 bg-gradient-to-r from-green-50 to-green-25 hover:from-green-100 hover:to-green-50'
//                                       : isAdmin
//                                         ? 'border-blue-600 text-blue-700 bg-gradient-to-r from-blue-50 to-blue-25 hover:from-blue-100 hover:to-blue-50 hover:border-blue-700'
//                                         : 'border-gray-400 text-gray-500 bg-gradient-to-r from-gray-50 to-gray-25 cursor-not-allowed'
//                                   }`}
//                                 title={isAdmin
//                                   ? item.has_pdf ? "Add another PDF" : "Upload PDF file"
//                                   : "Admin login required to upload PDF"
//                                 }
//                               >
//                                 {uploadingPdf && selectedItemForUpload?.id === item.id ? (
//                                   <>
//                                     <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
//                                     Uploading...
//                                   </>
//                                 ) : !isAdmin ? (
//                                   <>
//                                     <LogIn className="w-3.5 h-3.5 mr-1.5" />
//                                     Login to Upload
//                                   </>
//                                 ) : item.has_pdf ? (
//                                   <>
//                                     <Upload className="w-3.5 h-3.5 mr-1.5" />
//                                     Add PDF
//                                   </>
//                                 ) : (
//                                   <>
//                                     <Upload className="w-3.5 h-3.5 mr-1.5" />
//                                     Upload PDF
//                                   </>
//                                 )}
//                               </label>

//                               {/* Upload Progress Indicator */}
//                               {uploadingPdf && selectedItemForUpload?.id === item.id && uploadProgress > 0 && (
//                                 <div className="absolute -bottom-6 left-0 right-0">
//                                   <div className="text-xs text-gray-500 text-center mb-1">
//                                     {uploadProgress}%
//                                   </div>
//                                   <div className="w-full bg-gray-200 rounded-full h-1.5">
//                                     <div
//                                       className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
//                                       style={{ width: `${uploadProgress}%` }}
//                                     ></div>
//                                   </div>
//                                 </div>
//                               )}
//                             </div>

//                             {/* Copy All Button */}
//                             <button
//                               onClick={() => {
//                                 const combinedLinks = `Drive Link 1:\n${item.drive_link_1}\n\nDrive Link 2:\n${item.drive_link_2}`;
//                                 copyToClipboard(combinedLinks);
//                               }}
//                               disabled={uploadingPdf && selectedItemForUpload?.id === item.id}
//                               className={`inline-flex items-center justify-center px-4 py-2 border rounded-lg text-sm font-medium transition-colors shadow-sm ${uploadingPdf && selectedItemForUpload?.id === item.id
//                                   ? 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed'
//                                   : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
//                                 }`}
//                             >
//                               <Copy className="w-3.5 h-3.5 mr-1.5" />
//                               Copy All
//                             </button>
//                           </div>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>

//         {/* Footer Stats */}
//         {!loading && filteredLinks.length > 0 && (
//           <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
//             <div className="flex flex-col md:flex-row md:items-center justify-between">
//               <div className="flex flex-wrap items-center gap-4">
//                 <div className="flex items-center">
//                   <div className="w-8 h-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center mr-2.5">
//                     <LinkIcon className="w-4 h-4 text-blue-600" />
//                   </div>
//                   <div>
//                     <div className="text-sm font-medium text-gray-900">{filteredLinks.length} link sets</div>
//                     <div className="text-xs text-gray-500">Currently showing</div>
//                   </div>
//                 </div>
//                 <div className="flex items-center">
//                   <div className="w-8 h-8 bg-gradient-to-br from-green-50 to-green-100 rounded-lg flex items-center justify-center mr-2.5">
//                     <User className="w-4 h-4 text-green-600" />
//                   </div>
//                   <div>
//                     <div className="text-sm font-medium text-gray-900">
//                       {selectedUser === 'all'
//                         ? `${totalUsers} active users`
//                         : `Filtered by: ${uniqueUsers.find(u => u.id === selectedUser)?.name}`}
//                     </div>
//                     <div className="text-xs text-gray-500">User filter applied</div>
//                   </div>
//                 </div>
//               </div>
//               <div className="mt-4 md:mt-0">
//                 <div className="text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border">
//                   <span className="font-medium">Live Data</span> • Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

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
  LogIn,
  AlertCircle,
  Upload,
  Trash2,
  Eye,
  Download,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedLink, setCopiedLink] = useState('');
  const [selectedUser, setSelectedUser] = useState('all');
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminInfo, setAdminInfo] = useState(null);
  const [expandedRows, setExpandedRows] = useState({});
  const [linkPDFs, setLinkPDFs] = useState({});

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
    setAdminInfo({
      name: localStorage.getItem('admin_name') || 'Admin User',
      loginTime: localStorage.getItem('admin_login_time') || Date.now()
    });
  };

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/drive-links/`);

      if (!response.ok) {
        throw new Error('Failed to fetch links');
      }

      const data = await response.json();
      setLinks(data);
      setError('');

    } catch (err) {
      setError('Error loading links. Please try again.');
      console.error('Error fetching links:', err);
    } finally {
      setLoading(false);
    }
  };

  // DELETE FUNCTION: Delete a drive link
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

      // Remove the deleted link from state
      setLinks(prevLinks => prevLinks.filter(link => link.id !== linkId));

      // Show success message
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

  // Fetch PDFs for a specific link
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

  // Toggle expanded row
  const toggleRow = async (linkId) => {
    const isExpanded = expandedRows[linkId];
    setExpandedRows(prev => ({ ...prev, [linkId]: !isExpanded }));

    // If expanding and haven't loaded PDFs yet, fetch them
    if (!isExpanded && !linkPDFs[linkId]) {
      await fetchLinkPDFs(linkId);
    }
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

  const uniqueUsers = [
    { id: 'all', name: 'All Users', email: '' },
    ...Array.from(new Map(links.map(link => [
      link.user_id,
      { id: link.user_id, name: link.user_name || `User ${link.user_id?.slice(-4) || 'unknown'}`, email: link.user_email }
    ])).values())
  ];

  const filteredLinks = selectedUser === 'all'
    ? links
    : links.filter(link => link.user_id === selectedUser);

  const totalLinks = links.length;
  const totalUsers = new Set(links.map(link => link.user_id).filter(id => id && id !== 'anonymous')).size;

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

    if (!isAdmin) {
      // In bypass mode this shouldn't happen, but good to keep the check
      setIsAdmin(true);
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

      // Update the link
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

      // Refresh PDFs for this link
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

  const handleLogout = () => {
    localStorage.clear();
    router.push('/');
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
    <div className="min-h-screen bg-gray-50">
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
                  <p className="text-gray-600 text-sm">Admin Dashboard</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{adminInfo?.name || 'Admin'}</div>
                  <div className="text-xs text-gray-500">Administrator</div>
                </div>
              </div>

              <button
                onClick={fetchLinks}
                disabled={loading}
                className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-md text-sm font-medium flex items-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
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

      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
              <span className="text-red-700 font-medium">{error}</span>
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

      {showDeleteConfirm && linkToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Confirm Delete</h3>
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

              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this drive link?
                <br />
                <span className="font-medium">{linkToDelete.drive_link_1?.substring(0, 50)}...</span>
                <br />
                <span className="text-sm text-red-600 mt-2 block">
                  ⚠️ This will also delete all associated PDF files!
                </span>
              </p>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setLinkToDelete(null);
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteDriveLink(linkToDelete.id)}
                  disabled={deletingLink === linkToDelete.id}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Drive Links Repository</h2>
                <p className="text-gray-600 text-sm mt-1">Click on any row to view uploaded PDFs</p>
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
                          {user.id === 'all' ? '👥 All Users' : `👤 ${user.name}`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

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
          ) : filteredLinks.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
                <LinkIcon className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">No Drive Links Found</h3>
              <p className="text-gray-600 max-w-md mx-auto mb-8">
                {selectedUser === 'all'
                  ? 'No Google Drive links have been uploaded yet.'
                  : `No drive links found for the selected user. Try selecting "All Users" to see all links.`}
              </p>
              <button
                onClick={fetchLinks}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium"
              >
                Refresh Data
              </button>
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
                    <>
                      <tr
                        key={item.id}
                        className="hover:bg-gray-50/50 transition-colors duration-150 cursor-pointer"
                        onClick={() => toggleRow(item.id)}
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-sm ${item.user_name && item.user_name !== 'Anonymous User'
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
                                </div>
                              </div>
                              <div className="flex items-center text-xs text-gray-600 mt-1">
                                <Mail className="w-3 h-3 mr-1.5 flex-shrink-0" />
                                <span className="truncate max-w-[180px]" title={item.user_email}>
                                  {item.user_email || 'anonymous@example.com'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <div className="space-y-4">
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center">
                                  <div className="w-6 h-6 bg-gradient-to-br from-blue-100 to-blue-50 rounded-md flex items-center justify-center mr-2">
                                    <span className="text-xs font-bold text-blue-600">1</span>
                                  </div>
                                  <span className="text-xs font-semibold text-gray-700">Drive Link 1</span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="flex-1 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 px-4 py-3 hover:border-blue-300 transition-colors">
                                  <a
                                    href={item.drive_link_1}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium truncate block group"
                                    title={item.drive_link_1}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <span className="group-hover:underline">{item.drive_link_1}</span>
                                    <ExternalLink className="w-3.5 h-3.5 inline ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                                  </a>
                                </div>
                                <div className="flex space-x-1.5" onClick={(e) => e.stopPropagation()}>
                                  <button
                                    onClick={() => copyToClipboard(item.drive_link_1)}
                                    className={`p-2 rounded-lg transition-all duration-200 ${copiedLink === item.drive_link_1
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

                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center">
                                  <div className="w-6 h-6 bg-gradient-to-br from-green-100 to-green-50 rounded-md flex items-center justify-center mr-2">
                                    <span className="text-xs font-bold text-green-600">2</span>
                                  </div>
                                  <span className="text-xs font-semibold text-gray-700">Drive Link 2</span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="flex-1 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 px-4 py-3 hover:border-green-300 transition-colors">
                                  <a
                                    href={item.drive_link_2}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-green-600 hover:text-green-800 text-sm font-medium truncate block group"
                                    title={item.drive_link_2}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <span className="group-hover:underline">{item.drive_link_2}</span>
                                    <ExternalLink className="w-3.5 h-3.5 inline ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                                  </a>
                                </div>
                                <div className="flex space-x-1.5" onClick={(e) => e.stopPropagation()}>
                                  <button
                                    onClick={() => copyToClipboard(item.drive_link_2)}
                                    className={`p-2 rounded-lg transition-all duration-200 ${copiedLink === item.drive_link_2
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

                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900 font-medium">
                            <Calendar className="w-4 h-4 mr-2.5 text-gray-400 flex-shrink-0" />
                            {formatDate(item.created_at)}
                          </div>
                          {item.has_pdf && (
                            <div className="mt-3">
                              <div className="text-xs text-gray-600 font-medium mb-1 flex items-center">
                                <FileText className="w-3 h-3 mr-1" />
                                {linkPDFs[item.id]?.length || 0} PDF(s)
                              </div>
                              {item.pdf_filename && (
                                <div className="text-xs text-gray-500 truncate" title={item.pdf_filename}>
                                  Latest: {item.pdf_filename}
                                </div>
                              )}
                            </div>
                          )}
                        </td>

                        <td className="px-6 py-5 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <div className="flex flex-col space-y-3">
                            <div className="flex space-x-2">
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
                                  className={`inline-flex items-center justify-center px-4 py-2 border rounded-lg text-sm font-medium transition-all duration-200 shadow-sm cursor-pointer ${uploadingPdf && selectedItemForUpload?.id === item.id
                                    ? 'border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed'
                                    : isAdmin && item.has_pdf
                                      ? 'border-green-600 text-green-700 bg-gradient-to-r from-green-50 to-green-25 hover:from-green-100 hover:to-green-50'
                                      : isAdmin
                                        ? 'border-blue-600 text-blue-700 bg-gradient-to-r from-blue-50 to-blue-25 hover:from-blue-100 hover:to-blue-50 hover:border-blue-700'
                                        : 'border-gray-400 text-gray-500 bg-gradient-to-r from-gray-50 to-gray-25 cursor-not-allowed'
                                    }`}
                                  title={isAdmin
                                    ? item.has_pdf ? "Add another PDF" : "Upload PDF file"
                                    : "Admin login required to upload PDF"
                                  }
                                >
                                  {uploadingPdf && selectedItemForUpload?.id === item.id ? (
                                    <>
                                      <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                                      Uploading...
                                    </>
                                  ) : !isAdmin ? (
                                    <>
                                      <LogIn className="w-3.5 h-3.5 mr-1.5" />
                                      Login to Upload
                                    </>
                                  ) : item.has_pdf ? (
                                    <>
                                      <Upload className="w-3.5 h-3.5 mr-1.5" />
                                      Add PDF
                                    </>
                                  ) : (
                                    <>
                                      <Upload className="w-3.5 h-3.5 mr-1.5" />
                                      Upload PDF
                                    </>
                                  )}
                                </label>
                              </div>

                              <button
                                onClick={() => confirmDelete(item)}
                                disabled={!isAdmin || deletingLink === item.id}
                                className="inline-flex items-center justify-center px-4 py-2 border border-red-300 text-red-700 bg-red-50 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Delete this link"
                              >
                                {deletingLink === item.id ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Trash2 className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>

                            <button
                              onClick={() => toggleRow(item.id)}
                              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors"
                            >
                              {expandedRows[item.id] ? (
                                <>
                                  <ChevronUp className="w-3.5 h-3.5 mr-1.5" />
                                  Hide PDFs
                                </>
                              ) : (
                                <>
                                  <Eye className="w-3.5 h-3.5 mr-1.5" />
                                  View PDFs ({item.has_pdf ? linkPDFs[item.id]?.length || '?' : 0})
                                </>
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expanded Row - PDFs List */}
                      {expandedRows[item.id] && (
                        <tr className="bg-blue-50">
                          <td colSpan={4} className="px-6 py-6">
                            <div className="bg-white rounded-lg border border-gray-200 p-4">
                              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                                Uploaded PDFs for this Link
                              </h4>

                              {loadingPDFs[item.id] ? (
                                <div className="flex justify-center py-8">
                                  <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                                  <span className="ml-3 text-gray-600">Loading PDFs...</span>
                                </div>
                              ) : linkPDFs[item.id]?.length > 0 ? (
                                <div className="space-y-3">
                                  {linkPDFs[item.id].map((pdf, index) => (
                                    <div key={pdf.pdf_id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                                      <div className="flex items-center space-x-4">
                                        <div className="w-10 h-12 bg-red-100 rounded flex items-center justify-center">
                                          <FileText className="w-5 h-5 text-red-600" />
                                        </div>
                                        <div>
                                          <h5 className="font-medium text-gray-900">{pdf.filename}</h5>
                                          <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                                            <span className="flex items-center">
                                              <Calendar className="w-3 h-3 mr-1" />
                                              {formatDate(pdf.uploaded_at)}
                                            </span>
                                            <span className="flex items-center">
                                              <FileText className="w-3 h-3 mr-1" />
                                              {formatFileSize(pdf.file_size)}
                                            </span>
                                            <span className="flex items-center">
                                              <User className="w-3 h-3 mr-1" />
                                              {pdf.uploaded_by?.user_name || 'Unknown'}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex space-x-2">
                                        <button
                                          onClick={() => downloadPDF(pdf.pdf_id, pdf.filename)}
                                          className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                                        >
                                          <Download className="w-3.5 h-3.5 mr-1.5" />
                                          Download
                                        </button>
                                        <a
                                          href={`${API_URL}/drive-links/pdf/view/${pdf.pdf_id}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="px-3 py-1.5 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                                        >
                                          <Eye className="w-3.5 h-3.5 mr-1.5" />
                                          View
                                        </a>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center py-8">
                                  <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <FileText className="w-8 h-8 text-gray-400" />
                                  </div>
                                  <p className="text-gray-600 font-medium">No PDFs uploaded yet</p>
                                  <p className="text-gray-500 text-sm mt-1">Upload a PDF using the "Upload PDF" button above</p>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

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
                  <span className="font-medium">Live Data</span> • Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}