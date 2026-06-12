import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Plus,
  Trash2,
  AlertTriangle,
  Check,
  ChevronRight,
  ChevronLeft,
  Bold,
  Italic,
  Underline,
  List,
  Eye,
  FileText,
  Briefcase,
  Award,
  Zap,
  ChevronDown,
  Search,
} from "lucide-react";
import "./CreateAdvert.modules.scss";
import { AdvertismentDetails } from "../../Hooks/getAdvertismentDetails";
import { useMasterData, MasterItem } from "../../Hooks/useMasterData";
import { CareerPotalServices, CommonServices, masterService, RecruitmentServices } from "../../../../../../services/ServiceExport";
import { CategoryID } from "../../../../../../utilities/ConditionConfig";
import ModalPopup from "../../../../../Comman/ModalPopup/ModalPopup";
import { useModalPopup } from "../../../../../Comman/ModalPopup/useModalPopup";
import { ListNames } from "../../../../../../utilities/Config";


export type SubmitAdvert = {
  JobDescription: string,
  RoleProfile: string,
  JobDescriptionFrench: string,
  RoleProfileFrench: string,
  Qualification: string,
  PreferredQualification: string,
  RoleSpecificKnowledgeJson: string,
  TechnicalSkillsKnowledgeJson: string,
  JobCodeId: number,
  TotalPreferredExperienceId: number,
  PreferredExperienceId: number,
  FunctionTypeId: number,
  JobTitleofFunctionalManagerId: number,
  JobTitleofLMorSupervisorId: number,
  FunctionalManagerName: string
  LineManagerorSupervisorName: string
}

export interface CreateAdvertProps {
  isOpen: boolean;
  onClose: () => void;
  jobCodeId: number;
  onPublish: (advert: AdvertismentDetails) => void;
  SubmitKey?: (advert: SubmitAdvert) => void;
  showModal: (modalState: any) => void;
  closeModal: () => void;
  advertDetails?: AdvertismentDetails | null;
}


const truncateDropdownOption = (text: string, maxLength: number = 45): string => {
  if (!text) return "";
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};

export interface AutoCompleteState {
  key: string | number;
  text: string;
}

