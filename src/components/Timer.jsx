import React, { useState, useEffect } from 'react';

const Timer = ({ theme, onClose, taskName }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customMinutes, setCustomMinutes] = useState(25);
  const [customSeconds, setCustomSeconds] = useState(0);
  const [inputMode, setInputMode] = useState('minutes');

  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }
    if (timeLeft === 0) {
      setIsRunning(false);
      // Loud beep
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.8, audioContext.currentTime + 0.1);
        gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 1);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 1);
      } catch (e) {}
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const setCustomTimer = () => {
    const totalSeconds = (customMinutes * 60) + customSeconds;
    if (totalSeconds > 0) {
      setTimeLeft(totalSeconds);
      setShowCustomInput(false);
      setIsRunning(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins.toString().padStart(2, '0') + ':' + secs.toString().padStart(2, '0');
  };

  return (
    <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}} onClick={onClose}>
      <div style={{background: theme.cardBackground, borderRadius: '20px', padding: '30px', textAlign: 'center', position: 'relative', width: '320px'}} onClick={(e) => e.stopPropagation()}>
        
        <h2 style={{color: theme.text, margin: '0 0 20px 0'}}>🎯 Focus Timer</h2>
        
        {taskName && (
          <div style={{padding: '10px', backgroundColor: '#007AFF20', borderRadius: '10px', marginBottom: '20px'}}>
            <p style={{fontSize: '14px', fontWeight: '600', color: '#007AFF', margin: 0}}>Working on: {taskName}</p>
          </div>
        )}
        
        <div style={{fontSize: '40px', fontWeight: '700', color: theme.text, fontFamily: 'monospace', marginBottom: '20px'}}>
          {formatTime(timeLeft)}
        </div>
        
        <div style={{display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '10px'}}>
          <button onClick={() => setIsRunning(!isRunning)} style={{padding: '12px 20px', borderRadius: '15px', border: 'none', background: isRunning ? '#FF3B30' : '#007AFF', color: 'white', fontSize: '16px', fontWeight: '600', cursor: 'pointer'}}>
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button onClick={() => {setTimeLeft(25*60); setIsRunning(false);}} style={{padding: '12px 20px', borderRadius: '15px', border: '2px solid ' + theme.border, background: 'transparent', color: theme.text, fontSize: '16px', fontWeight: '600', cursor: 'pointer'}}>
            Reset
          </button>
          <button onClick={() => setShowCustomInput(true)} style={{padding: '12px 20px', borderRadius: '15px', border: 'none', background: '#AF52DE', color: 'white', fontSize: '16px', fontWeight: '600', cursor: 'pointer'}}>
            Custom
          </button>
        </div>

        {/* Custom Modal */}
        {showCustomInput && (
          <div style={{position: 'absolute', top: '10px', left: '10px', right: '10px', background: theme.cardBackground, padding: '16px', borderRadius: '12px', border: '2px solid #AF52DE', boxShadow: '0 4px 16px rgba(175, 82, 222, 0.3)', zIndex: 15}}>
            <h3 style={{fontSize: '14px', fontWeight: '600', color: theme.text, margin: '0 0 8px 0', textAlign: 'center'}}>⚙️ Custom Timer</h3>
            
            <div style={{display: 'flex', gap: '4px', marginBottom: '8px', justifyContent: 'center'}}>
              <button onClick={() => setInputMode('minutes')} style={{padding: '4px 8px', borderRadius: '6px', border: 'none', background: inputMode === 'minutes' ? '#AF52DE' : (theme.isDark ? '#2C2C2E' : '#F5F5F5'), color: inputMode === 'minutes' ? 'white' : theme.text, fontSize: '10px', fontWeight: '600', cursor: 'pointer'}}>Min</button>
              <button onClick={() => setInputMode('seconds')} style={{padding: '4px 8px', borderRadius: '6px', border: 'none', background: inputMode === 'seconds' ? '#AF52DE' : (theme.isDark ? '#2C2C2E' : '#F5F5F5'), color: inputMode === 'seconds' ? 'white' : theme.text, fontSize: '10px', fontWeight: '600', cursor: 'pointer'}}>Sec</button>
            </div>
            
            <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px'}}>
              <input type="number" value={inputMode === 'minutes' ? customMinutes : customSeconds} onChange={(e) => {const val = parseInt(e.target.value) || 0; if (inputMode === 'minutes') {setCustomMinutes(val);} else {setCustomSeconds(val);}}} min={inputMode === 'minutes' ? '0' : '1'} max={inputMode === 'minutes' ? '180' : '3600'} style={{flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #AF52DE', background: theme.background, color: theme.text, fontSize: '14px', textAlign: 'center', fontWeight: '600'}} autoFocus />
              <span style={{fontSize: '11px', color: theme.textSecondary, fontWeight: '500', minWidth: '30px'}}>{inputMode === 'minutes' ? 'min' : 'sec'}</span>
            </div>
            
            <div style={{textAlign: 'center', marginBottom: '8px', padding: '4px', backgroundColor: theme.isDark ? '#2C2C2E' : '#F5F5F5', borderRadius: '4px'}}>
              <span style={{fontSize: '10px', color: theme.textSecondary}}>Total: {Math.floor(((customMinutes * 60) + customSeconds) / 60)}m {((customMinutes * 60) + customSeconds) % 60}s</span>
            </div>
            
            <div style={{display: 'flex', gap: '6px'}}>
              <button onClick={() => setShowCustomInput(false)} style={{flex: 1, padding: '6px', borderRadius: '6px', border: '1px solid ' + theme.border, background: 'transparent', color: theme.text, fontSize: '11px', fontWeight: '600', cursor: 'pointer'}}>Cancel</button>
              <button onClick={setCustomTimer} style={{flex: 1, padding: '6px', borderRadius: '6px', border: 'none', background: '#AF52DE', color: 'white', fontSize: '11px', fontWeight: '600', cursor: 'pointer'}}>Set</button>
            </div>
          </div>
        )}

        <button onClick={onClose} style={{position: 'absolute', top: '10px', right: '15px', background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer', color: theme.textSecondary}}>×</button>
      </div>
    </div>
  );
};

export default Timer;