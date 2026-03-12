import React from 'react';
import { Video, VideoOff, Mic, MicOff, PhoneOff } from 'lucide-react';

const VideoCall = ({ roomName = 'RuralHealthConnect-Default', onEndCall }) => {
  const jitsiUrl = `https://meet.jit.si/${roomName}#config.prejoinPageEnabled=false&interfaceConfig.TOOLBAR_BUTTONS=["microphone","camera","closedcaptions","desktop","fullscreen","fittowidth","chat","raisehand","videoquality","filmstrip","invite","feedback","stats","shortcuts","tileview","videobackgroundblur","download","help","mute-everyone","security"]`;

  return (
    <div className="glass-card" style={{ height: '600px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#22c55e', animation: 'pulse 2s infinite' }}></div>
          <h3 style={{ margin: 0 }}>Live Consultation</h3>
        </div>
        <button 
          onClick={onEndCall} 
          style={{ background: '#f43f5e', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px' }}
        >
          <PhoneOff size={18} /> End Call
        </button>
      </div>
      
      <div style={{ flex: 1, backgroundColor: '#000' }}>
        <iframe
          src={jitsiUrl}
          style={{ width: '100%', height: '100%', border: 'none' }}
          allow="camera; microphone; display-capture; autoplay; clipboard-write"
          title="Video Consultation"
        ></iframe>
      </div>
      
      <div style={{ padding: '12px', textAlign: 'center', fontSize: '0.8rem', opacity: 0.6 }}>
        Secure, encrypted end-to-end communication via Jitsi Meet
      </div>

      <style>{`
        @keyframes pulse {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(34, 197, 94, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
        }
      `}</style>
    </div>
  );
};

export default VideoCall;
