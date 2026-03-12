import React, { useState } from 'react';
import { LayoutDashboard, Users, AlertCircle, BarChart3, Package, Settings, LogOut, Plus, Search, MapPin } from 'lucide-react';
import MedicineAvailability from './components/MedicineAvailability';
import './phc_hub.css';

const PHCHub = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Registered Patients', value: '847', icon: <Users size={20} />, color: 'var(--primary)' },
    { label: 'Active Consultations', value: '23', icon: <AlertCircle size={20} />, color: '#f43f5e' },
    { label: 'Inventory Level', value: '92%', icon: <Package size={20} />, color: '#10b981' },
    { label: 'Monthly Growth', value: '+14%', icon: <BarChart3 size={20} />, color: '#8b5cf6' }
  ];

  return (
    <div className="phc-hub-container">
      {/* Header */}
      <header className="glass-card" style={{ padding: '16px 24px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div className="phc-logo-container">
            <LayoutDashboard color="var(--primary)" size={32} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.4rem', margin: 0 }}>PHC Rampur</h1>
            <p style={{ fontSize: '0.8rem', opacity: 0.5, margin: 0 }}>Kangra District | Facility ID: HP-7721</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
           <div className="admin-badge">
             <div style={{ fontWeight: '600' }}>Dr. Priya Sharma</div>
             <div style={{ fontSize: '0.7rem', opacity: 0.6, textAlign: 'right' }}>PHC Administrator</div>
           </div>
           <button className="logout-btn">
             <LogOut size={18} />
           </button>
        </div>
      </header>

      {/* Stats Quick View */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '24px' }}>
        {stats.map((stat, i) => (
          <div key={i} className="glass-card stat-card-phc" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ color: stat.color, background: `${stat.color}15`, padding: '8px', borderRadius: '10px' }}>
                {stat.icon}
              </span>
              <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{stat.value}</span>
            </div>
            <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '24px' }}>
        {/* Sidebar Nav */}
        <aside className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            { id: 'overview', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
            { id: 'patients', label: 'Patient Registry', icon: <Users size={20} /> },
            { id: 'inventory', label: 'Medicine Inventory', icon: <Package size={20} /> },
            { id: 'analytics', label: 'Public Health', icon: <BarChart3 size={20} /> },
            { id: 'settings', label: 'Facility Settings', icon: <Settings size={20} /> }
          ].map(item => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`nav-item-phc ${activeTab === item.id ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
          
          <div style={{ marginTop: 'auto', paddingTop: '24px' }}>
             <button className="add-patient-btn">
               <Plus size={20} /> New Registration
             </button>
          </div>
        </aside>

        {/* Dynamic Content */}
        <main className="content-area-phc">
          {activeTab === 'overview' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
              <div className="glass-card" style={{ padding: '24px' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                   <h3>Emergency Queue</h3>
                   <span style={{ fontSize: '0.8rem', color: '#f43f5e' }}>Live Updates</span>
                 </div>
                 <div style={{ display: 'grid', gap: '16px' }}>
                    <div className="alert-item high-alert">
                       <div className="alert-header">
                         <span className="alert-badge">Critical</span>
                         <span className="alert-time">2m ago</span>
                       </div>
                       <div className="alert-body">
                         <div className="patient-main-info">Ravi Kumar (ID: 9012)</div>
                         <div className="patient-location"><MapPin size={14} /> Village Rampur</div>
                       </div>
                       <button className="dispatch-btn">Dispatch EMS</button>
                    </div>
                    <div className="alert-item medium-alert">
                       <div className="alert-header">
                         <span className="alert-badge">Stable</span>
                         <span className="alert-time">15m ago</span>
                       </div>
                       <div className="alert-body">
                         <div className="patient-main-info">Sunita Devi (ID: 7834)</div>
                         <div className="patient-location"><MapPin size={14} /> Village Dharamkot</div>
                       </div>
                    </div>
                 </div>
              </div>
              
              <div className="glass-card" style={{ padding: '24px' }}>
                 <h3>Facility Status</h3>
                 <div style={{ marginTop: '20px', display: 'grid', gap: '20px' }}>
                    <div className="status-indicator">
                       <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{ fontSize: '0.85rem' }}>Ambulance Availability</span>
                          <span>1/2</span>
                       </div>
                       <div className="progress-bar"><div className="progress" style={{ width: '50%' }}></div></div>
                    </div>
                    <div className="status-indicator">
                       <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{ fontSize: '0.85rem' }}>Oxygen Stock</span>
                          <span style={{ color: '#10b981' }}>Optimal</span>
                       </div>
                       <div className="progress-bar"><div className="progress" style={{ width: '85%', background: '#10b981' }}></div></div>
                    </div>
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'patients' && (
            <div className="glass-card" style={{ padding: '24px' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h3>Electronic Health Records</h3>
                  <div className="search-box">
                    <Search size={18} />
                    <input type="text" placeholder="Search by name, ID or mobile..." />
                  </div>
               </div>
               <div className="ehr-table-wrapper">
                 <table className="phc-table">
                   <thead>
                     <tr>
                       <th>Patient Name</th>
                       <th>Age/Sex</th>
                       <th>Village</th>
                       <th>Risk Status</th>
                       <th>Last Visit</th>
                       <th>Actions</th>
                     </tr>
                   </thead>
                   <tbody>
                     <tr>
                       <td>
                         <div style={{ fontWeight: '600' }}>Mohan Singh</div>
                         <span style={{ fontSize: '0.7rem', opacity: 0.5 }}>ID: 5621</span>
                       </td>
                       <td>38/M</td>
                       <td>Mcleodganj</td>
                       <td><span className="status-pill low">Low</span></td>
                       <td>10 Dec 2025</td>
                       <td><button className="table-action-btn">View EHR</button></td>
                     </tr>
                     <tr>
                       <td>
                         <div style={{ fontWeight: '600' }}>Kamla Devi</div>
                         <span style={{ fontSize: '0.7rem', opacity: 0.5 }}>ID: 3456</span>
                       </td>
                       <td>67/F</td>
                       <td>Bhagsu</td>
                       <td><span className="status-pill high">High</span></td>
                       <td>12 Dec 2025</td>
                       <td><button className="table-action-btn">View EHR</button></td>
                     </tr>
                   </tbody>
                 </table>
               </div>
            </div>
          )}

          {activeTab === 'inventory' && (
            <MedicineAvailability facilityMode={true} />
          )}

          {activeTab === 'analytics' && (
             <div className="glass-card" style={{ padding: '24px' }}>
               <h3>Regional Health Analytics</h3>
               <div style={{ marginTop: '24px', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                  <p style={{ opacity: 0.5 }}>Disease Distribution Heatmap (Loading...)</p>
               </div>
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '24px' }}>
                  <div className="analytics-stat">
                    <h4>Hypertension</h4>
                    <div className="stat-val">156 Cases</div>
                    <div className="stat-trend down">-5% this month</div>
                  </div>
                  <div className="analytics-stat">
                    <h4>Diabetes</h4>
                    <div className="stat-val">89 Cases</div>
                    <div className="stat-trend up">+2% this month</div>
                  </div>
                  <div className="analytics-stat">
                    <h4>Respiratory</h4>
                    <div className="stat-val">67 Cases</div>
                    <div className="stat-trend up">+12% this month</div>
                  </div>
               </div>
             </div>
          )}
        </main>
      </div>

      <style>{`
        .phc-hub-container { color: #e2e8f0; }
        .nav-item-phc {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: transparent;
          border: none;
          color: #94a3b8;
          border-radius: 12px;
          transition: all 0.2s;
          text-align: left;
          cursor: pointer;
        }
        .nav-item-phc:hover { background: rgba(255, 255, 255, 0.05); color: #fff; }
        .nav-item-phc.active {
          background: rgba(14, 165, 233, 0.1);
          color: var(--primary);
          border: 1px solid rgba(14, 165, 233, 0.2);
        }
        .add-patient-btn {
          width: 100%;
          background: var(--primary);
          color: white;
          padding: 12px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: none;
          font-weight: 600;
          cursor: pointer;
        }
        .alert-item {
          padding: 16px;
          border-radius: 16px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
        }
        .high-alert { border-left: 4px solid #f43f5e; }
        .alert-badge { font-size: 0.7rem; font-weight: bold; text-transform: uppercase; }
        .high-alert .alert-badge { color: #f43f5e; }
        .alert-header { display: flex; justify-content: space-between; margin-bottom: 8px; }
        .alert-time { font-size: 0.7rem; opacity: 0.5; }
        .dispatch-btn {
          margin-top: 12px;
          width: 100%;
          background: rgba(244, 63, 94, 0.1);
          color: #f43f5e;
          border: 1px solid rgba(244, 63, 94, 0.2);
          padding: 8px;
          border-radius: 8px;
          cursor: pointer;
        }
        .search-box {
          position: relative;
          width: 300px;
          display: flex;
          align-items: center;
        }
        .search-box svg { position: absolute; left: 12px; opacity: 0.4; }
        .search-box input {
          width: 100%;
          padding: 10px 10px 10px 40px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          color: white;
        }
        .phc-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        .phc-table th { text-align: left; padding: 12px; opacity: 0.5; font-size: 0.8rem; border-bottom: 1px solid rgba(255,255,255,0.1); }
        .phc-table td { padding: 16px 12px; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .status-pill { padding: 4px 10px; border-radius: 20px; font-size: 0.7rem; font-weight: 700; }
        .status-pill.high { background: rgba(244, 63, 94, 0.1); color: #f43f5e; }
        .status-pill.low { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .analytics-stat { padding: 16px; background: rgba(255,255,255,0.03); border-radius: 12px; }
        .stat-val { font-size: 1.2rem; font-weight: bold; margin: 8px 0; }
        .stat-trend { font-size: 0.7rem; }
        .trend-up { color: #f43f5e; }
        .trend-down { color: #10b981; }
        .logout-btn { background: rgba(255,255,255,0.05); border: none; padding: 10px; border-radius: 10px; color: white; cursor: pointer; }
      `}</style>
    </div>
  );
};

export default PHCHub;
