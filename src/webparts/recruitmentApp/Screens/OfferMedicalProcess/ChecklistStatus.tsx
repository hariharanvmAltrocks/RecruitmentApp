import * as React from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Popover,
} from "@mui/material";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import "./Checklist.css";

interface StatusBarProps {
  checklist: { [key: string]: boolean }; // your checklist values
}

const StatusBar: React.FC<StatusBarProps> = ({ checklist }) => {
  const steps = Object.keys(checklist);
  const completedCount = steps.filter((step) => checklist[step]).length;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const open = Boolean(anchorEl);

  return (
    <div>
      <Box
        className="StatusBar-container"
        onClick={handleOpen}
        sx={{
          textAlign: "center",
          p: 2,
          cursor: "pointer",
          borderRadius: 3,
          boxShadow: 2,
          width: 53,
        }}
      >
        <Typography variant="body1" sx={{ mb: 1, marginTop: "-20%" }}>
          Status
        </Typography>
        <div className="circularpercentage-container">
          <CircularProgressbar
            value={(completedCount / steps.length) * 100}
            text={`${completedCount}/${steps.length}`}
            styles={buildStyles({
              textColor: "green",
              pathColor: "green",
              trailColor: "#e0e0e0",
            })}
            className="circularpercentage"
          />
        </div>
      </Box>

      {/* Popover List */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Box sx={{ p: 2, width: 250 }}>
          <Stepper orientation="vertical">
            {steps.map((label, index) => {
              const isDone = checklist[label];

              return (
                <Step key={index} active>
                  <StepLabel
                    icon={
                      isDone ? (
                        <CheckCircleIcon sx={{ color: "green" }} />
                      ) : (
                        <RadioButtonUncheckedIcon sx={{ color: "gray" }} />
                      )
                    }
                  >
                    <Typography
                      variant="body1"
                      sx={{ color: isDone ? "green" : "gray" }}
                    >
                      {label}
                    </Typography>
                  </StepLabel>
                </Step>
              );
            })}
          </Stepper>
        </Box>
      </Popover>
    </div>
  );
};

export default StatusBar;
