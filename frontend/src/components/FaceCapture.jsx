import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';

export default function FaceCapture({ onCapture, onCancel, mode = 'register' }) {
  const videoRef = useRef(null);
  const [loadingMsg, setLoadingMsg] = useState('Opening camera...');
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState('');
  const [stream, setStream] = useState(null);
  const [capturedEmbeddings, setCapturedEmbeddings] = useState([]);

  useEffect(() => {
    let active = true;

    const startCameraAndLoadModels = async () => {
      try {
        // 1. Open camera immediately
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'user' } 
        });
        
        if (!active) {
          mediaStream.getTracks().forEach(track => track.stop());
          return;
        }

        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }

        setLoadingMsg('Loading Local AI Models...');
        
        // 2. Load models directly from localhost public folder (instant)
        const MODEL_URL = '/models';
        
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
        ]);

        if (!active) return;
        setIsReady(true);
      } catch (err) {
        console.error('Face Capture Error:', err);
        setError('Failed to access camera or load models. Please ensure camera permissions are granted.');
      }
    };

    startCameraAndLoadModels();

    return () => {
      active = false;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const captureFace = async () => {
    if (!videoRef.current) return;
    setLoadingMsg('Scanning face...');
    setIsReady(false);
    setError('');

    try {
      // Basic anti-spoofing: detecting faces
      const detections = await faceapi
        .detectAllFaces(videoRef.current)
        .withFaceLandmarks()
        .withFaceDescriptors();

      if (detections.length === 0) {
        setError('No face detected. Please ensure your face is clearly visible.');
        setIsReady(true);
        return;
      }

      if (detections.length > 1) {
        setError('Multiple faces detected. Please ensure only your face is in the frame.');
        setIsReady(true);
        return;
      }

      const detection = detections[0];

      if (detection.detection.score < 0.7) {
        setError('Face detection confidence too low. Please adjust lighting and try again.');
        setIsReady(true);
        return;
      }

      const descriptorArray = Array.from(detection.descriptor);

      if (mode === 'register') {
        const newEmbeddings = [...capturedEmbeddings, descriptorArray];
        setCapturedEmbeddings(newEmbeddings);

        if (newEmbeddings.length < 3) {
          // Ask for next sample
          setError(`Face ${newEmbeddings.length}/3 captured. Please turn your head slightly and click capture again.`);
          setIsReady(true);
        } else {
          // Got all 3
          if (stream) stream.getTracks().forEach(track => track.stop());
          onCapture(newEmbeddings);
        }
      } else {
        // Login mode only requires 1 capture
        if (stream) stream.getTracks().forEach(track => track.stop());
        onCapture(descriptorArray);
      }
    } catch (err) {
      console.error(err);
      setError('Face scanning failed. Please try again.');
      setIsReady(true);
    }
  };

  const handleCancel = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    onCancel();
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        background: '#fff', padding: '24px', borderRadius: '16px', maxWidth: '400px', width: '90%',
        textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
      }}>
        <h3 style={{ marginTop: 0, color: '#1A1A2E', fontSize: 20 }}>
          {mode === 'register' ? 'Register Face Authentication' : 'Face Verification'}
        </h3>
        
        {mode === 'register' && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
            {[1, 2, 3].map(num => (
              <div key={num} style={{ 
                padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold',
                backgroundColor: capturedEmbeddings.length >= num ? '#D1FAE5' : '#F3F4F6',
                color: capturedEmbeddings.length >= num ? '#047857' : '#9CA3AF'
              }}>
                Face {num}/3 {capturedEmbeddings.length >= num ? '✓' : ''}
              </div>
            ))}
          </div>
        )}

        <div style={{
          width: '100%', height: '260px', backgroundColor: '#000', borderRadius: '12px',
          overflow: 'hidden', position: 'relative', marginBottom: '16px'
        }}>
          {(!stream || !isReady) && !error && (
            <div style={{ 
              position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', 
              justifyContent: 'center', color: '#fff', padding: 20, 
              background: stream ? 'rgba(0,0,0,0.5)' : '#000',
              zIndex: 10, textAlign: 'center'
            }}>
              {loadingMsg}
            </div>
          )}
          
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              transform: 'scaleX(-1)', // Mirror effect
              opacity: stream ? 1 : 0
            }}
          />
        </div>

        {error && <div style={{ 
          color: error.includes('captured') ? '#047857' : '#E53E3E', 
          fontSize: 13, marginBottom: '16px', fontWeight: 500,
          background: error.includes('captured') ? '#D1FAE5' : 'transparent',
          padding: error.includes('captured') ? '8px' : 0, borderRadius: '4px'
        }}>{error}</div>}

        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={handleCancel}
            style={{
              flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #E5E7EB',
              background: '#fff', color: '#4B5563', fontWeight: 600, cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button 
            onClick={captureFace}
            disabled={!isReady}
            style={{
              flex: 2, padding: '12px', borderRadius: '8px', border: 'none',
              background: isReady ? 'linear-gradient(135deg, #0B3D91, #1A5BC4)' : '#A0AEC0',
              color: '#fff', fontWeight: 600, cursor: isReady ? 'pointer' : 'not-allowed'
            }}
          >
            {isReady ? 'Capture Face' : 'Please wait...'}
          </button>
        </div>
      </div>
    </div>
  );
}
