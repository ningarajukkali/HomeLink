import React, { useState, useRef, useEffect } from 'react';

/**
 * CameraCaptureModal Component
 * Live device camera streaming with environment/user facing toggle,
 * guidelines overlay, and device photo upload fallback.
 */
export default function CameraCaptureModal({ isOpen, onClose, onPhotoCaptured }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [facingMode, setFacingMode] = useState('environment'); // 'user' | 'environment'

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const startCamera = async () => {
    setCameraError('');
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API is not supported in this browser environment.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraActive(true);
      }
    } catch (err) {
      console.warn('Camera access error:', err);
      setCameraActive(false);
      setCameraError(err.message || 'Camera permission denied or camera not found.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      onPhotoCaptured(dataUrl);
      onClose();
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onPhotoCaptured(event.target.result);
          onClose();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSampleSelect = (url) => {
    onPhotoCaptured(url);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div 
        className="bg-surface-container-lowest rounded-3xl max-w-lg w-full border border-outline-variant/40 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-outline-variant/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-container text-2xl">
              photo_camera
            </span>
            <div>
              <h3 className="font-extrabold text-sm text-on-surface">Capture Room Photo</h3>
              <p className="text-[11px] text-outline">Real-time room angle verification</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Video Viewport / Error State */}
        <div className="relative aspect-[4/3] bg-black flex items-center justify-center overflow-hidden">
          {cameraActive ? (
            <>
              <video
                ref={videoRef}
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {/* Guidelines Overlay */}
              <div className="absolute inset-4 border-2 border-dashed border-white/40 rounded-2xl pointer-events-none flex items-center justify-center">
                <span className="text-[11px] font-bold text-white/70 bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">
                  Align room bed, window or study area
                </span>
              </div>
            </>
          ) : (
            <div className="p-6 text-center text-white max-w-xs space-y-3">
              <span className="material-symbols-outlined text-4xl text-amber-400">
                videocam_off
              </span>
              <p className="text-xs text-white/80">
                {cameraError || 'Camera stream is unavailable.'}
              </p>
              <div className="pt-2">
                <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-container hover:bg-primary text-white text-xs font-bold transition-all cursor-pointer shadow-md">
                  <span className="material-symbols-outlined text-base">file_upload</span>
                  <span>Upload from Device</span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Controls & Sample Photos */}
        <div className="p-4 bg-surface-container-low space-y-3">
          {cameraActive && (
            <div className="flex items-center justify-around">
              <button
                type="button"
                onClick={() => setFacingMode(prev => prev === 'user' ? 'environment' : 'user')}
                className="p-3 rounded-full bg-surface-container text-on-surface hover:bg-surface-container-high cursor-pointer"
                title="Switch Camera"
              >
                <span className="material-symbols-outlined text-xl">flip_camera_ios</span>
              </button>

              <button
                type="button"
                onClick={capturePhoto}
                className="w-16 h-16 rounded-full bg-white border-4 border-primary-container flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
                title="Shutter Button"
              >
                <div className="w-11 h-11 rounded-full bg-primary-container" />
              </button>

              <label className="p-3 rounded-full bg-surface-container text-on-surface hover:bg-surface-container-high cursor-pointer">
                <span className="material-symbols-outlined text-xl">file_upload</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {/* Quick Select Sample verified photos */}
          <div className="pt-2 border-t border-outline-variant/30">
            <span className="text-[10px] font-bold uppercase tracking-wider text-outline block mb-2">
              Or pick verified room sample angle:
            </span>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {[
                { label: 'Single Room (Real)', url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80' },
                { label: 'Living Balcony (Real)', url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80' },
                { label: 'Student Study (Real)', url: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80' },
                { label: '3D Render (Test AI)', url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80' }
              ].map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSampleSelect(sample.url)}
                  className="shrink-0 flex items-center gap-1.5 p-1.5 rounded-xl bg-surface-container-lowest border border-outline-variant/40 hover:border-primary-container text-xs font-bold text-on-surface cursor-pointer"
                >
                  <img src={sample.url} alt="sample" className="w-8 h-8 rounded-lg object-cover" />
                  <span className="pr-1 text-[11px]">{sample.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
