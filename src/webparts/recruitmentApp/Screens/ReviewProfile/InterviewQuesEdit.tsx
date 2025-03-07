// import * as React from "react";
// import { useState, useEffect } from "react";
// import Card from "@mui/material/Card";
// import CardContent from "@mui/material/CardContent";
// import "../../App.css"; // Adjust path as needed
// import { Typography, Button, Box } from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// // Custom components
// import CustomLoader from "../../Services/Loader/CustomLoader";
// import CustomAlert from "../../components/CustomAlert/CustomAlert";
// import BreadcrumbsComponent, {
//   TabNameData,
// } from "../../components/CustomBreadcrumps";
// import CustomAutoComplete from "../../components/CustomAutoComplete";
// import RichTextEditor from "../../components/CustomRichTextEditor";
// import CustomRadioGroup from "../../components/CustomRadioGroup";
// // Models / Types
// import type { InterviewQues } from "../../Models/RecuritmentVRR";
// import type { alertPropsData, AutoCompleteItem } from "../../Models/Screens";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";

// // Utilities
// import {
//   HRMSAlertOptions,
//   RecuritmentHRMsg,
//   RoleID,
// } from "../../utilities/Config";
// import CustomInput from "../../components/CustomInput";

// type ValidationError = {
//   QuestionType: boolean;
//   QuestionNumber: boolean;
//   Disciplines: boolean;
//   Question: boolean;
//   ExpectedAnswer: boolean;
//   OptionsType: boolean;
// };
// type OptionRow = {
//   text: string;
// };
// const InterviewQuesEdit: React.FC = (props: any) => {
//   const [InterviewQuesData, setInterviewQuesData] = useState<InterviewQues>({
//     Disciplines: { key: 0, text: "" },
//     QuestionNumber: { key: 0, text: "" },
//     QuestionType: { key: 0, text: "" },
//     Question: "",
//     ExpectedAnswer: "",
//   });

//   const [ValidationError, setValidationError] = useState<ValidationError>({
//     QuestionType: false,
//     QuestionNumber: false,
//     Disciplines: false,
//     Question: false,
//     ExpectedAnswer: false,
//     OptionsType: false,
//   });
//   const [OptionsType, setOptionsType] = React.useState<OptionRow[]>([
//     { text: "" },
//   ]);

//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [AlertPopupOpen, setAlertPopupOpen] = useState<boolean>(false);
//   const [alertProps, setalertProps] = useState<alertPropsData>({
//     Message: "",
//     Type: "",
//     ButtonAction: null,
//     visible: false,
//   });

//   const [TabNameData, setTabNameData] = useState<TabNameData[]>([]);
//   const [activeTab, setactiveTab] = useState("tab1");
//   const [isDisqualification, setIsDisqualification] = useState("NO");
//   const [isAddQuestionOpen, setIsAddQuestionOpen] = useState(false);
//   const [questions, setQuestions] = useState<any[]>([]);
//   const [editingQuestionIndex, setEditingQuestionIndex] = useState<
//     number | null
//   >(null);
//   const [expandedQuestionIndex, setExpandedQuestionIndex] = useState<
//     number | null
//   >(null);

//   // ---------------------------------------
//   // Handlers
//   // ---------------------------------------
//   const handleAutoComplete = async (
//     key: keyof InterviewQues,
//     value: AutoCompleteItem | null
//   ) => {
//     setInterviewQuesData((prev) => ({
//       ...prev,
//       [key]: value || { key: 0, text: "" },
//     }));
//     setValidationError((prev) => ({
//       ...prev,
//       [key]: false,
//     }));
//   };

//   const handleRichTextEditor = (value: string, stateKey: string) => {
//     setInterviewQuesData((prev) => ({
//       ...prev,
//       [stateKey]: value,
//     }));
//     setValidationError((prev) => ({
//       ...prev,
//       [stateKey]: false,
//     }));
//   };

//   const handleBreadcrumbChange = (newItem: string) => {
//     setactiveTab(newItem);
//   };

//   const handleCancel = () => {
//     setIsLoading(true);

//     const CancelAlert = {
//       Message: RecuritmentHRMsg.RecuritmentHRMsgCancel,
//       Type: HRMSAlertOptions.Confirmation,
//       visible: true,
//       ButtonAction: async (userClickedOK: boolean) => {
//         if (userClickedOK) {
//           if (props.CurrentRoleID === RoleID.RecruitmentHR) {
//             props.navigation("/ReviewProfileList", {
//               state: { activeTab: "tab3" },
//             });
//           } else if (props.CurrentRoleID === RoleID.HOD) {
//             props.navigation("/RecurimentProcess", {
//               state: { activeTab: "tab3" },
//             });
//           } else if (props.CurrentRoleID === RoleID.LineManager) {
//             props.navigation("/ReviewProfileList", {
//               state: { activeTab: "tab2" },
//             });
//           } else {
//             props.navigation("/InterviewPanelList");
//           }
//           setAlertPopupOpen(false);
//         } else {
//           setAlertPopupOpen(false);
//         }
//       },
//     };

//     setAlertPopupOpen(true);
//     setalertProps(CancelAlert);
//     setIsLoading(false);
//   };

//   const handleToggleExpand = (index: number) => {
//     setExpandedQuestionIndex((prev) => (prev === index ? null : index));
//   };

//   // ---------------------------------------
//   // Inline Editing Handler for a Question Field
//   // ---------------------------------------
//   const handleQuestionFieldChange = (
//     index: number,
//     field: string,
//     value: any
//   ) => {
//     setQuestions((prevQuestions) => {
//       const newQuestions = [...prevQuestions];
//       newQuestions[index] = {
//         ...newQuestions[index],
//         [field]: value,
//       };
//       return newQuestions;
//     });
//   };

//   // ---------------------------------------
//   // Save (Add or Update) Question
//   // ---------------------------------------
//   const handleSaveQuestion = () => {
//     // 1) Validate Disciplines
//     if (!InterviewQuesData.Disciplines.text) {
//       setValidationError((prev) => ({ ...prev, Disciplines: true }));
//       return;
//     }

