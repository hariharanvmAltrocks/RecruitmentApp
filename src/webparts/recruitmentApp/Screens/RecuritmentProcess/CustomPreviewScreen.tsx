import * as React from "react";
import { AdvDetails } from "../../Models/RecuritmentVRR";
import ReuseButton from "../../components/ReuseButton";
import LabelHeaderComponents from "../../components/TitleHeader";
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import CustomLabel from "../../components/CustomLabel";

interface FormFields {
  data: AdvDetails;
  onclose: () => void;
  Ok_btnfn: () => void;
  JobTitle: string;
}

function CustomPreviewScreen({
  data,
  onclose,
  Ok_btnfn,
  JobTitle,
}: FormFields) {
  // const ValidTo = data.ValidTo;
  // const ValidFrom = data.ValidFrom;
  const isEmptyData =
  !data ||
  !(
    data.RolePurpose &&
    data.JobDescription &&
    data.RoleSpeKnowledgeoption?.length &&
    data.MinQualificationOption?.length &&
    data.TechnicalSkillsOption?.length &&
    data.TotalExperience &&
    data.ExperienceinMiningIndustry
  );
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

              {isEmptyData ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "20px",
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: "gray",
                  }}
                >
                  No record found
                </div>
              ) : (
                <>
                  <div className="ms-Grid-row" style={{ textAlign: "center" }}>
                    <CustomLabel
                      value={`JobTitle - ${JobTitle}`}
                      style={{ fontSize: "17px", fontWeight: "bold" }}
                    />
                  </div>
                  {data.RolePurpose && (
                    <div className="ms-Grid-row">
                      <div
                        className="ms-Grid-col ms-lg12"
                        // style={{ marginBottom: "-7%" }}
                      >
                        <p>
                          <b style={{ fontSize: "17px" }}>Role Purpose:</b>{" "}
                          <span
                            dangerouslySetInnerHTML={{
                              __html: data.RolePurpose,
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  )}

                  {data.JobDescription && (
                    <div className="ms-Grid-row">
                      <div
                        className="ms-Grid-col ms-lg12"
                        // style={{ marginBottom: "-7%" }}
                      >
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
                  {/* 
                  {data.ValidFrom && data.ValidTo ? (
                    <div
                      className="ms-Grid-row"
                      style={{ marginBottom: "20px" }}
                    >
                      <div className="ms-Grid-col ms-lg12">
                        <div
                          className="ms-Grid-row"
                          // style={{ marginTop: "8px" }}
                        >
                          <div
                            style={{
                              display: "flex",
                              fontWeight: "bold",
                              marginBottom: "8px",
                            }}
                          >
                            <div className="ms-Grid-col ms-lg4">
                              <b style={{ fontSize: "17px" }}>Valid From</b>
                            </div>
                            <div
                              className="ms-Grid-col ms-lg1"
                              style={{ textAlign: "center" }}
                            ></div>
                            <div className="ms-Grid-col ms-lg4">
                              <b style={{ fontSize: "17px" }}>Valid To</b>
                            </div>
                          </div>

                          {data.ValidFrom && data.ValidTo && (
                            <div style={{ display: "flex", marginTop: "8px" }}>
                              <div className="ms-Grid-col ms-lg4">
                                {ValidFrom}
                              </div>
                              <div
                                className="ms-Grid-col ms-lg1"
                                style={{ textAlign: "center" }}
                              ></div>
                              <div className="ms-Grid-col ms-lg4">
                                {ValidTo}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : null} */}
                  {(data.TotalExperience ||
                    data.ExperienceinMiningIndustry) && (
                    <div
                      className="ms-Grid-row"
                      style={{ marginBottom: "20px" }}
                    >
                      <div className="ms-Grid-col ms-lg12">
                        <div
                          className="ms-Grid-row"
                          style={{ marginTop: "8px" }}
                        >
                          <div
                            style={{
                              display: "flex",
                              fontWeight: "bold",
                              marginBottom: "8px",
                            }}
                          >
                            <div className="ms-Grid-col ms-lg4">
                              <b style={{ fontSize: "17px" }}>
                                Preferred Total Experience
                              </b>
                            </div>
                            <div
                              className="ms-Grid-col ms-lg1"
                              style={{ textAlign: "center" }}
                            ></div>
                            <div className="ms-Grid-col ms-lg4">
                              <b style={{ fontSize: "17px" }}>
                                Preferred Experience in Mining Industry (Years)
                              </b>
                            </div>
                          </div>

                          <div style={{ display: "flex", marginTop: "8px" }}>
                            <div className="ms-Grid-col ms-lg4">
                              {data.TotalExperience
                                ? `${data.TotalExperience} years`
                                : ""}
                            </div>
                            <div
                              className="ms-Grid-col ms-lg1"
                              style={{ textAlign: "center" }}
                            >
                              {data.TotalExperience &&
                                data.ExperienceinMiningIndustry && (
                                  <span> </span>
                                )}
                            </div>
                            <div className="ms-Grid-col ms-lg4">
                              {data.ExperienceinMiningIndustry
                                ? `${data.ExperienceinMiningIndustry} years in Mining`
                                : ""}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {data.MinQualificationOption?.length > 0 && (
                    <>
                      <div
                        className="ms-Grid-row"
                        style={{ marginBottom: "20px" }}
                      >
                        <div className="ms-Grid-col ms-lg12">
                          <div
                            className="ms-Grid-row"
                            style={{ marginTop: "4px" }}
                          >
                            <div
                              style={{
                                display: "flex",
                                fontWeight: "bold",
                                marginBottom: "8px",
                              }}
                            >
                              <div className="ms-Grid-col ms-lg4">
                                <b style={{ fontSize: "17px" }}>
                                  Minimum Qualification
                                </b>
                              </div>
                              <div
                                className="ms-Grid-col ms-lg1"
                                style={{ textAlign: "center" }}
                              ></div>
                              <div className="ms-Grid-col ms-lg4">
                                <b style={{ fontSize: "17px" }}>
                                  Preferred Qualification
                                </b>
                              </div>
                            </div>

                            {data.MinQualificationOption.map((item, index) => (
                              <div
                                key={index}
                                style={{ display: "flex", marginTop: "8px" }}
                              >
                                <div className="ms-Grid-col ms-lg4">
                                  {item.text}
                                </div>
                                <div
                                  className="ms-Grid-col ms-lg1"
                                  style={{ textAlign: "center" }}
                                >
                                  {data.PrefeQualificationOption?.[index] && (
                                    <span></span>
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
                      <hr
                        style={{
                          border: "1px solid #d3d3d3",
                          margin: "10px 0",
                        }}
                      />{" "}
                      {/* Add this line */}
                    </>
                  )}

                  {data.RoleSpeKnowledgeoption?.length > 0 && (
                    <div
                      className="ms-Grid-row"
                      style={{ marginBottom: "20px" }}
                    >
                      <div className="ms-Grid-col ms-lg12">
                        <div
                          className="ms-Grid-row"
                          style={{ marginTop: "4px" }}
                        >
                          <div
                            style={{
                              display: "flex",
                              fontWeight: "bold",
                              marginBottom: "8px",
                            }}
                          >
                            <div className="ms-Grid-col ms-lg4">
                              <b style={{ fontSize: "17px" }}>
                                Role Specific Knowledge
                              </b>
                            </div>
                            <div
                              className="ms-Grid-col ms-lg1"
                              style={{ textAlign: "center" }}
                            >
                              {/* - */}
                            </div>
                            <div className="ms-Grid-col ms-lg4">
                              <b style={{ fontSize: "17px" }}>
                                {" "}
                                Required Level
                              </b>
                            </div>
                          </div>

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

                  {data.TechnicalSkillsOption?.length > 0 && (
                    <div
                      className="ms-Grid-row"
                      style={{ marginBottom: "20px" }}
                    >
                      <div className="ms-Grid-col ms-lg12">
                        <div
                          className="ms-Grid-row"
                          style={{ marginTop: "4px" }}
                        >
                          <div
                            style={{
                              display: "flex",
                              fontWeight: "bold",
                              marginBottom: "8px",
                            }}
                          >
                            <div className="ms-Grid-col ms-lg4">
                              <b style={{ fontSize: "17px" }}>
                                Technical Skills - Ability to Apply Knowledge
                              </b>
                            </div>
                            <div
                              className="ms-Grid-col ms-lg1"
                              style={{ textAlign: "center" }}
                            ></div>
                            <div className="ms-Grid-col ms-lg4">
                              <b style={{ fontSize: "17px" }}>
                                Level of Proficiency
                              </b>
                            </div>
                          </div>

                          {data.TechnicalSkillsOption.map((item, index) => (
                            <div
                              key={index}
                              style={{ display: "flex", marginTop: "8px" }}
                            >
                              <div className="ms-Grid-col ms-lg4">
                                {item.text}
                              </div>
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
                  {data.FunctionType && (
                    <div className="ms-Grid-row">
                      <div
                        className="ms-Grid-col ms-lg12"
                        style={{ marginTop: "-2%" }}
                      >
                        <p>
                          <b style={{ fontSize: "17px" }}>Function Type</b>{" "}
                        </p>
                        <p style={{ position: "relative", bottom: "8px" }}>
                          {data.FunctionType}
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}
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
            {/* <div style={{ marginRight: "10px" }}>
              <ReuseButton label="Cancel" onClick={onclose} spacing={4} />
            </div> */}
            <div style={{ marginRight: "10px" }}>
              <ReuseButton label="Close" onClick={Ok_btnfn} spacing={4} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CustomPreviewScreen;
