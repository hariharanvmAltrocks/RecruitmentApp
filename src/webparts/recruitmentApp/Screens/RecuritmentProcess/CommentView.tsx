import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import * as moment from "moment";
import { Label } from "@fluentui/react";
import LabelHeaderComponents from "../../components/TitleHeader";
import Labelheader from "../../components/LabelHeader";
import LabelValue from "../../components/LabelValue";
import TabsComponent from "../../components/TabsComponent ";
import ReuseButton from "../../components/ReuseButton";
import { TabName } from "../../utilities/Config";
import { CommentsDatas } from "../../Services/InterviewProcess/IInterviewProcessService";

interface CommentViewProps {
  comments: CommentsDatas[] | undefined;
  onClose: () => void;
}

const boldLabelStyles: React.CSSProperties = {
  fontWeight: "bold",
  fontSize: "18px",
};

const labelStyles: React.CSSProperties = {
  fontSize: "15px",
};

const CommentView: React.FC<CommentViewProps> = ({ comments, onClose }) => {
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
            {comments && comments.length > 0 ? (
              <>
                {comments.map((comment: any, index: number) => (
                  <div
                    key={index}
                    className="sub-menu-card comment"
                    style={{ marginTop: "20px" }}
                  >
                    <div className="ms-Grid-row">
                      <div className="ms-Grid-col ms-lg12">
                        <LabelHeaderComponents
                          value={`Submitted by ${comment?.Role ?? ""}`}
                        />
                      </div>
                    </div>
                    {comment.CandidateScoreCard.map(
                      (score: any, scoreIndex: number) => (
                        <div key={scoreIndex}>
                          <div className="ms-Grid-row">
                            <div className="ms-Grid-col ms-lg12">
                              <Labelheader value="Feedback" />
                              <LabelValue value={score?.Feedback ?? "N/A"} />
                            </div>
                          </div>
                          <div className="ms-Grid-row">
                            <div className="ms-Grid-col ms-lg12">
                              <Labelheader value="Overall Evaluation" />
                              <LabelValue
                                value={
                                  score?.OverAllEvaluationFeedback ?? "N/A"
                                }
                              />
                            </div>
                          </div>
                        </div>
                      )
                    )}
                    <div className="ms-Grid-row"></div>
                    {comment?.Name && (
                      <div>
                        <Label style={boldLabelStyles}>{comment?.Name}</Label>
                      </div>
                    )}
                    {comment?.JobTitleInEnglish && (
                      <div>
                        <Label className="title" style={labelStyles}>
                          {comment?.JobTitleInEnglish}
                        </Label>
                      </div>
                    )}
                    {comment?.JobTitleInFrench && (
                      <div>
                        <Label className="title" style={labelStyles}>
                          {comment?.JobTitleInFrench}
                        </Label>
                      </div>
                    )}
                    {comment.UserRoleName && (
                      <div>
                        <Label style={labelStyles}>
                          {comment.UserRoleName}
                        </Label>
                      </div>
                    )}
                    {comment.Department && (
                      <div>
                        <Label style={labelStyles}>{comment.Department}</Label>
                      </div>
                    )}
                    {comment?.Date && (
                      <Label style={labelStyles}>
                        {moment(comment?.Date).format("DD-MMM-YYYY - hh:mm A")}
                      </Label>
                    )}
                  </div>
                ))}
              </>
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