//     // 2) Validate question type
//     if (!InterviewQuesData.QuestionType.text) {
//       setValidationError((prev) => ({ ...prev, QuestionType: true }));
//       return;
//     }

//     // 3) Validate question text
//     if (!InterviewQuesData.Question) {
//       setValidationError((prev) => ({ ...prev, Question: true }));
//       return;
//     }

//     // 4) If Multiple Choice => ensure at least one option is filled
//     if (InterviewQuesData.QuestionType.text === "Multiple Choice") {
//       const anyOptionFilled = OptionsType.some((opt) => opt.text.trim() !== "");
//       if (!anyOptionFilled) {
//         setValidationError((prev) => ({ ...prev, OptionsType: true }));
//         return;
//       }
//     } else {
//       // For non-multiple-choice, validate ExpectedAnswer
//       if (!InterviewQuesData.ExpectedAnswer) {
//         setValidationError((prev) => ({ ...prev, ExpectedAnswer: true }));
//         return;
//       }
//     }

//     // Build question object
//     const questionData = {
//       id:
//         editingQuestionIndex !== null
//           ? questions[editingQuestionIndex].id
//           : questions.length + 1,
//       discipline: InterviewQuesData.Disciplines,
//       questionNumber: {
//         key: questions.length + 1,
//         text:
//           editingQuestionIndex !== null
//             ? `Question ${editingQuestionIndex + 1}`
//             : `Question ${questions.length + 1}`,
//       },
//       questionType: InterviewQuesData.QuestionType,
//       question: InterviewQuesData.Question,
//       // If Multiple Choice, store the options array; otherwise store ExpectedAnswer
//       expectedAnswer:
//         InterviewQuesData.QuestionType.text === "Multiple Choice"
//           ? undefined
//           : InterviewQuesData.ExpectedAnswer,
//       options:
//         InterviewQuesData.QuestionType.text === "Multiple Choice"
//           ? OptionsType
//           : undefined,
//       isDisqualification: isDisqualification === "YES",
//     };

//     if (editingQuestionIndex !== null) {
//       const updated = [...questions];
//       updated[editingQuestionIndex] = questionData;
//       setQuestions(updated);
//       setEditingQuestionIndex(null);
//     } else {
//       setQuestions((prev) => [...prev, questionData]);
//     }

//     // Reset form
//     setInterviewQuesData({
//       Disciplines: { key: 0, text: "" },
//       QuestionNumber: { key: 0, text: "" },
//       QuestionType: { key: 0, text: "" },
//       Question: "",
//       ExpectedAnswer: "",
//     });
//     setOptionsType([{ text: "" }]);
//     setIsDisqualification("NO");
//   };

//   // Add a new option row
//   const handleAddRow = () => {
//     setOptionsType((prev) => [...prev, { text: "" }]);
//   };

//   // Delete an option row
//   const handleDeleteRow = (index: number) => {
//     setOptionsType((prev) => prev.filter((_, i) => i !== index));
//   };

//   // Update the text in an option row
//   const handleOptionChange = (index: number, newVal: string) => {
//     setOptionsType((prev) => {
//       const updated = [...prev];
//       updated[index].text = newVal;
//       return updated;
//     });
//   };

//   const tabs = [
//     {
//       label: "Interview Questions",
//       value: "tab1",
//       content: (
//         <Card
//           variant="outlined"
//           sx={{
//             boxShadow: "0px 7px 4px 3px #d3d3d3",
//             borderRadius: "10px",
//             marginTop: "2%",
//           }}
//         >
//           <CardContent>
//             <Box sx={{ display: "flex", alignItems: "flex-start" }}>
//               <Box
//                 sx={{
//                   width: "30%",
//                   pr: 3,
//                   display: "flex",
//                   flexDirection: "column",
//                   alignItems: "center",
//                 }}
//               >
//                 <Box sx={{ textAlign: "center", mb: 2 }}>
//                   <Typography
//                     variant="h6"
//                     sx={{
//                       color: "#d32f2f",
//                       fontWeight: "bold",
//                       fontSize: "1.1rem",
//                       mt: 1,
//                     }}
//                   >
//                     Interview Panel Questions
//                   </Typography>
//                 </Box>
//               </Box>

//               <Box sx={{ width: "70%" }}>
//                 <Box sx={{ mb: 2 }}>
//                   <div className="ms-Grid-row">
//                     <div className="ms-Grid-col ms-lg5">
//                       <CustomAutoComplete
//                         label="Disciplines"
//                         options={[
//                           { key: 0, text: "Scope" },
//                           { key: 1, text: "Technical" },
//                           { key: 2, text: "Behavioral" },
//                         ]}
//                         value={InterviewQuesData.Disciplines}
//                         onChange={(val) =>
//                           handleAutoComplete("Disciplines", val)
//                         }
//                         disabled={false}
//                         mandatory={true}
//                         error={ValidationError.Disciplines}
//                       />
//                     </div>
//                   </div>
//                 </Box>

//                 <Box sx={{ mt: 4 }}>
//                   {questions.map((q, index) => {
//                     const isExpanded = expandedQuestionIndex === index;
//                     return (
//                       <Card
//                         key={index}
//                         sx={{
//                           mb: 2,
//                           borderRadius: "10px",
//                           boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
//                         }}
//                       >
//                         <CardContent>
//                           <Box
//                             sx={{
//                               display: "flex",
//                               justifyContent: "space-between",
//                               alignItems: "center",
//                               cursor: "pointer",
//                             }}
//                             onClick={() => handleToggleExpand(index)}
//                           >
//                             <Typography variant="h6">
//                               {q.questionNumber.text}
//                             </Typography>
//                             <ExpandMoreIcon
//                               sx={{
//                                 transform: isExpanded
//                                   ? "rotate(180deg)"
//                                   : "rotate(0deg)",
//                                 transition: "transform 0.3s",
//                               }}
//                             />
//                           </Box>

