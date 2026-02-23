import * as React from "react";
import { Card, CardContent } from "@mui/material";
import CustomAutoComplete from "../../components/CustomAutoComplete";
interface QuestionnaireSectionProps {
  questionnaire: any[];
  ScoreRating: { key: number; text: string }[];
  handleRatingChange: (id: number, value: { key: number; text: string } | null) => void;
  ratingErrors: Record<number, boolean>;
  labelNames: any;
}
const QuestionnaireSection: React.FC<QuestionnaireSectionProps> = ({
  questionnaire = [],
  ScoreRating = [],
  handleRatingChange,
  ratingErrors = {},
  labelNames = {},
})  => {

  const cleanHTML = (text = "") =>
    text
      .replace(/<p>/gi, "")
      .replace(/<\/p>/gi, "")
      .replace(/<br\s*\/?>/gi, "")
      .trim();

  if (questionnaire.length === 0) {
    return (
      <div style={{ marginTop: "20px", fontWeight: 600 }}>
        No interview questions available.
      </div>
    );
  }

  return (
    <div style={{ marginTop: "24px" }}>
      {questionnaire.map((q, index) => (
        <Card
          key={q.id || index}
          variant="outlined"
          sx={{
            mb: 3,
            borderRadius: "12px",
            border: "1px solid #e0e0e0",
            transition: "0.2s",
            "&:hover": {
              boxShadow: "0px 6px 18px rgba(0,0,0,0.12)",
            },
          }}
        >
          <CardContent sx={{ p: 2.5 }}>

            {/* Question */}
            <div
              style={{
                fontSize: "18px",
                fontWeight: 700,
                marginBottom: "12px",
              }}
            >
              Q{index + 1}:{" "}
              <span
                dangerouslySetInnerHTML={{
                  __html: cleanHTML(q?.question),
                }}
              />
            </div>

            {/* Expected Answer */}
            <div style={{ marginBottom: "18px" }}>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>
                {labelNames?.Questionnaires?.ExpectedAnswer ?? "Expected Answer"}
              </div>

              <div
                style={{
                  backgroundColor: "#f3f2f1",
                  padding: "14px",
                  borderRadius: "8px",
                }}
              >
                <span
                  dangerouslySetInnerHTML={{
                    __html: cleanHTML(q?.answer),
                  }}
                />
              </div>
            </div>

            {/* Rating */}
          <div style={{ width:"26%"}}>
             <CustomAutoComplete
              label={labelNames?.Questionnaires?.Rating ?? "Rating"}
              value={
                ScoreRating?.find(
                  (option) => option.key === q?.rating
                ) || null
              }
              options={ScoreRating}
              onChange={(value) =>
                handleRatingChange?.(q?.id, value)
              }
              error={ratingErrors?.[q?.id]}
              mandatory
              disabled={false}
            />

           </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default QuestionnaireSection;
