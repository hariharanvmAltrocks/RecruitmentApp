import * as React from "react";
import { Breadcrumbs, Typography } from "@mui/material";
import ReuseButton from "./ReuseButton";

type BreadcrumbData = {
    label: string;
    value: string;
    content: React.ReactNode;
};

export type TabNameData = {
    tabName: string;
};

interface BreadcrumbsComponentProps {
    items: BreadcrumbData[];
    TabName?: TabNameData[];  // Made optional with ?
    initialItem?: string;
    separator?: string;
    handleCancel?: () => void;
    onBreadcrumbChange?: (newItem: string) => void;
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
    handleCancel
}) => {
    const [currentValue, setCurrentValue] = React.useState(initialItem);

    const currentIndex = items.findIndex((item) => item.value === currentValue);

    const handleNextClick = () => {
        if (currentIndex < items.length - 1) {
            const nextValue = items[currentIndex + 1].value;
            setCurrentValue(nextValue);
            if (onBreadcrumbChange) onBreadcrumbChange(nextValue);
        }
    };

    const handleBackClick = () => {
        if (currentIndex > 0) {
            const prevValue = items[currentIndex - 1].value;
            setCurrentValue(prevValue);
            if (onBreadcrumbChange) onBreadcrumbChange(prevValue);
        }
    };

    return (
        <div>

            <Breadcrumbs aria-label="breadcrumb" separator={separator} sx={{ marginBottom: "16px", marginLeft: "2%" }}>
                {TabName.map((item, index) => (
                    <Typography
                        key={index}
                        color="text.primary"
                        fontWeight="Bold"
                    >
                        {item.tabName}
                    </Typography>
                ))}
            </Breadcrumbs>
            {items.find((item) => item.value === currentValue)?.content}


            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>

                {handleCancel && (
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
                    if (button.label === "Submit" || button.label === "Preview" || button.label === "Approved") {
                        return (
                            currentValue === items[items.length - 1].value ? (
                                <div key={index} style={{ marginRight: "10px" }}>
                                    <ReuseButton
                                        label={button.label}
                                        onClick={button.onClick}
                                        spacing={4}
                                        width={"100%"}
                                        disabled={button.disable}
                                    />
                                </div>
                            ) : null
                        );
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
    );
};

export default BreadcrumbsComponent;
