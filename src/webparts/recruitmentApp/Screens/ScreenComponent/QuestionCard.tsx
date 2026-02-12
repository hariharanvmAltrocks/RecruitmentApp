import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import SignatureCheckbox from "../../components/SignatureCheckbox";
import { Box, Accordion, AccordionSummary, AccordionDetails, Typography, Button } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ColorCode } from "../../utilities/Config";
import { ViewQuestion } from "./ViewQuestionCheckbox";

type QuestionCardProps = {
  questions: ViewQuestion[];
  handleCheckbox?: (id: number, value: boolean) => void;
  handleRemove?: (index: number) => void;
  expandable?: boolean;
};

export default function QuestionCard({
  questions,
  handleCheckbox,
  handleRemove,
  expandable = false,
}: QuestionCardProps) {
  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <Card sx={{ mb: 2, borderRadius: "4px", boxShadow: "0px 0px 4px 4px rgba(0,0,0,.1)" }}>
      <CardContent sx={{ maxHeight: expandable && expandedIndex === null ? 250 : "auto", overflowY: "auto" }}>
        {questions.map((q, index) => {
          if (expandable) {
            const isExpanded = expandedIndex === index;
            return (
              <Box key={q.id} sx={{ mb: 2 }}>
                <Accordion expanded={isExpanded} onChange={() => toggleExpand(index)} sx={{ boxShadow: "none" }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>{q.HeaderLabel}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div dangerouslySetInnerHTML={{ __html: q.question }} />
                    <p><strong>Expected Answer:</strong> <span dangerouslySetInnerHTML={{ __html: q.expectedAnswer }} /></p>
                    {handleRemove && (
                      <Box sx={{ display: "flex", justifyContent: "end" }}>
                        <Button
                          variant="contained"
                          sx={{
                            backgroundColor: ColorCode.ButtonColorCode.ButtonColor,
                            color: "white",
                            "&:hover": { backgroundColor: ColorCode.ButtonColorCode.ButtonColor },
                            textTransform: "none",
                            borderRadius: "4px",
                            px: 3,
                          }}
                          onClick={(e) => { e.stopPropagation(); handleRemove(index); }}
                        >
                          Remove
                        </Button>
                      </Box>
                    )}
                  </AccordionDetails>
                </Accordion>
              </Box>
            );
          } else {
            return (
              <Box key={q.id} sx={{ border: "1px solid #e0e0e0", borderRadius: "6px", p: 2, mb: 2 }}>
                {handleCheckbox && (
                  <SignatureCheckbox
                    checked={q.Checked}
                    onChange={(value) => handleCheckbox(q.id, value)}
                  />
                )}
                <div dangerouslySetInnerHTML={{ __html: q.question }} />
                <div style={{ backgroundColor: "#f8fafc", padding: "12px", borderRadius: "6px" }}>
                  <strong>Expected Answer:</strong> {q.expectedAnswer?.join(", ")}
                </div>
              </Box>
            );
          }
        })}
      </CardContent>
    </Card>
  );
}
