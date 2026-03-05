import * as React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CustomLabel from "../../components/CustomLabel";
import CustomAutoComplete from "../../components/CustomAutoComplete";
import CustomRadioGroup from "../../components/CustomRadioGroup";
import RichTextEditor from "../../components/CustomRichTextEditor";
import CustomInput from "../../components/CustomInput";
import {
  ColorCode,
  DataType,
  displayTextOptionCode,
  isDisqualificationOption,
  StatusId,
} from "../../utilities/Config";
import { memo } from "react";
import { MasterOption, OptionRow, ViewQuestion } from "./Hooks/Interviewtypes";

interface Props {
  questions: ViewQuestion[];
  label: string;
  expandedIndex: number | null;
  statusId: number;
  masterData: MasterOption;
  onExpand: (index: number) => void;
  onRemove: (index: number, type: string) => void;
  onFieldChange: (qIndex: number, field: string, value: any) => void;
  onOptionChange: (qIndex: number, optIndex: number, val: string, lang: "en" | "fr") => void;
  onAddRow: (qIndex: number) => void;
  onDeleteRow: (qIndex: number, optIndex: number) => void;
  onAnswerSelection: (qIndex: number, optIndex: number) => void;
  onRadioChange: (qIndex: number, field: string, value: string) => void;
  type: typeof DataType.New | typeof DataType.Existing;
}

