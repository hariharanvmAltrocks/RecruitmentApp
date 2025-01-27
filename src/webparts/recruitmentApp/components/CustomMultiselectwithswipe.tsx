import * as React from "react";
import { Checkbox, IconButton, Stack, Text } from "@fluentui/react";
import { JobCodeTilte } from "../Models/RecuritmentVRR";

interface JobCodeSelectorProps {
  jobCodes: JobCodeTilte[];
  selectedJobCodes: JobCodeTilte[];
  onSelectionChange: (selectedJobCodes: JobCodeTilte[]) => void;
}

const JobCodeSelector: React.FC<JobCodeSelectorProps> = ({
  jobCodes,
  onSelectionChange,
  selectedJobCodes,
}) => {
  // Handle checkbox toggle
  const handleSelect = (jobCode: JobCodeTilte, isChecked: boolean): void => {
    const updatedSelectedJobCodes = isChecked
      ? [...selectedJobCodes, jobCode]
      : selectedJobCodes.filter((code) => code.id !== jobCode.id);

    onSelectionChange(updatedSelectedJobCodes); // Notify parent
  };

  // Handle remove button click
  const handleRemove = (id: string): void => {
    const updatedSelectedJobCodes = selectedJobCodes.filter(
      (code) => code.id !== id
    );
    onSelectionChange(updatedSelectedJobCodes); // Notify parent
  };

  return (
    <>
      <div>
        <div className="ms-Grid-row" style={{ textAlign: "center" }}>
          <div className="ms-Grid-col ms-lg12">
            <h2 style={{ color: "red" }}>Approved Job Positions</h2>
          </div>
        </div>
      </div>

      <Stack horizontal tokens={{ childrenGap: 20 }}>
        {/* Left Side: Job Codes */}
        <Stack
          tokens={{ childrenGap: 10 }}
          styles={{
            root: { border: "1px solid orange", padding: 10, width: 300 },
          }}
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
          styles={{
            root: { border: "1px solid green", padding: 10, width: 300 },
          }}
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
                <Text>{`${jobCode.id} - ${jobCode.name} `}</Text>
                <IconButton
                  iconProps={{
                    iconName: "Delete",
                    styles: {
                      root: {
                        color: "red", // Icon color is set to red
                        fontSize: "16px", // Optional: Set the icon's font size
                      },
                    },
                  }}
                  title="Delete"
                  ariaLabel="Delete"
                  className="Deletebtn"
                  onClick={() => handleRemove(jobCode.id)} // Call remove handler with jobCode id
                />
              </Stack>
            ))
          ) : (
            <Text>No job codes selected.</Text>
          )}
        </Stack>
      </Stack>
    </>
  );
};

export default JobCodeSelector;
