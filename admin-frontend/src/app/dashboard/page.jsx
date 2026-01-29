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
  Loader2
} from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState('');
  const [driveLinks, setDriveLinks] = useState([]);

  // Check authentication and load data
  useEffect(() => {
    const checkAuth = () => {
      const isAdmin = localStorage.getItem('is_admin');
      const name = localStorage.getItem('admin_name');
      
      if (isAdmin !== 'true') {
        router.push('/login');
      } else {
        setAdminName(name || 'Administrator');
        loadDashboardData();
      }
    };

    checkAuth();
  }, [router]);

  // Simulate loading dashboard data
  const loadDashboardData = () => {
    setTimeout(() => {
      // Mock data for drive links
      const mockLinks = [
        {
          id: 1,
          title: 'Project Proposals',
          type: 'Folder',
          icon: '📁',
          url: 'https://drive.google.com',
          date: '2024-01-15',
          size: '45 MB',
          color: 'blue'
        },
        {
          id: 2,
          title: 'Financial Reports',
          type: 'Spreadsheet',
          icon: '📊',
          url: 'https://drive.google.com',
          date: '2024-01-14',
          size: '12 MB',
          color: 'green'
        },
        {
          id: 3,
          title: 'Client Contracts',
          type: 'PDF',
          icon: '📄',
          url: 'https://drive.google.com',
          date: '2024-01-13',
          size: '8 MB',
          color: 'orange'
        },
        {
          id: 4,
          title: 'Design Assets',
          type: 'Folder',
          icon: '🎨',
          url: 'https://drive.google.com',
          date: '2024-01-12',
          size: '156 MB',
          color: 'purple'
        },
        {
          id: 5,
          title: 'Meeting Recordings',
          type: 'Video',
          icon: '🎥',
          url: 'https://drive.google.com',
          date: '2024-01-11',
          size: '2.3 GB',
          color: 'red'
        },
        {
          id: 6,
          title: 'Team Documents',
          type: 'Folder',
          icon: '👥',
          url: 'https://drive.google.com',
          date: '2024-01-10',
          size: '89 MB',
          color: 'teal'
        }
      ];
      setDriveLinks(mockLinks);
      setLoading(false);
    }, 800);
  };

  const stats = [
    {
      title: 'Total Drive Links',
      value: '156',
      icon: <FileText className="w-5 h-5" />,
      change: '+12%',
      color: 'bg-blue-500',
      textColor: 'text-blue-500'
    },
    {
      title: 'Active Bookings',
      value: '24',
      icon: <Calendar className="w-5 h-5" />,
      change: '+3 this week',
      color: 'bg-green-500',
      textColor: 'text-green-500'
    },
    {
      title: 'Total Contacts',
      value: '342',
      icon: <Users className="w-5 h-5" />,
      change: '+8%',
      color: 'bg-purple-500',
      textColor: 'text-purple-500'
    },
    {
      title: 'Storage Used',
      value: '4.2 GB',
      icon: <BarChart3 className="w-5 h-5" />,
      change: '65% of limit',
      color: 'bg-orange-500',
      textColor: 'text-orange-500'
    }
  ];

  const recentActivity = [
    { id: 1, action: 'New drive link added', user: 'You', time: '10 min ago', icon: '➕' },
    { id: 2, action: 'Booking confirmed', user: 'John Doe', time: '1 hour ago', icon: '✅' },
    { id: 3, action: 'Contact updated', user: 'Sarah Smith', time: '2 hours ago', icon: '✏️' },
    { id: 4, action: 'File uploaded', user: 'You', time: '5 hours ago', icon: '📤' },
  ];

  const handleAddLink = () => {
    const newLink = {
      id: driveLinks.length + 1,
      title: `New Drive Link ${driveLinks.length + 1}`,
      type: 'Link',
      icon: '🔗',
      url: 'https://drive.google.com',
      date: new Date().toISOString().split('T')[0],
      size: '--',
      color: 'gray'
    };
    setDriveLinks([newLink, ...driveLinks]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
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
                  style={{ width: stat.title === 'Storage Used' ? '65%' : '80%' }}
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
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1">
                <ExternalLink className="w-4 h-4" />
                View All
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {driveLinks.slice(0, 5).map((link) => (
                    <tr key={link.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{link.icon}</span>
                          <div>
                            <p className="font-medium text-gray-900">{link.title}</p>
                            <p className="text-xs text-gray-500 truncate max-w-[200px]">{link.url}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium bg-${link.color}-100 text-${link.color}-600`}>
                          {link.type}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-600">{link.date}</td>
                      <td className="py-4 px-6 text-gray-600">{link.size}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => window.open(link.url, '_blank')}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="Open Link"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg" title="Download">
                            <Download className="w-4 h-4" />
                          </button>
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
