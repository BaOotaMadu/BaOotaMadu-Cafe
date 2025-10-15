import React, { useState } from 'react';

const Announce = ({ tokenNumber, onPlay }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(null);

  const playAnnouncement = async () => {
    if (!tokenNumber) return;

    setIsPlaying(true);
    setError(null);

    try {
      // Fetch audio from your backend
      const response = await fetch(`/api/orders/audio/${tokenNumber}`);
      
      if (!response.ok) throw new Error('Failed to load audio');

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      audio.onended = () => {
        URL.revokeObjectURL(audioUrl); // Clean up
        setIsPlaying(false);
        if (onPlay) onPlay(tokenNumber);
      };

      audio.onerror = () => {
        setError('Failed to play audio');
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };

      await audio.play();
    } catch (err) {
      console.error('Audio play error:', err);
      setError(err.message || 'Unknown error');
      setIsPlaying(false);
    }
  };

  return (
    <div style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '6px' }}>
      <p>Token: <strong>{tokenNumber}</strong></p>
      <button
        onClick={playAnnouncement}
        disabled={isPlaying}
        style={{
          padding: '8px 16px',
          backgroundColor: isPlaying ? '#ccc' : '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isPlaying ? 'not-allowed' : 'pointer'
        }}
      >
        {isPlaying ? 'Playing...' : 'Announce "Order Ready"'}
      </button>
      {error && <p style={{ color: 'red', marginTop: '8px' }}>{error}</p>}
    </div>
  );
};

export default Announce;