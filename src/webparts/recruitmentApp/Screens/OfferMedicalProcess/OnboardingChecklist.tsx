import * as React from "react";
import CustomLoader from "../../Services/Loader/CustomLoader";
import { Button, Card, CardContent } from "@mui/material";
import ".//Checklist.css";

type ResponseType = "Yes" | "N/A" | undefined;

interface OnboardingChecklistProps {
  documents: string[];
}

interface Responses {
  [key: string]: ResponseType;
}

const defaultDocuments: string[] = [
  "RESI Form",
  "Position Motivation",
  "Position Code Confirmation",
  "Checklist",
  "Position Role Profile",
  "Employee CV/Resume",
  "Memorandum/Motivation to Appoint",
  "Certified Copies of Qualifications",
  "Police Affidavit of Qualifications",
  "Background & Qualifications Consent Form",
  "Qualifications Verification Results",
  "Background Results (Fraud & Criminal)",
  "Reference Checks",
  "Job Application Form",
];

export const OnboardingChecklist: React.FC<OnboardingChecklistProps> = ({
  documents = defaultDocuments,
}) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [responses, setResponses] = React.useState<Responses>({});

  React.useEffect(() => {
    setIsLoading(false);
  }, []);

  const handleResponse = (name: string, value: ResponseType) => {
    setResponses((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <CustomLoader isLoading={isLoading}>
      <div className="checklist-container">
        {documents.map((doc, index) => (
          <Card key={index} className="checklist-card">
            <CardContent className="checklist-card-content">
              <div className="checklist-title">
                <h3>{doc}</h3>
              </div>
              <div className="checklist-buttons">
                <Button
                  variant={responses[doc] === "Yes" ? "contained" : "outlined"}
                  color="success"
                  onClick={() => handleResponse(doc, "Yes")}
                >
                  Yes
                </Button>
                <Button
                  variant={responses[doc] === "N/A" ? "contained" : "outlined"}
                  color="error"
                  onClick={() => handleResponse(doc, "N/A")}
                >
                  N/A
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </CustomLoader>
  );
};
