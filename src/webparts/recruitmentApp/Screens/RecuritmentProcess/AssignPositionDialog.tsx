import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import CustomTextArea from "../../components/CustomTextArea";
import { AutoCompleteItem } from "../../Models/Screens";
import { AssignHod } from "../../Models/RecuritmentVRR";
import CustomAutoComplete from "../../components/CustomAutoComplete";
import { ColorCode } from "../../utilities/Config";

interface AssignPositionDialogProps {
  visible: boolean;
  onHide: () => void;
  candidateData: {
    FullName: string;
    PositionTitle: string;
    JobCode: string;

    Comments?: string;
  } | null;
  onAssign: (data: {
    positionId: AutoCompleteItem | null;
    Reasons: string;
  }) => void;
  AssignOption: AutoCompleteItem[];
}

type ValidationError = {
  Comments: boolean;
  PositionID: boolean;
};

export const AssignPositionDialog = ({
  visible,
  onHide,
  candidateData,
  onAssign,
  AssignOption,
}: AssignPositionDialogProps) => {
  console.log("AssignOption", AssignOption);
  const [selectedPosition, setSelectedPosition] =
    React.useState<AutoCompleteItem | null>(null);
  const positionOptions = AssignOption || [];
  const [Reasons, setReasons] = React.useState<AssignHod>({
    Comments: candidateData?.Comments || "",
  });

  const [validationErrors, setValidationErrors] =
    React.useState<ValidationError>({
      Comments: false,
      PositionID: false,
    });

  const resetForm = () => {
    setSelectedPosition(null);
    setReasons({ Comments: "" });
    setValidationErrors({ Comments: false, PositionID: false });
  };

  const handleClose = () => {
    resetForm();
    onHide();
  };

  const handleAutoComplete = (value: AutoCompleteItem | null) => {
    setSelectedPosition(value);
    setValidationErrors((prevState) => ({
      ...prevState,
      PositionID: false,
    }));
  };

  const handleInputChangeTextArea = (
    value: string,
    stateKey: keyof AssignHod
  ) => {
    setReasons((prevState: any) => ({
      ...prevState,
      [stateKey]: value,
    }));
    setValidationErrors((prevState) => ({
      ...prevState,
      [stateKey]: false,
    }));
  };

  const validate = (): boolean => {
    const errors: ValidationError = {
      Comments: !Reasons.Comments.trim(),
      PositionID: selectedPosition === null,
    };
    setValidationErrors(errors);
    return Object.values(errors).every((error) => !error);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    onAssign({
      positionId: selectedPosition,
      Reasons: Reasons.Comments,
    });

    handleClose();
  };

  return (
    <Dialog
      open={visible}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "26px",
          fontFamily: `"Segoe UI", "Segoe UI Web (West European)", "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif`,
        },
      }}
      sx={{ overflow: "hidden" }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "16px 24px",
          color: ColorCode.LabelStyleColorCode.LabelStyleColor,
          fontWeight: "bold",
          position: "relative",
          marginTop: "8px",
        }}
      >
        <span style={{ flexGrow: 1, textAlign: "center" }}>
          Assign Position ID
        </span>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 1, marginTop: "-11px" }}>
          <div style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", marginBottom: "16px" }}>
              <span
                style={{ width: "127px", fontWeight: "bold", color: "black" }}
              >
                Job Title
              </span>
              <span
                style={{
                  marginLeft: "8px",
                  fontWeight: "bold",
                  color: "black",
                }}
              >
                -
              </span>
              <span
                style={{
                  marginLeft: "31px",
                  fontWeight: "bold",
                  color: "black",
                }}
              >
                {candidateData?.PositionTitle ?? "N/A"}
              </span>
            </div>
            <div style={{ display: "flex", marginBottom: "16px" }}>
              <span
                style={{ width: "127px", fontWeight: "bold", color: "black" }}
              >
                Candidate Name
              </span>
              <span
                style={{
                  marginLeft: "8px",
                  fontWeight: "bold",
                  color: "black",
                }}
              >
                -
              </span>
              <span
                style={{
                  marginLeft: "31px",
                  fontWeight: "bold",
                  color: "black",
                }}
              >
                {candidateData?.FullName ?? "N/A"}
              </span>
            </div>
          </div>

          <div className="ms-Grid-row" style={{ textAlign: "left" }}>
            <div className="ms-Grid-col ms-lg6">
              <CustomAutoComplete
                label="Assign PositionID"
                options={positionOptions}
                value={selectedPosition}
                onChange={(item: AutoCompleteItem | null) =>
                  handleAutoComplete(item)
                }
                error={validationErrors.PositionID}
                disabled={false}
                mandatory={true}
                placeholder="Select a position"
              />
            </div>
          </div>

          <CustomTextArea
            label="Reasons"
            value={Reasons.Comments}
            onChange={(value) => handleInputChangeTextArea(value, "Comments")}
            error={validationErrors.Comments}
            placeholder="Enter Reasons"
            mandatory={true}
          />
        </DialogContent>

        <DialogActions
          sx={{ p: 3, pt: 0, display: "flex", justifyContent: "center" }}
        >
          <Button
            onClick={handleClose}
            variant="outlined"
            sx={{
              borderColor:  ColorCode.ButtonColorCode.ButtonColor,
              color:  ColorCode.ButtonColorCode.color,
              backgroundColor:  ColorCode.ButtonColorCode.ButtonColor,
              textTransform: "capitalize",
              mr: 2.5,
              "&:hover": {
                borderColor:  ColorCode.ButtonColorCode.ButtonColor,
                backgroundColor:  ColorCode.ButtonColorCode.ButtonColor,
                color: ColorCode.ButtonColorCode.color,
              },
            }}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="outlined"
            sx={{
              borderColor:  ColorCode.ButtonColorCode.ButtonColor,
              color:  ColorCode.ButtonColorCode.color,
              backgroundColor:  ColorCode.ButtonColorCode.ButtonColor,
              textTransform: "capitalize",
              mr: 2.5,
              "&:hover": {
                borderColor:  ColorCode.ButtonColorCode.ButtonColor,
                backgroundColor:  ColorCode.ButtonColorCode.ButtonColor,
                color: ColorCode.ButtonColorCode.color,
              },
            }}
          >
            Assign
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
