import * as React from "react";
import styles from "./Loader.module.scss";


const Loader = () => {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "80vh",
            }}
        >
            <div className={styles.customLoader}></div>
        </div>
    );
};

export default Loader;
