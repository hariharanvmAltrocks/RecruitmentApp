import * as React from "react";
import { useState, useCallback } from "react";
import { Stack } from "@fluentui/react/lib/Stack";
import { RoleID, ColorCode } from "../../utilities/Config";
import { JobCodeTilte } from "../../Models/RecuritmentVRR";
import { AutoCompleteItem } from "../../Models/Screens";
import IsValid from "../../components/Validation";
import JobCodeSelector from "../../components/CustomMultiselectwithswipe";
import CustomAutoComplete from "../../components/CustomAutoComplete";
import CustomMultiSelect from "../../components/CustomMultiSelect";
import CustomTextArea from "../../components/CustomTextArea";
import ReuseButton from "../../components/ReuseButton";

export interface AssignRecuritmentHRProps {
  selectedJobCodes: JobCodeTilte[];
  onSelectAllChange?: (value: boolean) => void;
  onRowChange?: (value: boolean, rowIndex: number) => void;
  currentRole: number[];
  assignRecruitmentHROption: AutoCompleteItem[];
  assignRecruitmentAgenciesOption: AutoCompleteItem[];
  onClose: () => void;
  onSubmit: (formData: FormDataType) => Promise<void>;
  isLoading?: boolean;
}

export type FormDataType = {
  assignRecruitmentHR: AutoCompleteItem | null;
  assignRecruitmentAgencies: AutoCompleteItem[];
  comments: string;
};

const AssignRecuritmentHR: React.FC<AssignRecuritmentHRProps> = React.memo(
  ({
    selectedJobCodes,
    currentRole,
    assignRecruitmentHROption,
    assignRecruitmentAgenciesOption,
    onClose,
    onSubmit,
    onSelectAllChange,
    onRowChange,
    isLoading = false,
  }) => {
    const [formData, setFormData] = useState<FormDataType>({
      assignRecruitmentHR: null,
      assignRecruitmentAgencies: [],
      comments: "",
    });

    const [errors, setErrors] = useState({
      assignRecruitmentHR: false,
      assignRecruitmentAgencies: false,
      comments: false,
    });

    const handleFieldChange = useCallback(
      (field: keyof FormDataType, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: false }));
      },
      [],
    );

    const validateForm = useCallback((): boolean => {
      const isHRLead = currentRole.includes(RoleID.RecruitmentHRLead);
      const newErrors = {
        assignRecruitmentHR:
          isHRLead && !IsValid(formData.assignRecruitmentHR?.text),
        assignRecruitmentAgencies:
          !isHRLead && formData.assignRecruitmentAgencies.length === 0,
        comments: !IsValid(formData.comments),
      };
      setErrors(newErrors);
      return !Object.values(newErrors).some((error) => error);
    }, [formData, currentRole]);

    const handleSubmit = useCallback(async () => {
      if (validateForm()) {
        await onSubmit(formData); 
      }
    }, [validateForm, onSubmit, formData]);

    const isHRLeadRole = currentRole.includes(RoleID.RecruitmentHRLead);
    const isHRRole = currentRole.includes(RoleID.RecruitmentHR);

    return (
      <div style={{ marginLeft: "12%", width: "78%" }}>
        <Stack tokens={{ childrenGap: 20 }} style={{ padding: "24px" }}>
        <Stack.Item>
          <JobCodeSelector
              jobCodes={selectedJobCodes}
              selectedJobCodes={selectedJobCodes}
              // onSelectAllChange={onSelectAllChange}
              onRowChange={onRowChange} onSelectAllChange={function (value: boolean): void {
                throw new Error("Function not implemented.");
              } }          />
          <span
            style={{
              color: "red",
              fontSize: "13px",
              display: "block",
              marginTop: "8px",
            }}
          >
            Note: To change selection, close this dialog and re-select from the
            list.
          </span>
        </Stack.Item>

        <Stack.Item>
          {isHRLeadRole ? (
            <CustomAutoComplete
              label="Assign Recruitment HR"
              options={assignRecruitmentHROption}
              value={formData.assignRecruitmentHR}
              disabled={isLoading}
              mandatory
              onChange={(item) =>
                handleFieldChange("assignRecruitmentHR", item)
              }
              error={errors.assignRecruitmentHR}
            />
          ) : (
            <CustomMultiSelect
              label="Assign Agencies"
              disabled={isLoading}
              mandatory
              value={formData.assignRecruitmentAgencies}
              options={assignRecruitmentAgenciesOption}
              onChange={(items) =>
                handleFieldChange("assignRecruitmentAgencies", items)
              }
              error={errors.assignRecruitmentAgencies}
            />
          )}
          {isHRRole && (
            <span
              style={{
                color: "red",
                fontSize: "13px",
                display: "block",
                marginTop: "8px",
              }}
            >
              Note: You can assign multiple Agencies.
            </span>
          )}
        </Stack.Item>

        <Stack.Item>
          <CustomTextArea
            label={isHRRole ? "Notes for Agencies" : "Notes for Recruitment HR"}
            value={formData.comments}
            error={errors.comments}
            onChange={(value) => handleFieldChange("comments", value)}
            mandatory
            disabled={isLoading}
          />
        </Stack.Item>

        <Stack
          horizontal
          horizontalAlign="center"
          tokens={{ childrenGap: 30 }}
          style={{ paddingTop: 20 }}
        >
          <ReuseButton
            label="Cancel"
            onClick={onClose}
            disabled={isLoading}
            Style={{
              backgroundColor: ColorCode.ButtonColorCode.ButtonColor,
              color: "white",
              width: "150px",
            }}
          />
          <ReuseButton
            label={isLoading ? "Assigning..." : "Assign"}
            onClick={handleSubmit}
            disabled={isLoading}
            Style={{
              backgroundColor: ColorCode.ButtonColorCode.ButtonColor,
              color: "white",
              width: "150px",
            }}
          />
        </Stack>
      </Stack>
      </div>
    );
  },
);  

export { AssignRecuritmentHR };
