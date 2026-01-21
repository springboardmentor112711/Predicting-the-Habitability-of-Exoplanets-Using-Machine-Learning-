import { useEffect, useRef, useState } from 'react';

export function BackgroundGrid() {
  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{
        background: 'radial-gradient(circle at center, #0a0a0a 0%, #000000 100%)'
      }}
    >
      {/* Grid pattern */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path
              d="M 50 0 L 0 0 0 50"
              fill="none"
              stroke="#ea580c"
              strokeWidth="0.5"
            />
          </pattern>
          
          {/* Glow filter for grid lines */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Radial gradient mask - brighter in center, fades to edges */}
          <radialGradient id="gridFade">
            <stop offset="0%" stopColor="white" stopOpacity="0.6"/>
            <stop offset="40%" stopColor="white" stopOpacity="0.4"/>
            <stop offset="70%" stopColor="white" stopOpacity="0.15"/>
            <stop offset="100%" stopColor="white" stopOpacity="0.05"/>
          </radialGradient>
        </defs>
        
        <rect width="100%" height="100%" fill="url(#grid)" mask="url(#gridMask)" />
        
        {/* Mask for grid fade effect */}
        <mask id="gridMask">
          <rect width="100%" height="100%" fill="url(#gridFade)" />
        </mask>
        
        <rect width="100%" height="100%" fill="url(#grid)" mask="url(#gridMask)" />
      </svg>

      {/* Multiple glow spots with box shadow effect */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(234, 88, 12, 0.3) 0%, rgba(234, 88, 12, 0.1) 40%, transparent 70%)',
          filter: 'blur(60px)',
          boxShadow: '0 0 200px 100px rgba(234, 88, 12, 0.15)'
        }}
      />

      {/* Top left glow */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full opacity-15"
        style={{
          left: '10%',
          top: '15%',
          background: 'radial-gradient(circle, rgba(234, 88, 12, 0.25) 0%, rgba(234, 88, 12, 0.08) 40%, transparent 70%)',
          filter: 'blur(50px)',
          boxShadow: '0 0 150px 80px rgba(234, 88, 12, 0.12)'
        }}
      />
      
      {/* Bottom right glow */}
      <div
        className="absolute w-[700px] h-[700px] rounded-full opacity-15"
        style={{
          right: '10%',
          bottom: '10%',
          background: 'radial-gradient(circle, rgba(234, 88, 12, 0.25) 0%, rgba(234, 88, 12, 0.08) 40%, transparent 70%)',
          filter: 'blur(50px)',
          boxShadow: '0 0 180px 90px rgba(234, 88, 12, 0.12)'
        }}
      />

      {/* Top right accent */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full opacity-10"
        style={{
          right: '20%',
          top: '20%',
          background: 'radial-gradient(circle, rgba(234, 88, 12, 0.2) 0%, transparent 60%)',
          filter: 'blur(40px)',
          boxShadow: '0 0 120px 60px rgba(234, 88, 12, 0.1)'
        }}
      />

      {/* Bottom left accent */}
      <div
        className="absolute w-[450px] h-[450px] rounded-full opacity-10"
        style={{
          left: '15%',
          bottom: '25%',
          background: 'radial-gradient(circle, rgba(234, 88, 12, 0.2) 0%, transparent 60%)',
          filter: 'blur(40px)',
          boxShadow: '0 0 120px 60px rgba(234, 88, 12, 0.1)'
        }}
      />

      {/* Animated grid lines with glow - stronger in center */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="horizontalFade" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ea580c" stopOpacity="0"/>
            <stop offset="50%" stopColor="#ea580c" stopOpacity="0.5"/>
            <stop offset="100%" stopColor="#ea580c" stopOpacity="0"/>
          </linearGradient>
          
          <linearGradient id="verticalFade" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ea580c" stopOpacity="0"/>
            <stop offset="50%" stopColor="#ea580c" stopOpacity="0.5"/>
            <stop offset="100%" stopColor="#ea580c" stopOpacity="0"/>
          </linearGradient>
        </defs>
        
        <line
          x1="0"
          y1="20%"
          x2="100%"
          y2="20%"
          stroke="url(#horizontalFade)"
          strokeWidth="1"
          filter="url(#glow)"
        />
        <line
          x1="0"
          y1="50%"
          x2="100%"
          y2="50%"
          stroke="url(#horizontalFade)"
          strokeWidth="1.5"
          filter="url(#glow)"
        />
        <line
          x1="0"
          y1="80%"
          x2="100%"
          y2="80%"
          stroke="url(#horizontalFade)"
          strokeWidth="1"
          filter="url(#glow)"
        />
        
        <line
          x1="25%"
          y1="0"
          x2="25%"
          y2="100%"
          stroke="url(#verticalFade)"
          strokeWidth="1"
          filter="url(#glow)"
        />
        <line
          x1="50%"
          y1="0"
          x2="50%"
          y2="100%"
          stroke="url(#verticalFade)"
          strokeWidth="1.5"
          filter="url(#glow)"
        />
        <line
          x1="75%"
          y1="0"
          x2="75%"
          y2="100%"
          stroke="url(#verticalFade)"
          strokeWidth="1"
          filter="url(#glow)"
        />
      </svg>

      {/* Vignette effect - darkens edges */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.6) 100%)'
        }}
      />
    </div>
  );
}