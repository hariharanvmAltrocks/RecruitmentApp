import * as React from "react";
import { QuestionItem } from "../../Models/RecuritmentVRR";
import ReuseButton from "../../components/ReuseButton";
import LabelHeaderComponents from "../../components/TitleHeader";
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";

interface FormFields {
  questionnaire: QuestionItem[];
  Ok_btnfn: () => void;
}

function HODQuestionsView({ questionnaire, Ok_btnfn }: FormFields) {
  return (
    <>
      <div className="ms-Grid-row">
        <Card
          variant="outlined"
          sx={{
            boxShadow: "0px 2px 4px 3px #d3d3d3",
            marginTop: "2%",
            width: "97%",
            marginLeft: "2%",
          }}
        >
          <CardContent>
            <div style={{ padding: "2%" }}>
              <div className="ms-Grid-row" style={{ textAlign: "center" }}>
                <div
                  className="ms-Grid-col ms-lg12"
                  style={{ fontSize: "22px" }}
                >
                  <LabelHeaderComponents value="Questions and Answers" />
                </div>
              </div>
              <div className="ms-Grid-row">
                <div style={{ marginTop: "20px" }}>
                  {questionnaire.length === 0 ? (
                    <p
                      style={{
                        fontSize: "15px",
                        fontWeight: "bold",
                        color: "gray",
                        textAlign: "center",
                      }}
                    >
                      No Questions and Answers are found
                    </p>
                  ) : (
                    questionnaire.map((q, index) => (
                      <div
                        key={q.id}
                        style={{ marginBottom: "15px", fontSize: "17px" }}
                      >
                        <h3 style={{ fontWeight: "bold" }}>
                          Q{index + 1}: {q.question}
                        </h3>
                        <p>
                          <strong>Expected Answer:</strong> {q.answer}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div
          className="ms-Grid-row"
          style={{ marginBottom: "2%", marginTop: "1%", marginRight: "1%" }}
        >
          <div
            className="ms-Grid-col ms-lg12"
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <div style={{ marginRight: "10px" }}>
              <ReuseButton label="Close" onClick={Ok_btnfn} spacing={4} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default HODQuestionsView;
