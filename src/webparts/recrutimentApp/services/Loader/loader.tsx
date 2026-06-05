import React, { useEffect, useState } from "react";
import "./loader.scss";

interface LoaderProps {
  isLoading: boolean;
  onComplete?: () => void;
  userName?: string;
}

const Loader: React.FC<LoaderProps> = ({
  isLoading,
  onComplete,
  userName = "",
}) => {
  const [progress, setProgress] = useState(0);
  const [showTroubleshoot, setShowTroubleshoot] = useState(false);
  const [timerPassed, setTimerPassed] = useState(false);

  // Smooth progress animation logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    const stepTime = isLoading ? 120 : 35; // Accelerate speed when background data is ready

    interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          if (onComplete) onComplete();
          return 100;
        }

        const maxLimit = isLoading ? 98 : 100;
        // Faster increments if loading is done
        const increment = isLoading
          ? Math.floor(Math.random() * 2) + 1
          : Math.floor(Math.random() * 8) + 4;

        const next = prev + increment;
        return next > maxLimit ? maxLimit : next;
      });
    }, stepTime);

    return () => clearInterval(interval);
  }, [isLoading, onComplete]);

  // Show troubleshooting link if load takes too long (e.g. 8 seconds)
  useEffect(() => {
    const checkTimer = setTimeout(() => {
      setTimerPassed(true);
    }, 8000);
    return () => clearTimeout(checkTimer);
  }, []);

  // Map progress to status text stages
  const getStatusText = (p: number) => {
    if (p <= 20) return "Initializing Application...";
    if (p <= 40) return "Loading User Profile...";
    if (p <= 60) return "Fetching Dashboard Data...";
    if (p <= 80) return "Preparing Recruitment Workspace...";
    return "Finalizing Setup...";
  };

  // Circular progress stroke calculation
  const radius = 54;
  const circumference = 2 * Math.PI * radius; // ~339.292
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="rms-loader-container">
      <div className="rms-loader-card">
        {/* Company Logo: stylized enterprise SVG */}
        <div className="rms-logo-container">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 6.5V11C2 17.55 6.27 21.74 12 23C17.73 21.74 22 17.55 22 11V6.5L12 2Z" fill="#2563eb" />
            <path d="M12 4.2L4 7.8V11.2C4 16.3 7.37 19.8 12 20.8V4.2Z" fill="#3b82f6" />
            <circle cx="12" cy="11" r="3" fill="#ffffff" />
            <path d="M12 14C9.5 14 7.5 15.5 7.5 17.5H16.5C16.5 15.5 14.5 14 12 14Z" fill="#ffffff" />
          </svg>
        </div>

        {/* Personalized Welcome */}
        <h2 className="rms-welcome-text">
          {userName ? `Welcome, ${userName}` : "Welcome"}
        </h2>
        <p className="rms-subtitle">Getting your workspace ready...</p>

        {/* Circular Progress Loader */}
        <div className="rms-progress-wrapper">
          <svg className="rms-circular-progress" viewBox="0 0 120 120">
            <defs>
              <linearGradient id="rms-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="#60a5fa" />
              </linearGradient>
            </defs>
            <circle className="rms-circle-bg" cx="60" cy="60" r={radius} />
            <circle
              className="rms-circle-fill"
              cx="60"
              cy="60"
              r={radius}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>
          <div className="rms-percentage-text">{progress}%</div>
        </div>

        {/* Dynamic Status Text */}
        <div className="rms-status-container">
          <p className="rms-status-text">{getStatusText(progress)}</p>
        </div>

        {/* Troubleshoot Section for first-time / slow load */}
        {timerPassed && (
          <>
            <button
              type="button"
              className="rms-troubleshoot-btn"
              onClick={() => setShowTroubleshoot(!showTroubleshoot)}
            >
              {showTroubleshoot ? "Hide troubleshooting guide" : "Taking longer than usual? Click here"}
            </button>
            
            {showTroubleshoot && (
              <div className="rms-troubleshoot-content">
                <h4>First-Time Setup Troubleshooting</h4>
                <ul>
                  <li>
                    <strong>Check API Access Approval:</strong> A tenant admin must approve Graph API permissions in the SharePoint Admin Center (e.g. <code>GroupMember.Read.All</code>).
                  </li>
                  <li>
                    <strong>AD Group & Roles:</strong> Verify that your user account email is mapped to a designated system role inside the SharePoint user role master list.
                  </li>
                  <li>
                    <strong>Empty System Data:</strong> If lists like <code>CareerPortalLink</code> are missing or empty, default links must be provisioned.
                  </li>
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Loader;