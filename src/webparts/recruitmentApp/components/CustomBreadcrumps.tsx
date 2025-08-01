import * as React from "react";
import { Breadcrumbs, Typography, useMediaQuery } from "@mui/material";
import ReuseButton from "./ReuseButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LabelHeaderComponents from "./TitleHeader";

type BreadcrumbData = {
  label: string;
  value: string;
  content: React.ReactNode;
};

export type TabNameData = {
  tabName: string;
};

export type JobTitleData = {
  JobTitle: string;
  JobCode: string;
  Status: string;
};

interface BreadcrumbsComponentProps {
  items: BreadcrumbData[];
  TabName?: TabNameData[]; // Made optional with ?
  initialItem?: string;
  separator?: string;
  handleCancel?: () => void;
  ValidationError?: () => boolean;
  onBreadcrumbChange?: (newItem: string) => void;
  Agencies?: string;
  JobValue?: JobTitleData;
  MainTable?: boolean;
  ISExpended?: boolean;
  additionalButtons?: {
    label: string;
    onClick?: () => void;
    disable?: boolean;
  }[];
}

const BreadcrumbsComponent: React.FC<BreadcrumbsComponentProps> = ({
  items,
  initialItem = "",
  separator = "|",
  onBreadcrumbChange,
  additionalButtons = [],
  TabName = [],
  handleCancel,
  ValidationError,
  Agencies,
  JobValue,
  MainTable,
  ISExpended,
}) => {
  const [currentValue, setCurrentValue] = React.useState(initialItem);

  const currentIndex = items.findIndex((item) => item.value === currentValue);

  const handleNextClick = () => {
    const isValid = ValidationError ? !ValidationError() : true;

    if (isValid) {
      if (currentIndex < items.length - 1) {
        const nextValue = items[currentIndex + 1].value;
        setCurrentValue(nextValue);
        onBreadcrumbChange?.(nextValue);
      }
    }
  };

  const handleBackClick = () => {
    if (currentIndex > 0) {
      const prevValue = items[currentIndex - 1].value;
      setCurrentValue(prevValue);
      if (onBreadcrumbChange) onBreadcrumbChange(prevValue);
    }
  };
  const isMobile = useMediaQuery("(max-width:600px)");
  return (
    <div>
      <div className="ms-Grid-row">
        {/* <div className="ms-Grid-col ms-lg0.3">
         
        </div> */}
        <div className="ms-Grid-col ms-lg9">
          <span style={{ display: "flex" }}>
            {additionalButtons.some((button) => button.label === "Back") &&
              additionalButtons.map((button, index) => {
                return <ArrowBackIcon key={index} onClick={button.onClick} />;
              })}
            <Breadcrumbs
              aria-label="breadcrumb"
              separator={separator}
              sx={{ marginBottom: "16px", marginLeft: "2%" }}
            >
              {TabName.map((item, index) => (
                <Typography key={index} color="text.primary" fontWeight="Bold">
                  {item.tabName}
                </Typography>
              ))}
            </Breadcrumbs>
          </span>
        </div>
        {Agencies && (
          <div className="ms-Grid-col ms-lg3">
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end", // This aligns the entire wrapper to the right
                marginTop: "0%",
                width: "100%", // Ensure the container spans the full width
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: isMobile ? "flex-start" : "center", // Flex-start for mobile, center for larger screens
                  backgroundColor: "white",
                  borderRadius: "20px",
                  padding: isMobile ? "10px" : "5px 10px", // Dynamic padding based on screen size
                  boxShadow: "0px 5px 10px 0px #0F4B8426",
                  margin: isMobile ? "10px auto" : "0", // Margin adjustment for mobile
                  width: isMobile ? "90%" : "100%", // Flexible width for mobile (90%) and larger screens (47%)
                }}
              >
                <div>
                  <p
                    style={{
                      margin: 0,
                      color: "#EF3340",
                      fontWeight: "400",
                      fontSize: isMobile ? "12px" : "14px", // Font size adjustment
                    }}
                  >
                    <span style={{ fontWeight: "bold" }}>
                      <LabelHeaderComponents
                        value={`Profile from ${Agencies} `}
                      />
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {JobValue?.JobTitle && (
        <div
          className="ms-Grid-row"
          style={{ marginLeft: "1%", marginRight: "1%" }}
        >
          <div className="ms-Grid-col ms-lg6">
            <LabelHeaderComponents
              value={`Job Title - ${JobValue?.JobTitle ?? ""} (${
                JobValue?.JobCode ?? ""
              })`}
            >
              {" "}
            </LabelHeaderComponents>
          </div>
          {JobValue?.Status && (
            <div
              className="ms-Grid-col ms-lg6"
              style={{ display: "flex", justifyContent: "end" }}
            >
              <LabelHeaderComponents
                value={`Status - ${JobValue?.Status ?? ""}`}
              >
                {" "}
              </LabelHeaderComponents>
            </div>
          )}
        </div>
      )}
      {/* <div
        className="no-scrollbar"
        style={{
          height: ISExpended ? "calc(-158px + 88vh)" : "calc(-158px + 91vh)",
          // boxSizing: "border-box",
          // width: "105%",
          margin: "-1% -17px 10px 0%",
          // background: "white",
          padding: "0%",
          // borderRadius: "5px",
          // boxShadow: "0px 2px 4px 3px lightgray",
          width: "100%",
        }}
      >
        */}

      <div
        className={MainTable ? "no-scrollbar" : ""}
        style={{
          height: ISExpended
            ? "calc(-158px + 85vh) "
            : MainTable
            ? "calc(-158px + 73vh)"
            : additionalButtons.length > 0 &&
              additionalButtons.some(
                (button) => button.label === "Close" || button.label === "Back"
              )
            ? " calc(-158px + 88vh)"
            : "calc(-158px + 85vh) ",
          // height: "calc(-230px + 86vh)",
          overflowY: MainTable ? "clip" : "auto",
          // padding: "10px",
          boxSizing: "border-box",
          width: "100%",
          willChange: "transform",
          // width: "105%",
          marginTop: "-2%",
          // marginLeft: "-27px",
        }}
      >
        {items.find((item) => item.value === currentValue)?.content}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "16px",
        }}
      >
        {handleCancel &&
          !additionalButtons.some(
            (button) => button.label === "Close" || button.label === "Back"
          ) && (
            <div style={{ marginRight: "10px" }}>
              <ReuseButton label="Cancel" onClick={handleCancel} spacing={4} />
            </div>
          )}

        {currentIndex > 0 && (
          <div style={{ marginRight: "10px" }}>
            <ReuseButton label="Back" onClick={handleBackClick} spacing={4} />
          </div>
        )}
        {currentIndex < items.length - 1 && (
          <div style={{ marginRight: "10px" }}>
            <ReuseButton label="Next" onClick={handleNextClick} spacing={4} />
          </div>
        )}

        {additionalButtons.map((button, index) => {
          if (button.label === "Back") {
            return null;
          } else if (
            button.label === "Submit" ||
            button.label === "Preview" ||
            button.label === "Approve" ||
            button.label === "Selected" ||
            button.label === "Rejected" ||
            button.label === "OnHold"
          ) {
            return currentValue === items[items.length - 1].value ? (
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
    // </div>
  );
};

export default BreadcrumbsComponent;