const QuestionAccordionList: React.FC<Props> = memo(
  ({
    questions,
    label,
    expandedIndex,
    statusId,
    masterData,
    onExpand,
    onRemove,
    onFieldChange,
    onOptionChange,
    onAddRow,
    onDeleteRow,
    onAnswerSelection,
    onRadioChange,
    type,
  }) => {
    if (questions.length === 0) return null;

    const isDisqStatus = statusId === StatusId.PendingwithLMcreateDisqualificationQuestion;
    const isInterviewStatus = statusId === StatusId.PendingwithHRandLMtocreateinterviewQuestion;

    return (
      <>
        <CustomLabel value={label} />
        <Card
          sx={{
            mb: 2,
            borderRadius: "4px",
            boxShadow: "0px 0px 4px 4px rgba(0,0,0,.1)",
          }}
        >
          <CardContent sx={{ maxHeight: expandedIndex !== null ? "none" : 250, overflowY: expandedIndex !== null ? "visible" : "auto", pr: 1 }}>
            {questions.map((q, index) => {
              const isExpanded = expandedIndex === index;
              // For new questions, extract global index from HeaderLabel
              const labelNum = parseInt((q.HeaderLabel ?? "").split(" ")[1] ?? "0");
              const qIndex = type === DataType.New ? labelNum - 1 : index;

              return (
                <Box
                  key={q.id}
                  sx={{ boxShadow: "0px 0px 4px 4px rgba(0,0,0,.1)", borderRadius: "4px", mt: 1 }}
                >
                  <Accordion
                    expanded={isExpanded}
                    onChange={() => onExpand(index)}
                    sx={{ boxShadow: "none", borderBottom: "1px solid #ddd", "&:last-of-type": { borderBottom: "none" }, mb: 2 }}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography sx={{ fontSize: "14px", flexGrow: 1 }}>{q.HeaderLabel}</Typography>
                    </AccordionSummary>

                    <AccordionDetails sx={{ pt: 0 }}>
                      {isExpanded && (
                        <>
                          {/* Type of Question dropdown (new, disqualification only) */}
                          {type === DataType.New && isDisqStatus && (
                            <Box sx={{ mt: "-25px", mb: 1 }}>
                              <CustomAutoComplete
                                label="Type of Question"
                                options={masterData.QueType}
                                value={q.questionType as any}
                                onChange={(val) => onFieldChange(qIndex, "questionType", val)}
                                disabled={false}
                                mandatory={true}
                              />
                            </Box>
                          )}

                          {/* Existing question: read-only bilingual view */}
                          {type === DataType.Existing ? (
                            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", mt: 1 }}>
                              <Box>
                                <Typography sx={{ fontSize: 12, color: "#6b7280", mb: 0.5 }}>QUESTION ENGLISH</Typography>
                                <Typography
                                  sx={{ fontWeight: 600 }}
                                  dangerouslySetInnerHTML={{ __html: (q.question ?? "").replace(/<p>|<\/p>|<br\s*\/?>/gi, "").trim() }}
                                />
                                <Box sx={{ mt: 1, backgroundColor: "#f8fafc", p: 1.5, borderRadius: "4px" }}>
                                  <strong>Expected Answer</strong>
                                  <Typography>{Array.isArray(q.expectedAnswer) ? q.expectedAnswer.join(", ") : q.expectedAnswer}</Typography>
                                </Box>
                              </Box>
                              {q.questionFr && (
                                <Box>
                                  <Typography sx={{ fontSize: 12, color: "#6b7280", mb: 0.5 }}>QUESTION FRANÇAISE</Typography>
                                  <Typography
                                    sx={{ fontWeight: 600 }}
                                    dangerouslySetInnerHTML={{ __html: (q.questionFr ?? "").replace(/<p>|<\/p>|<br\s*\/?>/gi, "").trim() }}
                                  />
                                  <Box sx={{ mt: 1, backgroundColor: "#f8fafc", p: 1.5, borderRadius: "4px" }}>
                                    <strong>Expected Answer</strong>
                                    <Typography>{Array.isArray(q.expectedAnswerFr) ? q.expectedAnswerFr.join(", ") : q.expectedAnswerFr}</Typography>
                                  </Box>
                                </Box>
                              )}
                            </Box>
                          ) : (
                            /* New question: editable bilingual fields */
                            <>
                              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2, width: "100%" }}>
                                <RichTextEditor
                                  label="Question (English)"
                                  value={q.question ?? ""}
                                  onChange={(val) => onFieldChange(qIndex, "question", val)}
                                  mandatory={true}
                                />
                                <RichTextEditor
                                  label="Question (French)"
                                  value={q.questionFr ?? ""}
                                  onChange={(val) => onFieldChange(qIndex, "questionFr", val)}
                                  mandatory={true}
                                />
                              </Box>

                              {/* MCQ options */}
                              {((q.questionType as any)?.text === displayTextOptionCode.MultiAnswer ||
                                (q.questionType as any)?.text === displayTextOptionCode.SingleAnswer) ? (
                                <Box sx={{ mb: 2 }}>
                                  {(q.options ?? []).map((option: OptionRow, optIndex: number) => (
                                    <Box key={optIndex} sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1 }}>
                                      <Typography sx={{ mt: "3%", width: "80px", fontSize: "14px" }}>
                                        Option {optIndex + 1} *
                                      </Typography>
                                      <Box sx={{ display: "flex", gap: 1, width: "77%" }}>
                                        <Box sx={{ flex: 1 }}>
                                          <CustomInput label="Option (EN)" value={option.text} onChange={(val) => onOptionChange(qIndex, optIndex, val, "en")} />
                                        </Box>
                                        <Box sx={{ flex: 1 }}>
                                          <CustomInput label="Option (FR)" value={option.textFr ?? ""} onChange={(val) => onOptionChange(qIndex, optIndex, val, "fr")} />
                                        </Box>
                                      </Box>
                                      <Box
                                        onClick={() => onAnswerSelection(qIndex, optIndex)}
                                        sx={{ backgroundColor: option.isCorrect ? "#4CAF50" : "#D3D3D3", borderRadius: "50%", width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", mt: "3%" }}
                                      >
                                        <CheckCircleOutlineIcon sx={{ color: option.isCorrect ? "white" : "black", fontSize: 24 }} />
                                      </Box>
                                      <Box sx={{ display: "flex", gap: 1, mt: "3%" }}>
                                        {(q.options ?? []).length > 1 && (
                                          <Button variant="contained" sx={{ backgroundColor: ColorCode.ButtonColorCode.ButtonColor, minWidth: 40, "&:hover": { backgroundColor: ColorCode.ButtonColorCode.ButtonColor } }} onClick={() => onDeleteRow(qIndex, optIndex)}>
                                            <DeleteOutlineIcon sx={{ fontSize: 20 }} />
                                          </Button>
                                        )}
                                        {optIndex === (q.options ?? []).length - 1 && (
                                          <Button variant="contained" sx={{ backgroundColor: ColorCode.ButtonColorCode.ButtonColor, minWidth: 40, "&:hover": { backgroundColor: ColorCode.ButtonColorCode.ButtonColor } }} onClick={() => onAddRow(qIndex)}>
                                            <AddIcon />
                                          </Button>
                                        )}
                                      </Box>
                                    </Box>
                                  ))}
                                </Box>
                              ) : isInterviewStatus ? (
                                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2, width: "100%" }}>
                                  <RichTextEditor label="Expected Answer (English)" value={q.expectedAnswer ?? ""} onChange={(val) => onFieldChange(qIndex, "expectedAnswer", val)} mandatory={true} />
                                  <RichTextEditor label="Expected Answer (French)" value={q.expectedAnswerFr ?? ""} onChange={(val) => onFieldChange(qIndex, "expectedAnswerFr", val)} mandatory={true} />
                                </Box>
                              ) : null}

                              {/* Disqualification radio */}
                              {isDisqStatus && (
                                <Box sx={{ mb: 2, width: "50%" }}>
                                  <CustomRadioGroup
                                    label="Disqualification Question?"
                                    value={q.Disqualification ?? "NO"}
                                    onChange={(val) => onRadioChange(qIndex, "Disqualification", val)}
                                    mandatory={true}
                                    options={isDisqualificationOption}
                                  />
                                </Box>
                              )}
                            </>
                          )}

                          {/* Remove / Delete button */}
                          <Box sx={{ display: "flex", justifyContent: type === DataType.Existing ? "flex-end" : "flex-start", mt: 2 }}>
                            <Button
                              variant="contained"
                              sx={{ backgroundColor: ColorCode.ButtonColorCode.ButtonColor, textTransform: "none", "&:hover": { backgroundColor: ColorCode.ButtonColorCode.ButtonColor } }}
                              onClick={(e) => { e.stopPropagation(); onRemove(index, type); }}
                            >
                              {type === DataType.Existing ? "Remove" : "Delete"}
                            </Button>
                          </Box>
                        </>
                      )}
                    </AccordionDetails>
                  </Accordion>
                </Box>
              );
            })}
          </CardContent>
        </Card>
      </>
    );
  },
);

QuestionAccordionList.displayName = "QuestionAccordionList";
export default QuestionAccordionList;