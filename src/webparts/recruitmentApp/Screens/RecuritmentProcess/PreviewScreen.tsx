import * as React from "react";
import {
  AdvDetails,
  QualificationValue,
  RoleSpecKnowledge,
  TechnicalSkills,
} from "../../Models/RecuritmentVRR";
import ReuseButton from "../../components/ReuseButton";
import LabelHeaderComponents from "../../components/TitleHeader";
import CustomLabel from "../../components/CustomLabel";
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import * as moment from "moment";

interface FormFields {
  data: AdvDetails;
  RoleSpec: RoleSpecKnowledge[];
  Qualification: QualificationValue;
  TechinicalSkills: TechnicalSkills[];
  onclose: () => void;
  Ok_btnfn: () => void;
  JobTitle: string;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function PreviewScreen({
  data,
  onclose,
  Ok_btnfn,
  RoleSpec,
  Qualification,
  TechinicalSkills,
  JobTitle,
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
                <div className="ms-Grid-col ms-lg12">
                  <LabelHeaderComponents value="Advertisement" />
                </div>
              </div>
              <div className="ms-Grid-row" style={{ textAlign: "center" }}>
                <CustomLabel
                  value={`JobTitle - ${JobTitle}`}
                  style={{ fontSize: "17px", fontWeight: "bold" }}
                />
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

              {data.ValidFrom && data.ValidTo ? (
                <div className="ms-Grid-row" style={{ marginBottom: "20px" }}>
                  <div className="ms-Grid-col ms-lg12">
                    <div className="ms-Grid-row" style={{ marginTop: "8px" }}>
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
                        />
                        <div className="ms-Grid-col ms-lg4">
                          <b style={{ fontSize: "17px" }}>Valid To</b>
                        </div>
                      </div>

                      {data.ValidFrom && data.ValidTo && (
                        <div style={{ display: "flex", marginTop: "8px" }}>
                          <div className="ms-Grid-col ms-lg4">
                            {moment(data.ValidFrom).format("DD-MM-YYYY")}
                          </div>
                          <div
                            className="ms-Grid-col ms-lg1"
                            style={{ textAlign: "center" }}
                          />
                          <div className="ms-Grid-col ms-lg4">
                            {moment(data.ValidTo).format("DD-MM-YYYY")}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : null}

              {(data.TotalExperience || data.ExperienceinMiningIndustry) && (
                <div className="ms-Grid-row" style={{ marginBottom: "20px" }}>
                  <div className="ms-Grid-col ms-lg12">
                    <div className="ms-Grid-row" style={{ marginTop: "8px" }}>
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
                        />
                        <div className="ms-Grid-col ms-lg4">
                          <b style={{ fontSize: "17px" }}>
                            Preferred Experience in Mining Industry (Years)
                          </b>
                        </div>
                      </div>

                      <div style={{ display: "flex", marginTop: "8px" }}>
                        <div className="ms-Grid-col ms-lg4">
                          {data.TotalExperience
                            ? `${data.TotalExperience?.text} years`
                            : ""}
                        </div>
                        <div
                          className="ms-Grid-col ms-lg1"
                          style={{ textAlign: "center" }}
                        />
                        <div className="ms-Grid-col ms-lg4">
                          {data.ExperienceinMiningIndustry
                            ? `${data.ExperienceinMiningIndustry.text} years in Mining`
                            : ""}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {(Qualification?.MinQualification?.length > 0 ||
                Qualification?.PrefeQualification?.length > 0) && (
                <div className="ms-Grid-row" style={{ marginBottom: "20px" }}>
                  <div className="ms-Grid-col ms-lg12">
                    <div className="ms-Grid-row" style={{ marginTop: "8px" }}>
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
                        />
                        <div className="ms-Grid-col ms-lg4">
                          <b style={{ fontSize: "17px" }}>
                            Preferred Qualification
                          </b>
                        </div>
                      </div>

                      <div style={{ display: "flex", marginTop: "8px" }}>
                        <div className="ms-Grid-col ms-lg4">
                          {Qualification?.MinQualification?.map(
                            (item: any) => item?.text || "N/A"
                          ).join(", ")}
                        </div>

                        <div
                          className="ms-Grid-col ms-lg1"
                          style={{ textAlign: "center" }}
                        />

                        <div className="ms-Grid-col ms-lg4">
                          {Qualification?.PrefeQualification?.map(
                            (item: any) => item?.text || "N/A"
                          ).join(", ")}
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr
                    style={{
                      border: "1px solid #d3d3d3",
                      position: "relative",
                      top: "21px",
                    }}
                  />
                </div>
              )}

              {RoleSpec.length > 0 && (
                <div className="ms-Grid-row" style={{ marginBottom: "20px" }}>
                  <div className="ms-Grid-col ms-lg12">
                    <div className="ms-Grid-row" style={{ marginTop: "8px" }}>
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
                        />
                        <div className="ms-Grid-col ms-lg4">
                          <b style={{ fontSize: "17px" }}> Required Level</b>
                        </div>
                      </div>

                      {RoleSpec.map((item: any, index: number) => (
                        <div
                          key={index}
                          style={{ display: "flex", marginTop: "8px" }}
                        >
                          <div className="ms-Grid-col ms-lg4">
                            {item.RoleSpeKnowledge?.text || "N/A"}
                          </div>
                          <div
                            className="ms-Grid-col ms-lg1"
                            style={{ textAlign: "center" }}
                          >
                            <span>-</span>
                          </div>
                          <div className="ms-Grid-col ms-lg4">
                            {item.RequiredLevel?.text || "N/A"}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {TechinicalSkills.length > 0 && (
                <div className="ms-Grid-row" style={{ marginBottom: "20px" }}>
                  <div className="ms-Grid-col ms-lg12">
                    <div className="ms-Grid-row" style={{ marginTop: "8px" }}>
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
                        />
                        <div className="ms-Grid-col ms-lg4">
                          <b style={{ fontSize: "17px" }}>
                            Level of Proficiency
                          </b>
                        </div>
                      </div>

                      {TechinicalSkills.map((item: any, index: number) => (
                        <div
                          key={index}
                          style={{ display: "flex", marginTop: "8px" }}
                        >
                          <div className="ms-Grid-col ms-lg4">
                            {item.TechnicalSkills?.text || "N/A"}
                          </div>
                          <div
                            className="ms-Grid-col ms-lg1"
                            style={{ textAlign: "center" }}
                          >
                            <span>-</span>
                          </div>
                          <div className="ms-Grid-col ms-lg4">
                            {item.LevelProficiency?.text || "N/A"}
                          </div>
                        </div>
                      ))}

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
                              {data.JobFunctionalType.text}
                            </p>
                          </div>
                        </div>
                      )}
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
              <ReuseButton
                label="Rework"
                onClick={onclose}
                spacing={4}
                Style={{ width: "123px", height: "41px", lineHeight: "20px" }}
              />
            </div>

            <div style={{ marginRight: "10px" }}>
              <ReuseButton
                label="Proceed To Submit"
                onClick={Ok_btnfn}
                spacing={4}
                Style={{ width: "123px", height: "41px", lineHeight: "20px" }}
              />
            </div>
          </div>
        </div>
        has context menu
      </div>
    </>
  );
}

export default PreviewScreen;
