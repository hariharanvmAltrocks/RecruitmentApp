import { Card, CardContent } from "@mui/material";
import * as React from "react";
import AttachmentButton from "../../../components/AttachmentButton";
import CustomAutoComplete from "../../../components/CustomAutoComplete";
import CustomLabel from "../../../components/CustomLabel";
import CustomTextArea from "../../../components/CustomTextArea";
import CustomViewAttachment from "../../../components/CustomViewAttachment";
import CustomViewDocument from "../../../components/CustomViewDocument";
import { DetailRow } from "../../../components/TabMerge";
import { workflowStatusApi, ColorCode } from "../../../utilities/Config";
import { labelNames } from "../../../utilities/LabelName";
import { AutoCompleteItem, IDocFile, ValidationErrorState } from "./Candidatetypes";
interface Props {
  conflictsOfInterest: string;
  COIReason: string;
  COIProfileLabel: AutoCompleteItem;
  COIProfileLabelOption: AutoCompleteItem[];
  COIAttachment: IDocFile[];
  COIComments: string;
  statusId: number;
  validationErrors: Pick<ValidationErrorState, "COIProfileLabel" | "COIAttachment" | "COIComments">;
  webURL: string;
  onAutoComplete: (value: AutoCompleteItem | null, field: string) => void;
  onDocumentUpload: (stateKey: string, value: IDocFile[]) => void;
  onDelete: (index: number, attachmentType: string) => void;
  onCommentsChange: (value: string) => void;
}

const COISection: React.FC<Props> = React.memo(
  ({
    conflictsOfInterest,
    COIReason,
    COIProfileLabel,
    COIProfileLabelOption,
    COIAttachment,
    COIComments,
    statusId,
    validationErrors,
    webURL,
    onAutoComplete,
    onDocumentUpload,
    onDelete,
    onCommentsChange,
  }) => {
    const isEditable = statusId === parseInt(workflowStatusApi.HRPending);

    return (
      <Card
        variant="outlined"
        sx={{ boxShadow: "0px 7px 4px 3px #d3d3d3", borderRadius: "10px", marginTop: "2%", overflow: "visible" }}
      >
        <CardContent>
          {/* Header */}
          <div className="ms-Grid-row">
            <div style={{ display: "flex", marginTop: "1%", marginLeft: "1%" }}>
              <div style={{ minWidth: 85, fontWeight: "bold", fontFamily: '"Roboto", sans-serif', fontSize: "17px" }}>
                {labelNames.CandidateDetails.ConflictsOfInterest}
              </div>
              <div style={{ fontFamily: '"Roboto", sans-serif', color: "red", marginLeft: "1%", fontWeight: "bold", fontSize: "17px" }}>
                : {conflictsOfInterest ?? "—"}
              </div>
            </div>
          </div>

          {/* Reason */}
          <div className="ms-Grid-row">
            <DetailRow label={labelNames.CandidateDetails.Reason} value={COIReason} />
          </div>

          {/* Consulted With + Proof */}
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-lg4">
              <CustomAutoComplete
                label={labelNames.CandidateDetails.ConsultedWith}
                options={COIProfileLabelOption.map(item => ({ ...item, key: typeof item.key === 'string' ? parseInt(item.key) : item.key }))}
                value={COIProfileLabel ? { ...COIProfileLabel, key: typeof COIProfileLabel.key === 'string' ? parseInt(COIProfileLabel.key) : COIProfileLabel.key } : null}
                disabled={!isEditable}
                mandatory={isEditable}
                onChange={(item) => onAutoComplete(item, "COIProfileLabel")}
                error={validationErrors.COIProfileLabel}
              />
            </div>

            {isEditable ? (
              <>
                <div className="ms-Grid-col ms-lg2">
                  <div className="ms-Grid-row" style={{ marginLeft: "2px" }}>
                    <CustomLabel value={labelNames.CandidateDetails.ProofDiscussion} mandatory={true} />
                    <AttachmentButton
                      label="Upload"
                      iconName="CloudUpload"
                      iconNameHover="CloudUpload"
                      allowMultiple={false}
                      AttachState={(newAttachment: any) => {
                        const attachment: IDocFile[] = newAttachment.map((item: any) => ({
                          name: item.name,
                          content: item.file,
                          type: "New",
                          url: item.Url,
                        }));
                        onDocumentUpload("COIAttachment", attachment);
                      }}
                      mandatory={true}
                      error={validationErrors.COIAttachment}
                      Style={{ backgroundColor: ColorCode.ButtonColorCode.ButtonColor, color: "white" }}
                      fileformat=".doc,.pdf,.docx,.png"
                    />
                  </div>
                </div>
                <div className="ms-Grid-col ms-lg4" style={{ marginTop: "2%" }}>
                  <CustomViewAttachment
                    Attachment={(COIAttachment ?? []).map(item => ({ ...item, type: item.type || "" }))}
                    StateValue="COIAttachment"
                    handleDelete={(idx, stateKey) => onDelete(idx, stateKey)}
                    webUrl={webURL}
                  />
                </div>
              </>
            ) : (
              COIAttachment.length > 0 && (
                <div className="ms-Grid-col ms-lg3 custom-document-column">
                  <CustomLabel value={labelNames.CandidateDetails.ProofDiscussion} />
                  <CustomViewDocument Attachment={COIAttachment.map(item => ({ ...item, type: item.type || "View" }))} webUrl={webURL} />
                </div>
              )
            )}
          </div>

          {/* Comments */}
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-lg12">
              <CustomTextArea
                label={labelNames.CommanLabel.Comments}
                value={COIComments}
                error={validationErrors.COIComments}
                onChange={onCommentsChange}
                disabled={!isEditable}
                mandatory={isEditable}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  },
);

COISection.displayName = "COISection";
export default COISection;