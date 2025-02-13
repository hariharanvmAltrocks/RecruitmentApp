import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  FormControl,
  IconButton,
  InputAdornment,
  OutlinedInput,
  FormLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CustomTextArea from "../../components/CustomTextArea";

interface AssignPositionDialogProps {
  visible: boolean;
  onHide: () => void;
  candidateData: {
    FullName: string;
    PositionTitle: string;
    JobCode: string;
  } | null;
  onAssign: (data: { positionId: string; justification: string }) => void;
}
export const AssignPositionDialog = ({
  visible,
  onHide,
  candidateData,
  onAssign,
}: AssignPositionDialogProps) => {
  const [selectedJobCode, setSelectedJobCode] = React.useState("");

  const jobCodeOptions = [
    { id: "JC001", label: "JC001" },
    { id: "JC002", label: "JC002" },
    { id: "JC003", label: "JC003" },
    { id: "JC004", label: "JC004" },
    { id: "JC005", label: "JC005" },
    { id: "JC004", label: "JC006" },
    { id: "JC005", label: "JC007" },
    { id: "JC004", label: "JC008" },
    { id: "JC005", label: "JC009" },
    { id: "JC004", label: "JC0010" },
  ];

  const [justification, setJustification] = React.useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onAssign({
      positionId: selectedJobCode,
      justification,
    });
  };

  return (
    <Dialog
      open={visible}
      onClose={onHide}
      maxWidth="sm"
      fullWidth
      sx={{
        "& .MuiPaper-root": {
          borderRadius: "26px",
          fontFamily: `"Segoe UI", "Segoe UI Web (West European)", "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif`,
        },
        overflow: "hidden",
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "16px 24px",
          color: "#EF3340",
          fontWeight: "bold",
          position: "relative",
          marginTop: "8px",
          fontFamily: `"Segoe UI", "Segoe UI Web (West European)", "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif`,
        }}
      >
        <span style={{ flexGrow: 1, textAlign: "center" }}>
          Assign Position ID
        </span>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent
          sx={{
            pt: 1,
            marginTop: "-11px",
            fontFamily: `"Segoe UI", "Segoe UI Web (West European)", "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif`,
          }}
        >
          <div style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", marginBottom: "16px" }}>
              <span
                style={{
                  width: "127px",
                  fontWeight: "bold",
                  color: "black",
                }}
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
                style={{
                  width: "127px",
                  fontWeight: "bold",
                  color: "black",
                }}
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
          <FormControl sx={{ width: "300px" }}>
            <FormLabel
              sx={{
                fontSize: "14px",
                color: "rgb(54 53 52 / 100%)",
                fontWeight: 600,
                fontFamily:
                  '"Segoe UI", "Segoe UI Web (West European)", "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif',
                marginBottom: "4px",
                "&.Mui-focused": {
                  color: "rgb(54 53 52 / 100%) !important",
                },
              }}
            >
              Assign PositionID <span style={{ color: "red" }}>*</span>
            </FormLabel>

            <Select
              value={selectedJobCode}
              onChange={(e) => setSelectedJobCode(e.target.value)}
              displayEmpty
              input={
                <OutlinedInput
                  sx={{
                    height: "42px",
                    paddingRight: "32px",
                    color: "rgb(54 53 52 / 100%)",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgb(54 53 52 / 100%) !important",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgb(54 53 52 / 70%) !important",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgb(54 53 52 / 70%) !important",
                    },
                  }}
                  endAdornment={
                    selectedJobCode && (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setSelectedJobCode("")}
                          edge="end"
                          // sx={{ mr: 0.5 }}
                        >
                          <CloseIcon />
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                />
              }
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: "120px",
                    overflowY: "auto",
                  },
                },
              }}
            >
              {jobCodeOptions.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <CustomTextArea
            label="Reasons"
            value={justification}
            onChange={setJustification}
            error={false}
            placeholder="Enter Reasons"
            mandatory={true}
          />
        </DialogContent>

        {/* <DialogActions
          sx={{
            p: 3,
            pt: 0,
            display: "flex",
            justifyContent: "center",
            fontFamily: `"Segoe UI", "Segoe UI Web (West European)", "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif`,
          }}
        >
          <Button
            onClick={onHide}
            variant="outlined"
            sx={{
              borderColor: "#EF3340",
              color: "#EF3340",
              textTransform: "capitalize",
              "&:hover": {
                borderColor: "#EF3340",
                backgroundColor: "rgba(239, 51, 64, 0.04)",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{
              bgcolor: "#EF3340",
              ml: 2,
              textTransform: "capitalize", // Ensure first letter is capitalized
              "&:hover": {
                bgcolor: "#d91a2a",
              },
            }}
          >
            Assign
          </Button>
        </DialogActions> */}

        <DialogActions
          sx={{
            p: 3,
            pt: 0,
            display: "flex",
            justifyContent: "center",
            fontFamily: `"Segoe UI", "Segoe UI Web (West European)", "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif`,
          }}
        >
          <Button
            onClick={onHide}
            variant="outlined"
            sx={{
              borderColor: "#EF3340",
              color: "#EF3340",
              textTransform: "capitalize",
              mr: 2.5,
              "&:hover": {
                borderColor: "#EF3340",
                backgroundColor: "rgba(239, 51, 64, 0.1)",
              },
            }}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            sx={{
              bgcolor: "#EF3340",
              textTransform: "capitalize",
              "&:hover": {
                bgcolor: "#d91a2a",
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
