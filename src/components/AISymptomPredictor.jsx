import React, { useState, useContext } from 'react';
import { AlertTriangle, CheckCircle, Zap, Brain } from 'lucide-react';
import { LanguageContext } from '../App';

const AISymptomPredictor = () => {
  const { lang, t } = useContext(LanguageContext);
  const [symptoms, setSymptoms] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const commonSymptoms = [
    'fever', 'cough', 'chest pain', 'headache', 
    'shortness of breath', 'stomach pain', 'dizziness', 'fatigue'
  ];

  const symptomDatabase = {
    'fever': { risk: 'Medium', advice: 'Monitor temperature, stay hydrated.', condition: 'Possible Viral Infection' },
    'cough': { risk: 'Low', advice: 'Warm fluids, rest. Monitor for 2 weeks.', condition: 'Common Cold / Bronchitis' },
    'chest pain': { risk: 'High', advice: 'SEEK EMERGENCY CARE IMMEDIATELY.', condition: 'Potential Cardiac Issue' },
    'headache': { risk: 'Low', advice: 'Rest, hydrate, take pain relief if needed.', condition: 'Stress / Migraine' },
    'shortness of breath': { risk: 'High', advice: 'IMMEDIATE MEDICAL ATTENTION REQUIRED.', condition: 'Respiratory Distress' },
    'stomach pain': { risk: 'Medium', advice: 'Avoid solid food, rest and hydrate.', condition: 'Indigestion / Appendicitis' },
    'dizziness': { risk: 'Medium', advice: 'Avoid sudden movements, rest.', condition: 'Low Blood Pressure' },
    'fatigue': { risk: 'Low', advice: 'Get proper rest and nutrition.', condition: 'General Fatigue / Anemia' },
  };

  const toggleSymptom = (symptom) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleAnalyze = () => {
    if (selectedSymptoms.length === 0 && !symptoms.trim()) {
      alert('Please select symptoms or describe them');
      return;
    }

    setLoading(true);
    setPrediction(null);

    setTimeout(() => {
      let highestRisk = null;
      let riskScore = { 'Low': 1, 'Medium': 2, 'High': 3 };
      let maxScore = 0;

      for (const symptom of selectedSymptoms) {
        const data = symptomDatabase[symptom];
        if (data && riskScore[data.risk] > maxScore) {
          maxScore = riskScore[data.risk];
          highestRisk = data;
        }
      }

      if (!highestRisk) {
        highestRisk = {
          risk: 'Low',
          condition: 'General Checkup Recommended',
          advice: 'Please consult a doctor for professional diagnosis'
        };
      }

      setPrediction(highestRisk);
      setLoading(false);
    }, 1200);
  };

  const getRiskColor = (risk) => {
    if (risk === 'High') return '#f43f5e';
    if (risk === 'Medium') return '#eab308';
    return '#22c55e';
  };

  const getRiskBg = (risk) => {
    if (risk === 'High') return 'rgba(244, 63, 94, 0.15)';
    if (risk === 'Medium') return 'rgba(234, 179, 8, 0.15)';
    return 'rgba(34, 197, 94, 0.15)';
  };

  return (
    <div style={{ display: 'grid', gap: '24px' }}>
      <div className="glass-card" style={{ padding: '24px', borderRadius: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <Brain size={32} color="var(--primary)" />
          <h2 style={{ margin: 0, fontSize: '1.5rem' }}>{t.symptom.title}</h2>
        </div>

        <p style={{ marginBottom: '20px', color: '#94a3b8', fontSize: '0.95rem' }}>
          {t.symptom.desc}
        </p>

        {/* Symptom Buttons */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '8px' }}>
            {commonSymptoms.map(symptom => (
              <button
                key={symptom}
                onClick={() => toggleSymptom(symptom)}
                style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: selectedSymptoms.includes(symptom) ? '2px solid var(--primary)' : '1px solid var(--border)',
                  background: selectedSymptoms.includes(symptom) ? 'rgba(14, 165, 233, 0.15)' : 'rgba(255,255,255,0.02)',
                  color: selectedSymptoms.includes(symptom) ? 'var(--primary)' : '#94a3b8',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: '500',
                  textTransform: 'capitalize',
                  transition: 'all 0.2s ease'
                }}
              >
                {t.symptom.common[symptom] || symptom}
              </button>
            ))}
          </div>
        </div>

        {/* Text Input */}
        <textarea
          placeholder={t.symptom.placeholder}
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '16px',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            background: 'rgba(15, 23, 42, 0.8)',
            color: '#fff',
            fontFamily: 'inherit',
            fontSize: '0.95rem',
            resize: 'vertical'
          }}
          rows="3"
        />

        {/* Analyze Button */}
        <button
          onClick={handleAnalyze}
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px 20px',
            background: loading ? 'rgba(14, 165, 233, 0.4)' : 'var(--primary)',
            border: 'none',
            borderRadius: '8px',
            color: '#fff',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '1rem',
            transition: 'all 0.2s ease'
          }}
        >
          {loading ? t.symptom.processing : t.symptom.btn}
        </button>
      </div>

      {/* Results */}
      {prediction && (
        <div style={{
          padding: '24px',
          borderRadius: '12px',
          background: getRiskBg(prediction.risk),
          border: `2px solid ${getRiskColor(prediction.risk)}`,
          display: 'grid',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
            {prediction.risk === 'High' ? (
              <AlertTriangle size={32} color={getRiskColor(prediction.risk)} />
            ) : (
              <CheckCircle size={32} color={getRiskColor(prediction.risk)} />
            )}
            <div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '1.1rem' }}>{t.symptom.result}</h3>
              <p style={{ margin: 0, opacity: 0.8 }}>{lang === 'mr' ? 'तपासणीनंतर प्राप्त झालेली स्थिती' : prediction.condition}</p>
            </div>
            <span style={{
              marginLeft: 'auto',
              padding: '6px 12px',
              background: getRiskColor(prediction.risk),
              color: '#fff',
              borderRadius: '20px',
              fontWeight: 'bold',
              fontSize: '0.85rem'
            }}>
              {prediction.risk} {t.symptom.risk}
            </span>
          </div>

          <div style={{
            padding: '12px',
            background: 'rgba(0,0,0,0.2)',
            borderRadius: '8px',
            borderLeft: `3px solid ${getRiskColor(prediction.risk)}`
          }}>
            <strong>{t.symptom.recommendation}:</strong><br/>
            {prediction.advice}
          </div>

          <button
            onClick={() => {
              setPrediction(null);
              setSelectedSymptoms([]);
              setSymptoms('');
            }}
            style={{
              width: '100%',
              padding: '10px',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            {t.symptom.new}
          </button>
        </div>
      )}
    </div>
  );
};

export default AISymptomPredictor;
