import * as React from "react";
import { Card, CardContent } from "@mui/material";
import CustomLoader from "../../Services/Loader/CustomLoader";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import BreadcrumbsComponent from "../../components/CustomBreadcrumps";

import { DataType, TabName, CatogryOptionCode } from "../../utilities/Config";
import { useEffect, useState } from "react";
import type { TabNameData } from "../../components/CustomBreadcrumps";
import { useInterviewQuestions } from "./Hooks/Useinterviewquestions";
import QuestionnaireHeader from "./Questionnaireheader";
import QuestionAccordionList from "./Questionaccordionlist";
import CreateQuestionBox from "./Createquestionbox";
import { ButtonAction } from "../../utilities/LabelName";
import ViewQuestionCheckbox from "../ScreenComponent/ViewQuestionCheckbox";

const InterviewQuesEdit: React.FC<any> = (props) => {
  const hook = useInterviewQuestions({
    stateValue: props.stateValue,
    CurrentRoleID: props.CurrentRoleID,
    Department: props.Department,
    navigation: props.navigation,
  });

  const [tabNameData, setTabNameData] = useState<TabNameData[]>([]);

  useEffect(() => {
    setTabNameData([
      { tabName: props.stateValue?.TabNames },
      {
        tabName:
          hook.formData.Catogry === CatogryOptionCode.CareerPortalCandidate
            ? TabName.CareerPortal
            : TabName.InterviewPanel,
      },
    ]);
  }, [props.stateValue?.TabNames, hook.formData.Catogry]);

  const tabs = [
    {
      label: "Interview Question",
      value: "tab1",
      content: (
        <Card
          variant="outlined"
          sx={{
            boxShadow: "0px 2px 4px 3px #d3d3d3",
            marginTop: "2%",
            position: "relative",
            overflow: "visible",
            zIndex: 1,
          }}
        >
          <CardContent>
            <QuestionnaireHeader
              statusId={props.stateValue?.StatusId}
              disciplineText={hook.formData.Disciplines?.text ?? ""}
              onViewQuestions={hook.getFetchQuestion}
              onNewQuestion={hook.handleNewQuestion}
            />

            <QuestionAccordionList
              questions={hook.existingQuestionnaire}
              label="Reuse Question"
              type={DataType.Existing}
              expandedIndex={hook.expandedExistingQuestion}
              statusId={props.stateValue?.StatusId}
              masterData={hook.masterData}
              onExpand={(i:any) =>
                hook.setExpandedExistingQuestion((prev) => (prev === i ? null : i))
              }
              onRemove={hook.handleRemoveQuestionnaire}
              onFieldChange={hook.handleQuestionFieldChange}
              onOptionChange={hook.handleQuestionOptionChange}
              onAddRow={hook.handleQuestionAddRow}
              onDeleteRow={hook.handleQuestionDeleteRow}
              onAnswerSelection={hook.handleAnswerSelection}
              onRadioChange={hook.handleCommonRadioChange}
            />

            {/* Newly created questions */}
            <QuestionAccordionList
              questions={hook.newQuestionnaire}
              label="New Question"
              type={DataType.New}
              expandedIndex={hook.expandedQuestionIndex}
              statusId={props.stateValue?.StatusId}
              masterData={hook.masterData}
              onExpand={(i: any) =>
                hook.setExpandedQuestionIndex((prev) => (prev === i ? null : i))
              }
              onRemove={hook.handleRemoveQuestionnaire}
              onFieldChange={hook.handleQuestionFieldChange}
              onOptionChange={hook.handleQuestionOptionChange}
              onAddRow={hook.handleQuestionAddRow}
              onDeleteRow={hook.handleQuestionDeleteRow}
              onAnswerSelection={hook.handleAnswerSelection}
              onRadioChange={hook.handleCommonRadioChange}
            />

            {/* Create question form */}
            {hook.showCreateQuestionBox && (
              <CreateQuestionBox
                statusId={props.stateValue?.StatusId}
                catogry={hook.formData.Catogry}
                questionCount={hook.resuequestionnaire.length + 1}
                englishQuestion={hook.englishQuestion}
                frenchQuestion={hook.frenchQuestion}
                formData={hook.formData}
                masterData={hook.masterData}
                optionRows={hook.optionRows}
                validationError={hook.validationError}
                isEditing={hook.editingQuestionIndex !== null}
                onEnglishChange={hook.setEnglishQuestion}
                onFrenchChange={hook.setFrenchQuestion}
                onAutoComplete={hook.handleAutoComplete}
                onRichTextChange={hook.handleRichTextEditor}
                onDisqualificationChange={hook.handleDisqualificationChange}
                onOptionChange={hook.handleOptionChange}
                onSelectAnswer={hook.handleAnswerSelections}
                onAddRow={hook.handleAddRow}
                onDeleteRow={hook.handleDeleteRow}
                onSave={hook.handleSaveQuestion}
                onClose={hook.handleCloseCreateQuestion}
              />
            )}
          </CardContent>
        </Card>
      ),
    },
  ];

  return (
    <>
      {hook.viewQA ? (
        <ViewQuestionCheckbox
          questionnaire={hook.questionnaire}
          handleCheckbox={hook.handleCheckbox}
          Disciplines={hook.formData.Disciplines?.text}
          Reusequestion_fn={hook.reuseQuestion}
          onClose={() => hook.setViewQA(false)}
        />
      ) : (
        <CustomLoader isLoading={hook.isLoading}>
          <div className="menu-card">
            <React.Fragment>
              <BreadcrumbsComponent
                items={tabs}
                initialItem="tab1"
                TabName={tabNameData}
                onBreadcrumbChange={() => {}}
                handleCancel={hook.handleCancel}
                JobValue={{
                  JobTitle: props.stateValue?.JobTitleInEnglish ?? "",
                  JobCode: props.stateValue?.JobCode,
                  Status: props.stateValue?.Status,
                }}
                additionalButtons={
                  hook.resuequestionnaire.length > 0
                    ? [
                        {
                          label: ButtonAction.Submit,
                          onClick: hook.handleSubmit,
                        },
                      ]
                    : []
                }
              />
            </React.Fragment>
          </div>
        </CustomLoader>
      )}

      {hook.alertPopupOpen && (
        <CustomAlert
          {...hook.alertProps}
          onClose={() => hook.setAlertPopupOpen(false)}
          ButtonAction={hook.alertProps.ButtonAction || (() => {})}
        />
      )}
    </>
  );
};

export default InterviewQuesEdit;