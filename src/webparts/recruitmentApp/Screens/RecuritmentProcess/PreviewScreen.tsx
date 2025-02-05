import * as React from "react";
import { AdvDetails, QualificationValue, RoleSpecKnowledge, TechnicalSkills } from "../../Models/RecuritmentVRR";
import ReuseButton from "../../components/ReuseButton";
import LabelHeaderComponents from "../../components/TitleHeader";
import CustomLabel from "../../components/CustomLabel";
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";

interface FormFields {
    data: AdvDetails;
    RoleSpec: RoleSpecKnowledge[];
    Qualification: QualificationValue[];
    TechinicalSkills: TechnicalSkills[];
    onclose: () => void
    Ok_btnfn: () => void
}


function PreviewScreen({
    data,
    onclose,
    Ok_btnfn,
    RoleSpec,
    Qualification,
    TechinicalSkills
}: FormFields) {

    return (
        <>
            <div className="ms-Grid-row">
                <Card variant="outlined" sx={{ boxShadow: "0px 2px 4px 3px #d3d3d3", marginTop: "2%", width: "97%", marginLeft: "2%" }}>
                    <CardContent>

                        <div style={{ padding: "2%" }}>
                            <div className="ms-Grid-row" style={{ textAlign: "center" }}>
                                <div className="ms-Grid-col ms-lg12">
                                    <LabelHeaderComponents value="Advertisement" />
                                </div>
                            </div>
                            <div className="ms-Grid-row" style={{ textAlign: "center" }}>
                                <CustomLabel value={`JobTitle - ${""}`} style={{ fontSize: "17px", fontWeight: "bold" }} />
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
                                                dangerouslySetInnerHTML={{ __html: data.JobDescription }}
                                            />
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="ms-Grid-row">
                                <div className="ms-Grid-col ms-lg6">
                                    <div>
                                        <p> <b style={{ fontSize: "17px" }}>Total Experience :</b>{" "}</p>
                                    </div>

                                    <div
                                        style={{ marginTop: "20px" }}
                                    >
                                        <p style={{ fontSize: "17px" }}>
                                            Total Experience:{" "} - {data.TotalExperience}
                                            <span>
                                                Experience in Mining Industry (Years) :{" "}   -  {data.ExperienceinMiningIndustry}
                                            </span>
                                        </p>
                                    </div>

                                </div>
                            </div>
                            {/* <div className="ms-Grid-row">
                                <div className="ms-Grid-col ms-lg6">
                                    <p>
                                        <b style={{ fontSize: "17px" }}>Total Experience :</b>{" "}
                                        <span>
                                            
                                        </span>
                                    </p>
                                </div>

                                <div className="ms-Grid-col ms-lg6">
                                    <p>
                                        <b style={{ fontSize: "17px" }}>Experience in Mining Industry (Years) :</b>{" "}
                                        <span>
                                            {data.ExperienceinMiningIndustry}
                                        </span>
                                    </p>
                                </div>

                            </div> */}

                            <div className="ms-Grid-row">
                                <div className="ms-Grid-col ms-lg6">
                                    <div>
                                        <p> <b style={{ fontSize: "17px" }}>Minimum Qualification :</b>{" "}</p>
                                    </div>

                                    {Qualification.map((item: any, index: number) => {
                                        return (
                                            <div
                                                key={index}
                                                style={{ marginTop: "20px" }}
                                            >
                                                <p style={{ fontSize: "17px" }}>
                                                    {item.MinQualification.text}
                                                    <span>
                                                        - {item.PrefeQualification.text}
                                                    </span>
                                                </p>
                                            </div>
                                        )
                                    })}

                                </div>
                            </div>

                            <div className="ms-Grid-row">
                                <div className="ms-Grid-col ms-lg6">
                                    <div>
                                        <p> <b style={{ fontSize: "17px" }}>Role Specific Knowledge :</b>{" "}</p>
                                    </div>

                                    {RoleSpec.map((item: any, index: number) => {
                                        return (
                                            <div
                                                key={index}
                                                style={{ marginTop: "20px" }}
                                            >
                                                <p style={{ fontSize: "17px" }}>
                                                    {item.RoleSpeKnowledge.text}
                                                    <span>
                                                        - {item.RequiredLevel.text}
                                                    </span>
                                                </p>
                                            </div>
                                        )
                                    })}

                                </div>

                                {/* {data.RequiredLevel.text && (
                                    <div className="ms-Grid-col ms-lg6">
                                        <p>
                                            <b style={{ fontSize: "17px" }}>Required Level :</b>{" "}
                                            <span>
                                                {data.RequiredLevel.text}
                                            </span>
                                        </p>
                                    </div>
                                )} */}

                            </div>

                            <div className="ms-Grid-row">
                                <div className="ms-Grid-col ms-lg6">
                                    <div>
                                        <p> <b style={{ fontSize: "17px" }}>Technical Skills - Ability to apply Knowledge :</b>{" "}</p>
                                    </div>

                                    {TechinicalSkills.map((item: any, index: number) => {
                                        return (
                                            <div
                                                key={index}
                                                style={{ marginTop: "20px" }}
                                            >
                                                <p style={{ fontSize: "17px" }}>
                                                    {item.TechnicalSkills.text}
                                                    <span>
                                                        - {item.LevelProficiency.text}
                                                    </span>
                                                </p>
                                            </div>
                                        )
                                    })}

                                </div>
                            </div>


                            {/* <div className="ms-Grid-row">
                                {data.TechnicalSkills.text && (
                                    <div className="ms-Grid-col ms-lg6">
                                        <p>
                                            <b style={{ fontSize: "17px" }}>Technical Skills - Ability to apply Knowledge :</b>{" "}
                                            <span>
                                                {data.TechnicalSkills.text}
                                            </span>
                                        </p>
                                    </div>
                                )}

                                {data.LevelProficiency.text && (
                                    <div className="ms-Grid-col ms-lg6">
                                        <p>
                                            <b style={{ fontSize: "17px" }}>Level of Proficiency :</b>{" "}
                                            <span>
                                                {data.LevelProficiency.text}
                                            </span>
                                        </p>
                                    </div>
                                )}

                            </div> */}
                        </div>
                    </CardContent>
                </Card>
                <div className="ms-Grid-row"
                    style={{
                        marginBottom: "2%",
                        marginTop: "1%",
                        marginRight: "1%"
                    }}>
                    <div className="ms-Grid-col ms-lg12"
                        style={{
                            display: "flex",
                            justifyContent: "flex-end",
                        }}>
                        <div style={{ marginRight: "10px" }}>
                            <ReuseButton
                                label="Cancel"
                                onClick={onclose}
                                spacing={4}
                            />
                        </div>

                        <div style={{ marginRight: "10px" }}>
                            <ReuseButton
                                label="OK"
                                onClick={Ok_btnfn}
                                spacing={4}
                            />
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}

export default PreviewScreen;
