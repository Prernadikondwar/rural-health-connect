import React, { useState, useEffect, useContext } from 'react';
import { User, Activity, Pill, Video, LayoutDashboard, ClipboardList, LogIn, Bell, Hospital, Brain, MessageSquare, Globe } from 'lucide-react';
import { LanguageContext } from './App';
import AISymptomPredictor from './components/AISymptomPredictor';
import MedicineAvailability from './components/MedicineAvailability';
import VideoCall from './components/VideoCall';
import ConsultationRequest from './components/ConsultationRequest';
import img1 from './assets/img1.png';
import img2 from './assets/img2.png';
import img3 from './assets/img3.png';
import './rural_health_connect.css';

const RuralHealthConnect = ({ authUser }) => {
  const { lang, t, toggleLang } = useContext(LanguageContext);
  const [activeTab, setActiveTab] = useState('welcome');
  const [currentPatient, setCurrentPatient] = useState(null);
  const [healthData, setHealthData] = useState(null);
  const [consultationActive, setConsultationActive] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'Dr. Sharma',
      message: 'Hello! I\'ve reviewed your health data. How are you feeling today?',
      type: 'doctor'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [videoRequest, setVideoRequest] = useState(null);

  // Poll for video request status
  useEffect(() => {
    if (activeTab === 'consultation' && videoRequest && videoRequest.status === 'pending') {
      const interval = setInterval(() => {
        const allRequests = JSON.parse(localStorage.getItem('consultationRequests') || '[]');
        const updatedReq = allRequests.find(req => req.id === videoRequest.id);
        if (updatedReq && updatedReq.status === 'accepted') {
          setVideoRequest(updatedReq);
          setConsultationActive(true);
          clearInterval(interval);
        }
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [activeTab, videoRequest]);

  // Load patient profile from authUser when component mounts
  useEffect(() => {
    if (authUser && authUser.type === 'patient' && authUser.profile) {
      // Check if profile has any data (indicating registered patient)
      if (authUser.profile.aadhaar && authUser.profile.fullName) {
        setCurrentPatient(authUser.profile);
      }
    }
  }, [authUser]);

  const showTab = (tabName) => {
    setActiveTab(tabName);
  };

  const handleRegistration = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const patientData = {
      aadhaar: formData.get('aadhaar'),
      mobile: formData.get('mobile'),
      fullName: formData.get('fullName'),
      age: formData.get('age'),
      gender: formData.get('gender'),
      bloodGroup: formData.get('bloodGroup'),
      address: formData.get('address'),
      medicalHistory: formData.get('medicalHistory'),
      registrationDate: new Date().toISOString()
    };

    if (patientData.aadhaar.length < 12) {
      alert('Please enter a valid Aadhaar number');
      return;
    }

    setCurrentPatient(patientData);

    // If user is logged in, also update their profile in authUser and registered users
    if (authUser && authUser.email && authUser.type === 'patient') {
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
      if (registeredUsers.patients && registeredUsers.patients[authUser.email]) {
        registeredUsers.patients[authUser.email].profile = patientData;
        registeredUsers.patients[authUser.email].fullName = patientData.fullName;
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
      }

      // Update authUser in localStorage
      const updatedAuthUser = {
        ...authUser,
        profile: patientData,
        name: patientData.fullName
      };
      localStorage.setItem('authUser', JSON.stringify(updatedAuthUser));
    }

    alert(`Registration Successful! Welcome ${patientData.fullName}!`);
    setActiveTab('dashboard');
  };

  const AccessRestricted = ({ featureName }) => (
    <div className="glass-card" style={{ padding: '60px 40px', textAlign: 'center' }}>
      <User size={60} color="var(--primary)" style={{ margin: '0 auto 20px', opacity: 0.5 }} />
      <h2 style={{ marginBottom: '16px' }}>{t.restricted.title}</h2>
      <p style={{ opacity: 0.7, maxWidth: '500px', margin: '0 auto 30px' }}>
        {t.restricted.desc.replace('{feature}', featureName)}
      </p>
      <button 
        onClick={() => showTab('register')}
        style={{ padding: '14px 40px', background: 'linear-gradient(135deg, #10b981, #06b6d4)', fontWeight: '600' }}
      >
        {t.restricted.btn}
      </button>
    </div>
  );

  const WelcomeTab = () => (
    <div className="welcome-section glass-card" style={{ padding: '60px 40px', textAlign: 'center' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '20px', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        {t.title}
      </h1>
      <p style={{ fontSize: '1.2rem', color: '#94a3b8', maxWidth: '700px', margin: '0 auto 40px' }}>
        {t.tagline}
      </p>
      
      <div className="feature-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div className="feature-card glass-card" style={{ padding: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img src={img1} alt="AI Diagnosis" style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '12px', marginBottom: '20px' }} />
          <Activity size={24} color="var(--primary)" style={{ marginBottom: '10px' }} />
          <h3>{t.dashboard.aiHealthCheck}</h3>
          <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>{t.dashboard.aiDesc}</p>
        </div>
        <div className="feature-card glass-card" style={{ padding: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img src={img2} alt="Video Consultation" style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '12px', marginBottom: '20px' }} />
          <Video size={24} color="var(--primary)" style={{ marginBottom: '10px' }} />
          <h3>{t.dashboard.telemedicine}</h3>
          <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>{t.dashboard.teleDesc}</p>
        </div>
        <div className="feature-card glass-card" style={{ padding: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img src={img3} alt="Medicine Tracker" style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '12px', marginBottom: '20px' }} />
          <Pill size={24} color="var(--primary)" style={{ marginBottom: '10px' }} />
          <h3>{t.nav.medicines}</h3>
          <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>{t.tagline.split('.')[1] || 'Live updates on medicine stock.'}</p>
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
        <button onClick={() => showTab('register')} style={{ padding: '15px 40px' }}>Get Started</button>
        <button onClick={() => showTab('symptom')} style={{ padding: '15px 40px', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.3)', color: '#6366f1' }}>Try AI Predictor</button>
      </div>
    </div>
  );

  return (
    <div className="user-dashboard-container">
      {/* Top Navbar */}
      <header className="glass-card" style={{ padding: '16px 24px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Hospital color="var(--primary)" size={32} />
          <div>
            <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Sehatsetu Dashboard</h1>
            <p style={{ fontSize: '0.8rem', opacity: 0.5, margin: 0 }}>Village Health Portal</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button 
            onClick={() => showTab('symptom')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              background: 'linear-gradient(135deg, #6366f1, #0ea5e9)',
              border: 'none',
              borderRadius: '20px',
              color: '#fff',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)'
            }}
          >
            <Brain size={18} />
            <span>AI Predictor</span>
          </button>
          <button 
            onClick={() => showTab('consult-request')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              background: 'linear-gradient(135deg, #f59e0b, #ec4899)',
              border: 'none',
              borderRadius: '20px',
              color: '#fff',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)'
            }}
          >
            <MessageSquare size={18} />
            <span>Request Doctor</span>
          </button>
          <button 
            onClick={() => { setConsultationActive(true); showTab('consultation'); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              background: 'linear-gradient(135deg, #10b981, #06b6d4)',
              border: 'none',
              borderRadius: '20px',
              color: '#fff',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
            }}
          >
            <Video size={18} />
            <span>Video Call</span>
          </button>
          <div className="notifications" style={{ position: 'relative' }}>
             <Bell size={20} />
             <span style={{ position: 'absolute', top: -5, right: -5, width: 8, height: 8, background: 'var(--accent)', borderRadius: '50%' }}></span>
          </div>
          {currentPatient && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 14px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', border: '1px solid var(--border)' }}>
              <div style={{ width: 32, height: 32, background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                {authUser.email[0].toUpperCase()}
              </div>
              <span style={{ fontWeight: 600 }}>{authUser.email}</span>
            </div>
          )}
        </div>
      </header>

      {/* Main Grid */}
      <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '24px', minHeight: '80vh' }}>
        {/* Sub-navigation */}
        <aside className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button onClick={() => showTab('welcome')} className={`sub-nav-btn ${activeTab === 'welcome' ? 'active' : ''}`}>
            <LogIn size={20} /> {t.nav.home}
          </button>
          <button onClick={() => showTab('dashboard')} className={`sub-nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}>
            <LayoutDashboard size={20} /> {t.nav.dashboard}
          </button>
          <button onClick={() => showTab('register')} className={`sub-nav-btn ${activeTab === 'register' ? 'active' : ''}`}>
             <User size={20} /> {t.nav.registration}
          </button>
          <button onClick={() => showTab('symptom')} className={`sub-nav-btn ${activeTab === 'symptom' ? 'active' : ''}`}>
            <Activity size={20} /> {t.nav.aiPredictor}
          </button>
          <button onClick={() => showTab('medicines')} className={`sub-nav-btn ${activeTab === 'medicines' ? 'active' : ''}`}>
            <Pill size={20} /> {t.nav.medicines}
          </button>
          <button onClick={() => showTab('consultation')} className={`sub-nav-btn ${activeTab === 'consultation' ? 'active' : ''}`}>
            <Video size={20} /> {t.nav.videoCall}
          </button>
          <button onClick={() => showTab('consult-request')} className={`sub-nav-btn ${activeTab === 'consult-request' ? 'active' : ''}`}>
            <MessageSquare size={20} /> {t.nav.requestDoctor}
          </button>
        </aside>

        {/* Dynamic Content Area */}
        <div className="content-area">
          {activeTab === 'welcome' && <WelcomeTab />}
          
          {activeTab === 'register' && (
            <div className="glass-card" style={{ padding: '40px' }}>
              <h2 style={{ marginBottom: '30px' }}>{t.registration.title}</h2>
              <form onSubmit={handleRegistration} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div className="form-group">
                  <label>Aadhaar Number</label>
                  <input type="text" name="aadhaar" placeholder="XXXX-XXXX-XXXX" required />
                </div>
                <div className="form-group">
                  <label>Mobile Number</label>
                  <input type="tel" name="mobile" placeholder="+91-XXXXX-XXXXX" required />
                </div>
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" name="fullName" placeholder="Enter full name" required />
                </div>
                <div className="form-group">
                  <label>Age</label>
                  <input type="number" name="age" placeholder="Age" required />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Address</label>
                  <textarea name="address" placeholder="Complete address" rows="3"></textarea>
                </div>
                <div style={{ gridColumn: 'span 2', textAlign: 'center', marginTop: '20px' }}>
                  <button type="submit" style={{ width: '250px' }}>Register Patient</button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'dashboard' && (!currentPatient ? <AccessRestricted featureName={t.nav.dashboard} /> : (
            <div style={{ display: 'grid', gap: '24px' }}>
              <div className="glass-card" style={{ padding: '30px', background: 'linear-gradient(to right, rgba(14, 165, 233, 0.1), transparent)' }}>
                <h2>{t.dashboard.welcome.replace('{name}', authUser.email)}</h2>
                <p style={{ opacity: 0.7 }}>{t.dashboard.status}</p>
              </div>

              {/* AI Predictor Quick Access */}
              <div style={{
                padding: '20px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(14, 165, 233, 0.1))',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Brain size={28} color="#6366f1" />
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{t.dashboard.aiHealthCheck}</h3>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', opacity: 0.7 }}>{t.dashboard.aiDesc}</p>
                  </div>
                </div>
                <button 
                  onClick={() => showTab('symptom')}
                  style={{
                    padding: '10px 24px',
                    background: 'linear-gradient(135deg, #6366f1, #0ea5e9)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)'
                  }}
                >
                  {t.dashboard.analyzeNow}
                </button>
              </div>

              {/* Video Call Quick Access */}
              <div style={{
                padding: '20px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(6, 182, 212, 0.1))',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Video size={28} color="#10b981" />
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{t.dashboard.telemedicine}</h3>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', opacity: 0.7 }}>{t.dashboard.teleDesc}</p>
                  </div>
                </div>
                <button 
                  onClick={() => { setConsultationActive(true); showTab('consultation'); }}
                  style={{
                    padding: '10px 24px',
                    background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
                  }}
                >
                  {t.dashboard.startCall}
                </button>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                <div className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.8rem', opacity: 0.6, marginBottom: '8px' }}>Blood Pressure</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                    {healthData?.vitals.bpSystolic || '--'}/{healthData?.vitals.bpDiastolic || '--'}
                  </div>
                </div>
                <div className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.8rem', opacity: 0.6, marginBottom: '8px' }}>Heart Rate</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--accent)' }}>
                    {healthData?.vitals.heartRate || '72'} <span style={{ fontSize: '0.8rem' }}>BPM</span>
                  </div>
                </div>
                <div className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.8rem', opacity: 0.6, marginBottom: '8px' }}>Blood Sugar</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#10b981' }}>
                    {healthData?.vitals.bloodSugar || '98'} <span style={{ fontSize: '0.8rem' }}>mg/dL</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
                <div className="glass-card" style={{ padding: '24px' }}>
                   <h3>Recent Activity</h3>
                   <div style={{ marginTop: '20px', display: 'grid', gap: '16px' }}>
                      <div style={{ display: 'flex', gap: '12px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                         <div style={{ width: 40, height: 40, background: 'var(--primary)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Activity size={20} />
                         </div>
                         <div>
                            <div style={{ fontWeight: 'bold' }}>Health Checkup</div>
                            <div style={{ fontSize: '0.8rem', opacity: 0.5 }}>Completed on Oct 12, 2025</div>
                         </div>
                      </div>
                      <div style={{ display: 'flex', gap: '12px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                         <div style={{ width: 40, height: 40, background: 'var(--accent)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Video size={20} />
                         </div>
                         <div>
                            <div style={{ fontWeight: 'bold' }}>Tele-consultation</div>
                            <div style={{ fontSize: '0.8rem', opacity: 0.5 }}>Scheduled for tomorrow, 10:00 AM</div>
                         </div>
                      </div>
                   </div>
                </div>
                <MedicineAvailability />
              </div>
            </div>
          ))}

          {activeTab === 'symptom' && (!currentPatient ? <AccessRestricted featureName="AI Health Predictor" /> : <AISymptomPredictor />)}
          
          {activeTab === 'medicines' && <MedicineAvailability />}
          
          {activeTab === 'consultation' && (!currentPatient ? <AccessRestricted featureName="Telemedicine Video Call" /> : (
            <div style={{ display: 'grid', gap: '24px' }}>
               {!consultationActive ? (
                 <div style={{ display: 'grid', gap: '24px' }}>
                   <div className="glass-card" style={{ padding: '60px', textAlign: 'center' }}>
                      {videoRequest && videoRequest.status === 'pending' ? (
                        <div style={{ padding: '20px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                          <p style={{ margin: 0, fontWeight: 'bold', color: '#f59e0b' }}>{t.video.pending}</p>
                          <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem', opacity: 0.7 }}>{t.video.waiting}</p>
                        </div>
                      ) : (
                        <button 
                          onClick={() => {
                            const newRequest = {
                              id: Date.now(),
                              patientName: currentPatient.fullName,
                              age: currentPatient.age,
                              gender: currentPatient.gender,
                              email: authUser.email,
                              phone: currentPatient.mobile,
                              symptoms: t.video.requestTitle,
                              urgency: 'medium',
                              patientId: currentPatient.aadhaar,
                              submittedAt: new Date().toISOString(),
                              status: 'pending',
                              type: 'video'
                            };
                            const existing = JSON.parse(localStorage.getItem('consultationRequests') || '[]');
                            existing.push(newRequest);
                            localStorage.setItem('consultationRequests', JSON.stringify(existing));
                            setVideoRequest(newRequest);
                            alert(t.video.pending);
                          }} 
                          style={{ padding: '14px 40px', background: 'linear-gradient(135deg, #10b981, #06b6d4)', fontSize: '1rem', fontWeight: '600' }}
                        >
                          {t.video.btn}
                        </button>
                      )}
                   </div>

                   <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                     <div className="glass-card" style={{ padding: '20px' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                         <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '8px', borderRadius: '8px' }}>
                           <Video size={20} color="#10b981" />
                         </div>
                         <h4 style={{ margin: 0 }}>High Quality Video</h4>
                       </div>
                       <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.7 }}>Crystal clear video and audio for better communication</p>
                     </div>

                     <div className="glass-card" style={{ padding: '20px' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                         <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '8px', borderRadius: '8px' }}>
                           <Brain size={20} color="#6366f1" />
                         </div>
                         <h4 style={{ margin: 0 }}>Certified Doctors</h4>
                       </div>
                       <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.7 }}>Consult with licensed medical professionals</p>
                     </div>

                     <div className="glass-card" style={{ padding: '20px' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                         <div style={{ background: 'rgba(244, 63, 94, 0.1)', padding: '8px', borderRadius: '8px' }}>
                           <Activity size={20} color="#f43f5e" />
                         </div>
                         <h4 style={{ margin: 0 }}>Secure & Private</h4>
                       </div>
                       <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.7 }}>End-to-end encrypted communication</p>
                     </div>
                   </div>
                 </div>
               ) : (
                 <VideoCall roomName={`RHC-${currentPatient?.aadhaar.substr(-4)}`} onEndCall={() => setConsultationActive(false)} />
               )}
            </div>
          ))}

          {activeTab === 'consult-request' && (!currentPatient ? <AccessRestricted featureName="Doctor Consultation Request" /> : (
            <ConsultationRequest 
              authUser={{ 
                id: currentPatient.aadhaar, 
                email: currentPatient.email || '',
                name: currentPatient.fullName 
              }} 
            />
          ))}
        </div>
      </div>

      <style>{`
        .sub-nav-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: transparent;
          border-radius: 12px;
          color: #94a3b8;
          transition: all 0.2s;
          text-align: left;
          width: 100%;
          border: none;
          box-shadow: none;
        }
        .sub-nav-btn:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.05);
          color: #fff;
        }
        .sub-nav-btn.active {
          background: rgba(14, 165, 233, 0.1);
          color: var(--primary);
          border: 1px solid rgba(14, 165, 233, 0.2);
        }
        .sub-nav-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default RuralHealthConnect;