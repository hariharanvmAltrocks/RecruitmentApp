import * as React from "react";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { Label } from "@fluentui/react";
import { ColorCode, StatusId } from "../../utilities/Config";
import { memo } from "react";

interface Props {
  statusId: number;
  disciplineText: string;
  onViewQuestions: () => void;
  onNewQuestion: () => void;
}

/**
 * Displays the top header card with:
 *  - Dynamic title (Interview vs Career Portal)
 *  - Disciplines badge
 *  - View Questions / New Question buttons
 */
const QuestionnaireHeader: React.FC<Props> = memo(
  ({ statusId, disciplineText, onViewQuestions, onNewQuestion }) => {
    const isCareerPortal =
      statusId === StatusId.PendingwithLMcreateDisqualificationQuestion;

    return (
      <Card
        sx={{
          borderRadius: "4px",
          borderColor: "#5f5f5f",
          boxShadow: "0px 0px 4px 4px rgba(0,0,0,.1)",
          mb: 2,
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              flexWrap: "nowrap",
            }}
          >
            <Label
              style={{
                fontSize: "18px",
                color: "black",
                fontFamily: "Roboto, sans-serif",
                fontWeight: 600,
                whiteSpace: "nowrap",
              }}
            >
              {isCareerPortal
                ? "Career Portal Candidate Questionnaires"
                : "Interview Questionnaires"}
            </Label>

            <Box
              sx={{
                backgroundColor: "#eef6ff",
                borderRadius: "10px",
                px: 3,
                py: 1,
                minWidth: "280px",
                textAlign: "center",
                flexShrink: 0,
              }}
            >
              <Typography
                sx={{ fontSize: "11px", fontWeight: 600, color: "#2563eb", letterSpacing: "0.5px" }}
              >
                DISCIPLINES
              </Typography>
              <Typography sx={{ fontSize: "15px", fontWeight: 600, color: "#0f172a" }}>
                {disciplineText || "-"}
              </Typography>
            </Box>

            {/* Action buttons */}
            <Box sx={{ display: "flex", gap: 2, flexShrink: 0 }}>
              {(["View Questions", "New Question"] as const).map((label) => (
                <Button
                  key={label}
                  variant="contained"
                  sx={{
                    backgroundColor: ColorCode.ButtonColorCode.ButtonColor,
                    textTransform: "none",
                    borderRadius: "4px",
                    fontSize: "14px",
                    fontWeight: 500,
                    boxShadow: "none",
                    "&:hover": { backgroundColor: ColorCode.ButtonColorCode.ButtonColor },
                  }}
                  onClick={label === "View Questions" ? onViewQuestions : onNewQuestion}
                >
                  {label}
                </Button>
              ))}
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  },
);

QuestionnaireHeader.displayName = "QuestionnaireHeader";
export default QuestionnaireHeader;