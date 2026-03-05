import * as React from "react";
import { Box, Button, Tooltip, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CustomInput from "../../components/CustomInput";
import { ColorCode } from "../../utilities/Config";
import { OptionRow } from "./Hooks/Interviewtypes";

interface Props {
  options: OptionRow[];
  validationError?: string | boolean;
  onOptionChange: (index: number, val: string, lang: "en" | "fr") => void;
  onSelectAnswer: (index: number) => void;
  onAddRow: () => void;
  onDeleteRow: (index: number) => void;
}


const OptionRowList: React.FC<Props> = React.memo(
  ({ options, validationError, onOptionChange, onSelectAnswer, onAddRow, onDeleteRow }) => {
    if (options.length === 0) {
      return <Typography color="error">No options available.</Typography>;
    }

    return (
      <Box sx={{ mb: 3 }}>
        {options.map((option, index) => {
          const isLast = index === options.length - 1;
          const hasValidationIssue = option.textvalidation || option.textvalidationFr;

          return (
            <Box
              key={index}
              sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", mb: 2, gap: 1 }}
            >
              {/* Label */}
              <Typography variant="body1" sx={{ minWidth: 80, textAlign: "right", pr: 1 }}>
                Option {index + 1} *
              </Typography>

              {/* Inputs */}
              <Box sx={{ display: "flex", gap: 1, width: "77%" }}>
                <Box sx={{ flex: 1 }}>
                  <CustomInput
                    label="Option (EN)"
                    placeHolder="Enter your text (maximum 155 characters)"
                    value={option.text}
                    onChange={(val) => onOptionChange(index, val, "en")}
                  />
                  {option.textvalidation && (
                    <Typography color="error" sx={{ fontSize: 12, mt: 0.5 }}>
                      English input exceeds 155 characters.
                    </Typography>
                  )}
                  {option.fieldValidation && (
                    <Typography color="error" sx={{ fontSize: 12, mt: 0.5 }}>
                      English field is required.
                    </Typography>
                  )}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <CustomInput
                    label="Option (FR)"
                    placeHolder="Entrez le texte (maximum 155 caractères)"
                    value={option.textFr ?? ""}
                    onChange={(val) => onOptionChange(index, val, "fr")}
                  />
                  {option.textvalidationFr && (
                    <Typography color="error" sx={{ fontSize: 12, mt: 0.5 }}>
                      French input exceeds 155 characters.
                    </Typography>
                  )}
                  {option.fieldValidationFr && (
                    <Typography color="error" sx={{ fontSize: 12, mt: 0.5 }}>
                      French field is required.
                    </Typography>
                  )}
                </Box>
              </Box>

              {/* Correct-answer toggle */}
              <Box
                onClick={() => onSelectAnswer(index)}
                sx={{
                  backgroundColor: option.isCorrect ? "#4CAF50" : "#D3D3D3",
                  borderRadius: "50%",
                  width: 30,
                  height: 30,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: option.isCorrect
                    ? "0px 0px 5px rgba(0, 128, 0, 0.5)"
                    : "0px 0px 5px rgba(0, 0, 0, 0.2)",
                  transition: "all 0.3s ease-in-out",
                  mt: hasValidationIssue ? 0 : "3%",
                }}
              >
                <Tooltip title="Select the correct answer">
                  <CheckCircleOutlineIcon
                    sx={{ color: option.isCorrect ? "white" : "black", fontSize: 24 }}
                  />
                </Tooltip>
              </Box>

              {/* Add / Delete */}
              <Box sx={{ display: "flex", gap: 1, mt: hasValidationIssue ? 0 : "3%" }}>
                {options.length > 1 && (
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: ColorCode.ButtonColorCode.ButtonColor,
                      minWidth: 40,
                      "&:hover": { backgroundColor: ColorCode.ButtonColorCode.ButtonColor },
                    }}
                    onClick={() => onDeleteRow(index)}
                  >
                    <DeleteOutlineIcon sx={{ fontSize: 20 }} />
                  </Button>
                )}
                {isLast && (
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: ColorCode.ButtonColorCode.ButtonColor,
                      minWidth: 40,
                      "&:hover": { backgroundColor: ColorCode.ButtonColorCode.ButtonColor },
                    }}
                    onClick={onAddRow}
                  >
                    <AddIcon />
                  </Button>
                )}
              </Box>
            </Box>
          );
        })}

        {validationError && (
          <Typography color="error">{String(validationError)}</Typography>
        )}
      </Box>
    );
  },
);

OptionRowList.displayName = "OptionRowList";
export default OptionRowList;