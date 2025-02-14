import * as React from "react";
import { Stack } from "@fluentui/react";
import { JobCodeTilte } from "../Models/RecuritmentVRR";
import CustomLabel from "./CustomLabel";
//import CustomLabel from "./CustomLabel";

interface JobCodeSelectorProps {
  jobCodes: JobCodeTilte[];
  selectedJobCodes: JobCodeTilte[];
  onSelectAllChange: (value: boolean) => void;
  onRowChange?: (value: boolean, rowIndex: number) => void;
  label?: string;
}

const JobCodeSelector: React.FC<JobCodeSelectorProps> = ({
  jobCodes,
  onSelectAllChange,
  selectedJobCodes,
  onRowChange,
  label,
}) => {
  React.useEffect(() => {}, [selectedJobCodes, jobCodes]);

  return (
    <>
      <div>
        {/* <div className="ms-Grid-row" style={{ textAlign: "center" }}>
          <div className="ms-Grid-col ms-lg12"> */}
        <h2
          style={{
            color: "red",
            fontFamily: `"Segoe UI", "Segoe UI Web (West European)", "Segoe UI", 
    -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif`,
          }}
        >
          {label}
        </h2>
        {/* </div>
        </div> */}
      </div>
      <CustomLabel value={"Selected Job Title"} />
      <Stack horizontal tokens={{ childrenGap: 20 }}>
        <Stack
          tokens={{ childrenGap: 10 }}
          styles={{
            root: {
              display: "flex",
              flexFlow: "column",
              width: 485,
              height: 121,
              boxSizing: "border-box",
              border: "1px solid rgb(191, 182, 182)",
              borderRadius: 0,
              padding: 20,
              overflowY: "auto",
              paddingLeft: 30,
              marginTop: 1,
              fontFamily: `"Segoe UI", "Segoe UI Web (West European)", "Segoe UI", 
    -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif`,
              fontSize: "13px",
            },
          }}

          // styles={{
          //   root: {
          //     border: "1px solid rgb(191 182 182)",
          //     borderRadius: 4,
          //     padding: 10,
          //     width: 485,
          //     height: 100,
          //   },
          // }}
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
