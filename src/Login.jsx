import React, { useState, useEffect, useContext } from 'react';
import { Shield, User, Mail, Lock, Eye, EyeOff, ArrowRight, Globe } from 'lucide-react';
import { LanguageContext } from './App';

const Login = ({ onLoginSuccess }) => {
  const { lang, t, toggleLang } = useContext(LanguageContext);
  const [userType, setUserType] = useState(null);
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const stored = localStorage.getItem('registeredUsers');
    return stored ? JSON.parse(stored) : {
      patients: {},
      doctors: {}
    };
  });

  // Save registered users to localStorage
  useEffect(() => {
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  const handleRegister = () => {
    setError('');
    
    // Validate fields
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const userList = userType === 'patient' ? registeredUsers.patients : registeredUsers.doctors;
      
      if (userList[email]) {
        setError('Email already registered. Please login instead.');
        setLoading(false);
        return;
      }

      // Register new user
      const updatedUsers = {
        ...registeredUsers,
        [userType === 'patient' ? 'patients' : 'doctors']: {
          ...userList,
          [email]: {
            password: password,
            name: userType === 'patient' ? 'New Patient' : 'New Doctor',
            email: email,
            type: userType,
            registeredAt: new Date().toISOString(),
            id: userType === 'patient' ? Math.random().toString(36).substr(2, 9) : `MH-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
            profile: {
              aadhaar: '',
              mobile: '',
              fullName: userType === 'patient' ? 'New Patient' : 'New Doctor',
              age: '',
              gender: '',
              bloodGroup: '',
              address: '',
              medicalHistory: ''
            }
          }
        }
      };

      setRegisteredUsers(updatedUsers);

      // Auto login after registration
      const userData = {
        type: userType,
        email: email,
        name: userType === 'patient' ? 'New Patient' : 'New Doctor',
        id: userType === 'patient' ? updatedUsers.patients[email].id : updatedUsers.doctors[email].id,
        profile: updatedUsers[userType === 'patient' ? 'patients' : 'doctors'][email].profile
      };

      localStorage.setItem('authUser', JSON.stringify(userData));
      // Store credentials for auto-login
      localStorage.setItem('userCredentials', JSON.stringify({
        email: email,
        password: password,
        type: userType
      }));
      setLoading(false);
      onLoginSuccess(userData);
    }, 800);
  };

  const handleLogin = () => {
    setError('');
    setLoading(true);

    // Validate fields
    if (!email.trim() || !password.trim()) {
      setError('Please enter email and password');
      setLoading(false);
      return;
    }

    // Simulate authentication delay
    setTimeout(() => {
      const userList = userType === 'patient' ? registeredUsers.patients : registeredUsers.doctors;
      
      if (userList[email] && userList[email].password === password) {
        const userData = {
          type: userType,
          email: email,
          name: userList[email].name,
          id: userList[email].id,
          profile: userList[email].profile || {}
        };
        localStorage.setItem('authUser', JSON.stringify(userData));
        // Store credentials for auto-login on next visit
        localStorage.setItem('userCredentials', JSON.stringify({
          email: email,
          password: password,
          type: userType
        }));
        onLoginSuccess(userData);
      } else {
        setError('Invalid email or password. Please check your credentials or register.');
      }
      setLoading(false);
    }, 800);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      isRegister ? handleRegister() : handleLogin();
    }
  };

  if (!userType) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at top right, #1e293b, #0f172a)',
        padding: '20px'
      }}>
        <div style={{ position: 'fixed', top: '20px', right: '20px' }}>
          <button 
            onClick={toggleLang}
            style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}
          >
            <Globe size={18} /> {lang === 'en' ? 'मराठी' : 'English'}
          </button>
        </div>
        <div className="glass-card" style={{ maxWidth: '600px', width: '100%', padding: '60px 40px', textAlign: 'center' }}>
          <div style={{ marginBottom: '40px' }}>
            <div style={{
              width: 80,
              height: 80,
              background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              boxShadow: '0 8px 32px rgba(14, 165, 233, 0.3)'
            }}>
              <Shield size={44} color="#fff" />
            </div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '12px' }}>{t.title}</h1>
            <p style={{ fontSize: '1rem', opacity: 0.7, margin: 0 }}>{t.login.subtitle}</p>
          </div>

          <p style={{ fontSize: '1.05rem', marginBottom: '40px', opacity: 0.8 }}>
            {t.login.selectRole}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <button
              onClick={() => setUserType('patient')}
              style={{
                padding: '30px 20px',
                borderRadius: '12px',
                border: '2px solid rgba(10, 180, 180, 0.3)',
                background: 'linear-gradient(135deg, rgba(10, 180, 180, 0.1), rgba(14, 165, 233, 0.1))',
                color: '#fff',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <User size={40} color="#06b6d4" />
              <div>
                <h3 style={{ margin: '8px 0 4px 0', fontSize: '1.2rem' }}>{t.login.patient}</h3>
                <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.7 }}>{t.login.patientDesc}</p>
              </div>
            </button>

            <button
              onClick={() => setUserType('doctor')}
              style={{
                padding: '30px 20px',
                borderRadius: '12px',
                border: '2px solid rgba(16, 185, 129, 0.3)',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(34, 197, 94, 0.1))',
                color: '#fff',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <Shield size={40} color="#10b981" />
              <div>
                <h3 style={{ margin: '8px 0 4px 0', fontSize: '1.2rem' }}>{t.login.doctor}</h3>
                <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.7 }}>{t.login.doctorDesc}</p>
              </div>
            </button>
          </div>

          <div style={{ marginTop: '40px', padding: '20px', background: 'rgba(99, 102, 241, 0.15)', borderRadius: '8px', textAlign: 'left', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
            <p style={{ margin: '0 0 10px 0', fontWeight: '700', fontSize: '0.95rem', color: '#ffffff' }}> {t.login.gettingStarted}</p>
            <p style={{ margin: '6px 0', fontSize: '0.9rem', color: '#e0e7ff' }}>{t.login.noAccount.replace('**', '')}</p>
            <p style={{ margin: '6px 0', fontSize: '0.9rem', color: '#e0e7ff' }}>{t.login.thenFill}</p>
            <p style={{ margin: '8px 0 0 0', fontSize: '0.85rem', color: '#c7d2fe' }}>{t.login.newUser}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at top right, #1e293b, #0f172a)',
      padding: '20px'
    }}>
      <div className="glass-card" style={{ maxWidth: '420px', width: '100%', padding: '40px' }}>
        <button
          onClick={() => { setUserType(null); setEmail(''); setPassword(''); setConfirmPassword(''); setError(''); setIsRegister(false); }}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#60a5fa',
            cursor: 'pointer',
            fontSize: '1rem',
            marginBottom: '24px',
            fontWeight: '500',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.color = '#93c5fd'}
          onMouseLeave={(e) => e.target.style.color = '#60a5fa'}
        >
          ← {t.login.backRole}
        </button>

        <div style={{ marginBottom: '30px', textAlign: 'center' }}>
          <div style={{
            width: 60,
            height: 60,
            background: userType === 'patient' ? 'linear-gradient(135deg, #10b981, #06b6d4)' : 'linear-gradient(135deg, #0ea5e9, #6366f1)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 8px 32px rgba(14, 165, 233, 0.3)'
          }}>
            {userType === 'patient' ? <User size={32} color="#fff" /> : <Shield size={32} color="#fff" />}
          </div>
          <h2 style={{ margin: '0 0 8px 0', fontSize: '1.5rem', color: '#ffffff' }}>
            {isRegister ? t.login.createAccount : t.login.loginBtn}
          </h2>
          <p style={{ margin: 0, color: '#c7d2fe', fontSize: '0.9rem' }}>
            {isRegister 
              ? t.login.registerAs.replace('{role}', userType === 'patient' ? t.login.patient : t.login.doctor)
              : t.login.signIn.replace('{role}', userType === 'patient' ? t.login.patient : t.login.doctor)
            }
          </p>
        </div>

        {error && (
          <div style={{
            padding: '12px',
            marginBottom: '16px',
            background: 'rgba(244, 63, 94, 0.1)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: '8px',
            color: '#f43f5e',
            fontSize: '0.85rem'
          }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600', color: '#ffffff' }}>
            {t.login.email}
          </label>
          <div style={{ position: 'relative' }}>
            <Mail style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#0ea5e9', zIndex: 2 }} size={18} />
            <input
              type="email"
              placeholder={userType === 'patient' ? 'patient@example.com' : 'doctor@example.com'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              style={{
                width: '100%',
                paddingLeft: '40px',
                paddingRight: '12px',
                background: 'rgba(30, 41, 59, 0.95)',
                border: '1.5px solid rgba(14, 165, 233, 0.3)',
                color: '#ffffff',
                fontSize: '0.95rem'
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: isRegister ? '20px' : '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600', color: '#ffffff' }}>
            {t.login.password}
          </label>
          <div style={{ position: 'relative' }}>
            <Lock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#0ea5e9', zIndex: 2 }} size={18} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              style={{
                width: '100%',
                paddingLeft: '40px',
                paddingRight: '40px',
                background: 'rgba(30, 41, 59, 0.95)',
                border: '1.5px solid rgba(14, 165, 233, 0.3)',
                color: '#ffffff',
                fontSize: '0.95rem'
              }}
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: '#0ea5e9',
                cursor: 'pointer',
                zIndex: 2
              }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {isRegister && (
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600', color: '#ffffff' }}>
              {t.login.confirmPassword}
            </label>
            <div style={{ position: 'relative' }}>
              <Lock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#0ea5e9', zIndex: 2 }} size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                style={{
                  width: '100%',
                  paddingLeft: '40px',
                  paddingRight: '40px',
                  background: 'rgba(30, 41, 59, 0.95)',
                  border: '1.5px solid rgba(14, 165, 233, 0.3)',
                  color: '#ffffff',
                  fontSize: '0.95rem'
                }}
              />
            </div>
          </div>
        )}

        <button
          onClick={isRegister ? handleRegister : handleLogin}
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            background: loading ? 'rgba(14, 165, 233, 0.4)' : userType === 'patient' 
              ? 'linear-gradient(135deg, #10b981, #06b6d4)'
              : 'linear-gradient(135deg, #0ea5e9, #6366f1)',
            border: 'none',
            borderRadius: '8px',
            color: '#fff',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '1rem',
            transition: 'all 0.3s ease',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          {loading ? t.login.processing : isRegister ? `📝 ${t.login.createAccount}` : `🔓 ${t.login.loginBtn}`}
        </button>

        <button
          onClick={() => { setIsRegister(!isRegister); setError(''); setConfirmPassword(''); }}
          style={{
             // ... existing styles ...
            width: '100%',
            padding: '14px',
            background: isRegister 
              ? 'rgba(59, 130, 246, 0.1)' 
              : 'linear-gradient(135deg, #3b82f6, #60a5fa)',
            border: isRegister
              ? '1.5px solid rgba(59, 130, 246, 0.3)'
              : '2px solid rgba(59, 130, 246, 0.8)',
            borderRadius: '10px',
            color: isRegister ? '#60a5fa' : '#ffffff',
            cursor: 'pointer',
            fontSize: isRegister ? '0.95rem' : '1.1rem',
            fontWeight: isRegister ? '600' : '700',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '16px',
            transition: 'all 0.3s ease',
            boxShadow: isRegister 
              ? 'none'
              : '0 8px 20px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            textShadow: isRegister ? 'none' : '0 2px 4px rgba(0, 0, 0, 0.2)'
          }}
        >
          {isRegister ? `🔓 ${t.login.backToLogin}` : `✏️ ${t.login.createAccount}`}
          <ArrowRight size={isRegister ? 16 : 20} />
        </button>

        <div style={{
          padding: '14px',
          background: 'rgba(99, 102, 241, 0.1)',
          borderRadius: '8px',
          fontSize: '0.85rem',
          textAlign: 'center',
          border: '1px solid rgba(99, 102, 241, 0.2)'
        }}>
          <p style={{ margin: 0, color: '#e0e7ff' }}>
            {isRegister 
              ? 'Create a new account to get started'
              : 'No account? Click "Create Account" above'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