//                           {/* Collapsible section with editable fields */}
//                           {isExpanded && (
//                             <>
//                               <Box sx={{ mb: 2 }}>
//                                 <div className="ms-Grid-row">
//                                   <div className="ms-Grid-col ms-lg5">
//                                     <CustomAutoComplete
//                                       label="Type of Question"
//                                       options={[
//                                         { key: 0, text: "Short Answer" },
//                                         { key: 1, text: "Long Answer" },
//                                         { key: 2, text: "Multiple Choice" },
//                                       ]}
//                                       value={q.questionType}
//                                       onChange={(val) =>
//                                         handleQuestionFieldChange(
//                                           index,
//                                           "questionType",
//                                           val
//                                         )
//                                       }
//                                       disabled={false}
//                                       mandatory={true}
//                                     />
//                                   </div>
//                                 </div>
//                               </Box>

//                               <Box sx={{ mb: 2 }}>
//                                 <RichTextEditor
//                                   label="Question"
//                                   value={q.question}
//                                   onChange={(val) =>
//                                     handleQuestionFieldChange(
//                                       index,
//                                       "question",
//                                       val
//                                     )
//                                   }
//                                   mandatory={true}
//                                 />
//                               </Box>

//                               {/* <Box sx={{ mb: 2 }}>
//                                 <RichTextEditor
//                                   label="Expected Answer"
//                                   value={q.expectedAnswer}
//                                   onChange={(val) =>
//                                     handleQuestionFieldChange(
//                                       index,
//                                       "expectedAnswer",
//                                       val
//                                     )
//                                   }
//                                   mandatory={true}
//                                 />
//                               </Box> */}
//                               {q.questionType.text === "Multiple Choice" ? (
//                                 <>
//                                   {q.options && q.options.length > 0 && (
//                                     <Box sx={{ mb: 2 }}>
//                                       {q.options.map(
//                                         (option: any, i: number) => (
//                                           <Typography key={i} variant="body2">
//                                             Option {i + 1}: {option.text}
//                                           </Typography>
//                                         )
//                                       )}
//                                     </Box>
//                                   )}
//                                 </>
//                               ) : (
//                                 <Box sx={{ mb: 2 }}>
//                                   <RichTextEditor
//                                     label="Expected Answer"
//                                     value={q.expectedAnswer}
//                                     onChange={(val) =>
//                                       handleQuestionFieldChange(
//                                         index,
//                                         "expectedAnswer",
//                                         val
//                                       )
//                                     }
//                                     mandatory={true}
//                                   />
//                                 </Box>
//                               )}
//                               <Box sx={{ mb: 2 }}>
//                                 <CustomRadioGroup
//                                   label="Disqualification Question?"
//                                   value={q.isDisqualification ? "YES" : "NO"}
//                                   onChange={(val) =>
//                                     handleQuestionFieldChange(
//                                       index,
//                                       "isDisqualification",
//                                       val === "YES"
//                                     )
//                                   }
//                                   mandatory={true}
//                                   options={["YES", "NO"]}
//                                 />
//                               </Box>
//                             </>
//                           )}
//                         </CardContent>
//                       </Card>
//                     );
//                   })}
//                 </Box>

//                 <Box
//                   sx={{
//                     border: "1px solid #e0e0e0",
//                     borderRadius: "4px",
//                     p: 2,
//                     mb: 2,
//                   }}
//                 >
//                   <Box
//                     sx={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       alignItems: "center",
//                       mb: 2,
//                       cursor: "pointer",
//                     }}
//                     onClick={() => setIsAddQuestionOpen(!isAddQuestionOpen)}
//                   >
//                     <Typography variant="subtitle1" fontWeight="medium">
//                       Add Questions
//                     </Typography>
//                     <ExpandMoreIcon
//                       sx={{
//                         transform: isAddQuestionOpen
//                           ? "rotate(180deg)"
//                           : "rotate(0deg)",
//                         transition: "transform 0.3s",
//                       }}
//                     />
//                   </Box>

//                   {isAddQuestionOpen && (
//                     <>
//                       <Box sx={{ mb: 2 }}>
//                         <div className="ms-Grid-row">
//                           <div className="ms-Grid-col ms-lg5">
//                             <CustomAutoComplete
//                               label="Type of Question"
//                               options={[
//                                 { key: 0, text: "Short Answer" },
//                                 { key: 1, text: "Long Answer" },
//                                 { key: 2, text: "Multiple Choice" },
//                               ]}
//                               value={InterviewQuesData.QuestionType}
//                               onChange={(val) =>
//                                 handleAutoComplete("QuestionType", val)
//                               }
//                               disabled={false}
//                               mandatory={true}
//                               error={ValidationError.QuestionType}
//                             />
//                           </div>
//                         </div>
//                       </Box>

//                       {/* Question */}
//                       <Box sx={{ mb: 2 }}>
//                         <RichTextEditor
//                           label="Question"
//                           value={InterviewQuesData.Question}
//                           onChange={(val) =>
//                             handleRichTextEditor(val, "Question")
//                           }
//                           mandatory={true}
//                         />
//                       </Box>

//                       {InterviewQuesData.QuestionType.text ===
//                       "Multiple Choice" ? (
//                         <Box sx={{ mb: 2 }}>
//                           {OptionsType.map((option, index) => {
//                             const isFilled = option.text.trim() !== "";
//                             return (
//                               <Box
//                                 key={index}
//                                 sx={{
//                                   display: "flex",
//                                   alignItems: "center",
//                                   mb: 2,
//                                   gap: 1,
//                                 }}
//                               >
//                                 <Typography
//                                   variant="body1"
//                                   sx={{ width: "80px" }}
//                                 >
//                                   Option {index + 1} *
//                                 </Typography>

