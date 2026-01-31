'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FileText,
  Download,
  BarChart3,
  Users,
  Calendar,
  AlertCircle,
  TrendingUp,
  ExternalLink,
  PlusCircle,
  Shield,
  Loader2,
  Link as LinkIcon
} from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState('');
  const [driveLinks, setDriveLinks] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  const formatRelativeTime = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  // Load data immediately since authentication is now optional/auto-handled
  useEffect(() => {
    const name = localStorage.getItem('admin_name');
    setAdminName(name || 'Admin User');
    loadDashboardData();
  }, []);

  // Fetch real dashboard data
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`
      };

      // Fetch all required data in parallel
      const [linksRes, bookingsRes, contactsRes, usersRes] = await Promise.all([
        fetch(`${API_URL}/drive-links/`, { headers }),
        fetch(`${API_URL}/bookings/`, { headers }),
        fetch(`${API_URL}/contacts/`, { headers }),
        fetch(`${API_URL}/api/users/all`, { headers })
      ]);

      const [linksData, bookingsData, contactsData, usersData] = await Promise.all([
        linksRes.ok ? linksRes.json() : [],
        bookingsRes.ok ? bookingsRes.json() : [],
        contactsRes.ok ? contactsRes.json() : [],
        usersRes.ok ? usersRes.json() : []
      ]);

      setDriveLinks(linksData);
      setBookings(bookingsData);
      setContacts(contactsData);
      setUsers(usersData);

      // Calculate stats
      const activeBookings = bookingsData.filter(b => b.status === 'confirmed' || b.status === 'pending').length;

      setStats([
        {
          title: 'Total Drive Links',
          value: linksData.length.toString(),
          icon: <FileText className="w-5 h-5" />,
          change: 'Live data',
          color: 'bg-blue-500',
          textColor: 'text-blue-500'
        },
        {
          title: 'Active Bookings',
          value: activeBookings.toString(),
          icon: <Calendar className="w-5 h-5" />,
          change: 'Confirmed & Pending',
          color: 'bg-green-500',
          textColor: 'text-green-500'
        },
        {
          title: 'Total Contacts',
          value: contactsData.length.toString(),
          icon: <Users className="w-5 h-5" />,
          change: 'User inquiries',
          color: 'bg-purple-500',
          textColor: 'text-purple-500'
        },
        {
          title: 'Total Users',
          value: usersData.length.toString(),
          icon: <Shield className="w-5 h-5" />,
          change: 'Registered accounts',
          color: 'bg-orange-500',
          textColor: 'text-orange-500'
        }
      ]);

      // Generate recent activity from real data
      const activity = [];

      setRecentActivity(
        [
          // Add latest links
          ...linksData.slice(0, 3).map(link => ({
            id: `link-${link.id}`,
            action: 'Portfolio Item Linked',
            user: link.user_name || 'Admin',
            time: new Date(link.created_at),
            icon: '🔗',
            type: 'link'
          })),

          // Add latest bookings
          ...bookingsData.slice(0, 3).map(booking => ({
            id: `booking-${booking.id}`,
            action: `${booking.service_type}`,
            user: booking.user_name || 'Guest',
            time: new Date(booking.created_at),
            icon: '📅',
            type: 'booking'
          })),

          // Add latest contacts
          ...contactsData.slice(0, 3).map(contact => ({
            id: `contact-${contact.id}`,
            action: 'New Inquiry Received',
            user: `${contact.first_name} ${contact.last_name}`,
            time: new Date(contact.created_at),
            icon: '💬',
            type: 'contact'
          }))
        ]
          .sort((a, b) => b.time - a.time)
          .slice(0, 6)
          .map(item => ({
            ...item,
            time: formatRelativeTime(item.time)
          }))
      );

    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLink = () => {
    router.push('/drivelinks');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-orange-600 mx-auto" />
          <p className="mt-4 text-gray-600 font-medium">Fetching correct data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back, <span className="font-semibold text-blue-600">{adminName}</span>
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
            <Shield className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Admin Mode</span>
          </div>
          <button
            onClick={handleAddLink}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusCircle className="w-5 h-5" />
            Add Drive Link
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600 font-medium">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <div className="text-white">{stat.icon}</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${stat.textColor.replace('text-', 'bg-')}`}
                  style={{ width: '85%' }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Drive Links Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Drive Links</h2>
                <p className="text-gray-600 text-sm mt-1">Recently added and shared links</p>
              </div>
              <button
                onClick={() => router.push('/drivelinks')}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
              >
                <ExternalLink className="w-4 h-4" />
                View All
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Drive Links</th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {driveLinks.slice(0, 5).map((link) => (
                    <tr key={link.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-50 rounded-lg">
                            <LinkIcon className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{link.user_name || 'Anonymous'}</p>
                            <p className="text-xs text-gray-500 truncate max-w-[200px]">{link.user_email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col gap-1">
                          <a href={link.drive_link_1} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline truncate max-w-[150px]">
                            {link.drive_link_1}
                          </a>
                          {link.drive_link_2 && (
                            <a href={link.drive_link_2} target="_blank" rel="noopener noreferrer" className="text-xs text-green-600 hover:underline truncate max-w-[150px]">
                              {link.drive_link_2}
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-600 text-sm">
                        {new Date(link.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${link.has_pdf ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {link.has_pdf ? 'PDF Attached' : 'No PDF'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => window.open(link.drive_link_1, '_blank')}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="Open Link 1"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                          {link.has_pdf && (
                            <button
                              onClick={() => router.push('/drivelinks')}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                              title="View PDF"
                            >
                              <FileText className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={handleAddLink}
                className="w-full py-3 text-center text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-5 h-5" />
                Add New Drive Link
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Recent Activity & Quick Stats */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="text-lg">{activity.icon}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">
                      by {activity.user} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <h3 className="text-lg font-bold mb-4">Performance</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">System Uptime</span>
                  <span className="font-bold">99.8%</span>
                </div>
                <div className="w-full bg-blue-400 rounded-full h-2">
                  <div className="h-2 rounded-full bg-green-300" style={{ width: '99.8%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">Storage Usage</span>
                  <span className="font-bold">65%</span>
                </div>
                <div className="w-full bg-blue-400 rounded-full h-2">
                  <div className="h-2 rounded-full bg-yellow-300" style={{ width: '65%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">User Engagement</span>
                  <span className="font-bold">+42%</span>
                </div>
                <div className="w-full bg-blue-400 rounded-full h-2">
                  <div className="h-2 rounded-full bg-pink-300" style={{ width: '72%' }}></div>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-blue-400">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                <span className="text-sm">Overall performance trending up</span>
              </div>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Quick Tip</h4>
                <p className="text-sm text-gray-600">
                  Use the "Add Drive Link" button to quickly share important documents with your team.
                  All links are securely stored and accessible.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
