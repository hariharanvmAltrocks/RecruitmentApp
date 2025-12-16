import * as React from "react";
import {
  AdvDetails,
  QualificationValue,
  RoleSpecKnowledge,
  TechnicalSkills,
} from "../../Models/RecuritmentVRR";
import LabelHeaderComponents from "../../components/TitleHeader";
import CustomLabel from "../../components/CustomLabel";
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import { Notes, TabName, tabType } from "../../utilities/Config";
import TabsComponent from "../../components/TabsComponent ";
import { ButtonAction, labelNames } from "../../utilities/LabelName";

interface FormFields {
  data: AdvDetails;
  RoleSpec: RoleSpecKnowledge[];
  Qualification: QualificationValue;
  TechinicalSkills: TechnicalSkills[];
  onclose: () => void;
  Ok_btnfn: () => void;
  JobTitle: string;
  JobTitle_fr: string;
}

// Small presentational helpers to reduce repetition
const SectionTitle: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div style={{ fontWeight: 700, marginBottom: 8 }}>
    <div style={{ fontSize: 17 }}>{children}</div>
  </div>
);

const TwoColumnRow: React.FC<{
  left: React.ReactNode;
  right?: React.ReactNode;
}> = ({ left, right }) => (
  <div
    style={{
      display: "flex",
      gap: "8px",
      alignItems: "flex-start",
      marginTop: 8,
    }}
  >
    <div style={{ flex: 1 }}>{left}</div>
    <div style={{ width: 16, textAlign: "center" }}> </div>
    <div style={{ flex: 1 }}>{right}</div>
  </div>
);

