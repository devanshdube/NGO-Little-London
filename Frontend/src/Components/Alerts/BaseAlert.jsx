import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const BaseAlert = ({ config, message, onClose, autoClose = 4000 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [ripples, setRipples] = useState([]);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 10);

    const newParticles = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      delay: i * 0.1,
      angle: i * 36,
      distance: 40 + Math.random() * 30
    }));
    setParticles(newParticles);

    if (autoClose) {
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const newProgress = (elapsed / autoClose) * 100;
        setProgress(newProgress);
        if (newProgress >= 100) {
          clearInterval(interval);
          handleClose();
        }
      }, 16);

      return () => clearInterval(interval);
    }
  }, [autoClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose && onClose(), 400);
  };

  const createRipple = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples(prev => [...prev, { id, x, y }]);
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== id));
    }, 1000);
  };

  const Icon = config.icon;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl transition-all duration-500 transform 
        ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}`}
      style={{
        minWidth: '300px',
        maxWidth: '420px',
        background: 'rgba(15, 23, 42, 0.95)',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: `0 10px 30px ${config.shadow}`
      }}
      onClick={createRipple}
    >
      {ripples.map(r => (
        <div
          key={r.id}
          className="absolute rounded-full animate-ping"
          style={{
            left: r.x, top: r.y, width: 10, height: 10,
            background: config.primary, transform: 'translate(-50%, -50%)'
          }}
        />
      ))}

      {particles.map(p => (
        <div
          key={p.id}
          className="absolute w-1 h-1 rounded-full"
          style={{
            background: config.secondary,
            left: '50%', top: '50%',
            animation: `floatParticle 3s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
            transform: `translate(-50%, -50%) rotate(${p.angle}deg) translateY(${p.distance}px)`,
            opacity: 0
          }}
        />
      ))}

      <div className="relative z-10 p-5 flex items-start gap-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ background: config.gradient }}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>

        <div className="flex-1">
          <p className="text-sm text-gray-200">{message}</p>
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); handleClose(); }}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="h-1 bg-gray-700">
        <div
          className="h-full transition-all"
          style={{
            width: `${progress}%`,
            background: config.gradient
          }}
        />
      </div>

      <style jsx>{`
        @keyframes floatParticle {
          0%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(0); }
          50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default BaseAlert;
