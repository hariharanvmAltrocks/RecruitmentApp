import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Label } from "@fluentui/react";
import LabelHeaderComponents from "../../components/TitleHeader";
import Labelheader from "../../components/LabelHeader";
import LabelValue from "../../components/LabelValue";
import ReuseButton from "../../components/ReuseButton";
import { TabName } from "../../utilities/Config";
import { CommentsData } from "../../Services/RecruitmentProcess/IRecruitmentProcessService";
import * as moment from "moment";
import TabsComponent from "../../components/TabsComponent ";

interface CommentViewProps {
  level1: CommentsData[];
  level2: CommentsData[];
  onClose: () => void;
}

const labelStyles: React.CSSProperties = {
  fontSize: "15px",
  margin: 0,
  padding: 0,
};

const boldLabelStyles: React.CSSProperties = {
  fontSize: "16px",
  fontWeight: "bold",
  marginBottom: "8px",
};

const CommentView: React.FC<CommentViewProps> = ({
  level1,
  level2,
  onClose,
}) => {
  const roles = Array.from(
    new Set([
      ...level1.map((c) => c.RoleName),
      ...level2.map((c) => c.RoleName),
    ])
  ).filter((role) => role);

  const tabs = [
    {
      label: TabName.ViewJustification,
      value: "tab1",
      content: (
        <Card
          variant="outlined"
          sx={{ boxShadow: "0px 2px 4px 3px #d3d3d3", marginTop: "2%" }}
        >
          <CardContent>
            {roles.length > 0 ? (
              roles.map((role, index) => {
                const c1 = level1.find((c) => c.RoleName === role);

                const c2 = level2.find((c) => c.RoleName === role);

                const fb2 = c2?.comments || "";

                const date1 = c1?.Date
                  ? moment(c1.Date).format("M/D/YYYY, h:mm:ss A")
                  : "";
                const date2 = c2?.Date
                  ? moment(c2.Date).format("M/D/YYYY, h:mm:ss A")
                  : "";

                const meta = c1 || c2;

                return (
                  <div
                    key={index}
                    className="sub-menu-card comment"
                    style={{ marginTop: "20px" }}
                  >
                    <div className="ms-Grid-row">
                      <div className="ms-Grid-col ms-lg12">
                        {role ? (
                          <LabelHeaderComponents
                            value={`Submitted by ${role}`}
                          />
                        ) : (
                          <LabelHeaderComponents value=" " />
                        )}
                      </div>
                    </div>

                    {(c1?.comments || c1?.OverAllEvaluationFeedback) && (
                      <>
                        {c1?.comments && (
                          <>
                            <Labelheader value="Feedback Level 1" />
                            <LabelValue value={c1.comments} />
                          </>
                        )}

                        {c1?.OverAllEvaluationFeedback && (
                          <>
                            <Labelheader value="Overall Feedback Level 1" />
                            <LabelValue value={c1.OverAllEvaluationFeedback} />
                          </>
                        )}
                      </>
                    )}
                    {fb2 && (
                      <>
                        <Labelheader value="Feedback Level 2" />
                        <LabelValue value={fb2} />
                      </>
                    )}

                    {meta?.Name && (
                      <Label style={boldLabelStyles}>{meta.Name}</Label>
                    )}
                    {meta?.JobTitleInEnglish && (
                      <Label style={labelStyles}>
                        {meta.JobTitleInEnglish}
                      </Label>
                    )}
                    {meta?.JobTitleInFrench && (
                      <Label className="title" style={labelStyles}>
                        {meta.JobTitleInFrench}
                      </Label>
                    )}
                    {meta?.Department && (
                      <Label className="title" style={labelStyles}>
                        {meta.Department}
                      </Label>
                    )}

                    {date1 && (
                      <Label style={labelStyles}>Level 1 Date: {date1}</Label>
                    )}
                    {date2 && (
                      <Label style={labelStyles}>Level 2 Date: {date2}</Label>
                    )}
                  </div>
                );
              })
            ) : (
              <p
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "1.2%",
                  fontSize: "1.3em",
                  marginTop: "16%",
                  marginBottom: "18%",
                }}
              >
                No Comments Found
              </p>
            )}

            <div className="ms-Grid-row">
              <div
                style={{
                  marginRight: "10px",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <ReuseButton label="Close" onClick={onClose} spacing={4} />
              </div>
            </div>
          </CardContent>
        </Card>
      ),
    },
  ];

  return (
    <div className="menu-card comment-view">
      <TabsComponent tabs={tabs} initialTab="tab1" />
    </div>
  );
};

export default CommentView;
