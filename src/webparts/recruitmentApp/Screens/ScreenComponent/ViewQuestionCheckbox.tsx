import * as React from "react";
import LabelHeaderComponents from "../../components/TitleHeader";
import SignatureCheckbox from "../../components/SignatureCheckbox";
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
  expectedAnswer: string;
  options?: OptionRow[];
  Disqualification: string;
  CareerportalAnswer: OptionRow[];
  Type?: string;
};

interface FormFields {
  questionnaire: ViewQuestion[];
  handleCheckbox: (id: number, value: boolean) => void;
}

function ViewQuestionCheckbox({ questionnaire, handleCheckbox }: FormFields) {
  return (
    <>
      <div className="ms-Grid-row">
        <div style={{ padding: "2%" }}>
          <div className="ms-Grid-row" style={{ textAlign: "center" }}>
            <div className="ms-Grid-col ms-lg12" style={{ fontSize: "22px" }}>
              <LabelHeaderComponents value="Questions and Answers" />
            </div>
          </div>
          <div className="ms-Grid-row">
            <div style={{ margin: "5%" }}>
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
                  <div key={q.id} style={{ marginBottom: "15px" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <SignatureCheckbox
                        label={""}
                        checked={q.Checked === true}
                        onChange={(value: boolean) =>
                          handleCheckbox(q.id, value)
                        }
                      />
                      <div>
                        <span>Q{index + 1}:</span>

                        <span
                          style={{
                            display: "inline-block",
                          }}
                          dangerouslySetInnerHTML={{
                            __html: `${
                              q.question
                                ? q?.question
                                    .replace(/<p>/gi, "")
                                    .replace(/<\/p>/gi, "")
                                    .replace(/<br\s*\/?>/gi, "")
                                    .trim()
                                : ""
                            }`,
                          }}
                        />
                      </div>
                    </div>
                    <p style={{ marginTop: "5px", marginLeft: "9%" }}>
                      <strong>Expected Answer:</strong>{" "}
                      <span
                        dangerouslySetInnerHTML={{
                          __html: q?.expectedAnswer,
                        }}
                      />
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ViewQuestionCheckbox;
