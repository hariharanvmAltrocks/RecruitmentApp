import { Box, Button, Typography } from "@mui/material";
import RichTextEditor from "../../components/CustomRichTextEditor";
import CustomAutoComplete from "../../components/CustomAutoComplete";
import CustomRadioGroup from "../../components/CustomRadioGroup";

import {
  ColorCode,
  displayTextOptionCode,
  isDisqualificationOption,
  StatusId,
} from "../../utilities/Config";
import * as React from "react";
import { memo } from "react";
import { ButtonAction } from "../../utilities/LabelName";
import OptionRowList from "./Optionrowlist";
import { AutoCompleteItem, InterviewQuesValidationError, MasterOption, OptionRow } from "./Hooks/Interviewtypes";

interface Props {
  statusId: number;
  catogry: string;
  questionCount: number;
  englishQuestion: string;
  frenchQuestion: string;
  formData: any;
  masterData: MasterOption;
  optionRows: OptionRow[];
  validationError: InterviewQuesValidationError;
  isEditing: boolean;
  onEnglishChange: (val: string) => void;
  onFrenchChange: (val: string) => void;
  onAutoComplete: (field: string, val: AutoCompleteItem | null) => void;
  onRichTextChange: (val: string, key: string) => void;
  onDisqualificationChange: (key: any, val: string) => void;
  onOptionChange: (index: number, val: string, lang: "en" | "fr") => void;
  onSelectAnswer: (index: number) => void;
  onAddRow: () => void;
  onDeleteRow: (index: number) => void;
  onSave: () => void;
  onClose: () => void;
}

const CreateQuestionBox: React.FC<Props> = memo(
  ({
    statusId,
    catogry,
    questionCount,
    englishQuestion,
    frenchQuestion,
    formData,
    masterData,
    optionRows,
    validationError,
    isEditing,
    onEnglishChange,
    onFrenchChange,
    onAutoComplete,
    onRichTextChange,
    onDisqualificationChange,
    onOptionChange,
    onSelectAnswer,
    onAddRow,
    onDeleteRow,
    onSave,
    onClose,
  }) => {
    const isDisqualificationStatus =
      statusId === StatusId.PendingwithLMcreateDisqualificationQuestion;
    const isInterviewPanelStatus =
      statusId === StatusId.PendingwithHRandLMtocreateinterviewQuestion;

    const questionTypeText = formData.QuestionType?.text?.trim() ?? "";
    const isMCQ =
      questionTypeText === displayTextOptionCode.MultiAnswer ||
      questionTypeText === displayTextOptionCode.SingleAnswer;

    return (
      <Box
        sx={{
          p: 2,
          mb: 2,
          boxShadow: "0px 0px 4px 4px rgba(0,0,0,.1)",
          borderRadius: "4px",
        }}
      >
        {/* Header row: title + optional question type dropdown */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
            gap: 2,
          }}
        >
          <Typography
            variant="subtitle1"
            fontWeight="medium"
            sx={{ fontSize: "16px", fontFamily: "Segoe UI, Roboto, sans-serif", whiteSpace: "nowrap" }}
          >
            Create Question
          </Typography>

          {isDisqualificationStatus && (
            <Box sx={{ minWidth: 280 }}>
              <CustomAutoComplete
                label="Type of Question"
                options={masterData.QueType}
                value={formData.QuestionType}
                onChange={(val) => onAutoComplete("QuestionType", val)}
                disabled={false}
                mandatory={true}
                error={validationError.QuestionType}
              />
            </Box>
          )}
        </Box>

        {/* Bilingual Question inputs */}
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2, width: "100%" }}>
          <RichTextEditor
            label={`Question (English) ${questionCount}`}
            value={englishQuestion}
            onChange={onEnglishChange}
            mandatory={true}
            error={validationError.Question}
          />
          <RichTextEditor
            label={`Question (French) ${questionCount}`}
            value={frenchQuestion}
            onChange={onFrenchChange}
            mandatory={true}
            error={validationError.Question}
          />
        </Box>

        {/* MCQ options OR expected answer */}
        {isMCQ ? (
          <OptionRowList
            options={optionRows}
            validationError={validationError.OptionsType}
            onOptionChange={onOptionChange}
            onSelectAnswer={onSelectAnswer}
            onAddRow={onAddRow}
            onDeleteRow={onDeleteRow}
          />
        ) : isInterviewPanelStatus ? (
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2, width: "100%" }}>
            <RichTextEditor
              label="Expected Answer (English)"
              value={formData.ExpectedAnswer}
              onChange={(val) => onRichTextChange(val, "ExpectedAnswer")}
              mandatory={true}
              error={validationError.ExpectedAnswer}
            />
            <RichTextEditor
              label="Expected Answer (French)"
              value={formData.ExpectedAnswerFr ?? ""}
              onChange={(val) => onRichTextChange(val, "ExpectedAnswerFr")}
              mandatory={true}
              error={validationError.ExpectedAnswerFr}
            />
          </Box>
        ) : null}

        {/* Disqualification radio */}
        {isDisqualificationStatus && (
          <Box sx={{ mb: 2, width: "50%" }}>
            <CustomRadioGroup
              label="Is this a disqualification question?"
              value={formData.Disqualification ?? ""}
              options={isDisqualificationOption}
              error={validationError.Disqualification}
              mandatory={true}
              onChange={(val) => onDisqualificationChange("Disqualification", val)}
            />
          </Box>
        )}

        {/* Save / Close */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            onClick={onSave}
            sx={{
              backgroundColor: ColorCode.ButtonColorCode.ButtonColor,
              textTransform: "none",
              borderRadius: "4px",
              px: 3,
              "&:hover": { backgroundColor: ColorCode.ButtonColorCode.ButtonColor },
            }}
          >
            {isEditing ? ButtonAction.Update : ButtonAction.Save}
          </Button>
          <Button
            variant="contained"
            onClick={onClose}
            sx={{
              backgroundColor: ColorCode.ButtonColorCode.ButtonColor,
              textTransform: "none",
              borderRadius: "4px",
              px: 3,
              "&:hover": { backgroundColor: ColorCode.ButtonColorCode.ButtonColor },
            }}
          >
            {ButtonAction.close}
          </Button>
        </Box>
      </Box>
    );
  },
);

CreateQuestionBox.displayName = "CreateQuestionBox";
export default CreateQuestionBox;