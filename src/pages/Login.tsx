import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, KeyRound, Info } from 'lucide-react';
import { authService } from '../services/authService';
import { dbService } from '../services/dbService';
import { mockUsers } from '../data/buildingsSeed';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Normal Login Inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide your official email and password.');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (user) {
        localStorage.setItem('cp_license_active_user', JSON.stringify(user));
        await dbService.addAuditLog('LOGIN', `User logged in using credentials: ${user.email}`);
        navigate('/');
      } else {
        setError('Invalid personnel email or credentials.');
      }
    } catch (err: any) {
      setError('Credentials sign-in failed. Please contact administrator.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      // Authenticate with Google
      const user = await authService.signInWithGoogle();
      await dbService.addAuditLog('LOGIN', `User logged in using credential: ${user.email}`);
      navigate('/');
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Google Sign-In failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4">
      
      {/* Official Gov Header */}
      <div className="text-center mb-6 max-w-md">
        <div className="w-16 h-16 bg-white rounded-full mx-auto flex items-center justify-center border-4 border-emerald-800 shadow-md mb-3">
          <span className="font-extrabold text-emerald-800 text-lg">LSGD</span>
        </div>
        <h2 className="text-white text-lg font-bold">Local Self Government Department</h2>
        <p className="text-slate-400 text-xs mt-1">LSG Track - Chakkittapara Panchayat GIS Compliance Portal</p>
      </div>

      {/* Main Login Card */}
      <div className="bg-white rounded border border-slate-200 w-full max-w-md p-6 shadow-2xl relative overflow-hidden">
        
        {/* Warning Banner */}
        <div className="bg-red-50 border border-red-200 text-red-800 rounded p-3 text-xs mb-5 flex items-start space-x-2">
          <ShieldAlert size={16} className="text-red-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">RESTRICTED ADMINISTRATIVE CHANNEL</span>
            This portal is restricted to authorized officers of Chakkittapara Grama Panchayat. Unauthorised access is punishable under IT Act 2000.
          </div>
        </div>

        <h3 className="text-slate-800 text-sm font-bold uppercase tracking-wider mb-4 border-b pb-2 flex items-center space-x-2">
          <KeyRound size={16} className="text-emerald-800" />
          <span>User Authentication</span>
        </h3>

        {error && (
          <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded p-2.5 text-xs mb-4">
            {error}
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleCredentialsSignIn} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
              Official Email
            </label>
            <input
              type="email"
              required
              placeholder="officer.name@kerala.gov.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-emerald-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-emerald-800"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-800 hover:bg-emerald-700 text-white rounded py-2 text-xs font-bold uppercase tracking-wider transition shadow-sm"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="relative flex py-4 items-center">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink mx-3 text-slate-400 text-[10px] uppercase font-bold">or</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        {/* Primary Google Login Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded py-2 text-xs font-bold uppercase tracking-wider transition shadow-sm flex items-center justify-center space-x-2"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span>Google Sign In</span>
        </button>

        {/* Credentials Help Tooltip */}
        <div className="mt-4 bg-slate-50 border border-slate-200 rounded p-2.5 text-[10px] text-slate-500 flex items-start space-x-1.5">
          <Info size={12} className="text-slate-400 shrink-0 mt-0.5" />
          <span>
            <strong>Developer Note:</strong> You can sign in using any mock email (e.g., <code>mini.secretary@kerala.gov.in</code> for Secretary, <code>sajesh.deo@kerala.gov.in</code> for Panchayat Staff, <code>thomas.ward1@kerala.gov.in</code> for Ward Member, <code>suresh.surveyor@kerala.gov.in</code> for VEO) with any password to load their unique interfaces.
          </span>
        </div>

      </div>

      {/* Kerala LSGD Link */}
      <div className="mt-8 text-slate-500 text-[10px] uppercase font-mono tracking-wider">
        LSGD Portal Net Connection Secured (SSL/TLS)
      </div>

    </div>
  );
};
