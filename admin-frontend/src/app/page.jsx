'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Mail, Lock, Loader2, Sun, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Clear any old data on mount
  useEffect(() => {
    localStorage.clear();
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter all credentials');
      return;
    }

    setLoading(true);
    setError('');

    // Simulate authentication
    setTimeout(() => {
      if (email === 'admin@gmail.com' && password === 'admin1234') {
        localStorage.setItem('token', 'demo_session_token_99');
        localStorage.setItem('admin_name', 'Princilla Savier');
        localStorage.setItem('is_admin', 'true');
        setIsSuccess(true);
        setTimeout(() => router.push('/dashboard'), 800);
      } else {
        setError('Invalid credentials. Use admin@gmail.com / admin1234');
        setLoading(false);
      }
    }, 1200);
  };

  const handleDemoLogin = () => {
    setEmail('admin@gmail.com');
    setPassword('admin1234');
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-600/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>

      <div className="max-w-md w-full relative z-10">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl">
          {/* Logo */}
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-orange-900/40 transform -rotate-6">
              <Sun className="text-white fill-white" size={32} />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase">
              Solar<span className="text-orange-500 italic">Admin</span>
            </h1>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.3em] mt-2">
              System Authentication
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-orange-500 transition-colors" size={18} />
                <input
                  type="email"
                  placeholder="Admin Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-medium"
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-orange-500 transition-colors" size={18} />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-medium"
                />
              </div>
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
                <p className="text-rose-500 text-xs font-bold uppercase tracking-wider">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || isSuccess}
              className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all duration-500 flex items-center justify-center gap-2 ${isSuccess
                ? 'bg-green-500 text-white translate-y-[-4px]'
                : 'bg-orange-600 hover:bg-orange-700 text-white shadow-xl shadow-orange-900/30 hover:shadow-orange-900/50 translate-y-0 active:translate-y-2'
                }`}
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : isSuccess ? (
                <>
                  <CheckCircle2 size={20} />
                  Access Granted
                </>
              ) : (
                <>
                  Launch Dashboard
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5 flex flex-col items-center gap-4">
            <button
              onClick={handleDemoLogin}
              className="text-slate-500 hover:text-orange-500 text-[10px] font-bold uppercase tracking-widest transition-colors"
            >
              Auto-fill Demo Credentials
            </button>
            <div className="flex items-center gap-2 text-slate-600">
              <Shield size={14} />
              <span className="text-[10px] font-medium tracking-widest uppercase">Secured by End-to-End Encryption</span>
            </div>
          </div>
        </div>

        <p className="text-center text-slate-600 text-[10px] font-bold mt-8 uppercase tracking-[0.4em]">
          &copy; 2026 Solaris Industrial Solutions
        </p>
      </div>
    </div>
  );
}
