import React, { useState } from 'react';
import { Send, AlertCircle, CheckCircle } from 'lucide-react';

const ConsultationRequest = ({ authUser, onSubmit }) => {
  const [formData, setFormData] = useState({
    patientName: '',
    age: '',
    gender: '',
    email: authUser?.email || '',
    phone: '',
    symptoms: '',
    medicalHistory: '',
    urgency: 'medium',
    preferredTime: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate required fields
    if (!formData.patientName.trim() || !formData.age || !formData.symptoms.trim()) {
      alert('Please fill in all required fields');
      setLoading(false);
      return;
    }

    // Create consultation request
    const consultationRequest = {
      id: Date.now(),
      ...formData,
      patientId: authUser?.id || 'unknown',
      submittedAt: new Date().toISOString(),
      status: 'pending',
      doctorResponse: null,
      type: formData.type || 'routine'
    };


    // Save to localStorage
    const existingRequests = JSON.parse(localStorage.getItem('consultationRequests') || '[]');
    existingRequests.push(consultationRequest);
    localStorage.setItem('consultationRequests', JSON.stringify(existingRequests));

    // Call parent onSubmit if provided
    if (onSubmit) {
      onSubmit(consultationRequest);
    }

    setLoading(false);
    setSubmitted(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({
        patientName: '',
        age: '',
        gender: '',
        email: authUser?.email || '',
        phone: '',
        symptoms: '',
        medicalHistory: '',
        urgency: 'medium',
        preferredTime: ''
      });
      setSubmitted(false);
    }, 3000);
  };

  if (submitted) {
    return (
      <div className="glass-card" style={{
        padding: '60px 40px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(34, 197, 94, 0.1))',
        border: '1px solid rgba(16, 185, 129, 0.3)'
      }}>
        <CheckCircle size={60} color="#10b981" style={{ margin: '0 auto 20px' }} />
        <h2 style={{ color: '#10b981', marginBottom: '10px' }}>Request Submitted Successfully!</h2>
        <p style={{ opacity: 0.7, marginBottom: '10px' }}>
          Your consultation request has been sent to available doctors.
        </p>
        <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>
          A doctor will review your details and respond shortly. You'll be notified when a doctor accepts your request.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card" style={{ padding: '40px' }}>
      <h2 style={{ marginBottom: '10px' }}>Request a Doctor Consultation</h2>
      <p style={{ opacity: 0.7, marginBottom: '30px' }}>
        Fill in your health details. A doctor will review and contact you shortly.
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Patient Name */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#ffffff' }}>
            Full Name *
          </label>
          <input
            type="text"
            name="patientName"
            value={formData.patientName}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
            style={{
              width: '100%',
              padding: '10px 12px',
              background: 'rgba(30, 41, 59, 0.95)',
              border: '1.5px solid rgba(14, 165, 233, 0.3)',
              color: '#ffffff',
              borderRadius: '8px',
              fontSize: '0.95rem'
            }}
          />
        </div>

        {/* Age */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#ffffff' }}>
            Age *
          </label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder="Age"
            required
            style={{
              width: '100%',
              padding: '10px 12px',
              background: 'rgba(30, 41, 59, 0.95)',
              border: '1.5px solid rgba(14, 165, 233, 0.3)',
              color: '#ffffff',
              borderRadius: '8px',
              fontSize: '0.95rem'
            }}
          />
        </div>

        {/* Gender */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#ffffff' }}>
            Gender *
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '10px 12px',
              background: 'rgba(30, 41, 59, 0.95)',
              border: '1.5px solid rgba(14, 165, 233, 0.3)',
              color: '#ffffff',
              borderRadius: '8px',
              fontSize: '0.95rem',
              cursor: 'pointer'
            }}
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Phone */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#ffffff' }}>
            Phone Number *
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+91-XXXXX-XXXXX"
            required
            style={{
              width: '100%',
              padding: '10px 12px',
              background: 'rgba(30, 41, 59, 0.95)',
              border: '1.5px solid rgba(14, 165, 233, 0.3)',
              color: '#ffffff',
              borderRadius: '8px',
              fontSize: '0.95rem'
            }}
          />
        </div>

        {/* Urgency */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#ffffff' }}>
            Urgency Level *
          </label>
          <select
            name="urgency"
            value={formData.urgency}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '10px 12px',
              background: 'rgba(30, 41, 59, 0.95)',
              border: '1.5px solid rgba(14, 165, 233, 0.3)',
              color: '#ffffff',
              borderRadius: '8px',
              fontSize: '0.95rem',
              cursor: 'pointer'
            }}
          >
            <option value="low">Low (Can wait)</option>
            <option value="medium">Medium (Soon)</option>
            <option value="high">High (Urgent)</option>
          </select>
        </div>

        <div></div>

        {/* Email */}
        <div style={{ gridColumn: 'span 2' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#ffffff' }}>
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            disabled
            style={{
              width: '100%',
              padding: '10px 12px',
              background: 'rgba(30, 41, 59, 0.6)',
              border: '1.5px solid rgba(14, 165, 233, 0.2)',
              color: '#94a3b8',
              borderRadius: '8px',
              fontSize: '0.95rem',
              cursor: 'not-allowed'
            }}
          />
        </div>

        {/* Symptoms */}
        <div style={{ gridColumn: 'span 2' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#ffffff' }}>
            Current Symptoms *
          </label>
          <textarea
            name="symptoms"
            value={formData.symptoms}
            onChange={handleChange}
            placeholder="Describe your symptoms in detail..."
            rows="4"
            required
            style={{
              width: '100%',
              padding: '10px 12px',
              background: 'rgba(30, 41, 59, 0.95)',
              border: '1.5px solid rgba(14, 165, 233, 0.3)',
              color: '#ffffff',
              borderRadius: '8px',
              fontSize: '0.95rem',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
          />
        </div>

        {/* Medical History */}
        <div style={{ gridColumn: 'span 2' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#ffffff' }}>
            Medical History / Allergies
          </label>
          <textarea
            name="medicalHistory"
            value={formData.medicalHistory}
            onChange={handleChange}
            placeholder="Any past illnesses, allergies, or medications you're taking..."
            rows="3"
            style={{
              width: '100%',
              padding: '10px 12px',
              background: 'rgba(30, 41, 59, 0.95)',
              border: '1.5px solid rgba(14, 165, 233, 0.3)',
              color: '#ffffff',
              borderRadius: '8px',
              fontSize: '0.95rem',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
          />
        </div>

        {/* Preferred Time */}
        <div style={{ gridColumn: 'span 2' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#ffffff' }}>
            Preferred Consultation Time
          </label>
          <input
            type="datetime-local"
            name="preferredTime"
            value={formData.preferredTime}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '10px 12px',
              background: 'rgba(30, 41, 59, 0.95)',
              border: '1.5px solid rgba(14, 165, 233, 0.3)',
              color: '#ffffff',
              borderRadius: '8px',
              fontSize: '0.95rem'
            }}
          />
        </div>

        {/* Info Box */}
        <div style={{
          gridColumn: 'span 2',
          padding: '15px',
          background: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '8px',
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-start'
        }}>
          <AlertCircle size={20} color="#60a5fa" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
            <strong>Please provide accurate details</strong>. The doctor will use this information to better understand your condition and provide appropriate consultation.
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          style={{
            gridColumn: 'span 2',
            padding: '14px',
            background: loading ? 'rgba(14, 165, 233, 0.4)' : 'linear-gradient(135deg, #0ea5e9, #6366f1)',
            border: 'none',
            borderRadius: '10px',
            color: '#fff',
            fontWeight: '700',
            fontSize: '1rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            transition: 'all 0.3s ease',
            boxShadow: '0 8px 20px rgba(14, 165, 233, 0.3)',
            textAlign: 'center'
          }}
        >
          {loading ? '⏳ Submitting...' : (
            <>
              <Send size={20} />
              Submit Consultation Request
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ConsultationRequest;
