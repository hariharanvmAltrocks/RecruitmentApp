import * as React from "react";
import { Callout, ProgressIndicator, Icon, List, Stack } from "@fluentui/react";
import "../App.css";

interface IStatusBarProps {
    statusList: { [key: string]: string } | undefined;
    ReworkLabel?: boolean;
    EXCOReverted?: number;
    EXCORevertLogic?: string;
}

const StatusBar: React.FC<IStatusBarProps> = ({ statusList }) => {
    const [status, setStatus] = React.useState<{ [key: string]: string } | undefined>(statusList);
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

    React.useEffect(() => {
        setStatus(statusList);
    }, [statusList]);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const getStatusColor = (status: string): string => {
        switch (status) {
            case "Completed":
                return "green";
            case "Pending":
                return "gray";
            case "Resubmitted":
                return "#007bff";
            case "Reverted":
                return "red";
            case "Progress":
                return "#FFA500";
            default:
                return "red"; // Default color
        }
    };

    const steps = status ? Object.keys(status) : [];
    const open = Boolean(anchorEl);
    const id = open ? "simple-callout" : undefined;

    const completedSteps = status ? Object.values(status).filter((s) => s === "Completed").length : 0;
    const percentage = (completedSteps / steps.length) * 100;

    return (
        <div>
            <div className="StatusBar-container" onClick={handleClick} style={{ cursor: "pointer" }}>
                <div className="ms-Grid-row" style={{ marginTop: "-12px", textAlign: "center" }}>
                    Status
                </div>

                <ProgressIndicator
                    percentComplete={percentage / 100}
                    label={`${completedSteps}/${steps.length}`}
                    description="Progress"
                    styles={{
                        root: { width: "100%" },
                        progressTrack: { backgroundColor: "#d6d6d6" },
                        progressBar: { backgroundColor: "green" },
                    }}
                />
            </div>

            <Callout
                id={id}
                target={anchorEl}
                onDismiss={handleClose}
                directionalHint={2}
                setInitialFocus
            >
                <div style={{ padding: "20px" }}>
                    <List>
                        {steps.map((label, index) => {
                            const stepStatus = status ? status[label] : "";
                            const isCompleted = stepStatus === "Completed";
                            const isReverted = stepStatus === "Reverted";
                            const isPending = stepStatus === "Pending";
                            const isProgress = stepStatus === "Progress";
                            // const isResubmitted = stepStatus === "Resubmitted"; // This can be added back if necessary

                            return (
                                <Stack key={index} horizontalAlign="start" style={{ marginBottom: "10px" }}>
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        <Icon
                                            iconName={isCompleted ? "CheckMark" : isReverted ? "Cancel" : "Info"}
                                            style={{
                                                color: isCompleted
                                                    ? "green"
                                                    : isReverted
                                                        ? "red"
                                                        : isPending
                                                            ? "gray"
                                                            : isProgress
                                                                ? "#FFA500"
                                                                : "#007bff",
                                                marginRight: "8px",
                                            }}
                                        />
                                        <div style={{ color: getStatusColor(stepStatus) }}>{label}</div>
                                    </div>
                                </Stack>
                            );
                        })}
                    </List>
                </div>
            </Callout>
        </div>
    );
};

export default StatusBar;
