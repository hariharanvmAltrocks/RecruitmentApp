import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface AssignPositionDialogProps {
  visible: boolean;
  onHide: () => void;
  candidateData: {
    FullName: string;
    PositionTitle: string;
    JobCode: string;
  } | null;
  onAssign: (data: { positionId: string; reasons: string }) => void;
}

export const AssignPositionDialog = ({
  visible,
  onHide,
  candidateData,
  onAssign,
}: AssignPositionDialogProps) => {
  const [selectedPositionId, setSelectedPositionId] = React.useState("");
  const [reasons, setReasons] = React.useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onAssign({
      positionId: selectedPositionId,
      reasons,
    });
  };

  return (
    <Dialog open={visible} onClose={onHide} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          borderBottom: "1px solid #e0e0e0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 24px",
        }}
      >
        Assign Position ID
        <IconButton onClick={onHide} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 3 }}>
          <div style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", marginBottom: "16px" }}>
              <span style={{ width: "150px", color: "black" }}>Job Title</span>
              <span style={{ marginLeft: "8px" }}>
                - {candidateData?.PositionTitle || "N/A"}
              </span>
            </div>
            <div style={{ display: "flex" }}>
              <span style={{ width: "150px", color: "black" }}>
                Candidate Name
              </span>
              <span style={{ marginLeft: "8px" }}>
                - {candidateData?.FullName || "N/A"}
              </span>
            </div>
          </div>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel required>Job Code</InputLabel>
            <Select
              value={selectedPositionId}
              onChange={(e) => setSelectedPositionId(e.target.value)}
              required
            >
              {candidateData?.JobCode ? (
                <MenuItem value={candidateData.JobCode}>
                  {candidateData.JobCode}
                </MenuItem>
              ) : (
                <MenuItem disabled>No Job Code Available</MenuItem>
              )}
            </Select>
          </FormControl>

          <TextField
            label="Reasons"
            multiline
            rows={4}
            fullWidth
            required
            placeholder="Enter reasons"
            value={reasons}
            onChange={(e) => setReasons(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={onHide}
            variant="outlined"
            sx={{
              borderColor: "#EF3340",
              color: "#EF3340",
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
              "&:hover": {
                bgcolor: "#d91a2a",
              },
            }}
            disabled={!selectedPositionId || !reasons}
          >
            Assign
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
