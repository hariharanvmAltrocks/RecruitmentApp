import * as React from "react";
import { AdvDetails } from "../../Models/RecuritmentVRR";
import ReuseButton from "../../components/ReuseButton";

interface FormFields {
    data: AdvDetails;
    onclose: () => void
}


function PreviewScreen({
    data,
    onclose
}: FormFields) {

    return (
        <>
            <div>
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
                    {data.MinQualification && (
                        <div className="ms-Grid-col ms-lg6">
                            <p>
                                <b style={{ fontSize: "17px" }}> Minimum Qualification :</b>{" "}
                                <span>
                                    {data.MinQualification}
                                </span>
                            </p>
                        </div>
                    )}

                    {data.PrefeQualification && (
                        <div className="ms-Grid-col ms-lg6">
                            <p>
                                <b style={{ fontSize: "17px" }}>Preferred Qualification :</b>{" "}
                                <span>
                                    {data.PrefeQualification}
                                </span>
                            </p>
                        </div>
                    )}
                </div>



                <div className="ms-Grid-row">
                    {data.RoleSpeKnowledge.text && (
                        <div className="ms-Grid-col ms-lg6">
                            <p>
                                <b style={{ fontSize: "17px" }}>Role Specific Knowledge :</b>{" "}
                                <span>
                                    {data.RoleSpeKnowledge.text}
                                </span>
                            </p>
                        </div>
                    )}

                    {data.RequiredLevel.text && (
                        <div className="ms-Grid-col ms-lg6">
                            <p>
                                <b style={{ fontSize: "17px" }}>Required Level :</b>{" "}
                                <span>
                                    {data.RequiredLevel.text}
                                </span>
                            </p>
                        </div>
                    )}

                </div>

                <div className="ms-Grid-row">
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

                </div>



                <div className="ms-Grid-row">
                    <div
                        style={{
                            marginRight: "10px",
                            display: "flex",
                            justifyContent: "flex-end",
                        }}
                    >
                        <ReuseButton
                            label="Close"
                            onClick={onclose}
                            spacing={4}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default PreviewScreen;