//                                 <CustomInput
//                                   label=""
//                                   value={option.text}
//                                   onChange={(val) =>
//                                     handleOptionChange(index, val)
//                                   }
//                                 />

//                                 <Box
//                                   sx={{
//                                     backgroundColor: isFilled
//                                       ? "green"
//                                       : "gray",
//                                     borderRadius: "50%",
//                                     width: 30,
//                                     height: 30,
//                                     display: "flex",
//                                     alignItems: "center",
//                                     justifyContent: "center",
//                                   }}
//                                 >
//                                   <CheckCircleIcon
//                                     sx={{
//                                       color: "white",
//                                       fontSize: 20,
//                                     }}
//                                   />
//                                 </Box>

//                                 {/* Buttons */}
//                                 <Box sx={{ display: "flex", gap: 1 }}>
//                                   {/* Add button (always visible on the last row) */}
//                                   {index === OptionsType.length - 1 && (
//                                     <Button
//                                       variant="contained"
//                                       sx={{
//                                         backgroundColor: "red",
//                                         color: "white",
//                                         minWidth: 40,
//                                         "&:hover": {
//                                           backgroundColor: "#b71c1c",
//                                         },
//                                       }}
//                                       onClick={handleAddRow}
//                                     >
//                                       <AddIcon />
//                                     </Button>
//                                   )}

//                                   {/* Delete button if more than one option */}
//                                   {OptionsType.length > 1 && (
//                                     <Button
//                                       variant="contained"
//                                       sx={{
//                                         backgroundColor: "red",
//                                         color: "white",
//                                         minWidth: 40,
//                                         "&:hover": {
//                                           backgroundColor: "#b71c1c",
//                                         },
//                                       }}
//                                       onClick={() => handleDeleteRow(index)}
//                                     >
//                                       X
//                                     </Button>
//                                   )}
//                                 </Box>
//                               </Box>
//                             );
//                           })}

//                           {/* Validation message if no option is filled */}
//                           {ValidationError.OptionsType && (
//                             <Typography color="error">
//                               Please provide at least one valid option.
//                             </Typography>
//                           )}
//                         </Box>
//                       ) : (
//                         // Show Expected Answer if not Multiple Choice
//                         <Box sx={{ mb: 2 }}>
//                           <RichTextEditor
//                             label="Expected Answer"
//                             value={InterviewQuesData.ExpectedAnswer}
//                             onChange={(val) =>
//                               handleRichTextEditor(val, "ExpectedAnswer")
//                             }
//                             mandatory={true}
//                           />
//                         </Box>
//                       )}

//                       {/* Disqualification? */}
//                       <Box sx={{ mb: 2 }}>
//                         <div className="ms-Grid-row">
//                           <div className="ms-Grid-col ms-lg8">
//                             <CustomRadioGroup
//                               label="Disqualification Question?"
//                               value={isDisqualification}
//                               options={["YES", "NO"]}
//                               error={false}
//                               mandatory={true}
//                               onChange={(item) => setIsDisqualification(item)}
//                             />
//                           </div>
//                         </div>
//                       </Box>
//                     </>
//                   )}

//                   {/* Add / Update button */}
//                   <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
//                     <Button
//                       variant="contained"
//                       startIcon={<AddIcon />}
//                       onClick={handleSaveQuestion}
//                       sx={{
//                         backgroundColor: "#d32f2f",
//                         color: "white",
//                         "&:hover": { backgroundColor: "#b71c1c" },
//                         textTransform: "none",
//                         borderRadius: "4px",
//                         px: 3,
//                       }}
//                     >
//                       {editingQuestionIndex !== null ? "Update" : "Add"}
//                     </Button>
//                   </Box>
//                 </Box>
//               </Box>
//             </Box>
//           </CardContent>
//         </Card>
//       ),
//     },
//   ];

//   useEffect(() => {
//     const activeTabObj = tabs.find((item) => item.value === activeTab);
//     if (activeTab === "tab1") {
//       setTabNameData(() => {
//         return [
//           { tabName: props.stateValue?.TabName },
//           { tabName: props.stateValue?.ButtonAction },
//           { tabName: activeTabObj?.label },
//         ];
//       });
//     }
//   }, [
//     props.stateValue?.ID,
//     activeTab,
//     props.stateValue?.TabName,
//     props.stateValue?.ButtonAction,
//   ]);

//   async function Submit_fn() {
//     alert("Submitted!");
//   }

//   return (
//     <>
//       <CustomLoader isLoading={isLoading}>
//         <div className="menu-card">
//           <React.Fragment>
//             <BreadcrumbsComponent
//               items={tabs}
//               initialItem={activeTab}
//               TabName={TabNameData}
//               onBreadcrumbChange={handleBreadcrumbChange}
//               handleCancel={handleCancel}
//               additionalButtons={[
//                 {
//                   label: "Close",
//                   onClick: async () => {
//                     props.navigation("/ReviewProfileList", {
//                       state: { activeTab: "tab2" },
//                     });
//                   },
//                 },
//                 {
//                   label: "Submit",
//                   onClick: async () => {
//                     await Submit_fn();
//                   },
//                 },
//               ]}
//             />
//           </React.Fragment>
//         </div>
//       </CustomLoader>

//       {AlertPopupOpen && (
//         <CustomAlert
//           {...alertProps}
//           onClose={() => setAlertPopupOpen(!AlertPopupOpen)}
//         />
//       )}
//     </>
//   );
// };