interface SearchableDropdownProps {
  options: { id: number | string; value: string; displayText: string }[];
  value: AutoCompleteState | null;
  onChange: (val: AutoCompleteState | null) => void;
  placeholder: string;
  error?: boolean;
  onAddCustom?: () => void;
}

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  options,
  value,
  onChange,
  placeholder,
  error,
  onAddCustom,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = options.filter((opt) =>
    (opt.displayText || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
    } else {
      const timer = setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleSelect = (opt: { id: number | string; value: string; displayText: string }) => {
    onChange({ key: opt.id, text: opt.displayText });
    setIsOpen(false);
  };

  return (
    <div className={`searchableDropdown ${error ? "error" : ""} ${isOpen ? "open" : ""}`} ref={dropdownRef}>
      <button
        type="button"
        className="dropdownTrigger"
        onClick={() => setIsOpen(!isOpen)}
        title={value ? value.text : ""}
      >
        <span className={`triggerText ${!value ? "placeholder" : ""}`}>
          {value ? truncateDropdownOption(value.text, 45) : placeholder}
        </span>
        <ChevronDown size={16} className="chevronIcon" />
      </button>

      {isOpen && (
        <div className="dropdownMenu">
          <div className="searchWrapper">
            <Search size={14} className="searchIcon" />
            <input
              ref={searchInputRef}
              type="text"
              className="searchInput"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
            {searchTerm && (
              <button
                type="button"
                className="clearSearchBtn"
                onClick={(e) => {
                  e.stopPropagation();
                  setSearchTerm("");
                }}
              >
                &times;
              </button>
            )}
          </div>

          <div className="optionsList">
            {filteredOptions.length === 0 ? (
              <div className="noOptions">No options found</div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = value ? opt.id === value.key : false;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    className={`optionItem ${isSelected ? "selected" : ""}`}
                    onClick={() => handleSelect(opt)}
                    title={opt.displayText}
                  >
                    <span className="optionText">{opt.displayText}</span>
                    {isSelected && <Check size={14} className="checkIcon" />}
                  </button>
                );
              })
            )}
            {onAddCustom && (
              <button
                type="button"
                className="addCustomOptionBtn"
                onClick={() => {
                  setIsOpen(false);
                  onAddCustom();
                }}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  background: "#eff6ff",
                  border: "none",
                  borderTop: "1px solid #e2e8f0",
                  color: "#2563eb",
                  fontWeight: 600,
                  fontSize: "13px",
                  textAlign: "center",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  position: "sticky",
                  bottom: 0,
                }}
              >
                <Plus size={14} /> Add Custom
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

interface MultiSelectSearchableDropdownProps {
  options: { id: number | string; value: string; displayText: string }[];
  value: AutoCompleteState[];
  onChange: (val: AutoCompleteState[]) => void;
  placeholder: string;
  error?: boolean;
  onAddCustom?: () => void;
}

const MultiSelectSearchableDropdown: React.FC<MultiSelectSearchableDropdownProps> = ({
  options,
  value,
  onChange,
  placeholder,
  error,
  onAddCustom,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = options.filter((opt) =>
    (opt.displayText || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
    } else {
      const timer = setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleSelect = (opt: { id: number | string; value: string; displayText: string }) => {
    const isSelected = value.some((val) => String(val.key) === String(opt.id));
    if (isSelected) {
      onChange(value.filter((val) => String(val.key) !== String(opt.id)));
    } else {
      onChange([...value, { key: opt.id, text: opt.displayText }]);
    }
  };

  const displayText = value.length > 0
    ? value.map((v) => v.text).join(", ")
    : placeholder;

  return (
    <div className={`searchableDropdown ${error ? "error" : ""} ${isOpen ? "open" : ""}`} ref={dropdownRef}>
      <button
        type="button"
        className="dropdownTrigger"
        onClick={() => setIsOpen(!isOpen)}
        title={value.length > 0 ? value.map((v) => v.text).join(", ") : ""}
      >
        <span className={`triggerText ${value.length === 0 ? "placeholder" : ""}`}>
          {truncateDropdownOption(displayText, 45)}
        </span>
        <ChevronDown size={16} className="chevronIcon" />
      </button>

      {isOpen && (
        <div className="dropdownMenu">
          <div className="searchWrapper">
            <Search size={14} className="searchIcon" />
            <input
              ref={searchInputRef}
              type="text"
              className="searchInput"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
            {searchTerm && (
              <button
                type="button"
                className="clearSearchBtn"
                onClick={(e) => {
                  e.stopPropagation();
                  setSearchTerm("");
                }}
              >
                &times;
              </button>
            )}
          </div>

          <div className="optionsList">
            {filteredOptions.length === 0 ? (
              <div className="noOptions">No options found</div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = value.some((val) => String(val.key) === String(opt.id));
                return (
                  <button
                    key={opt.id}
                    type="button"
                    className={`optionItem ${isSelected ? "selected" : ""}`}
                    onClick={() => handleSelect(opt)}
                    title={opt.displayText}
                  >
                    <span className="optionText">{opt.displayText}</span>
                    {isSelected && <Check size={14} className="checkIcon" />}
                  </button>
                );
              })
            )}
            {onAddCustom && (
              <button
                type="button"
                className="addCustomOptionBtn"
                onClick={() => {
                  setIsOpen(false);
                  onAddCustom();
                }}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  background: "#eff6ff",
                  border: "none",
                  borderTop: "1px solid #e2e8f0",
                  color: "#2563eb",
                  fontWeight: 600,
                  fontSize: "13px",
                  textAlign: "center",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  position: "sticky",
                  bottom: 0,
                }}
              >
                <Plus size={14} /> + Add Custom
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

interface AddCustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (english: string, french: string) => Promise<void>;
  title: string;
  options: { id: number | string; value: string; displayText: string }[];
}

const AddCustomModal: React.FC<AddCustomModalProps> = ({
  isOpen,
  onClose,
  onSave,
  title,
  options,
}) => {
  const [englishVal, setEnglishVal] = useState("");
  const [frenchVal, setFrenchVal] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setEnglishVal("");
      setFrenchVal("");
      setError("");
      setLoading(false);
    }
  }, [isOpen]);

  const handleSave = async () => {
    const en = englishVal.trim();
    const fr = frenchVal.trim();

    if (!en || !fr) {
      setError("Both English and French values are required.");
      return;
    }

    // Duplicate check
    const isDuplicate = options.some(
      (opt) =>
        opt.displayText.toLowerCase() === en.toLowerCase()
    );

    if (isDuplicate) {
      setError("This item already exists in the list.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await onSave(en, fr);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to save custom value.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="customModalOverlay">
      <div className="customModalContainer">
        <div className="customModalHeader">
          <h3>{title}</h3>
          <button type="button" className="closeBtn" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="customModalBody">
          {error && <div className="modalError">{error}</div>}
          <div className="modalFormGroup">
            <label>Value in English <span>*</span></label>
            <input
              type="text"
              value={englishVal}
              onChange={(e) => setEnglishVal(e.target.value)}
              placeholder="Enter English value..."
              disabled={loading}
            />
          </div>
          <div className="modalFormGroup">
            <label>Value in French <span>*</span></label>
            <input
              type="text"
              value={frenchVal}
              onChange={(e) => setFrenchVal(e.target.value)}
              placeholder="Enter French value..."
              disabled={loading}
            />
          </div>
        </div>
        <div className="customModalFooter">
          <button type="button" className="cancelBtn" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button type="button" className="saveBtn" onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export const CreateAdvert: React.FC<CreateAdvertProps> = ({
  isOpen,
  onClose,
  jobCodeId,
  onPublish,
  SubmitKey,
  showModal,
  closeModal,
  advertDetails,
}) => {
  const {
    totalExperience,
    // miningExperience,
    qualifications: dbQualifications,
    technicalSkills: dbTechnicalSkills,
    roleSpecificKnowledge: dbRoleSpecificKnowledge,
    Level: dbLevel,
    // managers,
    jobTitles,
    functionalType,
    loading: masterLoading,
  } = useMasterData();

  useEffect(() => {
}, [dbQualifications]);


useEffect(() => {
  if (!masterLoading) {
    setLocalJobTitles(jobTitles);
    setLocalFunctionalType(functionalType);
  }
}, [masterLoading, jobTitles, functionalType]);

  // Local master data states for dynamic updates
  const [localQualifications, setLocalQualifications] = useState<MasterItem[]>([]);
  const [localTechnicalSkills, setLocalTechnicalSkills] = useState<MasterItem[]>([]);
  const [localRoleSpecificKnowledge, setLocalRoleSpecificKnowledge] = useState<MasterItem[]>([]);
  const [localJobTitles, setLocalJobTitles] = useState<MasterItem[]>([]);
  const [localFunctionalType, setLocalFunctionalType] = useState<MasterItem[]>([]);
  const [managers, setmangers] = useState<MasterItem[]>([]);

  useEffect(() => {
    if (!masterLoading) {
      setLocalQualifications(dbQualifications);
      setLocalTechnicalSkills(dbTechnicalSkills);
      setLocalRoleSpecificKnowledge(dbRoleSpecificKnowledge);
      setLocalJobTitles(jobTitles);
      setLocalFunctionalType(functionalType);
    }
  }, [masterLoading, dbQualifications, dbTechnicalSkills, dbRoleSpecificKnowledge, jobTitles, functionalType]);

  interface CustomModalState {
    isOpen: boolean;
    fieldKey: "minQual" | "prefQual" | "selectedTechSkill" | "selectedKnowledge" | null;
    category: { id: number; name: string };
    title: string;
  }

  const [customModal, setCustomModal] = useState<CustomModalState>({
    isOpen: false,
    fieldKey: null,
    category: { id: 0, name: "" },
    title: "",
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [advertLang, setAdvertLang] = useState<"EN" | "FR">("EN");

  // Step 1 Form States
  const [rolePurposeEn, setRolePurposeEn] = useState("");
  const [rolePurposeFr, setRolePurposeFr] = useState("");
  const [jobDescEn, setJobDescEn] = useState("");
  const [jobDescFr, setJobDescFr] = useState("");
  // const [responsibilitiesEn, setResponsibilitiesEn] = useState<string[]>([""]);
  // const [responsibilitiesFr, setResponsibilitiesFr] = useState<string[]>([""]);

  // Step 2 Form States
  const [prefTotalExp, setPrefTotalExp] = useState<AutoCompleteState | null>(null);
  const [prefMiningExp, setPrefMiningExp] = useState<AutoCompleteState | null>(null);
  const [minQual, setMinQual] = useState<AutoCompleteState[]>([]);
  const [prefQual, setPrefQual] = useState<AutoCompleteState[]>([]);
  const [functionalMgr, setFunctionalMgr] = useState<AutoCompleteState | null>(null);
  const [lineMgr, setLineMgr] = useState<AutoCompleteState | null>(null);

  // Step 3 Form States
  const [selectedKnowledge, setSelectedKnowledge] = useState<AutoCompleteState | null>(null);
  const [knowledgeLevel, setKnowledgeLevel] = useState<AutoCompleteState | null>(null);
  const [selectedTechSkill, setSelectedTechSkill] = useState<AutoCompleteState | null>(null);
  const [techSkillLevel, setTechSkillLevel] = useState<AutoCompleteState | null>(null);

  const [functionalMgrJobTitle, setFunctionalMgrJobTitle] = useState<AutoCompleteState | null>(null);
  const [lineMgrJobTitle, setLineMgrJobTitle] = useState<AutoCompleteState | null>(null);
  const [jobFunctionalType, setJobFunctionalType] = useState<AutoCompleteState | null>(null);

  const { modalState, showModal: insideModelshow, closeModal: insideModalClose } = useModalPopup();

  // Added items (chips lists)
  const [roleKnowledgeChips, setRoleKnowledgeChips] = useState<{ skill: AutoCompleteState; level: AutoCompleteState }[]>([]);
  const [techSkillChips, setTechSkillChips] = useState<{ skill: AutoCompleteState; level: AutoCompleteState }[]>([]);

  // Validation States
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showErrorBanner, setShowErrorBanner] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Formatting toggles (for editor toolbar aesthetic feedback)
  const [boldActive, setBoldActive] = useState(false);
  const [italicActive, setItalicActive] = useState(false);
  const [underlineActive, setUnderlineActive] = useState(false);

  // Clear states when closed
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1);
      setShowErrorBanner(false);
      setErrors({});
      setPrefTotalExp(null);
      setPrefMiningExp(null);
      setMinQual([]);
      setPrefQual([]);
      setFunctionalMgr(null);
      setLineMgr(null);
      setSelectedKnowledge(null);
      setSelectedTechSkill(null);
      setKnowledgeLevel(null);
      setTechSkillLevel(null);
      setFunctionalMgrJobTitle(null);
      setLineMgrJobTitle(null);
      setJobFunctionalType(null);
      setRolePurposeEn("");
      setRolePurposeFr("");
      setJobDescEn("");
      setJobDescFr("");
      setRoleKnowledgeChips([]);
      setTechSkillChips([]);
      setmangers([]);
    }
  }, [isOpen]);

  // Fetch and populate existing advertisement data when editing
  useEffect(() => {
    const fetchAdvertDetails = async () => {
      if (!isOpen || masterLoading) return;

      if (advertDetails) {
        // 1. Populate from local state (passed as prop)
        // Step 1: Job details
        setRolePurposeEn(advertDetails.english.responsibilities[0] || "");
        setRolePurposeFr(advertDetails.french.responsibilities[0] || "");
        setJobDescEn(advertDetails.english.description || "");
        setJobDescFr(advertDetails.french.description || "");

        // Step 2: Experience & Qualifications
        let totalExpText = "";
        let miningExpText = "";
        (advertDetails.english.experience || []).forEach((exp) => {
          if (exp.startsWith("Total Experience:")) {
            totalExpText = exp.replace("Total Experience:", "").trim();
          } else if (exp.startsWith("Mining Experience:")) {
            miningExpText = exp.replace("Mining Experience:", "").trim();
          }
        });

        if (totalExpText) {
          const found = totalExperience.find(
            (e) => e.displayText.trim().toLowerCase() === totalExpText.toLowerCase()
          );
          if (found) {
            setPrefTotalExp({ key: Number(found.id), text: found.displayText });
          }
        }
        if (miningExpText) {
          const found = totalExperience.find(
            (e) => e.displayText.trim().toLowerCase() === miningExpText.toLowerCase()
          );
          if (found) {
            setPrefMiningExp({ key: Number(found.id), text: found.displayText });
          }
        }

        const minQuals: AutoCompleteState[] = [];
        (advertDetails.english.qualifications || []).forEach((qText) => {
          const found = localQualifications.find(
            (q) => q.displayText.trim().toLowerCase() === qText.trim().toLowerCase()
          );
          if (found) {
            minQuals.push({ key: found.id, text: found.displayText });
          }
        });
        setMinQual(minQuals);

        const prefQuals: AutoCompleteState[] = [];
        (advertDetails.english.PrefeQualification || []).forEach((qText) => {
          const found = localQualifications.find(
            (q) => q.displayText.trim().toLowerCase() === qText.trim().toLowerCase()
          );
          if (found) {
            prefQuals.push({ key: found.id, text: found.displayText });
          }
        });
        setPrefQual(prefQuals);

        // Job Functional Type
        const funcTypeText = advertDetails.english.JobFunctionalType[0] || "";
        if (funcTypeText) {
          const found = localFunctionalType.find(
            (f) => f.displayText.trim().toLowerCase() === funcTypeText.trim().toLowerCase()
          );
          if (found) {
            setJobFunctionalType({ key: Number(found.id), text: found.displayText });
          }
        }

        // Step 3: Skills & Knowledge Chips
        const roleChips: { skill: AutoCompleteState; level: AutoCompleteState }[] = [];
        const rkList = advertDetails.english.RoleSpecificKnowledge || [];
        const rkLevels = advertDetails.english.RequiredLevel || [];
        rkList.forEach((skText, idx) => {
          const foundSkill = localRoleSpecificKnowledge.find(
            (s) => s.displayText.trim().toLowerCase() === skText.trim().toLowerCase()
          );
          const lvlText = rkLevels[idx] || "";
          const foundLevel = dbLevel.find(
            (l) => l.displayText.trim().toLowerCase() === lvlText.trim().toLowerCase()
          );
          if (foundSkill && foundLevel) {
            roleChips.push({
              skill: { key: foundSkill.id, text: foundSkill.displayText },
              level: { key: foundLevel.id, text: foundLevel.displayText },
            });
          }
        });
        setRoleKnowledgeChips(roleChips);

        const techChips: { skill: AutoCompleteState; level: AutoCompleteState }[] = [];
        const tsList = advertDetails.english.TechnicalSkills || [];
        const tsLevels = advertDetails.english.LevelProficiency || [];
        tsList.forEach((skText, idx) => {
          const foundSkill = localTechnicalSkills.find(
            (s) => s.displayText.trim().toLowerCase() === skText.trim().toLowerCase()
          );
          const lvlText = tsLevels[idx] || "";
          const foundLevel = dbLevel.find(
            (l) => l.displayText.trim().toLowerCase() === lvlText.trim().toLowerCase()
          );
          if (foundSkill && foundLevel) {
            techChips.push({
              skill: { key: foundSkill.id, text: foundSkill.displayText },
              level: { key: foundLevel.id, text: foundLevel.displayText },
            });
          }
        });
        setTechSkillChips(techChips);

        // Fetch functional manager and line manager (since they aren't stored in localAdvertDetails translation object)
        if (jobCodeId) {
          try {
            const filterConditions = [
              {
                FilterKey: "JobCode/ID",
                Operator: "eq",
                FilterValue: jobCodeId,
              },
            ];
            const response = await RecruitmentServices.GetHRMSRecruitmentRoleProfileDetails(
              filterConditions,
              "",
            );
            if (response.status === 200 && response.data && response.data.length > 0) {
              const items = response.data[0];

              if (items.JobTitleofFunctionalManagerId) {
                const titleId = Number(items.JobTitleofFunctionalManagerId);
                const foundTitle = jobTitles.find(t => Number(t.id) === titleId);
                setFunctionalMgrJobTitle({
                  key: titleId,
                  text: foundTitle ? foundTitle.displayText : "",
                });
              }

              if (items.JobTitleofLMorSupervisorId) {
                const titleId = Number(items.JobTitleofLMorSupervisorId);
                const foundTitle = jobTitles.find(t => Number(t.id) === titleId);
                setLineMgrJobTitle({
                  key: titleId,
                  text: foundTitle ? foundTitle.displayText : "",
                });
              }

              const mgrOptions: MasterItem[] = [];
              const fMgrName = items.FunctionalManagerName || "";
              const lMgrName = items.LineManagerorSupervisorName || "";
              
              const fMgrKey = 55;
              const lMgrKey = 70;
              
              if (fMgrName) {
                mgrOptions.push({
                  id: fMgrKey,
                  value: String(fMgrKey),
                  displayText: fMgrName
                });
                setFunctionalMgr({ key: fMgrKey, text: fMgrName });
              }
              if (lMgrName) {
                mgrOptions.push({
                  id: lMgrKey,
                  value: String(lMgrKey),
                  displayText: lMgrName
                });
                setLineMgr({ key: lMgrKey, text: lMgrName });
              }
              if (mgrOptions.length > 0) {
                setmangers(mgrOptions);
              }
            }
          } catch (err) {
            console.error("Error fetching manager details for local details:", err);
          }
        }
      } else if (jobCodeId) {
        // Fallback: Fetch completely from DB
        try {
          const filterConditions = [
            {
              FilterKey: "JobCode/ID",
              Operator: "eq",
              FilterValue: jobCodeId,
            },
          ];
          const response = await RecruitmentServices.GetHRMSRecruitmentRoleProfileDetails(
            filterConditions,
            "",
          );
          if (response.status === 200 && response.data && response.data.length > 0) {
            const items = response.data[0];

            // 1. Job details (Step 1)
            setRolePurposeEn(items.RolePurpose || "");
            setRolePurposeFr(items.RolePurpose_fr || "");
            setJobDescEn(items.JobDescription || "");
            setJobDescFr(items.JobDescription_fr || "");

            // 2. Experience & Qualifications (Step 2)
            if (items.TotalExperience && items.TotalExperience.key) {
              setPrefTotalExp({
                key: Number(items.TotalExperience.key),
                text: items.TotalExperience.text,
              });
            }
            
            if (items.ExperienceinMiningIndustry && items.ExperienceinMiningIndustry.key) {
              setPrefMiningExp({
                key: Number(items.ExperienceinMiningIndustry.key),
                text: items.ExperienceinMiningIndustry.text,
              });
            }

            if (items.qualificationValue) {
              const minQ = (items.qualificationValue.MinQualification || []).map((q: any) => ({
                key: q.key,
                text: q.text,
              }));
              setMinQual(minQ);

              const prefQ = (items.qualificationValue.PrefeQualification || []).map((q: any) => ({
                key: q.key,
                text: q.text,
              }));
              setPrefQual(prefQ);
            }

            // 3. Job Functional Type
            if (items.JobFunctionalType && items.JobFunctionalType.key) {
              setJobFunctionalType({
                key: Number(items.JobFunctionalType.key),
                text: items.JobFunctionalType.text || "",
              });
            }

            // 4. Managers Titles & Names
            if (items.JobTitleofFunctionalManagerId) {
              const titleId = Number(items.JobTitleofFunctionalManagerId);
              const foundTitle = jobTitles.find(t => Number(t.id) === titleId);
              setFunctionalMgrJobTitle({
                key: titleId,
                text: foundTitle ? foundTitle.displayText : "",
              });
            }

            if (items.JobTitleofLMorSupervisorId) {
              const titleId = Number(items.JobTitleofLMorSupervisorId);
              const foundTitle = jobTitles.find(t => Number(t.id) === titleId);
              setLineMgrJobTitle({
                key: titleId,
                text: foundTitle ? foundTitle.displayText : "",
              });
            }

            const mgrOptions: MasterItem[] = [];
            const fMgrName = items.FunctionalManagerName || "";
            const lMgrName = items.LineManagerorSupervisorName || "";
            
            const fMgrKey = 55; // Placeholder mock ID matching implementation config
            const lMgrKey = 70; // Placeholder mock ID matching implementation config
            
            if (fMgrName) {
              mgrOptions.push({
                id: fMgrKey,
                value: String(fMgrKey),
                displayText: fMgrName
              });
              setFunctionalMgr({ key: fMgrKey, text: fMgrName });
            }
            if (lMgrName) {
              mgrOptions.push({
                id: lMgrKey,
                value: String(lMgrKey),
                displayText: lMgrName
              });
              setLineMgr({ key: lMgrKey, text: lMgrName });
            }
            if (mgrOptions.length > 0) {
              setmangers(mgrOptions);
            }

            // 5. Skills & Knowledge Chips (Step 3)
            if (items.RoleSpeKnowledgeValue) {
              const roleChips = items.RoleSpeKnowledgeValue.map((rk: any) => ({
                skill: { key: rk.RoleSpeKnowledge.key, text: rk.RoleSpeKnowledge.text },
                level: { key: rk.RequiredLevel.key, text: rk.RequiredLevel.text }
              }));
              setRoleKnowledgeChips(roleChips);
            }

            if (items.TechnicalSkillValue) {
              const techChips = items.TechnicalSkillValue.map((ts: any) => ({
                skill: { key: ts.TechnicalSkills.key, text: ts.TechnicalSkills.text },
                level: { key: ts.LevelProficiency.key, text: ts.LevelProficiency.text }
              }));
              setTechSkillChips(techChips);
            }
          }
        } catch (err) {
          console.error("Error fetching/populating role profile details:", err);
        }
      }
    };

    fetchAdvertDetails();
  }, [isOpen, jobCodeId, masterLoading, jobTitles, advertDetails]);

  const handleSaveCustom = async (englishText: string, frenchText: string) => {
    if (!customModal.fieldKey || !customModal.category.id) return;

    const payload = [{
      displayText: englishText,
      displayText_fr: frenchText,
      category: customModal.category,
    }];

    try {
      const res = await CareerPotalServices.UpsertMaster(payload);
      if (res.status === 200 && res.data && res.data.data && res.data.data.length > 0) {
        let MasterData
        let ListName = ""
        switch (customModal.fieldKey) {
          case "minQual":
            ListName = ListNames.HRMSQualification
            MasterData = {
              Qualification: res.data.data[0].displayText,
              QualificationCode: res.data.data[0].value,
              QualificationFrench: res.data.data[0].displayText_fr,
            };
            break;
          case "prefQual":
            ListName = ListNames.HRMSQualification
            MasterData = {
              Qualification: res.data.data[0].displayText,
              QualificationCode: res.data.data[0].value,
              QualificationFrench: res.data.data[0].displayText_fr,
            };
            break;
          case "selectedKnowledge":
            ListName = ListNames.HRMSRoleSpecificKnowlegeMaster
            MasterData = {
              RoleSpecificKnowledge: res.data.data[0].displayText,
              Code: res.data.data[0].value,
              RoleSpecificKnowledgeFrench: res.data.data[0].displayText_fr,
            };
            break;

          case "selectedTechSkill":
            ListName = ListNames.HRMSTechnicalSkills
            MasterData = {
              TechnicalSkills: res.data.data[0].displayText,
              Code: res.data.data[0].value,
              TechnicalSkillsfrench: res.data.data[0].displayText_fr,
            };
            break;
        }

        await RecruitmentServices.UpsertList(MasterData, ListName);
        const createdItem = res.data.data[0];
        const newItem: MasterItem = {
          id: createdItem.value || createdItem.ID || createdItem.id || String(Date.now()),
          value: createdItem.value || createdItem.id || "",
          displayText: createdItem.displayText || englishText,
        };

        // Dynamically add to options list and auto-select
        switch (customModal.fieldKey) {
          case "minQual":
            setLocalQualifications((prev) => [...prev, newItem]);
            setMinQual((prev) => [...prev, { key: newItem.id, text: newItem.displayText }]);
            break;
          case "prefQual":
            setLocalQualifications((prev) => [...prev, newItem]);
            setPrefQual((prev) => [...prev, { key: newItem.id, text: newItem.displayText }]);
            break;
          case "selectedTechSkill":
            setLocalTechnicalSkills((prev) => [...prev, newItem]);
            setSelectedTechSkill({ key: newItem.id, text: newItem.displayText });
            break;
          case "selectedKnowledge":
            setLocalRoleSpecificKnowledge((prev) => [...prev, newItem]);
            setSelectedKnowledge({ key: newItem.id, text: newItem.displayText });
            break;
        }

        insideModelshow({
          type: "success",
          title: "Custom Item Created",
          message: `"${englishText}" was successfully added to ${customModal.category.name} and selected.`,
          confirmLabel: "OK",
          onConfirm: insideModalClose,
        });
      } else {
        throw new Error(res.message || "Failed to save custom master data.");
      }
    } catch (err: any) {
      console.error("Error saving custom item:", err);
      insideModelshow({
        type: "error",
        title: "Error",
        message: err.message || "An unexpected error occurred while saving custom item.",
        confirmLabel: "Close",
        onConfirm: insideModalClose,
      });
      throw err;
    }
  };
  const getMaxYears = (text: string): number => {
    if (!text) return 0;
    const normalized = text.toLowerCase();

    if (normalized.includes("no mining exp") || normalized.includes("no exp")) {
      return 0;
    }

    const plusMatch = normalized.match(/(\d+)\s*\+/);
    if (plusMatch) {
      return Number(plusMatch[1]);
    }

    const rangeMatch = normalized.match(/(\d+)\s*-\s*(\d+)/);
    if (rangeMatch) {
      return Number(rangeMatch[2]);
    }

    const singleMatch = normalized.match(/(\d+)/);
    if (singleMatch) {
      return Number(singleMatch[1]);
    }

    return 0;
  };

  const handleTotalExpChange = (val: AutoCompleteState | null) => {
    setPrefTotalExp(val);
    if (val) {
      const maxTotal = getMaxYears(val.text);
      if (prefMiningExp) {
        const maxMining = getMaxYears(prefMiningExp.text);
        if (maxMining >= maxTotal) {
          setPrefMiningExp(null);
        }
      }
    } else {
      setPrefMiningExp(null);
    }
  };

const filteredMiningExperience = useMemo(() => {
  if (!prefTotalExp) return totalExperience;

  const selectedIndex = totalExperience.findIndex(
    (item) => item.displayText === prefTotalExp.text
  );

  return selectedIndex >= 0
    ? totalExperience.slice(0, selectedIndex + 1)
    : totalExperience;
}, [prefTotalExp, totalExperience]);

  const filteredMinQualOptions = useMemo(() => {
    const selectedKeys = new Set([
      ...minQual.map((q) => String(q.key)),
      ...prefQual.map((q) => String(q.key))
    ]);
    return localQualifications.filter((opt) => !selectedKeys.has(String(opt.id)));
  }, [minQual, prefQual, localQualifications]);

  const filteredPrefQualOptions = useMemo(() => {
    const selectedKeys = new Set([
      ...minQual.map((q) => String(q.key)),
      ...prefQual.map((q) => String(q.key))
    ]);
    return localQualifications.filter((opt) => !selectedKeys.has(String(opt.id)));
  }, [minQual, prefQual, localQualifications]);

  const handleFunctionalJobTitleChange = async (val: AutoCompleteState | null) => {
    setFunctionalMgrJobTitle(val);
    if (val) {
      let Filter = [
        {
           FilterKey: "ID",
           Operator: "eq",
           FilterValue: 55
        }
      ]
       const managersRes =
               await masterService.GetUserDetails(
                Filter,
                "and"
              );
            if (
              managersRes?.status === 200 
            ) {
              let displayText = [
                managersRes?.data?.FirstName,
                managersRes?.data?.MiddleName,
                managersRes?.data?.LastName
              ] .filter(Boolean)
                    .join(" ")

              const mappedManagers: AutoCompleteState ={
                key: managersRes.data?.ID,
                text: displayText
              }

              const ManagersOption: MasterItem ={
                 id: managersRes.data?.ID,
  value: String(managersRes.data?.ID) ?? "", 
  displayText: displayText
              }
        setFunctionalMgr(mappedManagers);
        setmangers([ManagersOption])
            }
    } else {
      setFunctionalMgr(null);
    }
  };

  const handleFunctionalMgrChange = (val: AutoCompleteState | null) => {
    setFunctionalMgr(val);
    if (val) {
      const matchedTitle = jobTitles.find((jt) => String(jt.id) === String(val.key));
      if (matchedTitle) {
        setFunctionalMgrJobTitle({ key: matchedTitle.id, text: matchedTitle.displayText });
      }
    } else {
      setFunctionalMgrJobTitle(null);
    }
  };

  const handleLineJobTitleChange = async (val: AutoCompleteState | null) => {
    setLineMgrJobTitle(val);
    if (val) {
        let Filter = [
        {
           FilterKey: "ID",
           Operator: "eq",
           FilterValue: 70
        }
      ]
       const managersRes =
               await masterService.GetUserDetails(
                Filter,
                "and"
              );
            if (
              managersRes?.status === 200 
            ) {
              let displayText = [
                managersRes?.data?.FirstName,
                managersRes?.data?.MiddleName,
                managersRes?.data?.LastName
              ] .filter(Boolean)
                    .join(" ")

              const mappedManagers: AutoCompleteState ={
                key: managersRes.data?.ID,
                text: displayText
              }

              const ManagersOption: MasterItem[] =[{
                 id: managersRes.data?.ID,
  value: String(managersRes.data?.ID) ?? "", 
  displayText: displayText
              },
              {
                 id: Number(functionalMgr?.key),
  value: String(functionalMgr?.key)  ?? "", 
  displayText: functionalMgr?.text ?? ""
              }
            ]
        setLineMgr(mappedManagers);
        setmangers(ManagersOption)
            }
      // const matchedManager = managers.find((m) => String(m.id) === String(val.key));
      // if (matchedManager) {
      //   setLineMgr({ key: matchedManager.id, text: matchedManager.displayText });
      // }
    } else {
      setLineMgr(null);
    }
  };

  const handleLineMgrChange = (val: AutoCompleteState | null) => {
    setLineMgr(val);
    if (val) {
      const matchedTitle = jobTitles.find((jt) => String(jt.id) === String(val.key));
      if (matchedTitle) {
        setLineMgrJobTitle({ key: matchedTitle.id, text: matchedTitle.displayText });
      }
    } else {
      setLineMgrJobTitle(null);
    }
  };

  // Handle Dynamic List Actions (Responsibilities)
  // const handleAddResponsibility = () => {
  //   if (advertLang === "EN") {
  //     setResponsibilitiesEn([...responsibilitiesEn, ""]);
  //   } else {
  //     setResponsibilitiesFr([...responsibilitiesFr, ""]);
  //   }
  // };

  // const handleRemoveResponsibility = (idx: number) => {
  //   if (advertLang === "EN") {
  //     setResponsibilitiesEn(responsibilitiesEn.filter((_, i) => i !== idx));
  //   } else {
  //     setResponsibilitiesFr(responsibilitiesFr.filter((_, i) => i !== idx));
  //   }
  // };

  // const handleResponsibilityChange = (idx: number, val: string) => {
  //   if (advertLang === "EN") {
  //     const updated = [...responsibilitiesEn];
  //     updated[idx] = val;
  //     setResponsibilitiesEn(updated);
  //   } else {
  //     const updated = [...responsibilitiesFr];
  //     updated[idx] = val;
  //     setResponsibilitiesFr(updated);
  //   }
  // };

  // Add tag chips for knowledge
  const handleAddKnowledgeChip = () => {
    const skillObj: AutoCompleteState | null = selectedKnowledge;

    const skillText = skillObj ? skillObj.text : "";

    // Validation for add button
    if (!skillObj || !knowledgeLevel) {
      setErrors((prev) => ({
        ...prev,
        knowledgeSelector: "Please select a knowledge area and select a proficiency level before adding.",
      }));
      return;
    }

    // Check duplicate
    if (roleKnowledgeChips.some((item) => item.skill.text.toLowerCase() === skillText.toLowerCase())) {
      setErrors((prev) => ({
        ...prev,
        knowledgeSelector: "This role specific knowledge has already been added.",
      }));
      return;
    }

    setRoleKnowledgeChips([
      ...roleKnowledgeChips,
      {
        skill: skillObj,
        level: knowledgeLevel
      }
    ]);
    setSelectedKnowledge(null);
    setKnowledgeLevel(null);
    setErrors((prev) => {
      const updated = { ...prev };
      delete updated.knowledgeSelector;
      delete updated.roleKnowledgeChips;
      return updated;
    });
  };

  const handleRemoveKnowledgeChip = (skillToRemove: string) => {
    setRoleKnowledgeChips(roleKnowledgeChips.filter((item) => item.skill.text !== skillToRemove));
  };

  // Add tag chips for technical skills
  const handleAddTechSkillChip = () => {
    const skillObj: AutoCompleteState | null = selectedTechSkill;

    const skillText = skillObj ? skillObj.text : "";

    // Validation for add button
    if (!skillObj || !techSkillLevel) {
      setErrors((prev) => ({
        ...prev,
        techSkillSelector: "Please select a technical skill and select a proficiency level before adding.",
      }));
      return;
    }

    // Check duplicate
    if (techSkillChips.some((item) => item.skill.text.toLowerCase() === skillText.toLowerCase())) {
      setErrors((prev) => ({
        ...prev,
        techSkillSelector: "This technical skill has already been added.",
      }));
      return;
    }

    setTechSkillChips([
      ...techSkillChips,
      {
        skill: skillObj,
        level: techSkillLevel
      }
    ]);
    setSelectedTechSkill(null);
    setTechSkillLevel(null);
    setErrors((prev) => {
      const updated = { ...prev };
      delete updated.techSkillSelector;
      delete updated.techSkillChips;
      return updated;
    });
  };

  const handleRemoveTechSkillChip = (skillToRemove: string) => {
    setTechSkillChips(techSkillChips.filter((item) => item.skill.text !== skillToRemove));
  };

  // Validate current step fields
  const validateStep = (step: number): boolean => {
    const stepErrors: Record<string, string> = {};

    if (step === 1) {
      if (!rolePurposeFr.trim() || !jobDescFr.trim()) {
        insideModelshow({
          type: "warning",
          title: "French Translation Required",
          message: "Please fill in Role Purpose (FR) and Job Description (FR) before proceeding.",
          confirmLabel: "OK",
          onConfirm: insideModalClose,
        });
      }

      if (!rolePurposeEn.trim()) stepErrors.rolePurposeEn = "Role Purpose (EN) is required.";
      if (!rolePurposeFr.trim()) stepErrors.rolePurposeFr = "Role Purpose (FR) is required.";
      if (!jobDescEn.trim()) stepErrors.jobDescEn = "Job Description (EN) is required.";
      if (!jobDescFr.trim()) stepErrors.jobDescFr = "Job Description (FR) is required.";


      // const emptyRespEn = responsibilitiesEn.filter((r) => !r.trim());
      // const emptyRespFr = responsibilitiesFr.filter((r) => !r.trim());
      // if (emptyRespEn.length > 0 || responsibilitiesEn.length === 0) {
      //   stepErrors.responsibilitiesEn = "All responsibilities in English must be filled.";
      // }
      // if (emptyRespFr.length > 0 || responsibilitiesFr.length === 0) {
      //   stepErrors.responsibilitiesFr = "All responsibilities in French must be filled.";
      // }
    }

    if (step === 2) {
      if (!prefTotalExp) stepErrors.prefTotalExp = "Preferred Total Experience is required.";
      if (!prefMiningExp) stepErrors.prefMiningExp = "Preferred Mining Experience is required.";

      const hasMinQual = minQual.length > 0;
      if (!hasMinQual) {
        stepErrors.minQual = "Minimum Qualification is required.";
      }

      const hasPrefQual = prefQual.length > 0;
      if (!hasPrefQual) {
        stepErrors.prefQual = "Preferred Qualification is required.";
      }

      if (hasMinQual && hasPrefQual) {
        const minQualTexts = new Set(minQual.map((q) => q.text.toLowerCase()));
        const prefQualTexts = prefQual.map((q) => q.text.toLowerCase());

        const hasOverlap = prefQualTexts.some((text) => minQualTexts.has(text));
        if (hasOverlap) {
          stepErrors.prefQual = "Minimum and Preferred Qualifications cannot contain duplicate entries.";
        }
      }

      if (!functionalMgrJobTitle) stepErrors.functionalMgrJobTitle = "Job Title of Functional Manager is required.";
      if (!functionalMgr) stepErrors.functionalMgr = "Functional Manager Name is required.";
      if (!lineMgrJobTitle) stepErrors.lineMgrJobTitle = "Job Title of Line Manager/Supervisor is required.";
      if (!lineMgr) stepErrors.lineMgr = "Line Manager/Supervisor Name is required.";
      if (!jobFunctionalType) stepErrors.jobFunctionalType = "Job Functional Type is required.";
    }

    if (step === 3) {
      if (roleKnowledgeChips.length === 0) {
        stepErrors.roleKnowledgeChips = "At least one role specific knowledge tag must be added.";
      }
      if (techSkillChips.length === 0) {
        stepErrors.techSkillChips = "At least one technical skill tag must be added.";
      }
    }

    setErrors(stepErrors);
    const isValid = Object.keys(stepErrors).length === 0;

    if (!isValid) {
      setShowErrorBanner(true);
      // Smart Validation UX: Auto-scroll to first error
      setTimeout(() => {
        const firstErrorEl = document.querySelector(".error");
        if (firstErrorEl) {
          firstErrorEl.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
    } else {
      setShowErrorBanner(false);
    }

    return isValid;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handlePrevStep = () => {
    setShowErrorBanner(false);
    setErrors({});
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handlePublish = () => {
    let isValid = true;
    for (let i = 1; i <= 3; i++) {
      if (!validateStep(i)) {
        setCurrentStep(i);
        isValid = false;
        break;
      }
    }

    if (!isValid) return;

    const finalMinQuals = minQual.map((q) => q.text);
    const finalPrefQuals = prefQual.map((q) => q.text);

    const publishedAdvert: AdvertismentDetails = {
      jobId: String(jobCodeId),
      english: {
        description: jobDescEn,
        responsibilities: [rolePurposeEn],
        qualifications: finalMinQuals,
        PrefeQualification: finalPrefQuals,
        experience: [
          `Total Experience: ${prefTotalExp ? prefTotalExp.text : ""}`,
          `Mining Experience: ${prefMiningExp ? prefMiningExp.text : ""}`
        ],
        RoleSpecificKnowledge: roleKnowledgeChips.map((c) => c.skill.text),
        RequiredLevel: roleKnowledgeChips.map((c) => c.level.text),
        TechnicalSkills: techSkillChips.map((c) => c.skill.text),
        LevelProficiency: techSkillChips.map((c) => c.level.text),
        JobFunctionalType: jobFunctionalType ? [jobFunctionalType.text] : [],
        JobBasedBGVVerification: [],
      },
      french: {
        description: jobDescFr,
        responsibilities: [rolePurposeFr],
        qualifications: finalMinQuals,
        PrefeQualification: finalPrefQuals,
        experience: [
          `Expérience totale: ${prefTotalExp ? prefTotalExp.text : ""}`,
          `Expérience minière: ${prefMiningExp ? prefMiningExp.text : ""}`
        ],
        RoleSpecificKnowledge: roleKnowledgeChips.map((c) => c.skill.text),
        RequiredLevel: roleKnowledgeChips.map((c) => c.level.text),
        TechnicalSkills: techSkillChips.map((c) => c.skill.text),
        LevelProficiency: techSkillChips.map((c) => c.level.text),
        JobFunctionalType: jobFunctionalType ? [jobFunctionalType.text] : [],
        JobBasedBGVVerification: [],
      },
    };

    onPublish(publishedAdvert);

    const QualificatioDetails = minQual.map((q) => ({ MinQualification: String(q.key) }));
    const PrefeQualification = prefQual.map((q) => ({ PrefeQualification: String(q.key) }));

    const RoleSpecificKnowledgeJson = roleKnowledgeChips.map((item) => ({
      RoleSpeKnowledge: String(item.skill.key),
      RequiredLevel: String(item.level.key),
    }));

    const TechnicalSkillsKnowledgeJson = techSkillChips.map((item) => ({
      TechnicalSkills: String(item.skill.key),
      LevelProficiency: String(item.level.key),
    }));

    const submitAdvert: SubmitAdvert = {
      JobDescription: jobDescEn,
      RoleProfile: rolePurposeEn,
      JobDescriptionFrench: jobDescFr,
      RoleProfileFrench: rolePurposeFr,
      Qualification: JSON.stringify(QualificatioDetails),
      PreferredQualification: JSON.stringify(PrefeQualification),
      RoleSpecificKnowledgeJson: JSON.stringify(RoleSpecificKnowledgeJson),
      TechnicalSkillsKnowledgeJson: JSON.stringify(TechnicalSkillsKnowledgeJson),
      JobCodeId: jobCodeId,
      TotalPreferredExperienceId: prefTotalExp ? Number(prefTotalExp.key) : 0,
      PreferredExperienceId: prefMiningExp ? Number(prefMiningExp.key) : 0,
      FunctionTypeId: jobFunctionalType ? Number(jobFunctionalType.key) : 0,
      JobTitleofFunctionalManagerId: functionalMgrJobTitle ? Number(functionalMgrJobTitle.key) : 0,
      JobTitleofLMorSupervisorId: lineMgrJobTitle ? Number(lineMgrJobTitle.key) : 0,
      FunctionalManagerName: functionalMgr ? functionalMgr.text : "",
      LineManagerorSupervisorName: lineMgr ? lineMgr.text : "",
    };
    console.log("Submit Advert Payload:", submitAdvert);
    if (SubmitKey) {
      SubmitKey(submitAdvert);
    }
  };

  const handleSaveDraft = () => {
    showModal({
      type: "success",
      title: "Draft Saved Successfully",
      message: "The job advertisement draft has been saved. You can complete it later.",
      confirmLabel: "OK",
      onConfirm: () => {
        closeModal();
        onClose();
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="createAdvertModal">
      <motion.div
        className="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        className="panel"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
      >
        {/* Header */}
        <div className="header">
          <div className="headerTop">
            <div className="titleSection">
              <div className="iconWrapper">
                <Eye size={22} />
              </div>
              <div>
                <h2>Create Job Advertisement</h2>
                <p>Complete all required information before publishing.</p>
              </div>
            </div>
            <button type="button" className="closeBtn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          {/* Progress Indicator Stepper */}
          <div className="stepper">
            <div className={`step ${currentStep >= 1 ? "active" : ""} ${currentStep > 1 ? "completed" : ""}`}>
              <div className="stepNumber">{currentStep > 1 ? <Check size={12} /> : "1"}</div>
              <span>Job Details</span>
            </div>
            <div className={`step ${currentStep >= 2 ? "active" : ""} ${currentStep > 2 ? "completed" : ""}`}>
              <div className="stepNumber">{currentStep > 2 ? <Check size={12} /> : "2"}</div>
              <span>Qualifications</span>
            </div>
            <div className={`step ${currentStep >= 3 ? "active" : ""} ${currentStep > 3 ? "completed" : ""}`}>
              <div className="stepNumber">{currentStep > 3 ? <Check size={12} /> : "3"}</div>
              <span>Skills</span>
            </div>
            <div className={`step ${currentStep === 4 ? "active" : ""}`}>
              <div className="stepNumber">4</div>
              <span>Review & Publish</span>
            </div>
          </div>
        </div>

        {/* Content Wrapper */}
        <div className="content" ref={contentRef}>
          {/* Smart Validation UX Banner */}
          {showErrorBanner && (
            <div className="errorBanner">
              <AlertTriangle size={18} />
              <span>
                Please complete {Object.keys(errors).length} required field(s) before continuing.
              </span>
            </div>
          )}

          {/* STEP 1: JOB DETAILS */}
          {currentStep === 1 && (
            <div className="formSection">
              <h3>Step 1: Job Details & Description</h3>

              {/* Language toggle for editing localized tabs */}
              <div className="advert-review-drawer__section advert-review-drawer__section--toggle" style={{ margin: "4px 0" }}>
                <div className="advert-review-drawer__toggle-label">Active Form Language</div>
                <div className="advert-review-drawer__toggle">
                  <button
                    type="button"
                    className={`advert-review-drawer__toggle-button ${advertLang === "EN" ? "is-active" : ""}`}
                    onClick={() => setAdvertLang("EN")}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    className={`advert-review-drawer__toggle-button ${advertLang === "FR" ? "is-active" : ""}`}
                    onClick={() => setAdvertLang("FR")}
                  >
                    French
                  </button>
                </div>
              </div>

              {advertLang === "EN" ? (
                <>
                  {/* Role Purpose EN */}
                  <div className="formGroup">
                    <label className="label">Role Purpose (English) <span>*</span></label>
                    <div className={`richTextEditor ${errors.rolePurposeEn ? "error" : ""}`}>
                      <div className="editorToolbar">
                        <button type="button" className={`toolbarBtn ${boldActive ? "active" : ""}`} onClick={() => setBoldActive(!boldActive)}><Bold size={13} /></button>
                        <button type="button" className={`toolbarBtn ${italicActive ? "active" : ""}`} onClick={() => setItalicActive(!italicActive)}><Italic size={13} /></button>
                        <button type="button" className={`toolbarBtn ${underlineActive ? "active" : ""}`} onClick={() => setUnderlineActive(!underlineActive)}><Underline size={13} /></button>
                        <button type="button" className="toolbarBtn"><List size={13} /></button>
                      </div>
                      <textarea
                        className="editorArea"
                        placeholder="Enter the primary objective of this role..."
                        value={rolePurposeEn}
                        onChange={(e) => setRolePurposeEn(e.target.value)}
                        maxLength={1000}
                      />
                      <div className="editorFooter">
                        {rolePurposeEn.length}/1000 characters
                      </div>
                    </div>
                    {errors.rolePurposeEn && <span className="errorText"><AlertTriangle size={12} /> {errors.rolePurposeEn}</span>}
                  </div>

                  {/* Job Description EN */}
                  <div className="formGroup">
                    <label className="label">Job Description (English) <span>*</span></label>
                    <div className={`richTextEditor ${errors.jobDescEn ? "error" : ""}`}>
                      <div className="editorToolbar">
                        <button type="button" className="toolbarBtn"><Bold size={13} /></button>
                        <button type="button" className="toolbarBtn"><Italic size={13} /></button>
                        <button type="button" className="toolbarBtn"><Underline size={13} /></button>
                        <button type="button" className="toolbarBtn"><List size={13} /></button>
                      </div>
                      <textarea
                        className="editorArea"
                        placeholder="Enter the full job description details..."
                        value={jobDescEn}
                        onChange={(e) => setJobDescEn(e.target.value)}
                        maxLength={2000}
                      />
                      <div className="editorFooter">
                        {jobDescEn.length}/2000 characters
                      </div>
                    </div>
                    {errors.jobDescEn && <span className="errorText"><AlertTriangle size={12} /> {errors.jobDescEn}</span>}
                  </div>

                  {/* Key Responsibilities EN */}
                  {/* <div className="formGroup">
                    <label className="label">Key Responsibilities (English) <span>*</span></label>
                    <div className="listInputs">
                      {responsibilitiesEn.map((resp, idx) => (
                        <div key={`resp-en-${idx}`} className="listRow">
                          <input
                            type="text"
                            className={`input ${errors.responsibilitiesEn ? "error" : ""}`}
                            placeholder={`Responsibility #${idx + 1}`}
                            value={resp}
                            onChange={(e) => handleResponsibilityChange(idx, e.target.value)}
                          />
                          {responsibilitiesEn.length > 1 && (
                            <button type="button" className="removeBtn" onClick={() => handleRemoveResponsibility(idx)}>
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      ))}
                      <button type="button" className="addBtn" onClick={handleAddResponsibility}>
                        <Plus size={14} /> Add Responsibility
                      </button>
                    </div>
                    {errors.responsibilitiesEn && <span className="errorText"><AlertTriangle size={12} /> {errors.responsibilitiesEn}</span>}
                  </div> */}
                </>
              ) : (
                <>
                  {/* Role Purpose FR */}
                  <div className="formGroup">
                    <label className="label">Role Purpose (French) <span>*</span></label>
                    <div className={`richTextEditor ${errors.rolePurposeFr ? "error" : ""}`}>
                      <div className="editorToolbar">
                        <button type="button" className="toolbarBtn"><Bold size={13} /></button>
                        <button type="button" className="toolbarBtn"><Italic size={13} /></button>
                        <button type="button" className="toolbarBtn"><Underline size={13} /></button>
                        <button type="button" className="toolbarBtn"><List size={13} /></button>
                      </div>
                      <textarea
                        className="editorArea"
                        placeholder="Saisir l'objectif principal du rôle..."
                        value={rolePurposeFr}
                        onChange={(e) => setRolePurposeFr(e.target.value)}
                        maxLength={1000}
                      />
                      <div className="editorFooter">
                        {rolePurposeFr.length}/1000 characters
                      </div>
                    </div>
                    {errors.rolePurposeFr && <span className="errorText"><AlertTriangle size={12} /> {errors.rolePurposeFr}</span>}
                  </div>

                  {/* Job Description FR */}
                  <div className="formGroup">
                    <label className="label">Job Description (French) <span>*</span></label>
                    <div className={`richTextEditor ${errors.jobDescFr ? "error" : ""}`}>
                      <div className="editorToolbar">
                        <button type="button" className="toolbarBtn"><Bold size={13} /></button>
                        <button type="button" className="toolbarBtn"><Italic size={13} /></button>
                        <button type="button" className="toolbarBtn"><Underline size={13} /></button>
                        <button type="button" className="toolbarBtn"><List size={13} /></button>
                      </div>
                      <textarea
                        className="editorArea"
                        placeholder="Saisir les détails de la description du poste..."
                        value={jobDescFr}
                        onChange={(e) => setJobDescFr(e.target.value)}
                        maxLength={2000}
                      />
                      <div className="editorFooter">
                        {jobDescFr.length}/2000 characters
                      </div>
                    </div>
                    {errors.jobDescFr && <span className="errorText"><AlertTriangle size={12} /> {errors.jobDescFr}</span>}
                  </div>

                  {/* Key Responsibilities FR */}
                  {/* <div className="formGroup">
                    <label className="label">Key Responsibilities (French) <span>*</span></label>
                    <div className="listInputs">
                      {responsibilitiesFr.map((resp, idx) => (
                        <div key={`resp-fr-${idx}`} className="listRow">
                          <input
                            type="text"
                            className={`input ${errors.responsibilitiesFr ? "error" : ""}`}
                            placeholder={`Responsabilité #${idx + 1}`}
                            value={resp}
                            onChange={(e) => handleResponsibilityChange(idx, e.target.value)}
                          />
                          {responsibilitiesFr.length > 1 && (
                            <button type="button" className="removeBtn" onClick={() => handleRemoveResponsibility(idx)}>
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      ))}
                      <button type="button" className="addBtn" onClick={handleAddResponsibility}>
                        <Plus size={14} /> Add Responsibility
                      </button>
                    </div>
                    {errors.responsibilitiesFr && <span className="errorText"><AlertTriangle size={12} /> {errors.responsibilitiesFr}</span>}
                  </div> */}
                </>
              )}
            </div>
          )}

          {/* STEP 2: QUALIFICATIONS & EXPERIENCE */}
          {currentStep === 2 && (
            <div className="formSection">
              <h3>Step 2: Qualifications & Experience Settings</h3>

              <div className="gridTwoCol">
                {/* Total Experience */}
                <div className="formGroup">
                  <label className="label">Preferred Total Experience <span>*</span></label>
                  <SearchableDropdown
                    options={totalExperience}
                    value={prefTotalExp}
                    onChange={handleTotalExpChange}
                    placeholder="Select Total Experience..."
                    error={!!errors.prefTotalExp}
                  />
                  {errors.prefTotalExp && <span className="errorText"><AlertTriangle size={12} /> {errors.prefTotalExp}</span>}
                </div>

                {/* Mining Experience */}
                <div className="formGroup">
                  <label className="label">Preferred Mining Experience <span>*</span></label>
                  <SearchableDropdown
                    options={filteredMiningExperience}
                    value={prefMiningExp}
                    onChange={setPrefMiningExp}
                    placeholder="Select Mining Experience..."
                    error={!!errors.prefMiningExp}
                  />
                  {errors.prefMiningExp && <span className="errorText"><AlertTriangle size={12} /> {errors.prefMiningExp}</span>}
                </div>

                {/* Minimum Qualification */}
                <div className="formGroup">
                  <label className="label">Minimum Qualification <span>*</span></label>
                  <MultiSelectSearchableDropdown
                    options={filteredMinQualOptions}
                    value={minQual}
                    onChange={setMinQual}
                    placeholder="Select Minimum Qualification..."
                    error={!!errors.minQual}
                    onAddCustom={() => setCustomModal({
                      isOpen: true,
                      fieldKey: "minQual",
                      category: { id: CategoryID.Qualification, name: "Qualification" },
                      title: "Add Custom Minimum Qualification"
                    })}
                  />
                  {minQual.length > 0 && (
                    <div className="chipsContainer" style={{ marginTop: "8px", display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {minQual.map((q) => (
                        <div key={q.key} className="chip">
                          <span>{q.text}</span>
                          <button
                            type="button"
                            className="removeChipBtn"
                            onClick={() => setMinQual(minQual.filter((item) => item.key !== q.key))}
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {errors.minQual && <span className="errorText"><AlertTriangle size={12} /> {errors.minQual}</span>}
                </div>

                {/* Preferred Qualification */}
                <div className="formGroup">
                  <label className="label">Preferred Qualification <span>*</span></label>
                  <MultiSelectSearchableDropdown
                    options={filteredPrefQualOptions}
                    value={prefQual}
                    onChange={setPrefQual}
                    placeholder="Select Preferred Qualification..."
                    error={!!errors.prefQual}
                    onAddCustom={() => setCustomModal({
                      isOpen: true,
                      fieldKey: "prefQual",
                      category: { id: CategoryID.Qualification, name: "Qualification" },
                      title: "Add Custom Preferred Qualification"
                    })}
                  />
                  {prefQual.length > 0 && (
                    <div className="chipsContainer" style={{ marginTop: "8px", display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {prefQual.map((q) => (
                        <div key={q.key} className="chip">
                          <span>{q.text}</span>
                          <button
                            type="button"
                            className="removeChipBtn"
                            onClick={() => setPrefQual(prefQual.filter((item) => item.key !== q.key))}
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {errors.prefQual && <span className="errorText"><AlertTriangle size={12} /> {errors.prefQual}</span>}
                </div>

                {/* Job Title of Functional Manager */}
                <div className="formGroup">
                  <label className="label">Job Title of Functional Manager <span>*</span></label>
                  <SearchableDropdown
                    options={localJobTitles}
                    value={functionalMgrJobTitle}
                    onChange={handleFunctionalJobTitleChange}
                    placeholder="Select Job Title of Functional Manager..."
                    error={!!errors.functionalMgrJobTitle}
                  // onAddCustom={() => setCustomModal({
                  //   isOpen: true,
                  //   fieldKey: "functionalMgrJobTitle",
                  //   category: { id: CategoryID.TitleforProfile, name: "Job Title" },
                  //   title: "Add Custom Job Title"
                  // })}
                  />
                  {errors.functionalMgrJobTitle && <span className="errorText"><AlertTriangle size={12} /> {errors.functionalMgrJobTitle}</span>}
                </div>

                {/* Functional Manager Name */}
                <div className="formGroup">
                  <label className="label">Functional Manager Name <span>*</span></label>
                  <SearchableDropdown
                    options={managers}
                    value={functionalMgr}
                    onChange={handleFunctionalMgrChange}
                    placeholder="Select Functional Manager Name..."
                    error={!!errors.functionalMgr}
                  />
                  {errors.functionalMgr && <span className="errorText"><AlertTriangle size={12} /> {errors.functionalMgr}</span>}
                </div>

                {/* Job Title of Line Manager/ Supervisor */}
                <div className="formGroup">
                  <label className="label">Job Title of Line Manager/ Supervisor <span>*</span></label>
                  <SearchableDropdown
                    options={localJobTitles}
                    value={lineMgrJobTitle}
                    onChange={handleLineJobTitleChange}
                    placeholder="Select Job Title of Line Manager/ Supervisor..."
                    error={!!errors.lineMgrJobTitle}
                  // onAddCustom={() => setCustomModal({
                  //   isOpen: true,
                  //   fieldKey: "lineMgrJobTitle",
                  //   category: { id: CategoryID.TitleforProfile, name: "Job Title" },
                  //   title: "Add Custom Job Title"
                  // })}
                  />
                  {errors.lineMgrJobTitle && <span className="errorText"><AlertTriangle size={12} /> {errors.lineMgrJobTitle}</span>}
                </div>

                {/* Line Manager/ Supervisor Name */}
                <div className="formGroup">
                  <label className="label">Line Manager/ Supervisor Name <span>*</span></label>
                  <SearchableDropdown
                    options={managers}
                    value={lineMgr}
                    onChange={handleLineMgrChange}
                    placeholder="Select Line Manager/ Supervisor Name..."
                    error={!!errors.lineMgr}
                  />
                  {errors.lineMgr && <span className="errorText"><AlertTriangle size={12} /> {errors.lineMgr}</span>}
                </div>

                {/* Job Functional Type */}
                <div className="formGroup">
                  <label className="label">Job Functional Type <span>*</span></label>
                  <SearchableDropdown
                    options={localFunctionalType}
                    value={jobFunctionalType}
                    onChange={setJobFunctionalType}
                    placeholder="Select Job Functional Type..."
                    error={!!errors.jobFunctionalType}
                  // onAddCustom={() => setCustomModal({
                  //   isOpen: true,
                  //   fieldKey: "jobFunctionalType",
                  //   category: { id: CategoryID.Function, name: "Functional Type" },
                  //   title: "Add Custom Functional Type"
                  // })}
                  />
                  {errors.jobFunctionalType && <span className="errorText"><AlertTriangle size={12} /> {errors.jobFunctionalType}</span>}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: SKILLS SECTION */}
          {currentStep === 3 && (
            <div className="formSection">
              <h3>Step 3: Role Skills & Knowledge</h3>

              {/* Role Specific Knowledge */}
              <div className="formGroup">
                <label className="label">Role Specific Knowledge <span>*</span></label>
                <div className="skillsSelectorGroup">
                  <div className="selectBox" style={{ flex: 1.5 }}>
                    <SearchableDropdown
                      options={localRoleSpecificKnowledge}
                      value={selectedKnowledge}
                      onChange={setSelectedKnowledge}
                      placeholder="Select Knowledge Area..."
                      error={!!errors.knowledgeSelector}
                      onAddCustom={() => setCustomModal({
                        isOpen: true,
                        fieldKey: "selectedKnowledge",
                        category: { id: CategoryID.RoleSpecificKnowledge, name: "Role Specific Knowledge" },
                        title: "Add Custom Role Specific Knowledge"
                      })}
                    />
                  </div>
                  <div className="selectBox">
                    <select
                      className={`select ${errors.knowledgeSelector ? "error" : ""}`}
                      value={knowledgeLevel ? String(knowledgeLevel.key) : ""}
                      onChange={(e) => {
                        const selectedVal = e.target.value;
                        const found = dbLevel.find((lvl) => String(lvl.id) === selectedVal);
                        setKnowledgeLevel(found ? { key: found.id, text: found.displayText } : null);
                      }}
                    >
                      <option value="">Required Level...</option>
                      {dbLevel.map((lvl) => (
                        <option key={lvl.id} value={lvl.id}>{lvl.displayText}</option>
                      ))}
                    </select>
                  </div>
                  <button type="button" className="addButton" onClick={handleAddKnowledgeChip}>
                    <Plus size={16} /> Add
                  </button>
                </div>
                {errors.knowledgeSelector && <span className="errorText"><AlertTriangle size={12} /> {errors.knowledgeSelector}</span>}
                {errors.roleKnowledgeChips && <span className="errorText"><AlertTriangle size={12} /> {errors.roleKnowledgeChips}</span>}

                <div className="chipsContainer" style={{ marginTop: "12px" }}>
                  {roleKnowledgeChips.length === 0 ? (
                    <span style={{ fontSize: "12px", color: "#94a3b8" }}>No knowledge areas added yet.</span>
                  ) : (
                    roleKnowledgeChips.map((chip) => (
                      <div key={chip.skill.text} className="chip">
                        <span>{chip.skill.text}</span>
                        <span className="badge">{chip.level.text}</span>
                        <button type="button" className="removeChipBtn" onClick={() => handleRemoveKnowledgeChip(chip.skill.text)}>
                          &times;
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Technical Skills */}
              <div className="formGroup" style={{ marginTop: "12px" }}>
                <label className="label">Technical Skills <span>*</span></label>
                <div className="skillsSelectorGroup">
                  <div className="selectBox" style={{ flex: 1.5 }}>
                    <SearchableDropdown
                      options={localTechnicalSkills}
                      value={selectedTechSkill}
                      onChange={setSelectedTechSkill}
                      placeholder="Select Technical Skill..."
                      error={!!errors.techSkillSelector}
                      onAddCustom={() => setCustomModal({
                        isOpen: true,
                        fieldKey: "selectedTechSkill",
                        category: { id: CategoryID.TechnicalSkills, name: "Technical Skill" },
                        title: "Add Custom Technical Skill"
                      })}
                    />
                  </div>
                  <div className="selectBox">
                    <select
                      className={`select ${errors.techSkillSelector ? "error" : ""}`}
                      value={techSkillLevel ? String(techSkillLevel.key) : ""}
                      onChange={(e) => {
                        const selectedVal = e.target.value;
                        const found = dbLevel.find((lvl) => String(lvl.id) === selectedVal);
                        setTechSkillLevel(found ? { key: found.id, text: found.displayText } : null);
                      }}
                    >
                      <option value="">Proficiency Level...</option>
                      {dbLevel.map((lvl) => (
                        <option key={lvl.id} value={lvl.id}>{lvl.displayText}</option>
                      ))}
                    </select>
                  </div>
                  <button type="button" className="addButton" onClick={handleAddTechSkillChip}>
                    <Plus size={16} /> Add
                  </button>
                </div>
                {errors.techSkillSelector && <span className="errorText"><AlertTriangle size={12} /> {errors.techSkillSelector}</span>}
                {errors.techSkillChips && <span className="errorText"><AlertTriangle size={12} /> {errors.techSkillChips}</span>}

                <div className="chipsContainer" style={{ marginTop: "12px" }}>
                  {techSkillChips.length === 0 ? (
                    <span style={{ fontSize: "12px", color: "#94a3b8" }}>No technical skills added yet.</span>
                  ) : (
                    techSkillChips.map((chip) => (
                      <div key={chip.skill.text} className="chip">
                        <span>{chip.skill.text}</span>
                        <span className="badge">{chip.level.text}</span>
                        <button type="button" className="removeChipBtn" onClick={() => handleRemoveTechSkillChip(chip.skill.text)}>
                          &times;
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: REVIEW & PUBLISH */}
          {currentStep === 4 && (
            <div className="formSection">
              <h3>Step 4: Review Advertisement</h3>
              <div className="reviewSummary">
                {/* Job Info review */}
                <div className="reviewCard">
                  <h4>Job Description & Purpose</h4>
                  <p style={{ fontWeight: 700, fontSize: "14px", marginBottom: "8px" }}>English Version</p>
                  <p style={{ color: "#475569", marginBottom: "12px" }}>{jobDescEn}</p>
                  <p style={{ fontWeight: 700, fontSize: "14px", marginBottom: "8px" }}>French Version</p>
                  <p style={{ color: "#475569" }}>{jobDescFr}</p>
                </div>

                <div className="reviewGrid">
                  {/* Experience review */}
                  <div className="reviewCard">
                    <h4>Experience & Qualifications</h4>
                    <p style={{ fontSize: "13px", marginBottom: "6px" }}><strong>Total Experience:</strong> {prefTotalExp ? prefTotalExp.text : ""}</p>
                    <p style={{ fontSize: "13px", marginBottom: "6px" }}><strong>Mining Experience:</strong> {prefMiningExp ? prefMiningExp.text : ""}</p>
                    <p style={{ fontSize: "13px", marginBottom: "6px" }}><strong>Minimum Qualification:</strong> {minQual.map((q) => q.text).join(", ")}</p>
                    <p style={{ fontSize: "13px" }}><strong>Preferred Qualification:</strong> {prefQual.map((q) => q.text).join(", ")}</p>
                  </div>

                  {/* Skills review */}
                  <div className="reviewCard">
                    <h4>Technical Skills & Knowledge</h4>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "4px" }}>
                      {techSkillChips.map((c) => (
                        <span key={`rev-ts-${c.skill.text}`} style={{ fontSize: "11px", background: "#f1f5f9", padding: "4px 8px", borderRadius: "12px" }}>
                          {c.skill.text} ({c.level.text})
                        </span>
                      ))}
                      {roleKnowledgeChips.map((c) => (
                        <span key={`rev-rk-${c.skill.text}`} style={{ fontSize: "11px", background: "#eff6ff", color: "#2563eb", padding: "4px 8px", borderRadius: "12px" }}>
                          {c.skill.text} ({c.level.text})
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sticky Footer */}
        <div className="stickyFooter">
          <div className="footerLeft">
            <button type="button" className="cancelBtn" onClick={onClose}>
              Cancel
            </button>
            <button type="button" className="draftBtn" onClick={handleSaveDraft}>
              Save Draft
            </button>
          </div>
          <div className="footerRight">
            {currentStep > 1 && (
              <button type="button" className="cancelBtn" onClick={handlePrevStep}>
                <ChevronLeft size={16} /> Back
              </button>
            )}
            {currentStep < 4 ? (
              <button type="button" className="publishBtn" onClick={handleNextStep}>
                Continue <ChevronRight size={16} />
              </button>
            ) : (
              <>
                {/* <button
                  type="button"
                  className="previewBtn"
                  onClick={() => {
                    showModal({
                      type: "info",
                      title: "Advertisement Preview",
                      message: `English Summary Description:\n\n${jobDescEn.slice(0, 300)}...`,
                      confirmLabel: "Close Preview",
                      onConfirm: closeModal,
                    });
                  }}
                >
                  <Eye size={16} /> Preview
                </button> */}
                <button type="button" className="publishBtn" onClick={handlePublish}>
                  <Check size={16} /> Create Advertisement
                </button>
              </>
            )}
          </div>
        </div>
      </motion.div>
      <ModalPopup {...modalState} onClose={closeModal} />
      <AddCustomModal
        isOpen={customModal.isOpen}
        onClose={() => setCustomModal((prev) => ({ ...prev, isOpen: false }))}
        onSave={handleSaveCustom}
        title={customModal.title}
        options={
          customModal.fieldKey === "minQual" || customModal.fieldKey === "prefQual"
            ? localQualifications.map((q) => ({ id: q.id, value: q.value, displayText: q.displayText }))
            : customModal.fieldKey === "selectedTechSkill"
              ? localTechnicalSkills.map((s) => ({ id: s.id, value: s.value, displayText: s.displayText }))
              : customModal.fieldKey === "selectedKnowledge"
                ? localRoleSpecificKnowledge.map((k) => ({ id: k.id, value: k.value, displayText: k.displayText }))
                : customModal.fieldKey === "functionalMgrJobTitle" || customModal.fieldKey === "lineMgrJobTitle"
                  ? localJobTitles.map((t) => ({ id: t.id, value: t.value, displayText: t.displayText }))
                  : customModal.fieldKey === "jobFunctionalType"
                    ? localFunctionalType.map((f) => ({ id: f.id, value: f.value, displayText: f.displayText }))
                    : []
        }
      />
    </div>
  );
};
