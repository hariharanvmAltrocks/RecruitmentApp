import * as React from "react";
import Loader from "./Loader";

type ViewProps = {
    isLoading: boolean;
    className?: string;
    style?: React.CSSProperties;
};

const CustomLoader: React.FC<ViewProps> = ({
    isLoading = false,
    style,
    className = "",
    children,
}) => {
    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <div style={style} className={className}>
                    {children}
                </div>
            )}
        </>
    );
};

export default CustomLoader;
