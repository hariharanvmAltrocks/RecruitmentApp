
import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import SignatureCheckbox from "../../components/SignatureCheckbox";
import LabelHeaderComponents from "../../components/TitleHeader";
import ReuseButton from "../../components/ReuseButton";
import { ColorCode } from "../../utilities/Config";
import { ButtonAction } from "../../utilities/LabelName";
import { AutoCompleteItem } from "../../Models/Screens";
import { OptionRow } from "../ReviewProfile/InterviewQuesEdit";

export type ViewQuestion = {
  id: number;
  Checked: boolean;
  header?: string;
  HeaderLabel?: string;
  discipline: AutoCompleteItem;
  questionType: AutoCompleteItem;
  question: string;
  questionFr?: string;
  expectedAnswer: any;
  options?: OptionRow[];
  Disqualification: string;
  CareerportalAnswer: OptionRow[];
  Type?: string;
  expectedAnswerFr?: any;
};

interface FormFields {
  questionnaire: ViewQuestion[];
  Disciplines: string;
  handleCheckbox: (id: number, value: boolean) => void;
  Reusequestion_fn: () => void;
  onClose: () => void;
}

const badgeStyle = (bg: string, color: string) => ({
  backgroundColor: bg,
  color,
  padding: "4px 10px",
  borderRadius: "4px",
  fontSize: "12px",
  marginLeft: "6px",
  fontWeight: 600,
});

function ViewQuestionCheckbox({
  questionnaire,
  Disciplines,
  handleCheckbox,
  Reusequestion_fn,
  onClose,
}: FormFields) {
  return (
    <div style={{ padding: "2%" }}>
      <Card
        sx={{
          width: "100%",
          height: "calc(80vh - 120px)",
          boxShadow: "0px 2px 4px 3px #d3d3d3",
        }}
      >
        <CardContent sx={{ height: "100%", padding: 2 }}>
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <LabelHeaderComponents value={`Disciplines - ${Disciplines}`} />
            <LabelHeaderComponents value="Questions and Answers" />
          </div>

          <div
            style={{
              height: "calc(100% - 140px)",
              overflowY: "auto",
              overflowX: "hidden",
              paddingRight: "8px",
            }}
          >
            {questionnaire.length === 0 ? (
              <p
                style={{
                  textAlign: "center",
                  color: "gray",
                  fontWeight: "bold",
                }}
              >
                No Questions and Answers are found
              </p>
            ) : (
              questionnaire.map((q, index) => (
                <div
                  key={q.id}
                  style={{
                    border: "1px solid #e0e0e0",
                    borderRadius: "6px",
                    padding: "9px",
                    marginBottom: "16px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <SignatureCheckbox
                        checked={q.Checked}
                        onChange={(value) => handleCheckbox(q.id, value)}
                      />
                      <strong
                      //  style={{ marginLeft: 8 }}
                      >
                        QUESTION {index + 1}
                      </strong>
                    </div>

                    <div>
                      {q.Disqualification && (
                        <span style={badgeStyle("#fdecea", "#d93025")}>
                          {q.Disqualification === "Yes"
                            ? "Disqualifying"
                            : q.Disqualification}
                        </span>
                      )}
                      {q.Type && (
                        <span style={badgeStyle("#e8f0fe", "#1a73e8")}>
                          {q.Type}
                        </span>
                      )}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "24px",
                      marginTop: "16px",
                    }}
                  >
                    <div>
                      <span
                        style={{
                          fontSize: 12,
                          color: "#6b7280",
                          display: "block",
                          marginBottom: "8px",
                        }}
                      >
                        QUESTION ENGLISH
                      </span>

                      <div
                        style={{
                          fontWeight: 600,
                          marginBottom: "12px",
                          lineHeight: "1.6",
                        }}
                        dangerouslySetInnerHTML={{
                          __html: q.question
                            ?.replace(/<p>|<\/p>|<br\s*\/?>/gi, "")
                            .trim(),
                        }}
                      />

                      <div
                        style={{
                          backgroundColor: "#f8fafc",
                          padding: "12px",
                          borderRadius: "6px",
                        }}
                      >
                        <strong
                          style={{ display: "block", marginBottom: "4px" }}
                        >
                          Expected Answer
                        </strong>
                        <div>{q.expectedAnswer?.join(", ")}</div>
                      </div>
                    </div>

                    {q.questionFr && (
                     <div>
  <span
    style={{
      fontSize: 12,
      color: "#6b7280",
      display: "block",
      marginBottom: "8px",
    }}
  >
    QUESTION FRANÇAISE
  </span>

  <div
    style={{
      fontWeight: 600,
      marginBottom: "12px",
      lineHeight: "1.6",
    }}
    dangerouslySetInnerHTML={{
      __html: q.questionFr
        ?.replace(/<p>|<\/p>|<br\s*\/?>/gi, "")
        .trim(),
    }}
  />

  <div
    style={{
      backgroundColor: "#f8fafc",
      padding: "12px",
      borderRadius: "6px",
    }}
  >
    <strong style={{ display: "block", marginBottom: "4px" }}>
      Expected Answer
    </strong>
    <div>{q.expectedAnswerFr?.join(", ")}</div>
  </div>
</div>

                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 10,
              marginTop: 12,
            }}
          >
            <ReuseButton
              label={ButtonAction.Back}
              onClick={onClose}
              Style={{
                backgroundColor: ColorCode.ButtonColorCode.ButtonColor,
                color: "white",
              }}
            />

            {questionnaire.length > 0 && (
              <ReuseButton
                label="Reuse"
                onClick={Reusequestion_fn}
                Style={{
                  backgroundColor: ColorCode.ButtonColorCode.ButtonColor,
                  color: "white",
                }}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ViewQuestionCheckbox;
