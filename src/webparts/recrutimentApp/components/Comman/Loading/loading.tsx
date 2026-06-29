import React from "react";
import "./loading.scss";

interface LoadingProps {
  text?: string;
}

const Loading: React.FC<LoadingProps> = ({ text }) => {
  return (
    <div className="loadingOverlay">
      <div className="spinner" />
      <div className="loadingText">{text}</div>
    </div>
  );
};

export default Loading;
