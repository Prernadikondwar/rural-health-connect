import React, { useState, useEffect, useContext } from 'react';
import { Shield, User, Activity, Video, ClipboardList, Database, LogOut, Search, MessageSquare, CheckCircle, XCircle, Globe } from 'lucide-react';
import { LanguageContext } from './App';
import VideoCall from './components/VideoCall';
import './doctor_portal.css';

const DoctorPortal = ({ authUser }) => {
  const { lang, t, toggleLang } = useContext(LanguageContext);
  const [activeTab, setActiveTab] = useState('requests');
  const [consultationActive, setConsultationActive] = useState(false);
  const [consultationRequests, setConsultationRequests] = useState([]);
  const [registeredPatients, setRegisteredPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Load registered patients from localStorage
    const registeredUsersData = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
    if (registeredUsersData.patients) {
      const patientList = Object.entries(registeredUsersData.patients).map(([email, patient]) => ({
        email,
        fullName: patient.profile?.fullName || patient.fullName || 'Unknown',
        aadhaar: patient.profile?.aadhaar || 'N/A',
        address: patient.profile?.address || 'N/A',
        age: patient.profile?.age || 'N/A',
        gender: patient.profile?.gender || 'N/A',
        phone: patient.profile?.mobile || 'N/A',
        bloodGroup: patient.profile?.bloodGroup || 'N/A',
        medicalHistory: patient.profile?.medicalHistory || 'None',
        registrationDate: patient.profile?.registrationDate ? new Date(patient.profile.registrationDate).toLocaleDateString() : 'N/A'
      }));
      setRegisteredPatients(patientList);
    }
  }, []);

  useEffect(() => {
    const fetchRequests = () => {
      const existingRequests = localStorage.getItem('consultationRequests');
      if (existingRequests) {
         const requests = JSON.parse(existingRequests);
         const pendingRequests = requests.filter(req => req.status === 'pending');
         setConsultationRequests(pendingRequests);
      } else {
         setConsultationRequests([]);
      }
    };

    // Load real consultation requests submitted by users from localStorage
    const existingRequests = localStorage.getItem('consultationRequests');
    if (!existingRequests) {
      localStorage.setItem('consultationRequests', JSON.stringify([]));
      setConsultationRequests([]);
    } else {
      fetchRequests();
    }

    // Adaptive polling: slower when tab is hidden
    let pollInterval = 5000;
    let timerID;

    const startPolling = () => {
      timerID = setInterval(fetchRequests, pollInterval);
    };

    const handleVisibilityChange = () => {
      clearInterval(timerID);
      if (document.hidden) {
        pollInterval = 15000; // slow down to 15s when inactive
      } else {
        pollInterval = 5000; // back to 5s when active
        fetchRequests();
      }
      startPolling();
    };

    startPolling();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Listen for storage changes from other tabs
    const handleStorageChange = (e) => {
      if (e.key === 'consultationRequests') {
        fetchRequests();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(timerID);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleAcceptRequest = (requestId) => {
    // Update the request status
    const allRequests = JSON.parse(localStorage.getItem('consultationRequests') || '[]');
    const updatedRequests = allRequests.map(req => 
      req.id === requestId 
        ? { ...req, status: 'accepted', doctorResponse: 'Doctor has accepted your consultation request' }
        : req
    );
    localStorage.setItem('consultationRequests', JSON.stringify(updatedRequests));
    
    // Update local state
    setConsultationRequests(prev => prev.filter(req => req.id !== requestId));
    alert('Consultation request accepted!');
  };

  const handleRejectRequest = (requestId) => {
    // Update the request status
    const allRequests = JSON.parse(localStorage.getItem('consultationRequests') || '[]');
    const updatedRequests = allRequests.map(req => 
      req.id === requestId 
        ? { ...req, status: 'rejected', doctorResponse: 'Doctor is currently unavailable' }
        : req
    );
    localStorage.setItem('consultationRequests', JSON.stringify(updatedRequests));
    
    // Update local state
    setConsultationRequests(prev => prev.filter(req => req.id !== requestId));
  };

  const showTab = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <div className="doctor-portal-container">
      {/* Header */}
      <header className="glass-card" style={{ padding: '16px 24px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Shield color="var(--primary)" size={32} />
          <div>
            <h1 style={{ fontSize: '1.4rem', margin: 0 }}>{authUser.email}</h1>
            <p style={{ fontSize: '0.8rem', opacity: 0.5, margin: 0 }}>{t.login.doctor} | {t.title} Portal</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
           <button 
             onClick={toggleLang}
             style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}
           >
             <Globe size={16} /> {lang === 'en' ? 'मराठी' : 'English'}
           </button>
           <div style={{ textAlign: 'right' }}>
              <div style={{ color: '#10b981', fontWeight: 'bold' }}>● Online</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>{consultationRequests.length} pending {consultationRequests.length === 1 ? 'consultation' : 'consultations'}</div>
           </div>
           <button style={{ background: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e', padding: '8px 16px', border: '1px solid rgba(244, 63, 94, 0.2)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <LogOut size={16} /> Logout
           </button>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '24px' }}>
        {/* Sidebar Navigation */}
        <aside className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '8px', height: 'fit-content' }}>
          <button onClick={() => showTab('requests')} className={`sub-nav-btn ${activeTab === 'requests' ? 'active' : ''}`}>
             <MessageSquare size={20} /> Patient Requests
             {consultationRequests.length > 0 && (
               <span style={{
                 marginLeft: 'auto',
                 background: '#ef4444',
                 color: '#fff',
                 padding: '2px 8px',
                 borderRadius: '12px',
                 fontSize: '0.8rem',
                 fontWeight: 'bold'
               }}>
                 {consultationRequests.length}
               </span>
             )}
          </button>
          <button onClick={() => showTab('consultations')} className={`sub-nav-btn ${activeTab === 'consultations' ? 'active' : ''}`}>
             <Video size={20} /> Active Cases
          </button>
          <button onClick={() => showTab('patients')} className={`sub-nav-btn ${activeTab === 'patients' ? 'active' : ''}`}>
             <User size={20} /> Patient Directory
          </button>
          <button onClick={() => showTab('history')} className={`sub-nav-btn ${activeTab === 'history' ? 'active' : ''}`}>
             <Database size={20} /> Medical Records
          </button>
          <button onClick={() => showTab('reports')} className={`sub-nav-btn ${activeTab === 'reports' ? 'active' : ''}`}>
             <ClipboardList size={20} /> Analytics
          </button>
        </aside>

        {/* Main Content Area */}
        <div className="content-area">
          {activeTab === 'requests' && (
            <div style={{ display: 'grid', gap: '24px' }}>
              <div className="glass-card" style={{ padding: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                  <MessageSquare size={28} color="#0ea5e9" />
                  <h2 style={{ margin: 0 }}>Patient Consultation Requests</h2>
                  <span style={{
                    marginLeft: 'auto',
                    background: consultationRequests.length > 0 ? '#ef4444' : '#10b981',
                    color: '#fff',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '0.9rem',
                    fontWeight: 'bold'
                  }}>
                    {consultationRequests.length} {consultationRequests.length === 1 ? 'Request' : 'Requests'}
                  </span>
                </div>

                {consultationRequests.length === 0 ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '60px 40px',
                    background: 'rgba(99, 102, 241, 0.05)',
                    borderRadius: '12px',
                    border: '2px dashed rgba(99, 102, 241, 0.2)'
                  }}>
                    <CheckCircle size={48} color="#10b981" style={{ margin: '0 auto 20px' }} />
                    <h3 style={{ margin: '0 0 10px 0' }}>All Caught Up!</h3>
                    <p style={{ margin: 0, opacity: 0.7 }}>No pending consultation requests at the moment.</p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gap: '16px' }}>
                    {consultationRequests.map((request) => (
                      <div 
                        key={request.id}
                        style={{
                          background: 'rgba(99, 102, 241, 0.05)',
                          border: '1px solid rgba(99, 102, 241, 0.2)',
                          borderRadius: '12px',
                          padding: '20px',
                          cursor: 'pointer',
                          transition: 'all 0.3s',
                          borderLeft: '4px solid #0ea5e9'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)';
                          e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(99, 102, 241, 0.05)';
                          e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.2)';
                        }}
                      >
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '20px', alignItems: 'start' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                              <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{request.patientName}</h3>
                               <span style={{
                                background: request.urgency === 'high' ? '#ef4444' : request.urgency === 'medium' ? '#f59e0b' : '#10b981',
                                color: '#fff',
                                padding: '4px 10px',
                                borderRadius: '20px',
                                fontSize: '0.75rem',
                                fontWeight: 'bold',
                                textTransform: 'uppercase'
                              }}>
                                {request.type === 'video' ? '📹 Video Call' : '📋 Routine'} | {request.urgency} Priority
                              </span>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px', fontSize: '0.95rem' }}>
                              <div>
                                <span style={{ opacity: 0.6 }}>Age:</span> {request.age} | {request.gender.charAt(0).toUpperCase() + request.gender.slice(1)}
                              </div>
                              <div>
                                <span style={{ opacity: 0.6 }}>Phone:</span> {request.phone}
                              </div>
                            </div>

                            <div style={{ marginBottom: '12px' }}>
                              <span style={{ opacity: 0.6, fontSize: '0.9rem', display: 'block', marginBottom: '4px' }}>Symptoms:</span>
                              <p style={{ margin: 0, padding: '8px 12px', background: 'rgba(0,0,0,0.2)', borderRadius: '6px', fontSize: '0.9rem' }}>
                                {request.symptoms}
                              </p>
                            </div>

                            {request.medicalHistory && (
                              <div style={{ marginBottom: '12px' }}>
                                <span style={{ opacity: 0.6, fontSize: '0.9rem', display: 'block', marginBottom: '4px' }}>Medical History:</span>
                                <p style={{ margin: 0, padding: '8px 12px', background: 'rgba(0,0,0,0.2)', borderRadius: '6px', fontSize: '0.9rem' }}>
                                  {request.medicalHistory}
                                </p>
                              </div>
                            )}

                            <div style={{ fontSize: '0.85rem', opacity: 0.6 }}>
                              Requested: {new Date(request.submittedAt).toLocaleString()}
                            </div>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '160px' }}>
                            <button
                              onClick={() => handleAcceptRequest(request.id)}
                              style={{
                                padding: '10px 16px',
                                background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                                border: 'none',
                                borderRadius: '8px',
                                color: '#fff',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                transition: 'all 0.3s',
                                fontSize: '0.9rem'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.4)';
                                e.target.style.transform = 'translateY(-2px)';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.boxShadow = 'none';
                                e.target.style.transform = 'translateY(0)';
                              }}
                            >
                              <CheckCircle size={16} />
                              Accept
                            </button>
                            <button
                              onClick={() => handleRejectRequest(request.id)}
                              style={{
                                padding: '10px 16px',
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '1.5px solid rgba(239, 68, 68, 0.3)',
                                borderRadius: '8px',
                                color: '#ef4444',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                transition: 'all 0.3s',
                                fontSize: '0.9rem'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.background = 'rgba(239, 68, 68, 0.2)';
                                e.target.style.borderColor = 'rgba(239, 68, 68, 0.6)';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.background = 'rgba(239, 68, 68, 0.1)';
                                e.target.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                              }}
                            >
                              <XCircle size={16} />
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'consultations' && (
            <div style={{ display: 'grid', gridTemplateColumns: consultationActive ? '1fr' : '1.5fr 1fr', gap: '24px' }}>
              {!consultationActive ? (
                <>
                  <div className="glass-card p-6" style={{ padding: '24px' }}>
                    <h3>Patient Queue</h3>
                    <div style={{ marginTop: '20px', textAlign: 'center', padding: '40px 20px', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '12px', border: '2px dashed rgba(99, 102, 241, 0.2)' }}>
                      <p style={{ opacity: 0.6 }}>No patients in queue currently.</p>
                      <p style={{ fontSize: '0.9rem', opacity: 0.5 }}>Check "Patient Requests" tab above to accept new consultation requests.</p>
                    </div>
                  </div>
                  
                  <div className="glass-card" style={{ padding: '24px' }}>
                     <h3>Today's Stats</h3>
                     <div style={{ marginTop: '20px', display: 'grid', gap: '16px' }}>
                       <div style={{ padding: '16px', background: 'rgba(14, 165, 233, 0.05)', borderRadius: '12px', border: '1px solid rgba(14, 165, 233, 0.1)' }}>
                         <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>0</div>
                         <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>Consultations Done</div>
                       </div>
                       <div style={{ padding: '16px', background: 'rgba(244, 63, 94, 0.05)', borderRadius: '12px', border: '1px solid rgba(244, 63, 94, 0.1)' }}>
                         <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>3</div>
                         <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>Critical Referrals</div>
                       </div>
                     </div>
                  </div>
                </>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
                   <VideoCall roomName={`RHC-9012`} onEndCall={() => setConsultationActive(false)} />
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                      <div className="glass-card" style={{ padding: '24px' }}>
                        <h3>Prescription</h3>
                        <textarea placeholder="Clinical Notes..." rows="4" style={{ marginTop: '16px', marginBottom: '16px' }}></textarea>
                        <button style={{ width: '100%' }}>Finalize Rx</button>
                      </div>
                      <div className="glass-card" style={{ padding: '24px' }}>
                        <h3>Vitals Summary</h3>
                        <div style={{ marginTop: '16px', display: 'grid', gap: '10px' }}>
                           <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span style={{ opacity: 0.6 }}>BP:</span>
                              <span style={{ color: '#f43f5e' }}>165/95 mmHg</span>
                           </div>
                           <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span style={{ opacity: 0.6 }}>HR:</span>
                              <span>98 BPM</span>
                           </div>
                        </div>
                      </div>
                   </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'patients' && (
            <div className="glass-card" style={{ padding: '24px' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h3 style={{ margin: 0 }}>Patient Directory</h3>
                  <div style={{ position: 'relative', width: '300px' }}>
                    <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} size={18} />
                    <input 
                      type="text" 
                      placeholder="Search by name or email..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{ paddingLeft: '40px', width: '100%', padding: '8px 12px 8px 40px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#e2e8f0' }} 
                    />
                  </div>
               </div>
               <div className="glass-card" style={{ overflow: 'hidden' }}>
                  {registeredPatients.length === 0 ? (
                    <div style={{ padding: '40px 20px', textAlign: 'center', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '8px' }}>
                      <User size={48} color="#0ea5e9" style={{ margin: '0 auto 20px' }} />
                      <p style={{ opacity: 0.6 }}>No patients registered yet.</p>
                      <p style={{ fontSize: '0.9rem', opacity: 0.5 }}>Patients who register in the system will appear here.</p>
                    </div>
                  ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                          <th style={{ padding: '16px', fontWeight: '600', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Name</th>
                          <th style={{ padding: '16px', fontWeight: '600', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Email</th>
                          <th style={{ padding: '16px', fontWeight: '600', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Aadhaar</th>
                          <th style={{ padding: '16px', fontWeight: '600', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Age</th>
                          <th style={{ padding: '16px', fontWeight: '600', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Phone</th>
                          <th style={{ padding: '16px', fontWeight: '600', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Registered</th>
                        </tr>
                      </thead>
                      <tbody>
                        {registeredPatients
                          .filter(patient => 
                            patient.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            patient.aadhaar.includes(searchQuery)
                          )
                          .map((patient) => (
                            <tr key={patient.email} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                              <td style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: 28, height: 28, background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem' }}>
                                  {patient.fullName[0].toUpperCase()}
                                </div>
                                {patient.fullName}
                              </td>
                              <td style={{ padding: '16px', fontSize: '0.9rem', opacity: 0.8 }}>{patient.email}</td>
                              <td style={{ padding: '16px', fontSize: '0.9rem', opacity: 0.8 }}>{patient.aadhaar}</td>
                              <td style={{ padding: '16px', fontSize: '0.9rem', opacity: 0.8 }}>{patient.age}</td>
                              <td style={{ padding: '16px', fontSize: '0.9rem', opacity: 0.8 }}>{patient.phone}</td>
                              <td style={{ padding: '16px', fontSize: '0.9rem', opacity: 0.8 }}>{patient.registrationDate}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  )}
               </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .doctor-portal-container { color: #e2e8f0; }
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
        .sub-nav-btn:hover {
          background: rgba(255, 255, 255, 0.05);
          color: #fff;
        }
        .sub-nav-btn.active {
          background: rgba(14, 165, 233, 0.1);
          color: var(--primary);
          border: 1px solid rgba(14, 165, 233, 0.2);
        }
        table th { border-bottom: 2px solid var(--border); }
      `}</style>
    </div>
  );
};

export default DoctorPortal;