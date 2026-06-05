import React, { useEffect, useState } from "react";
import Loader from "./loader";

interface CustomLoaderProps {
  isLoading: boolean;
  className?: string;
  style?: React.CSSProperties;
  userName?: string;
}

const CustomLoader: React.FC<React.PropsWithChildren<CustomLoaderProps>> = ({
  isLoading = false,
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

  if (isLoading || !isComplete) {
    return (
      <Loader
        isLoading={isLoading}
        onComplete={() => setIsComplete(true)}
        userName={userName}
      />
    );
  }

  return (
    <div style={style} className={className}>
      {children}
    </div>
  );
};

export default CustomLoader;