import React, { useEffect, useState } from "react";
import Loader from "./loader";

interface CustomLoaderProps {
  isLoading: boolean;
  progress?: number;
  statusMessage?: string;
  className?: string;
  style?: React.CSSProperties;
  userName?: string;
}

const CustomLoader: React.FC<React.PropsWithChildren<CustomLoaderProps>> = ({
  isLoading = false,
  progress = 0,
  statusMessage = "Initializing Application...",
  style,
  className = "",
  userName = "",
  children,
}) => {
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setIsComplete(false);
    }
  }, [isLoading]);

  const showLoader = isLoading || !isComplete;
  const showContent = !isLoading;

  return (
    <div style={{ ...style, position: "relative", minHeight: "100vh" }} className={className}>
      
      {showContent && (
        <div className="rms-app-content-fade-in">
          {children}
        </div>
      )}

      {showLoader && (
        <Loader
          isLoading={isLoading}
          progress={progress}
          statusMessage={statusMessage}
          onComplete={() => setIsComplete(true)}
          userName={userName}
        />
      )}
    </div>
  );
};

export default CustomLoader;