function PreviewScreen({
  data,
  onclose,
  Ok_btnfn,
  RoleSpec,
  Qualification,
  TechinicalSkills,
  JobTitle,
  JobTitle_fr,
}: FormFields) {
  const [activeTab, setactiveTab] = React.useState("tab1");
  const handleTabChange = (newValue: string) => {
    setactiveTab(newValue);
  };

  const containerStyle: React.CSSProperties = {
    overflow: "auto",
    height: "56vh",
    width: "99%",
  };

  const renderQualifications = (
    minQ: any[] | undefined,
    prefQ: any[] | undefined
  ) => {
    const left = (minQ || []).map((i: any) => i?.text || "N/A").join(", ");
    const right = (prefQ || []).map((i: any) => i?.text || "N/A").join(", ");
    return (
      <>
        <SectionTitle>
          <div style={{ display: "flex", gap: 24 }}>
            <div style={{ width: "50%" }}>
              {activeTab === "tab1"
                ? labelNames.AdvertisementLabel.MinimumQualification
                : labelNames.Advertisement_fr.MinimumQualification}
            </div>
            <div style={{ width: "50%" }}>
              {activeTab === "tab1"
                ? labelNames.AdvertisementLabel.PreferredQualification
                : labelNames.Advertisement_fr.PreferredQualification}
            </div>
          </div>
        </SectionTitle>
        <TwoColumnRow left={<div>{left}</div>} right={<div>{right}</div>} />
        <hr
          style={{ border: "1px solid #d3d3d3", position: "relative", top: 21 }}
        />
      </>
    );
  };

  const renderRoleSpec = (items: any[]) => (
    <>
      <SectionTitle>
        <div style={{ display: "flex", gap: 24 }}>
          <div style={{ width: "50%" }}>
            {labelNames.AdvertisementLabel.RoleSpecificKnowledge}
          </div>
          <div style={{ width: "50%" }}>
            {labelNames.AdvertisementLabel.RequiredLevel}
          </div>
        </div>
      </SectionTitle>
      {items.map((item: any, idx: number) => (
        <TwoColumnRow
          key={idx}
          left={<div>{item.RoleSpeKnowledge?.text || "N/A"}</div>}
          right={<div>{item.RequiredLevel?.text || "N/A"}</div>}
        />
      ))}
    </>
  );

  const renderTechSkills = (items: any[]) => (
    <>
      <SectionTitle>
        <div style={{ display: "flex", gap: 24 }}>
          <div style={{ width: "50%" }}>
            {labelNames.AdvertisementLabel.TechnicalSkills}
          </div>
          <div style={{ width: "50%" }}>
            {labelNames.AdvertisementLabel.LevelProficiency}
          </div>
        </div>
      </SectionTitle>
      {items.map((item: any, idx: number) => (
        <TwoColumnRow
          key={idx}
          left={<div>{item.TechnicalSkills?.text || "N/A"}</div>}
          right={<div>{item.LevelProficiency?.text || "N/A"}</div>}
        />
      ))}
    </>
  );

  const tabs = [
    {
      label: TabName.EnglishAdvertisment,
      value: "tab1",
      content: (
        <>
          <Card
            variant="outlined"
            sx={{ boxShadow: "0px 2px 4px 3px #d3d3d3", marginTop: "2%" }}
          >
            <CardContent>
              <div className="ms-Grid-row" style={{ marginLeft: "2%" }}>
                <div>
                  <div style={containerStyle}>
                    <div
                      style={{
                        margin: "0%",
                        marginTop: "1%",
                        marginBottom: "-1%",
                      }}
                    >
                      <p>
                        <span
                          style={{
                            color: "red",
                            marginTop: 8,
                            display: "block",
                            fontFamily: "sans-serif",
                            fontSize: 14,
                            fontWeight: 700,
                          }}
                        >
                          Note:- {Notes.JobAdvetisementNotes}
                        </span>
                      </p>
                    </div>

                    <div style={{ textAlign: "center" }}>
                      <LabelHeaderComponents
                        value={labelNames.AdvertisementLabel.Advertisement}
                      />
                    </div>

                    <div style={{ textAlign: "center", marginTop: 6 }}>
                      <CustomLabel
                        value={`JobTitle - ${JobTitle}`}
                        style={{ fontSize: 17, fontWeight: "bold" }}
                      />
                    </div>

                    {data.RolePurpose && (
                      <div style={{ marginTop: 12 }}>
                        <p>
                          <b style={{ fontSize: 17 }}>
                            {labelNames.AdvertisementLabel.RolePurpose}
                          </b>{" "}
                          <span
                            dangerouslySetInnerHTML={{
                              __html: data.RolePurpose,
                            }}
                          />
                        </p>
                      </div>
                    )}

                    {data.JobDescription && (
                      <div style={{ marginTop: 12 }}>
                        <p>
                          <b style={{ fontSize: 17 }}>
                            {labelNames.AdvertisementLabel.JobDescription}
                          </b>{" "}
                          <span
                            dangerouslySetInnerHTML={{
                              __html: data.JobDescription,
                            }}
                          />
                        </p>
                      </div>
                    )}

                    {(data.TotalExperience ||
                      data.ExperienceinMiningIndustry) && (
                      <div style={{ marginTop: 12, marginBottom: 20 }}>
                        <SectionTitle>
                          <div style={{ display: "flex", gap: 24 }}>
                            <div style={{ width: "50%" }}>
                              {
                                labelNames.AdvertisementLabel
                                  .PreferredTotalExperience
                              }
                            </div>
                            <div style={{ width: "50%" }}>
                              {
                                labelNames.AdvertisementLabel
                                  .PreferredExperienceMining
                              }
                            </div>
                          </div>
                        </SectionTitle>

                        <TwoColumnRow
                          left={
                            <div>
                              {data.TotalExperience
                                ? `${data.TotalExperience.text
                                    .replace(/[a-zA-Z]/g, "")
                                    .trim()} years`
                                : ""}
                            </div>
                          }
                          right={
                            <div>
                              {data.ExperienceinMiningIndustry
                                ? `${data.ExperienceinMiningIndustry.text
                                    .replace(/[a-zA-Z]/g, "")
                                    .trim()} years`
                                : ""}
                            </div>
                          }
                        />
                      </div>
                    )}

                    {(Qualification?.MinQualification?.length > 0 ||
                      Qualification?.PrefeQualification?.length > 0) && (
                      <div style={{ marginTop: 12, marginBottom: 20 }}>
                        {renderQualifications(
                          Qualification?.MinQualification,
                          Qualification?.PrefeQualification
                        )}
                      </div>
                    )}

                    {RoleSpec.length > 0 && (
                      <div style={{ marginTop: 12, marginBottom: 20 }}>
                        {renderRoleSpec(RoleSpec)}
                      </div>
                    )}

                    {TechinicalSkills.length > 0 && (
                      <div style={{ marginTop: 12, marginBottom: 20 }}>
                        {renderTechSkills(TechinicalSkills)}
                      </div>
                    )}

                    {data.JobFunctionalType && (
                      <div style={{ marginTop: 12 }}>
                        <p>
                          <b style={{ fontSize: 17 }}>
                            {labelNames.AdvertisementLabel.JobFunctionalType}
                          </b>
                        </p>
                        <p style={{ position: "relative", bottom: 8 }}>
                          {data.JobFunctionalType.text}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      ),
    },
    {
      label: TabName.FrenchAdvertisement,
      value: "tab2",
      content: (
        <>
          <Card
            variant="outlined"
            sx={{ boxShadow: "0px 2px 4px 3px #d3d3d3", marginTop: "2%" }}
          >
            <CardContent>
              <div className="ms-Grid-row" style={{ marginLeft: "2%" }}>
                <div>
                  <div style={containerStyle}>
                    <div
                      style={{
                        margin: "0%",
                        marginTop: "1%",
                        marginBottom: "-1%",
                      }}
                    >
                      <p>
                        <span
                          style={{
                            color: "red",
                            marginTop: 8,
                            display: "block",
                            fontFamily: "sans-serif",
                            fontSize: 14,
                            fontWeight: 700,
                          }}
                        >
                          Note:- {Notes.JobAdvetisement_fr}
                        </span>
                      </p>
                    </div>

                    <div style={{ textAlign: "center" }}>
                      <LabelHeaderComponents
                        value={labelNames.Advertisement_fr.Advertisement}
                      />
                    </div>

                    <div style={{ textAlign: "center", marginTop: 6 }}>
                      <CustomLabel
                        value={`JobTitle - ${JobTitle_fr}`}
                        style={{ fontSize: 17, fontWeight: "bold" }}
                      />
                    </div>

                    {data.RolePurpose_fr && (
                      <div style={{ marginTop: 12 }}>
                        <p>
                          <b style={{ fontSize: 17 }}>
                            {labelNames.Advertisement_fr.RolePurpose}
                          </b>{" "}
                          <span
                            dangerouslySetInnerHTML={{
                              __html: data.RolePurpose_fr,
                            }}
                          />
                        </p>
                      </div>
                    )}

                    {data.JobDescription_fr && (
                      <div style={{ marginTop: 12 }}>
                        <p>
                          <b style={{ fontSize: 17 }}>
                            {labelNames.Advertisement_fr.JobDescription}
                          </b>{" "}
                          <span
                            dangerouslySetInnerHTML={{
                              __html: data.JobDescription_fr,
                            }}
                          />
                        </p>
                      </div>
                    )}

                    {(data.TotalExperience ||
                      data.ExperienceinMiningIndustry) && (
                      <div style={{ marginTop: 12, marginBottom: 20 }}>
                        <SectionTitle>
                          <div style={{ display: "flex", gap: 24 }}>
                            <div style={{ width: "50%" }}>
                              {
                                labelNames.Advertisement_fr
                                  .PreferredTotalExperience
                              }
                            </div>
                            <div style={{ width: "50%" }}>
                              {
                                labelNames.Advertisement_fr
                                  .PreferredExperienceMining
                              }
                            </div>
                          </div>
                        </SectionTitle>

                        <TwoColumnRow
                          left={
                            <div>
                              {data.TotalExperience
                                ? `${data.TotalExperience?.text} years`
                                : ""}
                            </div>
                          }
                          right={
                            <div>
                              {data.ExperienceinMiningIndustry
                                ? `${data.ExperienceinMiningIndustry.text} years`
                                : ""}
                            </div>
                          }
                        />
                      </div>
                    )}

                    {(Qualification?.MinQualification_fr?.length > 0 ||
                      Qualification?.PrefeQualification_fr?.length > 0) && (
                      <div style={{ marginTop: 12, marginBottom: 20 }}>
                        {renderQualifications(
                          Qualification?.MinQualification_fr,
                          Qualification?.PrefeQualification_fr
                        )}
                      </div>
                    )}

                    {RoleSpec.length > 0 && (
                      <div style={{ marginTop: 12, marginBottom: 20 }}>
                        <SectionTitle>
                          <div style={{ display: "flex", gap: 24 }}>
                            <div style={{ width: "50%" }}>
                              {
                                labelNames.Advertisement_fr
                                  .RoleSpecificKnowledge
                              }
                            </div>
                            <div style={{ width: "50%" }}>
                              {labelNames.Advertisement_fr.RequiredLevel}
                            </div>
                          </div>
                        </SectionTitle>

                        {RoleSpec.map((item: any, idx: number) => (
                          <TwoColumnRow
                            key={idx}
                            left={
                              <div>
                                {item.RoleSpeKnowledge_fr?.text || "N/A"}
                              </div>
                            }
                            right={
                              <div>{item.RequiredLevel_fr?.text || "N/A"}</div>
                            }
                          />
                        ))}
                      </div>
                    )}

                    {TechinicalSkills.length > 0 && (
                      <div style={{ marginTop: 12, marginBottom: 20 }}>
                        <SectionTitle>
                          <div style={{ display: "flex", gap: 24 }}>
                            <div style={{ width: "50%" }}>
                              {labelNames.Advertisement_fr.TechnicalSkills}
                            </div>
                            <div style={{ width: "50%" }}>
                              {labelNames.Advertisement_fr.LevelProficiency}
                            </div>
                          </div>
                        </SectionTitle>

                        {TechinicalSkills.map((item: any, idx: number) => (
                          <TwoColumnRow
                            key={idx}
                            left={
                              <div>
                                {item.TechnicalSkills_fr?.text || "N/A"}
                              </div>
                            }
                            right={
                              <div>
                                {item.LevelProficiency_fr?.text || "N/A"}
                              </div>
                            }
                          />
                        ))}

                        {data.JobFunctionalType_fr && (
                          <div style={{ marginTop: 12 }}>
                            <p>
                              <b style={{ fontSize: 17 }}>
                                {" "}
                                {labelNames.Advertisement_fr.JobFunctionalType}
                              </b>
                            </p>
                            <p style={{ position: "relative", bottom: 8 }}>
                              {data.JobFunctionalType_fr.text}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      ),
    },
  ];

  return (
    <>
      <div className="menu-card">
        <TabsComponent
          tabs={tabs}
          initialTab={activeTab}
          tabtype={tabType.EditPage}
          onTabChange={handleTabChange}
          additionalButtons={
            data.JobcodeChecked
              ? [
                  {
                    label: ButtonAction.close,
                    onClick: async () => {
                      Ok_btnfn();
                    },
                  },
                ]
              : [
                  {
                    label: ButtonAction.Rework,
                    onClick: async () => {
                      onclose();
                    },
                  },
                  {
                    label: ButtonAction.Submit,
                    onClick: async () => {
                      Ok_btnfn();
                    },
                  },
                ]
          }
        />
      </div>
    </>
  );
}

export default PreviewScreen;
