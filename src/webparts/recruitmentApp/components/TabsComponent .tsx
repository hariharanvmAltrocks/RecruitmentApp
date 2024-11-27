import * as React from "react";
import { Box, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import "../App.css";


interface TabData {
    label: string;
    value: string;
    content: React.ReactNode;
}

interface TabsComponentProps {
    tabs: TabData[];
    initialTab?: string;
}
const TabsComponent: React.FC<TabsComponentProps> = ({ tabs, initialTab = "tab1" }) => {

    const [value, setValue] = React.useState(initialTab);

    const handleChange = (event: any, newValue: any) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: "100%", typography: "body1" }}>
            <TabContext value={value}>
                <TabList
                    className="TabStatus"
                    onChange={handleChange}
                    aria-label="tabs"
                    variant="scrollable"
                    scrollButtons
                >
                    {tabs.map((tab: any, index: any) => (
                        <Tab
                            key={index}
                            label={tab.label}
                            value={tab.value}
                        />
                    ))}
                </TabList>

                {tabs.map((tab: any, index: any) => (
                    <TabPanel key={index} value={tab.value}>
                        {tab.content}
                    </TabPanel>
                ))}
            </TabContext>
        </Box>
    );
};

export default TabsComponent;
