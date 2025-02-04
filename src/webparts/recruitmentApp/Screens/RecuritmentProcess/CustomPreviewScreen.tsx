import * as React from "react";
import { AdvDetails } from "../../Models/RecuritmentVRR";
import ReuseButton from "../../components/ReuseButton";
import LabelHeaderComponents from "../../components/TitleHeader";
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";

interface FormFields {
  data: AdvDetails;
  onclose: () => void;
  Ok_btnfn: () => void;
}

function CustomPreviewScreen({ data, onclose, Ok_btnfn }: FormFields) {
  console.log("Received data in PreviewScreen:", data);

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
                <div className="ms-Grid-col ms-lg12">
                  <LabelHeaderComponents value="Advertisement" />
                </div>
              </div>

              {data.RolePurpose && (
                <div className="ms-Grid-row">
                  <div className="ms-Grid-col ms-lg12">
                    <p>
                      <b style={{ fontSize: "17px" }}>Role Purpose:</b>{" "}
                      <span
                        dangerouslySetInnerHTML={{ __html: data.RolePurpose }}
                      />
                    </p>
                  </div>
                </div>
              )}

              {data.JobDescription && (
                <div className="ms-Grid-row">
                  <div className="ms-Grid-col ms-lg12">
                    <p>
                      <b style={{ fontSize: "17px" }}>Job Description:</b>{" "}
                      <span
                        dangerouslySetInnerHTML={{
                          __html: data.JobDescription,
                        }}
                      />
                    </p>
                  </div>
                </div>
              )}

              {data.RoleSpeKnowledgeoption?.length > 0 && (
                <div className="ms-Grid-row" style={{ marginBottom: "20px" }}>
                  <div className="ms-Grid-col ms-lg12">
                    <b style={{ fontSize: "17px" }}>Role Specific Knowledge:</b>
                    <div className="ms-Grid-row">
                      {data.RoleSpeKnowledgeoption?.map((item, index) => (
                        <div
                          key={index}
                          style={{ display: "flex", marginTop: "8px" }}
                        >
                          <div className="ms-Grid-col ms-lg4">{item}</div>
                          <div
                            className="ms-Grid-col ms-lg1"
                            style={{ textAlign: "center" }}
                          >
                            {data.RequiredLeveloption?.[index] && (
                              <span>-</span>
                            )}
                          </div>
                          <div className="ms-Grid-col ms-lg4">
                            {data.RequiredLeveloption?.[index]}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {data.MinQualificationOption?.length > 0 && (
                <div className="ms-Grid-row" style={{ marginBottom: "20px" }}>
                  <div className="ms-Grid-col ms-lg12">
                    <b style={{ fontSize: "17px" }}>Minimum Qualification:</b>
                    <div className="ms-Grid-row">
                      {data.MinQualificationOption.map((item, index) => (
                        <div
                          key={index}
                          style={{ display: "flex", marginTop: "8px" }}
                        >
                          <div className="ms-Grid-col ms-lg4">{item.text}</div>
                          <div
                            className="ms-Grid-col ms-lg1"
                            style={{ textAlign: "center" }}
                          >
                            {data.PrefeQualificationOption?.[index] && (
                              <span>-</span>
                            )}
                          </div>
                          <div className="ms-Grid-col ms-lg4">
                            {data.PrefeQualificationOption?.[index]?.text}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {(data.TotalExperience || data.ExperienceinMiningIndustry) && (
                <div className="ms-Grid-row" style={{ marginBottom: "20px" }}>
                  <div className="ms-Grid-col ms-lg12">
                    <b style={{ fontSize: "17px" }}>Total Experience:</b>
                    <div className="ms-Grid-row">
                      <div style={{ display: "flex", marginTop: "8px" }}>
                        {data.TotalExperience && (
                          <div className="ms-Grid-col ms-lg4">
                            {data.TotalExperience} years
                          </div>
                        )}
                        {data.TotalExperience &&
                          data.ExperienceinMiningIndustry && (
                            <div
                              className="ms-Grid-col ms-lg1"
                              style={{ textAlign: "center" }}
                            >
                              <span>-</span>
                            </div>
                          )}
                        {data.ExperienceinMiningIndustry && (
                          <div className="ms-Grid-col ms-lg4">
                            {data.ExperienceinMiningIndustry} years in Mining
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {data.TechnicalSkillsOption?.length > 0 && (
                <div className="ms-Grid-row" style={{ marginBottom: "20px" }}>
                  <div className="ms-Grid-col ms-lg12">
                    <b style={{ fontSize: "17px" }}>Technical Skills:</b>
                    <div className="ms-Grid-row">
                      {data.TechnicalSkillsOption.map((item, index) => (
                        <div
                          key={index}
                          style={{ display: "flex", marginTop: "8px" }}
                        >
                          <div className="ms-Grid-col ms-lg4">{item.text}</div>
                          <div
                            className="ms-Grid-col ms-lg1"
                            style={{ textAlign: "center" }}
                          >
                            {data.LevelProficiencyOption?.[index] && (
                              <span>-</span>
                            )}
                          </div>
                          <div className="ms-Grid-col ms-lg4">
                            {data.LevelProficiencyOption?.[index]?.text}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        <div
          className="ms-Grid-row"
          style={{
            marginBottom: "2%",
            marginTop: "1%",
            marginRight: "1%",
          }}
        >
          <div
            className="ms-Grid-col ms-lg12"
            style={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <div style={{ marginRight: "10px" }}>
              <ReuseButton label="Cancel" onClick={onclose} spacing={4} />
            </div>

            <div style={{ marginRight: "10px" }}>
              <ReuseButton label="OK" onClick={Ok_btnfn} spacing={4} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CustomPreviewScreen;
