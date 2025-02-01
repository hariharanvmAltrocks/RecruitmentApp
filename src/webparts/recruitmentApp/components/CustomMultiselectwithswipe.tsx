import * as React from "react";
import { Stack } from "@fluentui/react";
import { JobCodeTilte } from "../Models/RecuritmentVRR";
import CustomLabel from "./CustomLabel";

interface JobCodeSelectorProps {
  jobCodes: JobCodeTilte[];
  selectedJobCodes: JobCodeTilte[];
  onSelectAllChange: (value: boolean) => void;
  onRowChange?: (value: boolean, rowIndex: number) => void;
  label: string;
}

const JobCodeSelector: React.FC<JobCodeSelectorProps> = ({
  jobCodes,
  onSelectAllChange,
  selectedJobCodes,
  onRowChange,
  label,
}) => {
  React.useEffect(() => {
    console.log("Received selectedJobCodes:", selectedJobCodes);
    console.log("Received jobCodes:", jobCodes);
  }, [selectedJobCodes, jobCodes]);

  return (
    <>
      <div>
        <div className="ms-Grid-row" style={{ textAlign: "center" }}>
          <div className="ms-Grid-col ms-lg12">
            <h2 style={{ color: "red" }}>{label}</h2>
          </div>
        </div>
      </div>
      <CustomLabel value={"Selected Job Title"} />

      <Stack horizontal tokens={{ childrenGap: 20 }}>
        <Stack
          tokens={{ childrenGap: 10 }}
          styles={{
            root: {
              border: "1px solid #5f5f5f",
              borderRadius: 4,
              padding: 10,
              width: 600,
            },
          }}
        >
          {selectedJobCodes.length > 0 ? (
            selectedJobCodes.map((jobCode, index) => (
              <div key={jobCode.id}>
                {index + 1}. {jobCode.JobCode} - {jobCode.JobTitle}{" "}
              </div>
            ))
          ) : (
            <div>No job codes selected.</div>
          )}
        </Stack>
      </Stack>
    </>
  );
};

export default JobCodeSelector;