// export default InterviewQuesEdit;
///==========
///
import * as React from "react";
import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import "../../App.css"; // Adjust path as needed
import { Typography, Button, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

// Custom components
import CustomLoader from "../../Services/Loader/CustomLoader";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import BreadcrumbsComponent, {
  TabNameData,
} from "../../components/CustomBreadcrumps";
import CustomAutoComplete from "../../components/CustomAutoComplete";
import RichTextEditor from "../../components/CustomRichTextEditor";
import CustomRadioGroup from "../../components/CustomRadioGroup";
import CustomInput from "../../components/CustomInput";

// Models / Types
import type { InterviewQues } from "../../Models/RecuritmentVRR";
import type { alertPropsData, AutoCompleteItem } from "../../Models/Screens";

// Utilities
import {
  HRMSAlertOptions,
  RecuritmentHRMsg,
  RoleID,
} from "../../utilities/Config";
// import viewSubmissionImage from "../../assets/interview-white.svg";
type ValidationError = {
  QuestionType: boolean;
  QuestionNumber: boolean;
  Disciplines: boolean;
  Question: boolean;
  ExpectedAnswer: boolean;
  OptionsType: boolean;
};

type OptionRow = {
  text: string;
};

interface QuestionItem {
  id: number;
  discipline: AutoCompleteItem;
  questionNumber: {
    key: number;
    text: string;
  };
  questionType: AutoCompleteItem;
  question: string;
  expectedAnswer?: string; // For non-multiple-choice
  options?: OptionRow[]; // For multiple-choice
  isDisqualification: boolean;
}

const InterviewQuesEdit: React.FC = (props: any) => {
  // -------------------------------
  // States for adding a new question
  // -------------------------------
  const [InterviewQuesData, setInterviewQuesData] = useState<InterviewQues>({
    Disciplines: { key: 0, text: "" },
    QuestionNumber: { key: 0, text: "" },
    QuestionType: { key: 0, text: "" },
    Question: "",
    ExpectedAnswer: "",
  });

  // For multiple choice options when adding a new question
  const [OptionsType, setOptionsType] = useState<OptionRow[]>([{ text: "" }]);

  // Validation
  const [ValidationError, setValidationError] = useState<ValidationError>({
    QuestionType: false,
    QuestionNumber: false,
    Disciplines: false,
    Question: false,
    ExpectedAnswer: false,
    OptionsType: false,
  });

  // Disqualification radio for new question
  const [isDisqualification, setIsDisqualification] = useState("NO");

  // The array of saved questions
  const [questions, setQuestions] = useState<QuestionItem[]>([]);

  // If editing an existing question, store its index
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<
    number | null
  >(null);

  // Which question card is expanded (null = none)
  const [expandedQuestionIndex, setExpandedQuestionIndex] = useState<
    number | null
  >(null);

  // UI states
  const [isAddQuestionOpen, setIsAddQuestionOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [AlertPopupOpen, setAlertPopupOpen] = useState<boolean>(false);
  const [alertProps, setalertProps] = useState<alertPropsData>({
    Message: "",
    Type: "",
    ButtonAction: null,
    visible: false,
  });

  // Breadcrumb
  const [TabNameData, setTabNameData] = useState<TabNameData[]>([]);
  const [activeTab, setactiveTab] = useState("tab1");

  // -------------------------------
  // Handlers for adding a new question
  // -------------------------------
  const handleAutoComplete = (
    key: keyof InterviewQues,
    value: AutoCompleteItem | null
  ) => {
    setInterviewQuesData((prev) => ({
      ...prev,
      [key]: value || { key: 0, text: "" },
    }));
    setValidationError((prev) => ({ ...prev, [key]: false }));
  };

  const handleRichTextEditor = (value: string, stateKey: string) => {
    setInterviewQuesData((prev) => ({
      ...prev,
      [stateKey]: value,
    }));
    setValidationError((prev) => ({ ...prev, [stateKey]: false }));
  };

  // Add or Update a question
  const handleSaveQuestion = () => {
    // Basic validations
    if (!InterviewQuesData.Disciplines.text) {
      setValidationError((prev) => ({ ...prev, Disciplines: true }));
      return;
    }
    if (!InterviewQuesData.QuestionType.text) {
      setValidationError((prev) => ({ ...prev, QuestionType: true }));
      return;
    }
    if (!InterviewQuesData.Question) {
      setValidationError((prev) => ({ ...prev, Question: true }));
      return;
    }

    // If multiple choice => ensure at least one option is filled
    if (InterviewQuesData.QuestionType.text === "Multiple Choice") {
      const anyOptionFilled = OptionsType.some((opt) => opt.text.trim() !== "");
      if (!anyOptionFilled) {
        setValidationError((prev) => ({ ...prev, OptionsType: true }));
        return;
      }
    } else {
      // If not multiple choice => ExpectedAnswer must be filled
      if (!InterviewQuesData.ExpectedAnswer) {
        setValidationError((prev) => ({ ...prev, ExpectedAnswer: true }));
        return;
      }
    }

    // Build question data
    const questionData: QuestionItem = {
      id:
        editingQuestionIndex !== null
          ? questions[editingQuestionIndex].id
          : questions.length + 1,
      discipline: InterviewQuesData.Disciplines,
      questionNumber: {
        key: questions.length + 1,
        text:
          editingQuestionIndex !== null
            ? `Question ${editingQuestionIndex + 1}`
            : `Question ${questions.length + 1}`,
      },
      questionType: InterviewQuesData.QuestionType,
      question: InterviewQuesData.Question,
      expectedAnswer:
        InterviewQuesData.QuestionType.text === "Multiple Choice"
          ? undefined
          : InterviewQuesData.ExpectedAnswer,
      options:
        InterviewQuesData.QuestionType.text === "Multiple Choice"
          ? [...OptionsType] // Copy the current array of options
          : undefined,
      isDisqualification: isDisqualification === "YES",
    };

    if (editingQuestionIndex !== null) {
      // Update existing
      const updated = [...questions];
      updated[editingQuestionIndex] = questionData;
      setQuestions(updated);
      setEditingQuestionIndex(null);
    } else {
      // Add new
      setQuestions((prev) => [...prev, questionData]);
    }

    // Reset the form
    setInterviewQuesData({
      Disciplines: { key: 0, text: "" },
      QuestionNumber: { key: 0, text: "" },
      QuestionType: { key: 0, text: "" },
      Question: "",
      ExpectedAnswer: "",
    });
    setOptionsType([{ text: "" }]);
    setIsDisqualification("NO");
  };

  // For multiple choice (when adding a new question)
  const handleAddRow = () => {
    setOptionsType((prev) => [...prev, { text: "" }]);
  };
  const handleDeleteRow = (index: number) => {
    setOptionsType((prev) => prev.filter((_, i) => i !== index));
  };
  const handleOptionChange = (index: number, newVal: string) => {
    setOptionsType((prev) => {
      const updated = [...prev];
      updated[index].text = newVal;
      return updated;
    });
  };

  // -------------------------------
  // Handlers for existing questions
  // -------------------------------
  // Toggle card expansion
  const handleToggleExpand = (index: number) => {
    setExpandedQuestionIndex((prev) => (prev === index ? null : index));
  };

  // Update a question's top-level field (e.g., question, questionType, expectedAnswer)
  const handleQuestionFieldChange = (
    qIndex: number,
    field: string,
    value: any
  ) => {
    setQuestions((prev) => {
      const updated = [...prev];
      const question = { ...updated[qIndex], [field]: value };
      updated[qIndex] = question;
      return updated;
    });
  };

  // For editing multiple choice options inside an existing question
  const handleQuestionOptionChange = (
    qIndex: number,
    optIndex: number,
    newVal: string
  ) => {
    setQuestions((prev) => {
      const updated = [...prev];
      const question = { ...updated[qIndex] };

      // Initialize if missing
      if (!question.options) {
        question.options = [];
      }
      const opts = [...question.options];
      opts[optIndex] = { ...opts[optIndex], text: newVal };
      question.options = opts;

      updated[qIndex] = question;
      return updated;
    });
  };

  const handleQuestionAddRow = (qIndex: number) => {
    setQuestions((prev) => {
      const updated = [...prev];
      const question = { ...updated[qIndex] };

      if (!question.options) {
        question.options = [];
      }
      question.options.push({ text: "" });
      updated[qIndex] = question;
      return updated;
    });
  };

  const handleQuestionDeleteRow = (qIndex: number, optIndex: number) => {
    setQuestions((prev) => {
      const updated = [...prev];
      const question = { ...updated[qIndex] };

      if (!question.options) {
        question.options = [];
      }
      question.options.splice(optIndex, 1);
      updated[qIndex] = question;
      return updated;
    });
  };

  // -------------------------------
  // Navigation / Breadcrumb
  // -------------------------------
  const handleBreadcrumbChange = (newItem: string) => {
    setactiveTab(newItem);
  };

  const handleCancel = () => {
    setIsLoading(true);
    const CancelAlert = {
      Message: RecuritmentHRMsg.RecuritmentHRMsgCancel,
      Type: HRMSAlertOptions.Confirmation,
      visible: true,
      ButtonAction: async (userClickedOK: boolean) => {
        if (userClickedOK) {
          if (props.CurrentRoleID === RoleID.RecruitmentHR) {
            props.navigation("/ReviewProfileList", {
              state: { activeTab: "tab3" },
            });
          } else if (props.CurrentRoleID === RoleID.HOD) {
            props.navigation("/RecurimentProcess", {
              state: { activeTab: "tab3" },
            });
          } else if (props.CurrentRoleID === RoleID.LineManager) {
            props.navigation("/ReviewProfileList", {
              state: { activeTab: "tab2" },
            });
          } else {
            props.navigation("/InterviewPanelList");
          }
          setAlertPopupOpen(false);
        } else {
          setAlertPopupOpen(false);
        }
      },
    };
    setAlertPopupOpen(true);
    setalertProps(CancelAlert);
    setIsLoading(false);
  };

  // -------------------------------
  // Tabs array
  // -------------------------------
  const tabs = [
    {
      label: "Interview Questions",
      value: "tab1",
      content: (
        <Card
          variant="outlined"
          sx={{
            boxShadow: "0px 7px 4px 3px #d3d3d3",
            borderRadius: "10px",
            marginTop: "2%",
          }}
        >
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "flex-start" }}>
              {/* Left side */}
              <Box
                sx={{
                  position: "relative",
                  top: "286PX",
                  width: "30%",
                  pr: 3,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Box sx={{ textAlign: "center", mt: 2 }}>
                  <img
                    src={require("../../assets/interview.svg")}
                    alt="Interview Panel"
                    style={{ maxWidth: "100%", height: "auto" }}
                  />
                </Box>
                <Box sx={{ textAlign: "center", mb: 2 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#d32f2f",
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                      mt: 1,
                    }}
                  >
                    Interview Panel Questions
                  </Typography>
                </Box>
              </Box>

              {/* Right side */}
              <Box sx={{ width: "70%" }}>
                {/* Disciplines for new question */}
                <Box sx={{ mb: 2 }}>
                  <div className="ms-Grid-row">
                    <div className="ms-Grid-col ms-lg5">
                      <CustomAutoComplete
                        label="Disciplines"
                        options={[
                          { key: 0, text: "Scope" },
                          { key: 1, text: "Technical" },
                          { key: 2, text: "Behavioral" },
                        ]}
                        value={InterviewQuesData.Disciplines}
                        onChange={(val) =>
                          handleAutoComplete("Disciplines", val)
                        }
                        disabled={false}
                        mandatory={true}
                        error={ValidationError.Disciplines}
                      />
                    </div>
                  </div>
                </Box>

                {/* List of existing questions */}
                <Box sx={{ mt: 4 }}>
                  {questions.map((q, index) => {
                    const isExpanded = expandedQuestionIndex === index;
                    return (
                      <Card
                        key={q.id}
                        sx={{
                          mb: 2,
                          borderRadius: "10px",
                          boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
                        }}
                      >
                        <CardContent>
                          {/* Header row */}
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              cursor: "pointer",
                            }}
                            onClick={() => handleToggleExpand(index)}
                          >
                            <Typography variant="h6">
                              {q.questionNumber.text}
                            </Typography>
                            <ExpandMoreIcon
                              sx={{
                                transform: isExpanded
                                  ? "rotate(180deg)"
                                  : "rotate(0deg)",
                                transition: "transform 0.3s",
                              }}
                            />
                          </Box>

                          {/* Expandable area */}
                          {isExpanded && (
                            // SCROLLABLE CONTAINER
                            <Box
                              sx={{
                                mt: 2,
                                // Adjust the height to your preference
                                maxHeight: 300,
                                overflowY: "auto",
                                pr: 1, // Add some right padding so the scrollbar doesn't overlap content
                              }}
                            >
                              {/* QUESTION TYPE */}
                              <Box sx={{ mb: 2 }}>
                                <div className="ms-Grid-row">
                                  <div className="ms-Grid-col ms-lg5">
                                    <CustomAutoComplete
                                      label="Type of Question"
                                      options={[
                                        { key: 0, text: "Short Answer" },
                                        { key: 1, text: "Long Answer" },
                                        { key: 2, text: "Multiple Choice" },
                                      ]}
                                      value={q.questionType}
                                      onChange={(val) =>
                                        handleQuestionFieldChange(
                                          index,
                                          "questionType",
                                          val
                                        )
                                      }
                                      disabled={false}
                                      mandatory={true}
                                    />
                                  </div>
                                </div>
                              </Box>

                              {/* QUESTION TEXT */}
                              <Box sx={{ mb: 2 }}>
                                <RichTextEditor
                                  label="Question"
                                  value={q.question}
                                  onChange={(val) =>
                                    handleQuestionFieldChange(
                                      index,
                                      "question",
                                      val
                                    )
                                  }
                                  mandatory={true}
                                />
                              </Box>

                              {/* MULTIPLE CHOICE VS. EXPECTED ANSWER */}
                              {q.questionType.text === "Multiple Choice" ? (
                                <Box sx={{ mb: 2 }}>
                                  {q.options?.map((option, optIndex) => {
                                    const isFilled = option.text.trim() !== "";
                                    return (
                                      <Box
                                        key={optIndex}
                                        sx={{
                                          display: "flex",
                                          alignItems: "center",
                                          mb: 2,
                                          gap: 1,
                                        }}
                                      >
                                        <Typography
                                          variant="body1"
                                          sx={{ width: "80px" }}
                                        >
                                          Option {optIndex + 1} *
                                        </Typography>

                                        <CustomInput
                                          label=""
                                          value={option.text}
                                          onChange={(val) =>
                                            handleQuestionOptionChange(
                                              index,
                                              optIndex,
                                              val
                                            )
                                          }
                                        />

                                        <Box
                                          sx={{
                                            backgroundColor: isFilled
                                              ? "green"
                                              : "gray",
                                            borderRadius: "50%",
                                            width: 30,
                                            height: 30,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                          }}
                                        >
                                          <CheckCircleIcon
                                            sx={{
                                              color: "white",
                                              fontSize: 20,
                                            }}
                                          />
                                        </Box>

                                        {/* Add/Delete buttons */}
                                        <Box sx={{ display: "flex", gap: 1 }}>
                                          {/* Add button on the last row */}
                                          {optIndex ===
                                            q.options!.length - 1 && (
                                            <Button
                                              variant="contained"
                                              sx={{
                                                backgroundColor: "red",
                                                color: "white",
                                                minWidth: 40,
                                                "&:hover": {
                                                  backgroundColor: "#b71c1c",
                                                },
                                              }}
                                              onClick={() =>
                                                handleQuestionAddRow(index)
                                              }
                                            >
                                              <AddIcon />
                                            </Button>
                                          )}
                                          {/* Delete button if more than one option */}
                                          {q.options!.length > 1 && (
                                            <Button
                                              variant="contained"
                                              sx={{
                                                backgroundColor: "red",
                                                color: "white",
                                                minWidth: 40,
                                                "&:hover": {
                                                  backgroundColor: "#b71c1c",
                                                },
                                              }}
                                              onClick={() =>
                                                handleQuestionDeleteRow(
                                                  index,
                                                  optIndex
                                                )
                                              }
                                            >
                                              X
                                            </Button>
                                          )}
                                        </Box>
                                      </Box>
                                    );
                                  })}
                                </Box>
                              ) : (
                                <Box sx={{ mb: 2 }}>
                                  <RichTextEditor
                                    label="Expected Answer"
                                    value={q.expectedAnswer || ""}
                                    onChange={(val) =>
                                      handleQuestionFieldChange(
                                        index,
                                        "expectedAnswer",
                                        val
                                      )
                                    }
                                    mandatory={true}
                                  />
                                </Box>
                              )}

                              {/* DISQUALIFICATION */}
                              <Box sx={{ mb: 2 }}>
                                <CustomRadioGroup
                                  label="Disqualification Question?"
                                  value={q.isDisqualification ? "YES" : "NO"}
                                  onChange={(val) =>
                                    handleQuestionFieldChange(
                                      index,
                                      "isDisqualification",
                                      val === "YES"
                                    )
                                  }
                                  mandatory={true}
                                  options={["YES", "NO"]}
                                />
                              </Box>
                            </Box>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </Box>

                {/* Add a new question */}
                <Box
                  sx={{
                    border: "1px solid #e0e0e0",
                    borderRadius: "4px",
                    p: 2,
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                      cursor: "pointer",
                    }}
                    onClick={() => setIsAddQuestionOpen(!isAddQuestionOpen)}
                  >
                    <Typography variant="subtitle1" fontWeight="medium">
                      Add Questions
                    </Typography>
                    <ExpandMoreIcon
                      sx={{
                        transform: isAddQuestionOpen
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                        transition: "transform 0.3s",
                      }}
                    />
                  </Box>

                  {isAddQuestionOpen && (
                    <>
                      {/* Question Type */}
                      <Box sx={{ mb: 2 }}>
                        <div className="ms-Grid-row">
                          <div className="ms-Grid-col ms-lg5">
                            <CustomAutoComplete
                              label="Type of Question"
                              options={[
                                { key: 0, text: "Short Answer" },
                                { key: 1, text: "Long Answer" },
                                { key: 2, text: "Multiple Choice" },
                              ]}
                              value={InterviewQuesData.QuestionType}
                              onChange={(val) =>
                                handleAutoComplete("QuestionType", val)
                              }
                              disabled={false}
                              mandatory={true}
                              error={ValidationError.QuestionType}
                            />
                          </div>
                        </div>
                      </Box>

                      {/* Question */}
                      <Box sx={{ mb: 2 }}>
                        <RichTextEditor
                          label="Question"
                          value={InterviewQuesData.Question}
                          onChange={(val) =>
                            handleRichTextEditor(val, "Question")
                          }
                          mandatory={true}
                        />
                      </Box>

                      {/* If multiple choice => dynamic UI, else => expected answer */}
                      {InterviewQuesData.QuestionType.text ===
                      "Multiple Choice" ? (
                        <Box sx={{ mb: 2 }}>
                          {OptionsType.map((option, index) => {
                            const isFilled = option.text.trim() !== "";
                            return (
                              <Box
                                key={index}
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  mb: 2,
                                  gap: 1,
                                }}
                              >
                                <Typography
                                  variant="body1"
                                  sx={{ width: "80px" }}
                                >
                                  Option {index + 1} *
                                </Typography>
                                <CustomInput
                                  label=""
                                  value={option.text}
                                  onChange={(val) =>
                                    handleOptionChange(index, val)
                                  }
                                />
                                <Box
                                  sx={{
                                    backgroundColor: isFilled
                                      ? "green"
                                      : "gray",
                                    borderRadius: "50%",
                                    width: 30,
                                    height: 30,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  <CheckCircleIcon
                                    sx={{ color: "white", fontSize: 20 }}
                                  />
                                </Box>

                                {/* Add/Delete buttons */}
                                <Box sx={{ display: "flex", gap: 1 }}>
                                  {index === OptionsType.length - 1 && (
                                    <Button
                                      variant="contained"
                                      sx={{
                                        backgroundColor: "red",
                                        color: "white",
                                        minWidth: 40,
                                        "&:hover": {
                                          backgroundColor: "#b71c1c",
                                        },
                                      }}
                                      onClick={handleAddRow}
                                    >
                                      <AddIcon />
                                    </Button>
                                  )}
                                  {OptionsType.length > 1 && (
                                    <Button
                                      variant="contained"
                                      sx={{
                                        backgroundColor: "red",
                                        color: "white",
                                        minWidth: 40,
                                        "&:hover": {
                                          backgroundColor: "#b71c1c",
                                        },
                                      }}
                                      onClick={() => handleDeleteRow(index)}
                                    >
                                      X
                                    </Button>
                                  )}
                                </Box>
                              </Box>
                            );
                          })}

                          {/* Validation if no option is filled */}
                          {ValidationError.OptionsType && (
                            <Typography color="error">
                              Please provide at least one valid option.
                            </Typography>
                          )}
                        </Box>
                      ) : (
                        <Box sx={{ mb: 2 }}>
                          <RichTextEditor
                            label="Expected Answer"
                            value={InterviewQuesData.ExpectedAnswer}
                            onChange={(val) =>
                              handleRichTextEditor(val, "ExpectedAnswer")
                            }
                            mandatory={true}
                            error={ValidationError.ExpectedAnswer}
                          />
                        </Box>
                      )}

                      {/* Disqualification */}
                      <Box sx={{ mb: 2 }}>
                        <CustomRadioGroup
                          label="Disqualification Question?"
                          value={isDisqualification}
                          options={["YES", "NO"]}
                          error={false}
                          mandatory={true}
                          onChange={(item) => setIsDisqualification(item)}
                        />
                      </Box>
                    </>
                  )}

                  {/* Save button */}
                  <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={handleSaveQuestion}
                      sx={{
                        backgroundColor: "#d32f2f",
                        color: "white",
                        "&:hover": { backgroundColor: "#b71c1c" },
                        textTransform: "none",
                        borderRadius: "4px",
                        px: 3,
                      }}
                    >
                      {editingQuestionIndex !== null ? "Update" : "Add"}
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      ),
    },
  ];

  // -------------------------------
  // Lifecycle / Breadcrumb Setup
  // -------------------------------
  useEffect(() => {
    const activeTabObj = tabs.find((item) => item.value === activeTab);
    if (activeTab === "tab1") {
      setTabNameData(() => {
        return [
          { tabName: props.stateValue?.TabName },
          { tabName: props.stateValue?.ButtonAction },
          { tabName: activeTabObj?.label },
        ];
      });
    }
  }, [
    props.stateValue?.ID,
    activeTab,
    props.stateValue?.TabName,
    props.stateValue?.ButtonAction,
  ]);

  // Submit placeholder
  async function Submit_fn() {
    alert("Submitted!");
  }

  // -------------------------------
  // Render
  // -------------------------------
  return (
    <>
      <CustomLoader isLoading={isLoading}>
        <div className="menu-card">
          <React.Fragment>
            <BreadcrumbsComponent
              items={tabs}
              initialItem={activeTab}
              TabName={TabNameData}
              onBreadcrumbChange={handleBreadcrumbChange}
              handleCancel={handleCancel}
              additionalButtons={[
                {
                  label: "Close",
                  onClick: async () => {
                    props.navigation("/ReviewProfileList", {
                      state: { activeTab: "tab2" },
                    });
                  },
                },
                {
                  label: "Submit",
                  onClick: async () => {
                    await Submit_fn();
                  },
                },
              ]}
            />
          </React.Fragment>
        </div>
      </CustomLoader>

      {AlertPopupOpen && (
        <CustomAlert
          {...alertProps}
          onClose={() => setAlertPopupOpen(!AlertPopupOpen)}
        />
      )}
    </>
  );
};

export default InterviewQuesEdit;
