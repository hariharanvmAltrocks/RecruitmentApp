import React, { useEffect, useState } from "react";
import "./loader.scss";

interface LoaderProps {
  isLoading: boolean;
  progress?: number;
  statusMessage?: string;
  onComplete?: () => void;
  userName?: string;
}

const Loader: React.FC<LoaderProps> = ({
  isLoading,
  progress = 0,
  statusMessage = "Initializing Application...",
  onComplete,
  userName = "",
}) => {
  const [displayProgress, setDisplayProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [timerPassed, setTimerPassed] = useState(false);
  const [showTroubleshoot, setShowTroubleshoot] = useState(false);

  // Smoothly animate the displayed progress number up to the target progress
  useEffect(() => {
    let animationFrameId: number;
    
    const animate = () => {
      setDisplayProgress((prev) => {
        if (prev < progress) {
          // Decelerating step for smooth acceleration catch-up
          const step = Math.ceil((progress - prev) / 8);
          const next = prev + step;
          return next > progress ? progress : next;
        }
        return prev;
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [progress]);

  // Coordinate the fade-out trigger once loading is done (100% progress achieved)
  useEffect(() => {
    if (progress === 100 && displayProgress === 100 && !isLoading) {
      const fadeOutTimer = setTimeout(() => {
        setIsFadingOut(true);
      }, 600); // Keep at 100% for 600ms for visual satisfaction
      return () => clearTimeout(fadeOutTimer);
    }
  }, [progress, displayProgress, isLoading]);

  // Notify parent component when the fade-out animation is complete
  useEffect(() => {
    if (isFadingOut) {
      const unmountTimer = setTimeout(() => {
        if (onComplete) {
          onComplete();
        }
      }, 750); // Matches the 750ms transition in CSS
      return () => clearTimeout(unmountTimer);
    }
  }, [isFadingOut, onComplete]);

  // Show troubleshooting link if initialization takes longer than 10 seconds
  useEffect(() => {
    const checkTimer = setTimeout(() => {
      setTimerPassed(true);
    }, 10000);
    return () => clearTimeout(checkTimer);
  }, []);

  // Circular progress SVG calculations
  const radius = 52;
  const circumference = 2 * Math.PI * radius; // ~326.72
  const strokeDashoffset = circumference - (displayProgress / 100) * circumference;

  return (
    <div className={`rms-splash-screen ${isFadingOut ? "rms-fade-out" : ""}`}>
      {/* Subtle modern corporate background grid patterns */}
      <div className="rms-splash-bg-pattern" />

      <div className="rms-splash-card">
        {/* Company Logo: stylized professional Fluent SVG */}
        <div className="rms-splash-logo">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="64" height="64" rx="16" fill="url(#logo-bg-gradient)" />
            <path
              d="M18 22C18 20.3431 19.3431 19 21 19H43C44.6569 19 46 20.3431 46 22V42C46 43.6569 44.6569 45 43 45H21C19.3431 45 18 43.6569 18 42V22Z"
              fill="white"
              fillOpacity="0.12"
              stroke="white"
              strokeWidth="1.5"
            />
            {/* Elegant connection nodes symbolizing recruitment / synergy */}
            <circle cx="27" cy="27" r="4" fill="white" />
            <circle cx="37" cy="37" r="4" fill="#60a5fa" />
            <line x1="29.8" y1="29.8" x2="34.2" y2="34.2" stroke="white" strokeWidth="2" strokeDasharray="1 1" />
            <path d="M22 36C22 33 24.5 31.5 27 31.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M42 28C42 31 39.5 32.5 37 32.5" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" />
            
            <defs>
              <linearGradient id="logo-bg-gradient" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
                <stop stopColor="#0078d4" />
                <stop offset="1" stopColor="#005a9e" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Product Brand */}
        <h1 className="rms-splash-brand">HRMS</h1>
        <p className="rms-splash-app-label">Recruitment & Talent Management</p>

        {/* Circular Progress Area */}
        <div className="rms-splash-progress-wrapper">
          <svg className="rms-splash-progress-svg" viewBox="0 0 120 120">
            <defs>
              <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0078d4" />
                <stop offset="100%" stopColor="#2b88d8" />
              </linearGradient>
            </defs>
            <circle className="rms-splash-circle-bg" cx="60" cy="60" r={radius} />
            <circle
              className="rms-splash-circle-fill"
              cx="60"
              cy="60"
              r={radius}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>
          <div className="rms-splash-percentage">{displayProgress}%</div>
        </div>

        {/* Loading status text matching milestones */}
        <div className="rms-splash-status-container">
          <p className="rms-splash-status-text">{statusMessage}</p>
          {userName && <p className="rms-splash-welcome-user">Preparing workspace for {userName}</p>}
        </div>

        {/* Fluent UI styled troubleshooting panel for slow network */}
        {timerPassed && (
          <div className="rms-splash-troubleshoot">
            <button
              type="button"
              className="rms-splash-troubleshoot-btn"
              onClick={() => setShowTroubleshoot(!showTroubleshoot)}
            >
              {showTroubleshoot ? "Hide details" : "Connection taking longer than usual?"}
            </button>
            
            {showTroubleshoot && (
              <div className="rms-splash-troubleshoot-details">
                <p>Ensure you are signed in and have permissions to read M365 resources. If the issue persists, contact IT support.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Loader;