import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Label } from "@fluentui/react";
import LabelHeaderComponents from "../../components/TitleHeader";
import Labelheader from "../../components/LabelHeader";
import LabelValue from "../../components/LabelValue";
import ReuseButton from "../../components/ReuseButton";
import { TabName } from "../../utilities/Config";
import {
  CandidateLevel2ScoreCardComments,
  CommentsDatas,
} from "../../Services/InterviewProcess/IInterviewProcessService";
import TabsComponent from "../../components/TabsComponent ";


// Define a type for the feedback for each role
interface CombinedFeedback {
  feedbackLevel1: string;
  overallFeedbackLevel1: string;
  feedbackLevel2: string;
}

interface CommentViewProps {
  level1: CommentsDatas[];
  level2: CandidateLevel2ScoreCardComments[];
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

const CommentView: React.FC<CommentViewProps> = ({ level1, level2, onClose }) => {
console.log("level1",level1)
console.log("level2",level2)
  const combinedComments: { [role: string]: CombinedFeedback } = {};

  // Combine Level 1 comments with their roles
  level1.forEach((comment: any) => {
    comment.CandidateScoreCard?.forEach((score: any) => {
      if (score.Feedback) {
        if (!combinedComments[comment.Role]) {
          combinedComments[comment.Role] = { feedbackLevel1: "", overallFeedbackLevel1: "", feedbackLevel2: "" };
        }
        combinedComments[comment.Role].feedbackLevel1 = score.Feedback;
      }
      if (score.OverAllEvaluationFeedback) {
        if (!combinedComments[comment.Role]) {
          combinedComments[comment.Role] = { feedbackLevel1: "", overallFeedbackLevel1: "", feedbackLevel2: "" };
        }
        combinedComments[comment.Role].overallFeedbackLevel1 = score.OverAllEvaluationFeedback;
      }
    });
  });

  // Combine Level 2 comments with their roles
  level2.forEach((comment: any) => {
    if (comment.Comments) {
      if (!combinedComments[comment.Role]) {
        combinedComments[comment.Role] = { feedbackLevel1: "", overallFeedbackLevel1: "", feedbackLevel2: "" };
      }
      combinedComments[comment.Role].feedbackLevel2 = comment.Comments;
    }
  });

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
            {/* Display comments grouped by Role */}
            {Object.keys(combinedComments).length > 0 ? (
              Object.keys(combinedComments).map((role: string, index: number) => {
                const { feedbackLevel1, overallFeedbackLevel1, feedbackLevel2 } = combinedComments[role];
                const comment = level1.find((c: any) => c.Role === role); // Get the original comment by role

                return (
                  <div key={index} className="sub-menu-card comment" style={{ marginTop: "20px" }}>
                    <div className="ms-Grid-row">
                      <div className="ms-Grid-col ms-lg12">
                        <LabelHeaderComponents value={`Submitted by ${role}`} />
                      </div>
                    </div>

                    {feedbackLevel1 && (
                      <div>
                        <Labelheader value="Feedback Ratings Below 2 - Level 1" />
                        <LabelValue value={feedbackLevel1} />
                      </div>
                    )}

            
                    {overallFeedbackLevel1 && (
                      <div>
                        <Labelheader value="Overall Evaluation - Level 1" />
                        <LabelValue value={overallFeedbackLevel1} />
                      </div>
                    )}

          
                    {feedbackLevel2 && (
                      <div>
                        <Labelheader value="Feedback - Level 2 " />
                        <LabelValue value={feedbackLevel2} />
                      </div>
                    )}

                    {comment?.Name && (
                      <div>
                        <Label style={boldLabelStyles}>{comment?.Name}</Label>
                      </div>
                    )}

                    {comment?.JobTitleInEnglish && (
                      <Label className="title" style={labelStyles}>
                        {comment.JobTitleInEnglish}
                      </Label>
                    )}

                    {comment?.JobTitleInFrench && (
                      <Label className="title" style={labelStyles}>
                        {comment.JobTitleInFrench}
                      </Label>
                    )}
                    {comment?.Department && (
                      <div>
                        <Label style={labelStyles}>{comment.Department}</Label>
                      </div>
                    )}

                    {comment?.CandidateScoreCard &&
                      comment.CandidateScoreCard.length > 0 &&
                      comment.CandidateScoreCard.map((score: any, scoreIndex: number) => (
                        <div key={scoreIndex}>
                          {score.CreatedDate && score.CreatedDate !== "N/A" && (
                            <Label style={labelStyles}>{score.CreatedDate}</Label>
                          )}
                        </div>
                      ))}
                    
                  </div>
                );
              })
            ) : (
              <p style={{ display: "flex", justifyContent: "center", padding: "1.2%", fontSize: "1.3em", marginTop: "16%", marginBottom: "18%" }}>
                No Comments Found
              </p>
            )}

            {/* Close Button */}
            <div className="ms-Grid-row">
              <div style={{ marginRight: "10px", display: "flex", justifyContent: "flex-end" }}>
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
