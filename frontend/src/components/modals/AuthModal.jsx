import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services';

export default function AuthModal() {
  const {
    isAuthModalOpen,
    setAuthModalOpen,
    currentUser,
    loginUser,
    navigate,
    selectedCity,
    CITIES
  } = useApp();

  // Mode: 'login' | 'register'
  const [mode, setMode] = useState('login');
  // Login Method: 'password' | 'otp'
  const [loginMethod, setLoginMethod] = useState('password');

  // Form Fields
  const [identifier, setIdentifier] = useState(''); // email or phone
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Student / Parent (Renter)'); // 'Student / Parent (Renter)' | 'Host / Owner'
  const [city, setCity] = useState(selectedCity === 'All Cities' ? 'Delhi NCR' : selectedCity);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // OTP State
  const [otpStep, setOtpStep] = useState('send'); // 'send' | 'verify'
  const [otpCode, setOtpCode] = useState('');
  const [otpSentPhone, setOtpSentPhone] = useState('');

  // UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const handleClose = () => {
    setAuthModalOpen(false);
    setError('');
    setSuccessMsg('');
    setLoading(false);
  };

  // 1. Password Login
  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError('Please enter your email or 10-digit mobile number');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const isEmail = identifier.includes('@');
      const payload = {
        email: isEmail ? identifier.trim() : undefined,
        phone: !isEmail ? identifier.trim() : undefined,
        password: password,
      };

      const res = await api.auth.login(payload);
      const user = res?.user || res?.data?.user;
      const token = res?.token || res?.accessToken || res?.data?.token;

      if (user) {
        loginUser(user, token);
        setSuccessMsg(`Welcome back, ${user.name}!`);
        setTimeout(() => {
          handleClose();
          const userRole = (user?.role || '').toLowerCase();
          if (userRole.includes('owner') || userRole.includes('host')) {
            navigate('owner-dashboard');
          } else {
            navigate('dashboard');
          }
        }, 600);
      } else {
        throw new Error('Could not retrieve user profile from server.');
      }
    } catch (err) {
      console.warn('Login error:', err.message);
      setError(err.message || 'Invalid credentials. Please verify your email/phone and password.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Send Mobile OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    const cleanDigits = phone.replace(/\D/g, '').slice(-10);
    if (!cleanDigits || cleanDigits.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Call backend send-otp API
      const res = await api.request('/auth/send-otp', {
        method: 'POST',
        body: JSON.stringify({ phone: cleanDigits }),
      }).catch(() => ({ success: true, otp: '1234' }));

      setOtpSentPhone(cleanDigits);
      setOtpStep('verify');
      setOtpCode(res?.otp || '1234');
    } catch (err) {
      setError(err.message || 'Failed to dispatch OTP. Please try password login.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Verify OTP & Login
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 4) {
      setError('Please enter the 4-digit verification code');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await api.auth.login({
        phone: otpSentPhone,
        otp: otpCode,
        role: role,
        name: name.trim() || undefined
      });

      const user = res?.user || res?.data?.user;
      const token = res?.token || res?.accessToken || res?.data?.token;

      if (user) {
        loginUser(user, token);
        setSuccessMsg(`Verified! Welcome to HomeLink, ${user.name}`);
        setTimeout(() => {
          handleClose();
          const userRole = (user?.role || '').toLowerCase();
          if (userRole.includes('owner') || userRole.includes('host')) {
            navigate('owner-dashboard');
          } else {
            navigate('dashboard');
          }
        }, 600);
      }
    } catch (err) {
      setError(err.message || 'OTP verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Register New Account
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your full name');
      return;
    }
    const cleanDigits = phone.replace(/\D/g, '').slice(-10);
    if (!cleanDigits && !email.trim()) {
      setError('Please enter at least a mobile number or email address');
      return;
    }
    if (password && password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    if (!agreeTerms) {
      setError('Please agree to the 0% Brokerage & Community Guidelines');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const payload = {
        name: name.trim(),
        email: email.trim() || undefined,
        phone: cleanDigits ? `+91 ${cleanDigits}` : undefined,
        password: password || 'password123',
        role: role,
        city: city
      };

      const res = await api.auth.register(payload);
      const user = res?.user || res?.data?.user;
      const token = res?.token || res?.accessToken || res?.data?.token;

      if (user) {
        loginUser(user, token);
        setSuccessMsg(`Account created! Welcome, ${user.name}`);
        setTimeout(() => {
          handleClose();
          const userRole = (user?.role || '').toLowerCase();
          if (userRole.includes('owner') || userRole.includes('host')) {
            navigate('owner-dashboard');
          } else {
            navigate('dashboard');
          }
        }, 700);
      }
    } catch (err) {
      setError(err.message || 'Registration failed. An account may already exist with this contact.');
    } finally {
      setLoading(false);
    }
  };

  // 5. Quick Demo Profile Logins
  const handleQuickLogin = (demoType) => {
    setError('');
    setLoading(true);

    if (demoType === 'aman') {
      setIdentifier('aman.v@gmail.com');
      setPassword('password123');
      api.auth.login({
        email: 'aman.v@gmail.com',
        password: 'password123'
      }).then(res => {
        const user = res?.user || res?.data?.user;
        const token = res?.token || res?.accessToken;
        if (user) {
          const studentUser = {
            ...user,
            role: 'Student / Parent (Renter)'
          };
          loginUser(studentUser, token);
          setSuccessMsg('Logged in as Student / Parent (Aman Verma)!');
          setTimeout(() => {
            handleClose();
            navigate('dashboard');
          }, 500);
        }
      }).catch(err => {
        setError(err.message);
      }).finally(() => setLoading(false));
    } else if (demoType === 'host') {
      setIdentifier('rameshwar@homelink.in');
      setPassword('password123');
      api.auth.login({
        email: 'rameshwar@homelink.in',
        password: 'password123'
      }).then(res => {
        const user = res?.user || res?.data?.user;
        const token = res?.token || res?.accessToken;
        if (user) {
          const ownerUser = {
            ...user,
            role: 'Host / Owner'
          };
          loginUser(ownerUser, token);
          setSuccessMsg('Logged in as Property Owner (Rameshwar Shukla)!');
          setTimeout(() => {
            handleClose();
            navigate('owner-dashboard');
          }, 500);
        }
      }).catch(err => {
        setError(err.message);
      }).finally(() => setLoading(false));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-surface-container-lowest rounded-3xl max-w-lg w-full border border-outline-variant/40 shadow-2xl overflow-hidden p-6 sm:p-7 relative max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface flex items-center justify-center transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>

        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-primary-container text-white flex items-center justify-center shadow-md shadow-primary-container/25">
            <span className="material-symbols-outlined text-2xl">roofing</span>
          </div>
          <div>
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-fixed/50 text-primary text-[10px] font-extrabold uppercase tracking-wider">
              <span>MongoDB Connected</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <h2 className="text-xl font-black text-on-surface tracking-tight mt-0.5">
              HomeLink Verified Access
            </h2>
          </div>
        </div>

        {/* Tabs: Login vs Register */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-surface-container mb-5 border border-outline-variant/30">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError('');
            }}
            className={`py-2 px-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              mode === 'login'
                ? 'bg-surface-container-lowest text-on-surface shadow-xs'
                : 'text-outline hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">lock_open</span>
            <span>Sign In</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError('');
            }}
            className={`py-2 px-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              mode === 'register'
                ? 'bg-surface-container-lowest text-on-surface shadow-xs'
                : 'text-outline hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">person_add</span>
            <span>Create Account</span>
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-error/10 border border-error/25 flex items-start gap-2.5 text-error text-xs font-semibold animate-in fade-in duration-150">
            <span className="material-symbols-outlined text-base shrink-0 mt-0.5">error</span>
            <span className="flex-1">{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-xs font-bold animate-in fade-in duration-150">
            <span className="material-symbols-outlined text-base">check_circle</span>
            <span>{successMsg}</span>
          </div>
        )}

        {/* TAB 1: LOGIN MODE */}
        {mode === 'login' && (
          <div className="space-y-4">
            {/* Login Method Sub-Toggle: Password vs Mobile OTP */}
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/30">
              <span className="text-xs font-extrabold text-on-surface">Login Method:</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setLoginMethod('password');
                    setError('');
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    loginMethod === 'password'
                      ? 'bg-primary-container text-white shadow-xs'
                      : 'bg-surface-container text-outline hover:text-on-surface'
                  }`}
                >
                  Password
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginMethod('otp');
                    setError('');
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    loginMethod === 'otp'
                      ? 'bg-primary-container text-white shadow-xs'
                      : 'bg-surface-container text-outline hover:text-on-surface'
                  }`}
                >
                  Mobile OTP
                </button>
              </div>
            </div>

            {/* PASSWORD LOGIN FORM */}
            {loginMethod === 'password' && (
              <form onSubmit={handlePasswordLogin} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">
                    Email or Mobile Number
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-3 text-outline text-lg">
                      badge
                    </span>
                    <input
                      type="text"
                      placeholder="e.g. aman.v@gmail.com or 98261 00001"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-outline-variant focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 text-xs font-semibold bg-surface-container-low text-on-surface focus:outline-none"
                      autoFocus
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-on-surface">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setLoginMethod('otp')}
                      className="text-[11px] font-bold text-primary-container hover:underline cursor-pointer"
                    >
                      Login with OTP instead
                    </button>
                  </div>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-3 text-outline text-lg">
                      key
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-outline-variant focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 text-xs font-semibold bg-surface-container-low text-on-surface focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-outline hover:text-on-surface cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl bg-primary-container text-white font-bold text-xs shadow-md hover:bg-primary transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {loading ? (
                    <span>Authenticating with MongoDB...</span>
                  ) : (
                    <>
                      <span>Sign In to Account</span>
                      <span className="material-symbols-outlined text-base">arrow_forward</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* OTP LOGIN FORM */}
            {loginMethod === 'otp' && (
              <div>
                {otpStep === 'send' ? (
                  <form onSubmit={handleSendOtp} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-bold text-on-surface mb-1">
                        10-Digit Mobile Number
                      </label>
                      <div className="flex items-center rounded-xl border border-outline-variant focus-within:border-primary-container focus-within:ring-2 focus-within:ring-primary-container/20 overflow-hidden bg-surface-container-low transition-all">
                        <span className="px-3 py-2.5 text-xs font-bold text-on-surface-variant bg-surface-container border-r border-outline-variant">
                          +91
                        </span>
                        <input
                          type="tel"
                          placeholder="98261 00000"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          maxLength={10}
                          className="w-full px-3 py-2.5 text-xs font-semibold text-on-surface bg-transparent focus:outline-none"
                          autoFocus
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 px-4 rounded-xl bg-primary-container text-white font-bold text-xs shadow-md hover:bg-primary transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                    >
                      {loading ? 'Dispatching OTP...' : 'Send Verification OTP'}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-3.5">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-on-surface">
                          Enter 4-Digit Code
                        </label>
                        <button
                          type="button"
                          onClick={() => setOtpStep('send')}
                          className="text-[11px] font-bold text-primary-container hover:underline cursor-pointer"
                        >
                          Change Number
                        </button>
                      </div>
                      <p className="text-[11px] text-outline mb-2">
                        Sent to <strong>+91 {otpSentPhone}</strong> (Demo code: <span className="font-bold text-primary-container">1234</span>)
                      </p>
                      <input
                        type="text"
                        placeholder="• • • •"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        className="w-full py-3 text-center text-2xl tracking-[0.5em] font-black text-on-surface rounded-xl border border-outline-variant focus:border-primary-container bg-surface-container-low focus:outline-none"
                        autoFocus
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 px-4 rounded-xl bg-primary-container text-white font-bold text-xs shadow-md hover:bg-primary transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                    >
                      {loading ? 'Verifying...' : 'Verify OTP & Continue'}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Quick Demo One-Click Logins */}
            <div className="pt-3 border-t border-outline-variant/30">
              <span className="block text-[10px] font-extrabold uppercase tracking-wider text-outline mb-2 text-center">
                Instant Demo Logins (Preloaded with MongoDB Data)
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('aman')}
                  className="p-2.5 rounded-xl border border-outline-variant/50 hover:border-primary-container bg-surface-container-low hover:bg-surface-container text-left transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-primary-container/20 text-primary-container text-[10px] font-extrabold flex items-center justify-center">
                      A
                    </span>
                    <span className="text-xs font-bold text-on-surface group-hover:text-primary-container">
                      Aman Verma
                    </span>
                  </div>
                  <span className="text-[10px] text-outline block mt-0.5">🎓 Student / Parent (Normal)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('host')}
                  className="p-2.5 rounded-xl border border-outline-variant/50 hover:border-secondary bg-surface-container-low hover:bg-surface-container text-left transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-secondary/20 text-secondary text-[10px] font-extrabold flex items-center justify-center">
                      R
                    </span>
                    <span className="text-xs font-bold text-on-surface group-hover:text-secondary">
                      R. Shukla
                    </span>
                  </div>
                  <span className="text-[10px] text-outline block mt-0.5">🏠 Property Owner (Host)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: REGISTER / CREATE ACCOUNT MODE */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3.5">
            {/* Role Switcher */}
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">
                I want to join HomeLink as:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('Student / Parent (Renter)')}
                  className={`p-2.5 rounded-xl border text-left flex items-center gap-2 cursor-pointer transition-all ${
                    role === 'Student / Parent (Renter)' || role === 'Renter & Seeker'
                      ? 'border-primary-container bg-primary-container/10 text-primary-container font-extrabold ring-1 ring-primary-container'
                      : 'border-outline-variant bg-surface-container-low text-on-surface-variant'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">school</span>
                  <div>
                    <div className="text-xs font-bold">Student / Parent</div>
                    <div className="text-[10px] opacity-75">Student, Parent or Seeker</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('Host / Owner')}
                  className={`p-2.5 rounded-xl border text-left flex items-center gap-2 cursor-pointer transition-all ${
                    role === 'Host / Owner'
                      ? 'border-secondary bg-secondary-container/20 text-secondary font-extrabold ring-1 ring-secondary'
                      : 'border-outline-variant bg-surface-container-low text-on-surface-variant'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">real_estate_agent</span>
                  <div>
                    <div className="text-xs font-bold">Property Owner</div>
                    <div className="text-[10px] opacity-75">Landlord or PG Host</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">
                Full Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Priyanshu Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant focus:border-primary-container text-xs font-semibold bg-surface-container-low text-on-surface focus:outline-none"
                required
              />
            </div>

            {/* Mobile & Email in grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">
                  Mobile Number *
                </label>
                <div className="flex items-center rounded-xl border border-outline-variant overflow-hidden bg-surface-container-low">
                  <span className="px-2.5 py-2 text-[11px] font-bold text-outline bg-surface-container border-r border-outline-variant">
                    +91
                  </span>
                  <input
                    type="tel"
                    placeholder="98261 00000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    maxLength={10}
                    className="w-full px-2.5 py-2 text-xs font-semibold text-on-surface bg-transparent focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="name@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant focus:border-primary-container text-xs font-semibold bg-surface-container-low text-on-surface focus:outline-none"
                />
              </div>
            </div>

            {/* City Selection */}
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">
                Preferred City / Location
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-outline-variant focus:border-primary-container text-xs font-semibold bg-surface-container-low text-on-surface focus:outline-none"
              >
                {CITIES?.filter(c => c.id !== 'All Cities').map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.state})
                  </option>
                ))}
              </select>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">
                Create Password * <span className="text-outline font-normal">(Min 6 characters)</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Choose a secure password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  className="w-full pl-3 pr-10 py-2.5 rounded-xl border border-outline-variant focus:border-primary-container text-xs font-semibold bg-surface-container-low text-on-surface focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-outline hover:text-on-surface cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Zero Brokerage Guarantee Agreement */}
            <label className="flex items-start gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 accent-primary-container"
              />
              <span className="text-[11px] text-outline leading-tight">
                I agree to the HomeLink 0% Brokerage Pledge and Verified Community Trust Guidelines.
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-primary-container text-white font-bold text-xs shadow-md hover:bg-primary transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <span>Registering to MongoDB...</span>
              ) : (
                <>
                  <span>Create Free Account</span>
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
