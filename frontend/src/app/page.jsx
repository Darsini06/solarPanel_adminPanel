"use client";

import { useState } from "react";
import { Upload, LogIn, LogOut, Home, User } from "lucide-react";

export default function HomePage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();
    // Simple mock login
    if (username === "admin" && password === "1234") {
      setLoggedIn(true);
      setShowLogin(false);
      setUsername("");
      setPassword("");
    } else {
      alert("Invalid credentials. Use admin/1234 for demo.");
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setShowUpload(false);
  };

  const handleUpload = (file, driveNumber) => {
    if (!file) {
      alert(`Please select a file for Google Drive ${driveNumber}`);
      return;
    }
    alert(`Uploading "${file.name}" to Google Drive ${driveNumber}...`);
    // Here you can integrate Google Drive API
    // Reset file after upload
    if (driveNumber === 1) setFile1(null);
    else setFile2(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 font-sans">
      {/* Navigation Bar */}
      <nav className="w-full bg-white shadow-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-teal-500 p-2 rounded-lg">
              <Home className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">ThermalSolar Drone</h1>
              <p className="text-xs text-gray-500">Advanced Panel Inspection</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-700 hover:text-blue-600 font-medium">
              Features
            </a>
            <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 font-medium">
              How It Works
            </a>
            <a href="#benefits" className="text-gray-700 hover:text-blue-600 font-medium">
              Benefits
            </a>
            <a href="#contact" className="text-gray-700 hover:text-blue-600 font-medium">
              Contact
            </a>
          </div>

          {/* Right side - Auth & Upload */}
          <div className="flex items-center space-x-4">
            {loggedIn ? (
              <>
                <button
                  onClick={() => setShowUpload(true)}
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-teal-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
                >
                  <Upload className="h-4 w-4" />
                  <span>Upload</span>
                </button>
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Welcome, Admin</p>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-1 text-xs text-gray-500 hover:text-red-600"
                    >
                      <LogOut className="h-3 w-3" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-teal-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
              >
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Login to Your Account</h2>
              <button
                onClick={() => setShowLogin(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Enter username"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Enter password"
                  required
                />
              </div>
              <div className="text-sm text-gray-600">
                <p>Demo credentials: admin / 1234</p>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-teal-500 text-white py-3 rounded-lg font-medium hover:opacity-90 transition"
              >
                Sign In
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUpload && loggedIn && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Upload Thermal Images</h2>
                <p className="text-gray-600 mt-1">Select files to upload to Google Drive</p>
              </div>
              <button
                onClick={() => setShowUpload(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Google Drive 1 */}
              <div className="border-2 border-dashed border-blue-200 rounded-xl p-6 hover:border-blue-400 transition bg-blue-50">
                <div className="text-center mb-4">
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Upload className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1 text-gray-800">Google Drive 1</h3>
                  <p className="text-sm text-gray-600">Primary storage</p>
                </div>
                <input
                  type="file"
                  accept="image/*,.pdf,.csv"
                  onChange={(e) => setFile1(e.target.files ? e.target.files[0] : null)}
                  className="w-full mb-4 text-sm"
                />
                <button
                  onClick={() => handleUpload(file1, 1)}
                  disabled={!file1}
                  className={`w-full py-3 rounded-lg font-medium transition ${
                    file1
                      ? "bg-gradient-to-r from-blue-600 to-teal-500 text-white hover:opacity-90"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {file1 ? `Upload ${file1.name}` : "Select File First"}
                </button>
                {file1 && (
                  <p className="mt-3 text-sm text-gray-600 truncate">
                    Selected: <span className="font-medium">{file1.name}</span>
                  </p>
                )}
              </div>

              {/* Google Drive 2 */}
              <div className="border-2 border-dashed border-teal-200 rounded-xl p-6 hover:border-teal-400 transition bg-teal-50">
                <div className="text-center mb-4">
                  <div className="h-12 w-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Upload className="h-6 w-6 text-teal-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1 text-gray-800">Google Drive 2</h3>
                  <p className="text-sm text-gray-600">Backup storage</p>
                </div>
                <input
                  type="file"
                  accept="image/*,.pdf,.csv"
                  onChange={(e) => setFile2(e.target.files ? e.target.files[0] : null)}
                  className="w-full mb-4 text-sm"
                />
                <button
                  onClick={() => handleUpload(file2, 2)}
                  disabled={!file2}
                  className={`w-full py-3 rounded-lg font-medium transition ${
                    file2
                      ? "bg-gradient-to-r from-teal-600 to-blue-500 text-white hover:opacity-90"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {file2 ? `Upload ${file2.name}` : "Select File First"}
                </button>
                {file2 && (
                  <p className="mt-3 text-sm text-gray-600 truncate">
                    Selected: <span className="font-medium">{file2.name}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => {
                  if (file1) handleUpload(file1, 1);
                  if (file2) handleUpload(file2, 2);
                  if (!file1 && !file2) alert("Please select files first");
                }}
                className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-3 rounded-lg font-medium hover:opacity-90 transition"
              >
                Upload Both Files
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Advanced Thermal Imaging for
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
              Solar Panel Inspection
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            Drone-based thermal inspection technology that detects hotspots, defects, 
            and efficiency issues in solar panels with unprecedented accuracy and speed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => loggedIn ? setShowUpload(true) : setShowLogin(true)}
              className="bg-gradient-to-r from-blue-600 to-teal-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition shadow-lg"
            >
              {loggedIn ? "Upload Inspection Data" : "Start Free Trial"}
            </button>
            <button className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 transition shadow-lg">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            How Thermal Solar Inspection Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="h-20 w-20 bg-gradient-to-r from-blue-100 to-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Drone Flight & Data Capture</h3>
              <p className="text-gray-600">
                Autonomous drones equipped with thermal cameras fly over solar farms,
                capturing high-resolution thermal images of every panel.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="h-20 w-20 bg-gradient-to-r from-teal-100 to-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-teal-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Hotspot Detection</h3>
              <p className="text-gray-600">
                AI-powered analysis identifies hotspots, micro-cracks, and defects that
                indicate panel degradation or malfunction.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="h-20 w-20 bg-gradient-to-r from-purple-100 to-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Report Generation</h3>
              <p className="text-gray-600">
                Detailed reports with actionable insights are generated, helping maintenance
                teams prioritize repairs and optimize performance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features/Benefits Section */}
      <section id="benefits" className="py-16 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Key Benefits of Thermal Drone Inspection
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "90% Faster", desc: "Reduce inspection time compared to manual methods" },
              { title: "Cost Efficient", desc: "Lower operational costs and manpower requirements" },
              { title: "High Accuracy", desc: "Detect issues invisible to the naked eye" },
              { title: "Safe Operation", desc: "No need for scaffolding or risky manual inspection" },
              { title: "Data Analytics", desc: "Comprehensive performance tracking over time" },
              { title: "Early Detection", desc: "Identify problems before they cause system failure" },
              { title: "Scalable Solution", desc: "Works for small installations to large solar farms" },
              { title: "24/7 Monitoring", desc: "Regular automated inspections ensure continuous operation" },
            ].map((benefit, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100"
              >
                <h3 className="font-bold text-xl mb-2 text-blue-700">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">ThermalSolar Drone</h3>
              <p className="text-gray-400">
                Revolutionizing solar panel maintenance through advanced thermal imaging technology.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition">How It Works</a></li>
                <li><a href="#benefits" className="hover:text-white transition">Benefits</a></li>
                <li><a href="#contact" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-2 text-gray-400">
                <li>info@thermalsolardrone.com</li>
                <li>+1 (555) 123-4567</li>
                <li>San Francisco, CA</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Get Started</h4>
              <button
                onClick={() => loggedIn ? setShowUpload(true) : setShowLogin(true)}
                className="bg-gradient-to-r from-blue-600 to-teal-500 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition"
              >
                {loggedIn ? "Upload Data" : "Login Now"}
              </button>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
            <p>&copy; 2024 ThermalSolar Drone Inspection. All rights reserved.</p>
            <p className="text-sm mt-2">Advanced thermal imaging for sustainable energy solutions</p>
          </div>
        </div>
      </footer>
    </div>
  );
}