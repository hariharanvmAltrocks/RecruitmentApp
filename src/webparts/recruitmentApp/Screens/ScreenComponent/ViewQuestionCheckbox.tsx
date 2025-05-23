import * as React from "react";
import LabelHeaderComponents from "../../components/TitleHeader";
import SignatureCheckbox from "../../components/SignatureCheckbox";
import { AutoCompleteItem } from "../../Models/Screens";
import { OptionRow } from "../ReviewProfile/InterviewQuesEdit";
import ReuseButton from "../../components/ReuseButton";
import { ColorCode } from "../../utilities/Config";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

export type ViewQuestion = {
  id: number;
  Checked: boolean;
  header?: string;
  HeaderLabel?: string;
  discipline: AutoCompleteItem;
  questionType: AutoCompleteItem;
  question: string;
  expectedAnswer: any;
  options?: OptionRow[];
  Disqualification: string;
  CareerportalAnswer: OptionRow[];
  Type?: string;
};

interface FormFields {
  questionnaire: ViewQuestion[];
  Disciplines: string;
  handleCheckbox: (id: number, value: boolean) => void;
  Reusequestion_fn: () => void;
  onClose: () => void;
}

function ViewQuestionCheckbox({
  questionnaire,
  Disciplines,
  handleCheckbox,
  Reusequestion_fn,
  onClose,
}: FormFields) {
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
                <LabelHeaderComponents
                  value={"Disciplines  - " + Disciplines}
                />
              </div>
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
                      <div key={q.id} style={{ marginBottom: "15px" }}>
                        <h3 style={{ fontWeight: "bold" }}>
                          <div>
                            <SignatureCheckbox
                              label={""}
                              checked={q.Checked === true}
                              onChange={(value: boolean) =>
                                handleCheckbox(q.id, value)
                              }
                            />
                            <span>Q{index + 1}:</span>

                            <span
                              style={{
                                display: "inline-block",
                                marginLeft: "1%",
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
                        </h3>
                        <p>
                          <strong>Expected Answer:</strong>
                          {q.expectedAnswer
                            .map((item: any, index: number) => (
                              <span
                                key={index}
                                dangerouslySetInnerHTML={{
                                  __html: item
                                    ? item
                                        .replace(/<p>/gi, "")
                                        .replace(/<\/p>/gi, "")
                                        .replace(/<br\s*\/?>/gi, "")
                                        .trim()
                                    : "",
                                }}
                              />
                            ))
                            .reduce((prev: any, curr: any) => [
                              prev,
                              " , ",
                              curr,
                            ])}
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
            <div className="ms-Grid-col ms-lg1" style={{ marginRight: "10px" }}>
              <ReuseButton
                label="Back"
                onClick={onClose}
                Style={{
                  backgroundColor: ColorCode.ButtonColorCode.ButtonColor,
                  color: "white",
                  width: "50%",
                }}
              />
            </div>
            {questionnaire.length === 0 ? (
              <></>
            ) : (
              <>
                <div
                  className="ms-Grid-col ms-lg1"
                  style={{ marginRight: "10px" }}
                >
                  <ReuseButton
                    label="Reuse"
                    onClick={async () => {
                      Reusequestion_fn();
                    }}
                    Style={{
                      backgroundColor: ColorCode.ButtonColorCode.ButtonColor,
                      color: "white",
                      width: "50%",
                    }}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ViewQuestionCheckbox;
