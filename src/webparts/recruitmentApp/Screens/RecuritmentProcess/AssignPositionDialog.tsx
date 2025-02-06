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
  open: boolean;
  onClose: () => void;
  jobTitle: string;
  candidateName: string;
}

export const AssignPositionDialog = ({
  open,
  onClose,
  jobTitle,
  candidateName,
}: AssignPositionDialogProps) => {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          borderBottom: "1px solid #e0e0e0",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "red",
          padding: "16px 24px",
        }}
      >
        Assign Position ID
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 3 }}>
          <div style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", marginBottom: "16px" }}>
              <span style={{ width: "150px", color: "#666" }}>Job Title</span>
              <span style={{ marginLeft: "8px" }}>- {jobTitle}</span>
            </div>
            <div style={{ display: "flex" }}>
              <span style={{ width: "150px", color: "#666" }}>
                Candidate Name
              </span>
              <span style={{ marginLeft: "8px" }}>- {candidateName}</span>
            </div>
          </div>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel required>Assign Position ID</InputLabel>
            <Select label="Assign Position ID" required defaultValue="">
              <MenuItem value="POS001">POS001</MenuItem>
              <MenuItem value="POS002">POS002</MenuItem>
              <MenuItem value="POS003">POS003</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Reasons"
            multiline
            rows={4}
            fullWidth
            required
            placeholder="Enter reasons"
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={onClose}
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
          >
            Assign
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
