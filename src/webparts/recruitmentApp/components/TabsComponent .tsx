import * as React from "react";
import { Box, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import "../App.css";
import ReuseButton from "./ReuseButton";
import StatusBar from "./StatusBar";

interface TabData {
    label: string;
    value: string;
    content: React.ReactNode;
}

interface TabsComponentProps {
    tabs: TabData[];
    initialTab?: string;
    handleCancel?: () => void;
    tabClassName?: string;
    Statuslist?: { [key: string]: string };
    validateTab?: ((tab: string) => boolean);
    additionalButtons?: {
        label: string;
        onClick?: () => void;
    }[];
}


const TabsComponent: React.FC<TabsComponentProps> = ({
    tabs,
    initialTab = "tab1",
    additionalButtons = [],
    handleCancel,
    tabClassName,
    Statuslist,
    validateTab
}) => {
    const [value, setValue] = React.useState(initialTab);

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    const handlePreviousClick = () => {
        const currentIndex = tabs.findIndex((tab) => tab.value === value);
        if (currentIndex > 0) {
            setValue(tabs[currentIndex - 1].value);
        }
    };

    const handleNextClick = () => {
        const currentIndex = tabs.findIndex((tab) => tab.value === value);
        let isValid: any;
        const currentTab = tabs[currentIndex].value;
        // if(validateTab){
        // isValid = !validateTab(currentTab);
        // }
        if (validateTab) {
            isValid = validateTab(currentTab); // Call validateTab, but don't expect a return value
        }

        if (isValid) {
        } else {
            if (currentIndex < tabs.length - 1) {
                setValue(tabs[currentIndex + 1].value);
            }
        }
    };



    return (
        <>
            <div className="ms-Grid-row">
                <div>
                    <Box sx={{ width: "100%", typography: "body1" }}>
                        <TabContext value={value}>
                            <TabList
                                className={tabClassName ? tabClassName : "tab"}
                                onChange={handleChange}
                                aria-label="tabs"
                                variant="scrollable"
                                scrollButtons
                                sx={{
                                    backgroundColor: "#EF3340",
                                    width: "95%",
                                    borderRadius: "6px",
                                    height: "80px",
                                    boxShadow:
                                        " 0 2px 4px 3px rgba(235,3,3,.2)",
                                    marginLeft: "30px",
                                    textAlign: "center",
                                    justifyContent: "space-evenly",
                                    alignItems: "center",
                                }}
                            >
                                {tabs.map((tab) => (
                                    <Tab key={tab.value} label={tab.label} value={tab.value} />
                                ))}
                            </TabList>

                            {tabs.map((tab) => (
                                <TabPanel key={tab.value} value={tab.value}>
                                    {tab.content}
                                </TabPanel>
                            ))}
                        </TabContext>
                    </Box>
                    <div className="ms-Grid-row" style={{ marginBottom: "2%" }}>
                        <div className="ms-Grid-col ms-lg6"></div>
                        <div
                            className="ms-Grid-col ms-lg6"
                            style={{ display: "flex", justifyContent: "end", marginLeft: "48%" }}
                        >
                            {handleCancel && (
                                <div style={{ marginRight: "10px" }}>
                                    <ReuseButton label="Cancel" onClick={handleCancel} spacing={4} />
                                </div>
                            )}

                            {tabs.length > 1 && value !== tabs[0].value && (
                                <div style={{ marginRight: "10px" }}>
                                    <ReuseButton label="Back" onClick={handlePreviousClick} spacing={4} />
                                </div>
                            )}


                            {tabs.length > 1 && value !== tabs[tabs.length - 1].value && (
                                <div style={{ marginRight: "10px" }}>
                                    <ReuseButton label="Next" onClick={handleNextClick} spacing={4} />
                                </div>
                            )}


                            {additionalButtons.map((button, index) => {
                                if (button.label === "Submit") {
                                    return (
                                        value === tabs[tabs.length - 1].value ? (
                                            <div style={{ marginRight: "10px" }} key={index}>
                                                <ReuseButton label={button.label} onClick={button.onClick} spacing={4} />
                                            </div>
                                        ) : null
                                    );
                                } else {
                                    return (
                                        <div key={index} style={{ marginRight: "10px" }}>
                                            <ReuseButton label={button.label} onClick={button.onClick} spacing={4} />
                                        </div>
                                    );
                                }
                            })}



                        </div>
                    </div>
                </div>

                {tabClassName == "TabStatus" && (
                    <div className="overlay-component">
                        <StatusBar statusList={Statuslist} />
                    </div>
                )}
            </div>
        </>
    );
};

export default TabsComponent;
