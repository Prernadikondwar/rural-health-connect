import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { User, Shield, Hospital, LayoutDashboard, Menu, X, LogOut } from 'lucide-react';
import Login from './Login.jsx';
import RuralHealthConnect from './rural_health_connect.jsx';
import PHCHub from './phc_hub.jsx';
import DoctorPortal from './doctor_portal.jsx'; 
import './App.css';

function App() {
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  // Check if user is logged in or auto-login with saved credentials
  useEffect(() => {
    const attemptAutoLogin = async () => {
      // First check if user session already exists
      const savedUser = localStorage.getItem('authUser');
      if (savedUser) {
        try {
          setAuthUser(JSON.parse(savedUser));
          setLoading(false);
          return;
        } catch (error) {
          console.log('Failed to parse stored user:', error.message);
          localStorage.removeItem('authUser');
        }
      }

      // If no session, check for saved credentials for auto-login
      const savedCredentials = localStorage.getItem('userCredentials');
      if (savedCredentials) {
        try {
          const credentials = JSON.parse(savedCredentials);
          // Get registered users and attempt login
          const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
          const userList = credentials.type === 'patient' ? registeredUsers.patients : registeredUsers.doctors;
          
          if (userList && userList[credentials.email] && userList[credentials.email].password === credentials.password) {
            // Auto-login successful
            const userData = {
              type: credentials.type,
              email: credentials.email,
              name: userList[credentials.email].name,
              id: userList[credentials.email].id,
              profile: userList[credentials.email].profile || {}
            };
            localStorage.setItem('authUser', JSON.stringify(userData));
            setAuthUser(userData);
          } else {
            // Credentials invalid, clear them
            localStorage.removeItem('userCredentials');
          }
        } catch (error) {
          console.log('Failed to process stored credentials:', error.message);
          localStorage.removeItem('userCredentials');
        }
      }

      setLoading(false);
    };

    attemptAutoLogin();
  }, []);

  const handleLoginSuccess = (userData) => {
    setAuthUser(userData);
    localStorage.setItem('authUser', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setAuthUser(null);
    localStorage.removeItem('authUser');
    // Clear saved credentials on logout
    localStorage.removeItem('userCredentials');
    navigate('/');
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at top right, #1e293b, #0f172a)',
        color: '#fff'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '16px' }}>🏥 Rural Health Connect</div>
          <div style={{ opacity: 0.7 }}>Loading...</div>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!authUser) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // Redirect based on user type
  if (location.pathname === '/' && authUser.type === 'doctor') {
    navigate('/doctor');
  }

  const isActive = (path) => location.pathname === path;

  return (
    <div className="App" style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-dark)', color: 'white' }}>
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', background: 'rgba(99, 102, 241, 0.1)', zIndex: 10000, padding: '8px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
          <User size={16} />
          <span>{authUser.email}</span>
          <span style={{ opacity: 0.5 }}>({authUser.type === 'patient' ? 'Patient' : 'Doctor'})</span>
        </div>
        <button 
          onClick={handleLogout}
          style={{ background: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e', padding: '6px 14px', border: '1px solid rgba(244, 63, 94, 0.3)', display: 'flex', alignItems: 'center', gap: '6px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}
        >
          <LogOut size={14} /> Logout
        </button>
      </div>

      {/* Sidebar */}
      <nav 
        className={`glass-card sidebar ${isSidebarOpen ? 'open' : 'closed'}`}
        style={{
          width: isSidebarOpen ? '260px' : '80px',
          height: 'calc(100vh - 40px)',
          margin: '40px 20px 20px 20px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.3s ease',
          position: 'sticky',
          top: '40px',
          zIndex: 100,
          border: '1px solid var(--border)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: isSidebarOpen ? 'space-between' : 'center', marginBottom: '40px' }}>
          {isSidebarOpen && <h2 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--primary)' }}>RHC Portal</h2>}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            style={{ padding: '8px', background: 'transparent', border: 'none', color: '#fff', boxShadow: 'none', cursor: 'pointer' }}
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
          {authUser.type === 'patient' ? (
            <>
              <Link to="/" className={`nav-item ${isActive('/') ? 'active' : ''}`}>
                 <User size={20} />
                 {isSidebarOpen && <span>User Dashboard</span>}
              </Link>
              <Link to="/phc" className={`nav-item ${isActive('/phc') ? 'active' : ''}`}>
                 <Hospital size={20} />
                 {isSidebarOpen && <span>PHC Hub</span>}
              </Link>
            </>
          ) : (
            <>
              <Link to="/doctor" className={`nav-item ${isActive('/doctor') ? 'active' : ''}`}>
                 <Shield size={20} />
                 {isSidebarOpen && <span>Doctor Portal</span>}
              </Link>
            </>
          )}
        </div>

        <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
          {isSidebarOpen && (
            <div style={{ fontSize: '0.75rem', opacity: 0.5, textAlign: 'center' }}>
              Rural Health Connect v2.0
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '40px 20px 20px 20px', overflowY: 'auto' }}>
        <Routes>
          {authUser.type === 'patient' && (
            <>
              <Route path="/" element={<RuralHealthConnect authUser={authUser} />} />
              <Route path="/phc" element={<PHCHub />} />
            </>
          )}
          {authUser.type === 'doctor' && (
            <>
              <Route path="/doctor" element={<DoctorPortal authUser={authUser} />} />
            </>
          )}
        </Routes>
      </main>

      <style>{`
        .sidebar { overflow: hidden; }
        .nav-item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 12px 16px;
          border-radius: 12px;
          color: #94a3b8;
          text-decoration: none;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .nav-item:hover {
          background: rgba(255, 255, 255, 0.05);
          color: #fff;
        }
        .nav-item.active {
          background: var(--primary);
          color: #fff;
          box-shadow: 0 4px 15px rgba(14, 165, 233, 0.3);
        }
        .nav-item.active svg { color: #fff; }
      `}</style>
    </div>
  );
}

export default App;