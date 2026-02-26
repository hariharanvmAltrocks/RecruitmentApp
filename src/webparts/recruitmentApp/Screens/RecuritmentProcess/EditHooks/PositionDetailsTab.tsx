import * as React from "react";
import { Card, CardContent } from "@mui/material";
import CustomInput from "../../../components/CustomInput";
import { labelNames } from "../../../utilities/LabelName";

interface PositionDetailsTabProps {
  formState: {
    BusinessUnitCode?: string;
    BusinessUnitName?: string;
    BusinessUnitDescription?: string;
    Department?: string;
    SubDepartment?: string;
    Section?: string;
    DepartmentCode?: string;
    Nationality?: string;
    PatersonGrade?: string;
    DRCGrade?: string;
    EmployementCategory?: string;
    ContractType?: string;
    AreaOfWork?: string;
    NoofPositionAssigned?: string | number;
    DateRequried?: string | Date;
  };
  validationErrors?: Record<string, string>;
  handleFormStateChange: (field: string, value: any) => void;
}

const PositionDetailsTab: React.FC<PositionDetailsTabProps> = ({
  formState,
  validationErrors,
  handleFormStateChange,
  ...props
}) => {
  return (
    <Card>
      <CardContent>
        <div className="ms-Grid-row">
          <div className="ms-Grid-col ms-lg3">
            <CustomInput
              label={labelNames.PositionDetails.BusinessUnitCode}
              value={formState.BusinessUnitCode}
              error={false}
              disabled={true}
              mandatory={false}
              onChange={(value) =>
                handleFormStateChange("BusinessUnitCode", value)
              }
            />
          </div>
          <div className="ms-Grid-col ms-lg3">
            <CustomInput
              label={labelNames.PositionDetails.BusinessUnitName}
              value={formState.BusinessUnitName}
              disabled={true}
              error={false}
              mandatory={false}
              onChange={(value) =>
                handleFormStateChange("BusinessUnitName", value)
              }
            />
          </div>
          <div className="ms-Grid-col ms-lg3">
            <CustomInput
              label={labelNames.PositionDetails.BusinessUnitDescription}
              value={formState.BusinessUnitDescription}
              error={false}
              disabled={true}
              mandatory={false}
              onChange={(value) =>
                handleFormStateChange("BusinessUnitDescription", value)
              }
            />
          </div>
          <div className="ms-Grid-col ms-lg3">
            <CustomInput
              label={labelNames.PositionDetails.Department}
              value={formState.Department}
              disabled={true}
              mandatory={false}
              onChange={(value) => handleFormStateChange("Department", value)}
            />
          </div>
        </div>
        <div className="ms-Grid-row">
          <div className="ms-Grid-col ms-lg3">
            <CustomInput
              label={labelNames.PositionDetails.SubDepartment}
              value={formState.SubDepartment}
              disabled={true}
              mandatory={false}
              onChange={(value) =>
                handleFormStateChange("SubDepartment", value)
              }
            />
          </div>
          <div className="ms-Grid-col ms-lg3">
            <CustomInput
              label={labelNames.PositionDetails.Section}
              value={formState.Section}
              disabled={true}
              mandatory={false}
              onChange={(value) => handleFormStateChange("Section", value)}
            />
          </div>
          <div className="ms-Grid-col ms-lg3">
            <CustomInput
              label={labelNames.PositionDetails.DepartmentCode}
              value={formState.DepartmentCode}
              disabled={true}
              mandatory={false}
              onChange={(value) =>
                handleFormStateChange("DepartmentCode", value)
              }
            />
          </div>
          <div className="ms-Grid-col ms-lg3">
            <CustomInput
              label={labelNames.PositionDetails.Nationality}
              value={formState.Nationality}
              disabled={true}
              mandatory={false}
              onChange={(value) => handleFormStateChange("Nationality", value)}
            />
          </div>
        </div>
        <div className="ms-Grid-row">
          <div className="ms-Grid-col ms-lg3">
            <CustomInput
              label={labelNames.PositionDetails.PatersonGrade}
              value={formState.PatersonGrade}
              disabled={true}
              mandatory={false}
              onChange={(value) =>
                handleFormStateChange("PatersonGrade", value)
              }
            />
          </div>

          <div className="ms-Grid-col ms-lg3">
            <CustomInput
              label={labelNames.PositionDetails.DRCGrade}
              value={formState.DRCGrade}
              disabled={true}
              mandatory={false}
              onChange={(value) => handleFormStateChange("DRCGrade", value)}
            />
          </div>
          <div className="ms-Grid-col ms-lg3">
            <CustomInput
              label={labelNames.PositionDetails.EmploymentCategory}
              value={formState.EmployementCategory}
              disabled={true}
              error={false}
              mandatory={false}
              onChange={(value) =>
                handleFormStateChange("EmployementCategory", value)
              }
            />
          </div>
          <div className="ms-Grid-col ms-lg3">
            <CustomInput
              label={labelNames.PositionDetails.TypeofContract}
              value={formState.ContractType}
              disabled={true}
              error={false}
              mandatory={false}
              onChange={(value) => handleFormStateChange("ContractType", value)}
            />
          </div>
        </div>
        <div className="ms-Grid-row">
          <div className="ms-Grid-col ms-lg3">
            <CustomInput
              label={labelNames.PositionDetails.AreaofWork}
              value={formState.AreaOfWork}
              disabled={true}
              error={false}
              mandatory={false}
              onChange={(value) => handleFormStateChange("AreaOfWork", value)}
            />
          </div>

          <div className="ms-Grid-col ms-lg3">
            <CustomInput
              label={labelNames.PositionDetails.NoofPerson}
              value={formState.NoofPositionAssigned}
              disabled={true}
              error={false}
              mandatory={false}
              onChange={(value) =>
                handleFormStateChange("NoofPositionAssigned", value)
              }
            />
          </div>

          <div className="ms-Grid-col ms-lg3">
            <CustomInput
              label={labelNames.PositionDetails.DatePositionRequired}
              value={
                formState.DateRequried
                  ? new Date(formState.DateRequried)
                      .toLocaleDateString("en-GB")
                      .replace(/\//g, "-")
                  : ""
              }
              disabled={true}
              error={false}
              mandatory={false}
              onChange={(value) => handleFormStateChange("DateRequried", value)}
            />
          </div>
        </div>

        {/* <CustomInput
                    label="Business Unit Code"
                    value={formState.BusinessUnitCode}
                    disabled={true}
                    onChange={(value) => handleFormStateChange('BusinessUnitCode', value)}
                /> */}
      </CardContent>
    </Card>
  );
};

export default React.memo(PositionDetailsTab);
