import * as React from "react";
import "../App.css";
import { Stack } from "office-ui-fabric-react";


interface MainPageHeaderProps {
    children?: React.ReactNode;
    toggleSideNav: () => void;
    userName: string | null;
    userRole: string | null;
}

const MainPageHeader: React.FC<MainPageHeaderProps> = ({ children, toggleSideNav, userName, userRole }) => {

    return (
        <div className="contentGrid">
            <div className="ContentHeader">
                <div className="ms-Grid-col ms-lg6">
                    <Stack
                        horizontal
                        tokens={{ childrenGap: 15 }}
                        style={{ alignItems: "right" }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="31"
                            height="31"
                            viewBox="0 0 31 31"
                            fill="none"
                            onClick={toggleSideNav}
                        >
                            <path
                                d="M2.45312 7.90625H24.7344C25.5366 7.90625 26.1875 7.25537 26.1875 6.45312C26.1875 5.65088 25.5366 5 24.7344 5H2.45312C1.65088 5 1 5.65088 1 6.45312C1 7.25537 1.65088 7.90625 2.45312 7.90625ZM24.7344 18.5625H12.1406C11.3384 18.5625 10.6875 19.2134 10.6875 20.0156C10.6875 20.8179 11.3384 21.4688 12.1406 21.4688H24.7344C25.5366 21.4688 26.1875 20.8179 26.1875 20.0156C26.1875 19.2134 25.5366 18.5625 24.7344 18.5625ZM24.7344 11.7812H12.1406C11.3384 11.7812 10.6875 12.4321 10.6875 13.2344C10.6875 14.0366 11.3384 14.6875 12.1406 14.6875H24.7344C25.5366 14.6875 26.1875 14.0366 26.1875 13.2344C26.1875 12.4321 25.5366 11.7812 24.7344 11.7812ZM2.45312 28.25H24.7344C25.5366 28.25 26.1875 27.5991 26.1875 26.7969C26.1875 25.9946 25.5366 25.3438 24.7344 25.3438H2.45312C1.65088 25.3438 1 25.9946 1 26.7969C1 27.5991 1.65088 28.25 2.45312 28.25ZM1.3209 15.9408L5.15957 12.1021C5.77109 11.4906 6.8125 11.9235 6.8125 12.7863V20.4606C6.8125 21.3234 5.76807 21.7563 5.15957 21.1448L1.32393 17.3092C0.942482 16.9308 0.94248 16.3192 1.3209 15.9408Z"
                                fill="#EF3340"
                            />
                        </svg>
                        <h6 className="title">Recuritment Process</h6>
                    </Stack>
                </div>
                <div
                    className="ms-Grid-col ms-lg6"
                    style={{ textAlign: "right" }}
                >
                    <p className="title"
                        style={{
                            display: "flex",
                            justifyContent: "end"
                        }}
                    >
                        Welcome,
                        <p style={{ fontWeight: "bold", marginBottom: "-1", marginTop: "0%" }}> {userName}</p>
                    </p>

                    <p
                        className="title Role"
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            marginLeft: "47%"
                        }}
                    >
                        {userRole} - { }
                    </p>
                </div>
            </div>
            <div className="MainContent ">{children}</div>
        </div>
    );
};

export default MainPageHeader;
