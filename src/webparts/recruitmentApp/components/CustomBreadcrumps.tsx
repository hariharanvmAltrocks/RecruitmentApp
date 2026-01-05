import * as React from "react";
import { Breadcrumbs, Typography, useMediaQuery } from "@mui/material";
import ReuseButton from "./ReuseButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LabelHeaderComponents from "./TitleHeader";
import { ButtonAction } from "../utilities/LabelName";
import { ColorCode } from "../utilities/Config";
import StatusBar from "./StatusBar";

type BreadcrumbData = {
  label: string;
  value: string;
  content: React.ReactNode;
};

export type TabNameData = {
  tabName: string;
  IsCurrent?: boolean;
  navigationPath?: string;
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
  Statuslist?: { [key: string]: string } | null;
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
  Statuslist,
}) => {
  const [currentValue, setCurrentValue] = React.useState(initialItem);
  const contentRef = React.useRef<HTMLDivElement>(null);

  const currentIndex = items.findIndex((item) => item.value === currentValue);

  React.useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [currentValue]);

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
  const hasBackButton = additionalButtons?.some(
    (button) => button.label === ButtonAction.Back
  );
  return (
    <div>
      <div className="ms-Grid-row">
        {/* <div className="ms-Grid-col ms-lg0.3">
         
        </div> */}
        <div
          className={
            Statuslist && Object.keys(Statuslist).length > 0
              ? "ms-Grid-col ms-lg8"
              : "ms-Grid-col ms-lg9"
          }
        >
          <span
            style={{ display: "flex", marginLeft: hasBackButton ? "3%" : "0%" }}
          >
            {additionalButtons.some(
              (button) => button.label === ButtonAction.Back
            ) &&
              additionalButtons.map((button, index) => {
                return (
                  <ReuseButton
                    label={ButtonAction.Back}
                    onClick={button.onClick}
                    spacing={4}
                    icon={
                      <ArrowBackIcon key={index} onClick={button.onClick} />
                    }
                  ></ReuseButton>
                );
              })}
            <Breadcrumbs
              aria-label="breadcrumb"
              separator={separator}
              sx={{ marginBottom: "16px", marginLeft: "3%", marginTop: "1%" }}
            >
              {TabName.map((item, index) => (
                <Typography
                  key={index}
                  color={
                    index === TabName.length - 1
                      ? "text.primary"
                      : ColorCode.BreadCrump.BreadCrumpColor
                  }
                  fontWeight="Bold"
                >
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
            />
          </div>

          {JobValue?.Status && (
            <div
              className={
                Statuslist && Object.keys(Statuslist).length > 0
                  ? "ms-Grid-col ms-lg5"
                  : "ms-Grid-col ms-lg6"
              }
              style={{ display: "flex", justifyContent: "flex-end" }}
            >
              <LabelHeaderComponents
                value={`Status - ${JobValue?.Status ?? ""}`}
              />
            </div>
          )}

          {Statuslist && Object.keys(Statuslist).length > 0 && (
            <div
              className="ms-Grid-col ms-lg1"
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                marginTop: "-5%",
              }}
            >
              <StatusBar checklist={Statuslist} />
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
        ref={contentRef}
        className={MainTable ? "no-scrollbar" : ""}
        style={{
          height: ISExpended
            ? "calc(-158px + 85vh) "
            : MainTable
            ? "calc(-158px + 73vh)"
            : additionalButtons.length > 0 &&
              additionalButtons.some(
                (button) =>
                  button.label === "Close" || button.label === ButtonAction.Back
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
            (button) =>
              button.label === ButtonAction.close ||
              button.label === ButtonAction.Back
          ) && (
            <div style={{ marginRight: "10px" }}>
              <ReuseButton
                label={ButtonAction.Cancel}
                onClick={handleCancel}
                spacing={4}
              />
            </div>
          )}

        {currentIndex > 0 && (
          <div style={{ marginRight: "10px" }}>
            <ReuseButton
              label={ButtonAction.Back}
              onClick={handleBackClick}
              spacing={4}
            />
          </div>
        )}
        {currentIndex < items.length - 1 && (
          <div style={{ marginRight: "10px" }}>
            <ReuseButton
              label={ButtonAction.Next}
              onClick={handleNextClick}
              spacing={4}
            />
          </div>
        )}

        {additionalButtons.map((button, index) => {
          if (button.label === ButtonAction.Back) {
            return null;
          } else if (
            button.label === ButtonAction.Submit ||
            button.label === ButtonAction.Preview ||
            button.label === ButtonAction.Approve ||
            button.label === ButtonAction.Selected ||
            button.label === ButtonAction.Rejected ||
            button.label === ButtonAction.OnHold ||
            button.label === ButtonAction.SaveAsDraft
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
