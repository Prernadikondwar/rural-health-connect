import React from 'react';
import { Pill, Check, X, RefreshCw } from 'lucide-react';

const MedicineAvailability = () => {
  const medicines = [
    { name: 'Paracetamol 650mg', status: 'In Stock', stock: '500+ units', location: 'Main Pharmacy' },
    { name: 'Amoxicillin 500mg', status: 'Low Stock', stock: '45 units', location: 'Main Pharmacy' },
    { name: 'Metformin 500mg', status: 'In Stock', stock: '200 units', location: 'Sub-Center A' },
    { name: 'Insulin (Rapid Acting)', status: 'Out of Stock', stock: '0 units', location: 'District Hospital' },
    { name: 'Amlodipine 5mg', status: 'In Stock', stock: '120 units', location: 'Main Pharmacy' },
    { name: 'ORS Packets', status: 'In Stock', stock: '1000+ units', location: 'All Centers' },
  ];

  return (
    <div className="glass-card" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Pill size={24} color="var(--primary)" />
          <h2 style={{ margin: 0 }}>Medicine Availability</h2>
        </div>
        <button className="btn-icon" style={{ padding: '8px', background: 'transparent', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <RefreshCw size={16} /> <span style={{ fontSize: '0.8rem' }}>Update</span>
        </button>
      </div>

      <div style={{ display: 'grid', gap: '12px' }}>
        {medicines.map((med, index) => (
          <div key={index} style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '12px 16px', 
            backgroundColor: 'rgba(255,255,255,0.03)', 
            borderRadius: '10px',
            border: '1px solid var(--border)' 
          }}>
            <div>
              <div style={{ fontWeight: 'bold' }}>{med.name}</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>{med.location}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px', 
                color: med.status === 'In Stock' ? '#22c55e' : med.status === 'Low Stock' ? '#eab308' : '#f43f5e',
                fontSize: '0.9rem',
                fontWeight: '600'
              }}>
                {med.status === 'In Stock' ? <Check size={16} /> : med.status === 'Low Stock' ? <RefreshCw size={16} /> : <X size={16} />}
                {med.status}
              </div>
              <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>{med.stock}</div>
            </div>
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: '20px', padding: '12px', backgroundColor: 'rgba(14, 165, 233, 0.1)', borderRadius: '8px', fontSize: '0.85rem' }}>
        <p style={{ margin: 0, color: 'var(--primary)' }}>
          <strong>Note:</strong> Stock levels are updated every 6 hours by the Primary Health Center staff.
        </p>
      </div>
    </div>
  );
};

export default MedicineAvailability;
