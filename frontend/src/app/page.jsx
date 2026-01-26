// app/admin/links/page.jsx
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
  Download,
  Clock
} from 'lucide-react';

export default function AdminLinksPage() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedLink, setCopiedLink] = useState('');
  const [selectedUser, setSelectedUser] = useState('all');

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
      
      // Add simulated user data for demo purposes
      // In real app, this would come from your API
      const linksWithUsers = data.map((item, index) => ({
        ...item,
        user: `User ${index + 1}`,
        userEmail: `user${index + 1}@example.com`,
        filesCount: Math.floor(Math.random() * 5) + 1 // Random number of files
      }));
      
      setLinks(linksWithUsers);
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

  // Get unique users
  const uniqueUsers = ['all', ...new Set(links.map(link => link.user))];

  // Filter links by selected user
  const filteredLinks = selectedUser === 'all' 
    ? links 
    : links.filter(link => link.user === selectedUser);

  // Calculate statistics
  const totalLinks = links.length;
  const totalUsers = new Set(links.map(link => link.user)).size;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                  <File className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Drive Links Admin</h1>
                  <p className="text-gray-600 text-sm">Google Drive Upload Management System</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchLinks}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium flex items-center transition-colors disabled:opacity-50"
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <LinkIcon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">{totalLinks}</h3>
                <p className="text-gray-600">Total Drive Links</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <User className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">{totalUsers}</h3>
                <p className="text-gray-600">Active Users</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {links.length > 0 ? formatDate(links[0].created_at) : 'No data'}
                </h3>
                <p className="text-gray-600">Latest Upload</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Uploaded Drive Links</h2>
                <p className="text-gray-600 text-sm mt-1">All Google Drive links uploaded by users</p>
              </div>
              
              <div className="mt-4 md:mt-0">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                      value={selectedUser}
                      onChange={(e) => setSelectedUser(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                      {uniqueUsers.map(user => (
                        <option key={user} value={user}>
                          {user === 'all' ? 'All Users' : user}
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
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
              <span className="ml-3 text-gray-600">Loading drive links...</span>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="text-red-600 mb-4">{error}</div>
              <button
                onClick={fetchLinks}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          ) : filteredLinks.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <LinkIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No drive links found</h3>
              <p className="text-gray-600">
                {selectedUser === 'all' 
                  ? 'No links have been uploaded yet' 
                  : `No links found for ${selectedUser}`}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Drive Links
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Upload Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLinks.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      {/* User Column */}
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-blue-600" />
                            </div>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{item.user}</div>
                            <div className="text-xs text-gray-500">{item.userEmail}</div>
                          </div>
                        </div>
                      </td>
                      
                      {/* Links Column */}
                      <td className="px-6 py-4">
                        <div className="space-y-3">
                          {/* Drive Link 1 */}
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium text-gray-500">Link 1</span>
                              <span className="text-xs text-gray-400">{item.filesCount} files</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="flex-1 bg-gray-50 rounded border border-gray-200 px-3 py-2">
                                <a
                                  href={item.drive_link_1}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 text-sm truncate block"
                                  title={item.drive_link_1}
                                >
                                  {item.drive_link_1}
                                </a>
                              </div>
                              <div className="flex space-x-1">
                                <button
                                  onClick={() => copyToClipboard(item.drive_link_1)}
                                  className={`p-1 rounded ${copiedLink === item.drive_link_1 ? 'bg-green-100 text-green-600' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
                                  title="Copy link"
                                >
                                  <Copy className="w-4 h-4" />
                                </button>
                                <a
                                  href={item.drive_link_1}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                                  title="Open link"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              </div>
                            </div>
                          </div>
                          
                          {/* Drive Link 2 */}
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium text-gray-500">Link 2</span>
                              <span className="text-xs text-gray-400">{item.filesCount} files</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="flex-1 bg-gray-50 rounded border border-gray-200 px-3 py-2">
                                <a
                                  href={item.drive_link_2}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 text-sm truncate block"
                                  title={item.drive_link_2}
                                >
                                  {item.drive_link_2}
                                </a>
                              </div>
                              <div className="flex space-x-1">
                                <button
                                  onClick={() => copyToClipboard(item.drive_link_2)}
                                  className={`p-1 rounded ${copiedLink === item.drive_link_2 ? 'bg-green-100 text-green-600' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
                                  title="Copy link"
                                >
                                  <Copy className="w-4 h-4" />
                                </button>
                                <a
                                  href={item.drive_link_2}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          {formatDate(item.created_at)}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          ID: {item.id.slice(-8)}
                        </div>
                      </td>
                      
                      {/* Actions Column */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <a
                            href={item.drive_link_1}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-1 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 text-sm"
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Open
                          </a>
                          <button
                            onClick={() => {
                              const combinedLinks = `${item.drive_link_1}\n${item.drive_link_2}`;
                              copyToClipboard(combinedLinks);
                            }}
                            className="inline-flex items-center px-3 py-1 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm"
                          >
                            <Copy className="w-3 h-3 mr-1" />
                            Copy All
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer Stats */}
        {!loading && filteredLinks.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between text-sm text-gray-600">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <LinkIcon className="w-4 h-4 mr-2" />
                  <span>{filteredLinks.length} drive link sets</span>
                </div>
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  <span>
                    {selectedUser === 'all' 
                      ? `${totalUsers} users` 
                      : `Filtered by: ${selectedUser}`}
                  </span>
                </div>
              </div>
              <div className="mt-2 md:mt-0">
                <span className="text-xs text-gray-500">
                  Last updated: {new Date().toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-8 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center text-gray-600 text-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-2 md:mb-0">
                <p className="font-medium">Drive Links Management System</p>
                <p className="text-gray-500">Admin Panel v1.0</p>
              </div>
              <div>
                <p>© {new Date().getFullYear()} • {totalLinks} links • {totalUsers} users</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}