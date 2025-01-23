import * as React from "react";
import { useState } from "react";
import { Checkbox, IconButton, Stack, Text } from "@fluentui/react";

interface JobCode {
    id: string;
    name: string;
}

interface JobCodeSelectorProps {
    jobCodes: JobCode[];
    onSelectionChange: (selectedJobCodes: JobCode[]) => void;
}

const JobCodeSelector: React.FC<JobCodeSelectorProps> = ({ jobCodes, onSelectionChange }) => {
    const [selectedJobCodes, setSelectedJobCodes] = useState<JobCode[]>([]);

    // Handle checkbox toggle
    const handleSelect = (jobCode: JobCode, isChecked: boolean): void => {
        const updatedSelectedJobCodes = isChecked
            ? [...selectedJobCodes, jobCode]
            : selectedJobCodes.filter((code) => code.id !== jobCode.id);

        setSelectedJobCodes(updatedSelectedJobCodes);
        onSelectionChange(updatedSelectedJobCodes); // Notify parent
    };

    // Handle remove button click
    const handleRemove = (id: string): void => {
        const updatedSelectedJobCodes = selectedJobCodes.filter((code) => code.id !== id);
        setSelectedJobCodes(updatedSelectedJobCodes);
        onSelectionChange(updatedSelectedJobCodes); // Notify parent
    };

    return (
        <Stack horizontal tokens={{ childrenGap: 20 }}>
            {/* Left Side: Job Codes */}
            <Stack
                tokens={{ childrenGap: 10 }}
                styles={{ root: { border: "1px solid orange", padding: 10, width: 300 } }}
            >
                <Text variant="mediumPlus" styles={{ root: { fontWeight: "bold" } }}>
                    Job Code
                </Text>
                {jobCodes.map((jobCode) => (
                    <Checkbox
                        key={jobCode.id}
                        label={`${jobCode.id} - ${jobCode.name}`}
                        checked={selectedJobCodes.some((code) => code.id === jobCode.id)}
                        onChange={(_, isChecked) => handleSelect(jobCode, isChecked!)}
                    />
                ))}
            </Stack>

            {/* Right Side: Selected Job Codes */}
            <Stack
                tokens={{ childrenGap: 10 }}
                styles={{ root: { border: "1px solid green", padding: 10, width: 300 } }}
            >
                <Text variant="mediumPlus" styles={{ root: { fontWeight: "bold" } }}>
                    Selected Job Code
                </Text>
                {selectedJobCodes.length > 0 ? (
                    selectedJobCodes.map((jobCode) => (
                        <Stack
                            key={jobCode.id}
                            horizontal
                            verticalAlign="center"
                            tokens={{ childrenGap: 10 }}
                        >
                            <Text>{`${jobCode.id} - ${jobCode.name}`}</Text>
                            <IconButton 
                                iconProps={{ iconName: "Delete" }}
                                title="Delete"
                                ariaLabel="Delete"
                                className="Deletebtn"
                                styles={{
                                    root: {
                                        color: "black !important", // Default color
                                        selectors: {
                                            ":hover": {
                                                color: "red !important", // Hover color
                                            },
                                        },
                                    },
                                }}
                                onClick={() => handleRemove(jobCode.id)}
                            />


                        </Stack>
                    ))
                ) : (
                    <Text>No job codes selected.</Text>
                )}
            </Stack>
        </Stack>
    );
};

export default JobCodeSelector;
