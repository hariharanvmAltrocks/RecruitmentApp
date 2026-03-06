import React from "react";
import Loader from "./loader";

interface CustomLoaderProps {
  isLoading: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const CustomLoader: React.FC<React.PropsWithChildren<CustomLoaderProps>> = ({
  isLoading = false,
  style,
  className = "",
  children,
}) => {
  if (isLoading) {
    return <Loader />;
  }

  return (
    <div style={style} className={className}>
      {children}
    </div>
  );
};

export default CustomLoader;