import * as React from "react";
import { Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import "../App.css";
import ReuseButton from "./ReuseButton";
import StatusBar from "./StatusBar";
import { ColorCode, tabType } from "../utilities/Config";
import { ButtonAction } from "../utilities/LabelName";

interface TabData {
  label: string | JSX.Element;
  value: string;
  content: React.ReactNode;
}

interface TabsComponentProps {
  tabs: TabData[];
  initialTab?: string;
  handleCancel?: () => void;
  tabClassName?: string;
  tabtype?: string;
  Statuslist?: { [key: string]: string };
  validateTab?: (tab: string) => boolean;
  IsNotscroll?: boolean;
  additionalButtons?: {
    label: string;
    onClick?: () => void;
    disable?: boolean;
  }[];
  onTabChange?: (newTab: string) => void;
}

const TabsComponent: React.FC<TabsComponentProps> = ({
  tabs,
  initialTab = "tab1",
  additionalButtons = [],
  handleCancel,
  tabClassName,
  Statuslist,
  validateTab,
  tabtype,
  onTabChange,
  IsNotscroll,
}) => {
  const [value, setValue] = React.useState(initialTab);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    if (onTabChange) {
      onTabChange(newValue);
    }
  };

  const handlePreviousClick = () => {
    const currentIndex = tabs.findIndex((tab) => tab.value === value);
    if (currentIndex > 0) {
      setValue(tabs[currentIndex - 1].value);
      if (onTabChange) {
        onTabChange(tabs[currentIndex - 1].value);
      }
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
      isValid = validateTab(currentTab);
    }

    if (isValid) {
    } else {
      if (currentIndex < tabs.length - 1) {
        setValue(tabs[currentIndex + 1].value);
        if (onTabChange) {
          onTabChange(tabs[currentIndex + 1].value);
        }
      }
    }
  };

  return (
    <>
      <div className="ms-Grid-row">
        <div className="ms-Grid-col ms-lg12">
          {/* <Box sx={{ width: "100%", typography: "body1" }}> */}
          <TabContext value={value}>
            <TabList
              className={tabClassName ? tabClassName : "tab"}
              onChange={handleChange}
              aria-label="tabs"
              variant="scrollable"
              scrollButtons
              sx={{
                backgroundColor: ColorCode.TabColorCode.Tabcolor,
                width: "95%",
                borderRadius: "6px",
                height: "80px",
                boxShadow: `0 2px 4px 3px ${ColorCode.TabColorCode.TabboxShadow}`,
                marginLeft: "30px",
                textAlign: "center",
                justifyContent: "space-evenly",
                alignItems: "center",
                marginTop: "0%",
              }}
            >
              {tabs.map((tab) => (
                <Tab key={tab.value} label={tab.label} value={tab.value} />
              ))}
            </TabList>

            {tabs.map((tab) => (
              <TabPanel key={tab.value} value={tab.value}>
                <div
                  // className="no-scrollbar"
                  style={{
                    height: "fit-content", //"calc(-158px + 80vh)",
                    overflowY: IsNotscroll ? "hidden" : "auto",
                    boxSizing: "border-box",
                    // width: "105%",
                    margin: "-2% -27px 10px",
                    // background: "white",
                    padding: "0%",
                    width: "calc(100% + -1px)",
                    marginLeft: "0%",
                    willChange: "transform",
                    marginTop: "-3%",
                    //                  width: calc(100% + -1px);
                    // margin-left: 0%;
                    // borderRadius: "5px",
                    // boxShadow: "0px 2px 4px 3px lightgray",
                  }}
                >
                  <div
                    //   className="no-scrollbar"
                    style={{
                      // height: "calc(-158px + 80vh)",
                      overflowY: "auto",
                      // padding: "10px",
                      boxSizing: "border-box",
                      overflowX: "hidden",
                      // width: "105%",
                      // marginTop: "-2%",
                      // marginLeft: "-27px",
                    }}
                  >
                    {tab.content}
                  </div>
                </div>
              </TabPanel>
            ))}
          </TabContext>
          {/* </Box> */}
          {tabtype === tabType.Dashboard ? (
            <></>
          ) : (
            <div className="ms-Grid-row" style={{ marginBottom: "2%" }}>
              <div className="ms-Grid-col ms-lg6"></div>
              <div
                className="ms-Grid-col ms-lg6"
                style={{
                  display: "flex",
                  justifyContent: "end",
                  marginLeft: "48%",
                }}
              >
                {handleCancel && (
                  <div style={{ marginRight: "10px" }}>
                    <ReuseButton
                      label="Cancel"
                      onClick={handleCancel}
                      spacing={4}
                    />
                  </div>
                )}

                {tabs.length > 1 && value !== tabs[0].value && (
                  <div style={{ marginRight: "10px" }}>
                    <ReuseButton
                      label={ButtonAction.Back}
                      onClick={handlePreviousClick}
                      spacing={4}
                    />
                  </div>
                )}

                {tabs.length > 1 && value !== tabs[tabs.length - 1].value && (
                  <div style={{ marginRight: "10px" }}>
                    <ReuseButton
                      label={ButtonAction.Next}
                      onClick={handleNextClick}
                      spacing={4}
                    />
                  </div>
                )}

                {additionalButtons.map((button, index) => {
                  if (
                    button.label === ButtonAction.Submit ||
                    button.label === ButtonAction.Rework ||
                    button.label === ButtonAction.ProceedToSubmit
                  ) {
                    return value === tabs[tabs.length - 1].value ? (
                      <div style={{ marginRight: "10px" }} key={index}>
                        <ReuseButton
                          label={button.label}
                          onClick={button.onClick}
                          spacing={4}
                          disabled={button.disable}
                        />
                      </div>
                    ) : null;
                  } else if (button.label === ButtonAction.Preview) {
                    return value === tabs[tabs.length - 1].value ? (
                      <div key={index} style={{ marginRight: "10px" }}>
                        <ReuseButton
                          label={button.label}
                          onClick={button.onClick}
                          spacing={4}
                          width={"100%"}
                          disabled={button.disable}
                        />
                      </div>
                    ) : null;
                  } else {
                    return (
                      <div key={index} style={{ marginRight: "10px" }}>
                        <ReuseButton
                          label={button.label}
                          onClick={button.onClick}
                          spacing={4}
                          width={"100%"}
                          disabled={button.disable}
                        />
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          )}
          {tabClassName === "TabStatus" && (
            <div className="overlay-component">
              <div>
                <StatusBar checklist={Statuslist ?? {}} />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TabsComponent;
