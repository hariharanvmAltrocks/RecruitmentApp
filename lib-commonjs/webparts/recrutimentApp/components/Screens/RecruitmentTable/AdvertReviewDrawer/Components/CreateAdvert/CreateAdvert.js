"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAdvert = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var framer_motion_1 = require("framer-motion");
var lucide_react_1 = require("lucide-react");
require("./CreateAdvert.modules.scss");
var useMasterData_1 = require("../../Hooks/useMasterData");
var ServiceExport_1 = require("../../../../../../services/ServiceExport");
var ConditionConfig_1 = require("../../../../../../utilities/ConditionConfig");
var ModalPopup_1 = tslib_1.__importDefault(require("../../../../../Comman/ModalPopup/ModalPopup"));
var useModalPopup_1 = require("../../../../../Comman/ModalPopup/useModalPopup");
var Config_1 = require("../../../../../../utilities/Config");
var truncateDropdownOption = function (text, maxLength) {
    if (maxLength === void 0) { maxLength = 45; }
    if (!text)
        return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};
var SearchableDropdown = function (_a) {
    var options = _a.options, value = _a.value, onChange = _a.onChange, placeholder = _a.placeholder, error = _a.error, onAddCustom = _a.onAddCustom;
    var _b = (0, react_1.useState)(false), isOpen = _b[0], setIsOpen = _b[1];
    var _c = (0, react_1.useState)(""), searchTerm = _c[0], setSearchTerm = _c[1];
    var dropdownRef = (0, react_1.useRef)(null);
    var searchInputRef = (0, react_1.useRef)(null);
    var filteredOptions = options.filter(function (opt) {
        return (opt.displayText || "").toLowerCase().includes(searchTerm.toLowerCase());
    });
    (0, react_1.useEffect)(function () {
        var handleClickOutside = function (event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        var handleKeyDown = function (event) {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("keydown", handleKeyDown);
        }
        return function () {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);
    (0, react_1.useEffect)(function () {
        if (!isOpen) {
            setSearchTerm("");
        }
        else {
            var timer_1 = setTimeout(function () {
                if (searchInputRef.current) {
                    searchInputRef.current.focus();
                }
            }, 50);
            return function () { return clearTimeout(timer_1); };
        }
    }, [isOpen]);
    var handleSelect = function (opt) {
        onChange({ key: opt.id, text: opt.displayText });
        setIsOpen(false);
    };
    return (react_1.default.createElement("div", { className: "searchableDropdown ".concat(error ? "error" : "", " ").concat(isOpen ? "open" : ""), ref: dropdownRef },
        react_1.default.createElement("button", { type: "button", className: "dropdownTrigger", onClick: function () { return setIsOpen(!isOpen); }, title: value ? value.text : "" },
            react_1.default.createElement("span", { className: "triggerText ".concat(!value ? "placeholder" : "") }, value ? truncateDropdownOption(value.text, 45) : placeholder),
            react_1.default.createElement(lucide_react_1.ChevronDown, { size: 16, className: "chevronIcon" })),
        isOpen && (react_1.default.createElement("div", { className: "dropdownMenu" },
            react_1.default.createElement("div", { className: "searchWrapper" },
                react_1.default.createElement(lucide_react_1.Search, { size: 14, className: "searchIcon" }),
                react_1.default.createElement("input", { ref: searchInputRef, type: "text", className: "searchInput", placeholder: "Search...", value: searchTerm, onChange: function (e) { return setSearchTerm(e.target.value); }, onClick: function (e) { return e.stopPropagation(); } }),
                searchTerm && (react_1.default.createElement("button", { type: "button", className: "clearSearchBtn", onClick: function (e) {
                        e.stopPropagation();
                        setSearchTerm("");
                    } }, "\u00D7"))),
            react_1.default.createElement("div", { className: "optionsList" },
                filteredOptions.length === 0 ? (react_1.default.createElement("div", { className: "noOptions" }, "No options found")) : (filteredOptions.map(function (opt) {
                    var isSelected = value ? opt.id === value.key : false;
                    return (react_1.default.createElement("button", { key: opt.id, type: "button", className: "optionItem ".concat(isSelected ? "selected" : ""), onClick: function () { return handleSelect(opt); }, title: opt.displayText },
                        react_1.default.createElement("span", { className: "optionText" }, opt.displayText),
                        isSelected && react_1.default.createElement(lucide_react_1.Check, { size: 14, className: "checkIcon" })));
                })),
                onAddCustom && (react_1.default.createElement("button", { type: "button", className: "addCustomOptionBtn", onClick: function () {
                        setIsOpen(false);
                        onAddCustom();
                    }, style: {
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
                    } },
                    react_1.default.createElement(lucide_react_1.Plus, { size: 14 }),
                    " + Add Custom")))))));
};
var MultiSelectSearchableDropdown = function (_a) {
    var options = _a.options, value = _a.value, onChange = _a.onChange, placeholder = _a.placeholder, error = _a.error, onAddCustom = _a.onAddCustom;
    var _b = (0, react_1.useState)(false), isOpen = _b[0], setIsOpen = _b[1];
    var _c = (0, react_1.useState)(""), searchTerm = _c[0], setSearchTerm = _c[1];
    var dropdownRef = (0, react_1.useRef)(null);
    var searchInputRef = (0, react_1.useRef)(null);
    var filteredOptions = options.filter(function (opt) {
        return (opt.displayText || "").toLowerCase().includes(searchTerm.toLowerCase());
    });
    (0, react_1.useEffect)(function () {
        var handleClickOutside = function (event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        var handleKeyDown = function (event) {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("keydown", handleKeyDown);
        }
        return function () {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);
    (0, react_1.useEffect)(function () {
        if (!isOpen) {
            setSearchTerm("");
        }
        else {
            var timer_2 = setTimeout(function () {
                if (searchInputRef.current) {
                    searchInputRef.current.focus();
                }
            }, 50);
            return function () { return clearTimeout(timer_2); };
        }
    }, [isOpen]);
    var handleSelect = function (opt) {
        var isSelected = value.some(function (val) { return String(val.key) === String(opt.id); });
        if (isSelected) {
            onChange(value.filter(function (val) { return String(val.key) !== String(opt.id); }));
        }
        else {
            onChange(tslib_1.__spreadArray(tslib_1.__spreadArray([], value, true), [{ key: opt.id, text: opt.displayText }], false));
        }
    };
    var displayText = value.length > 0
        ? value.map(function (v) { return v.text; }).join(", ")
        : placeholder;
    return (react_1.default.createElement("div", { className: "searchableDropdown ".concat(error ? "error" : "", " ").concat(isOpen ? "open" : ""), ref: dropdownRef },
        react_1.default.createElement("button", { type: "button", className: "dropdownTrigger", onClick: function () { return setIsOpen(!isOpen); }, title: value.length > 0 ? value.map(function (v) { return v.text; }).join(", ") : "" },
            react_1.default.createElement("span", { className: "triggerText ".concat(value.length === 0 ? "placeholder" : "") }, truncateDropdownOption(displayText, 45)),
            react_1.default.createElement(lucide_react_1.ChevronDown, { size: 16, className: "chevronIcon" })),
        isOpen && (react_1.default.createElement("div", { className: "dropdownMenu" },
            react_1.default.createElement("div", { className: "searchWrapper" },
                react_1.default.createElement(lucide_react_1.Search, { size: 14, className: "searchIcon" }),
                react_1.default.createElement("input", { ref: searchInputRef, type: "text", className: "searchInput", placeholder: "Search...", value: searchTerm, onChange: function (e) { return setSearchTerm(e.target.value); }, onClick: function (e) { return e.stopPropagation(); } }),
                searchTerm && (react_1.default.createElement("button", { type: "button", className: "clearSearchBtn", onClick: function (e) {
                        e.stopPropagation();
                        setSearchTerm("");
                    } }, "\u00D7"))),
            react_1.default.createElement("div", { className: "optionsList" },
                filteredOptions.length === 0 ? (react_1.default.createElement("div", { className: "noOptions" }, "No options found")) : (filteredOptions.map(function (opt) {
                    var isSelected = value.some(function (val) { return String(val.key) === String(opt.id); });
                    return (react_1.default.createElement("button", { key: opt.id, type: "button", className: "optionItem ".concat(isSelected ? "selected" : ""), onClick: function () { return handleSelect(opt); }, title: opt.displayText },
                        react_1.default.createElement("span", { className: "optionText" }, opt.displayText),
                        isSelected && react_1.default.createElement(lucide_react_1.Check, { size: 14, className: "checkIcon" })));
                })),
                onAddCustom && (react_1.default.createElement("button", { type: "button", className: "addCustomOptionBtn", onClick: function () {
                        setIsOpen(false);
                        onAddCustom();
                    }, style: {
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
                    } },
                    react_1.default.createElement(lucide_react_1.Plus, { size: 14 }),
                    " + Add Custom")))))));
};
var AddCustomModal = function (_a) {
    var isOpen = _a.isOpen, onClose = _a.onClose, onSave = _a.onSave, title = _a.title, options = _a.options;
    var _b = (0, react_1.useState)(""), englishVal = _b[0], setEnglishVal = _b[1];
    var _c = (0, react_1.useState)(""), frenchVal = _c[0], setFrenchVal = _c[1];
    var _d = (0, react_1.useState)(""), error = _d[0], setError = _d[1];
    var _e = (0, react_1.useState)(false), loading = _e[0], setLoading = _e[1];
    (0, react_1.useEffect)(function () {
        if (isOpen) {
            setEnglishVal("");
            setFrenchVal("");
            setError("");
            setLoading(false);
        }
    }, [isOpen]);
    var handleSave = function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var en, fr, isDuplicate, err_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    en = englishVal.trim();
                    fr = frenchVal.trim();
                    if (!en || !fr) {
                        setError("Both English and French values are required.");
                        return [2 /*return*/];
                    }
                    isDuplicate = options.some(function (opt) {
                        return opt.displayText.toLowerCase() === en.toLowerCase();
                    });
                    if (isDuplicate) {
                        setError("This item already exists in the list.");
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    setLoading(true);
                    setError("");
                    return [4 /*yield*/, onSave(en, fr)];
                case 2:
                    _a.sent();
                    onClose();
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _a.sent();
                    setError(err_1.message || "Failed to save custom value.");
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    if (!isOpen)
        return null;
    return (react_1.default.createElement("div", { className: "customModalOverlay" },
        react_1.default.createElement("div", { className: "customModalContainer" },
            react_1.default.createElement("div", { className: "customModalHeader" },
                react_1.default.createElement("h3", null, title),
                react_1.default.createElement("button", { type: "button", className: "closeBtn", onClick: onClose }, "\u00D7")),
            react_1.default.createElement("div", { className: "customModalBody" },
                error && react_1.default.createElement("div", { className: "modalError" }, error),
                react_1.default.createElement("div", { className: "modalFormGroup" },
                    react_1.default.createElement("label", null,
                        "Value in English ",
                        react_1.default.createElement("span", null, "*")),
                    react_1.default.createElement("input", { type: "text", value: englishVal, onChange: function (e) { return setEnglishVal(e.target.value); }, placeholder: "Enter English value...", disabled: loading })),
                react_1.default.createElement("div", { className: "modalFormGroup" },
                    react_1.default.createElement("label", null,
                        "Value in French ",
                        react_1.default.createElement("span", null, "*")),
                    react_1.default.createElement("input", { type: "text", value: frenchVal, onChange: function (e) { return setFrenchVal(e.target.value); }, placeholder: "Enter French value...", disabled: loading }))),
            react_1.default.createElement("div", { className: "customModalFooter" },
                react_1.default.createElement("button", { type: "button", className: "cancelBtn", onClick: onClose, disabled: loading }, "Cancel"),
                react_1.default.createElement("button", { type: "button", className: "saveBtn", onClick: handleSave, disabled: loading }, loading ? "Saving..." : "Save")))));
};
var CreateAdvert = function (_a) {
    var isOpen = _a.isOpen, onClose = _a.onClose, jobCodeId = _a.jobCodeId, onPublish = _a.onPublish, SubmitKey = _a.SubmitKey, showModal = _a.showModal, closeModal = _a.closeModal;
    var _b = (0, useMasterData_1.useMasterData)(), totalExperience = _b.totalExperience, 
    // miningExperience,
    dbQualifications = _b.qualifications, dbTechnicalSkills = _b.technicalSkills, dbRoleSpecificKnowledge = _b.roleSpecificKnowledge, dbLevel = _b.Level, managers = _b.managers, jobTitles = _b.jobTitles, functionalType = _b.functionalType, masterLoading = _b.loading;
    // Local master data states for dynamic updates
    var _c = (0, react_1.useState)([]), localQualifications = _c[0], setLocalQualifications = _c[1];
    var _d = (0, react_1.useState)([]), localTechnicalSkills = _d[0], setLocalTechnicalSkills = _d[1];
    var _e = (0, react_1.useState)([]), localRoleSpecificKnowledge = _e[0], setLocalRoleSpecificKnowledge = _e[1];
    var _f = (0, react_1.useState)([]), localJobTitles = _f[0], setLocalJobTitles = _f[1];
    var _g = (0, react_1.useState)([]), localFunctionalType = _g[0], setLocalFunctionalType = _g[1];
    (0, react_1.useEffect)(function () {
        if (!masterLoading) {
            setLocalQualifications(dbQualifications);
            setLocalTechnicalSkills(dbTechnicalSkills);
            setLocalRoleSpecificKnowledge(dbRoleSpecificKnowledge);
            setLocalJobTitles(jobTitles);
            setLocalFunctionalType(functionalType);
        }
    }, [masterLoading, dbQualifications, dbTechnicalSkills, dbRoleSpecificKnowledge, jobTitles, functionalType]);
    var _h = (0, react_1.useState)({
        isOpen: false,
        fieldKey: null,
        category: { id: 0, name: "" },
        title: "",
    }), customModal = _h[0], setCustomModal = _h[1];
    var _j = (0, react_1.useState)(1), currentStep = _j[0], setCurrentStep = _j[1];
    var _k = (0, react_1.useState)("EN"), advertLang = _k[0], setAdvertLang = _k[1];
    // Step 1 Form States
    var _l = (0, react_1.useState)(""), rolePurposeEn = _l[0], setRolePurposeEn = _l[1];
    var _m = (0, react_1.useState)(""), rolePurposeFr = _m[0], setRolePurposeFr = _m[1];
    var _o = (0, react_1.useState)(""), jobDescEn = _o[0], setJobDescEn = _o[1];
    var _p = (0, react_1.useState)(""), jobDescFr = _p[0], setJobDescFr = _p[1];
    // const [responsibilitiesEn, setResponsibilitiesEn] = useState<string[]>([""]);
    // const [responsibilitiesFr, setResponsibilitiesFr] = useState<string[]>([""]);
    // Step 2 Form States
    var _q = (0, react_1.useState)(null), prefTotalExp = _q[0], setPrefTotalExp = _q[1];
    var _r = (0, react_1.useState)(null), prefMiningExp = _r[0], setPrefMiningExp = _r[1];
    var _s = (0, react_1.useState)([]), minQual = _s[0], setMinQual = _s[1];
    var _t = (0, react_1.useState)([]), prefQual = _t[0], setPrefQual = _t[1];
    var _u = (0, react_1.useState)(null), functionalMgr = _u[0], setFunctionalMgr = _u[1];
    var _v = (0, react_1.useState)(null), lineMgr = _v[0], setLineMgr = _v[1];
    // Step 3 Form States
    var _w = (0, react_1.useState)(null), selectedKnowledge = _w[0], setSelectedKnowledge = _w[1];
    var _x = (0, react_1.useState)(null), knowledgeLevel = _x[0], setKnowledgeLevel = _x[1];
    var _y = (0, react_1.useState)(null), selectedTechSkill = _y[0], setSelectedTechSkill = _y[1];
    var _z = (0, react_1.useState)(null), techSkillLevel = _z[0], setTechSkillLevel = _z[1];
    var _0 = (0, react_1.useState)(null), functionalMgrJobTitle = _0[0], setFunctionalMgrJobTitle = _0[1];
    var _1 = (0, react_1.useState)(null), lineMgrJobTitle = _1[0], setLineMgrJobTitle = _1[1];
    var _2 = (0, react_1.useState)(null), jobFunctionalType = _2[0], setJobFunctionalType = _2[1];
    var _3 = (0, useModalPopup_1.useModalPopup)(), modalState = _3.modalState, insideModelshow = _3.showModal, insideModalClose = _3.closeModal;
    // Added items (chips lists)
    var _4 = (0, react_1.useState)([]), roleKnowledgeChips = _4[0], setRoleKnowledgeChips = _4[1];
    var _5 = (0, react_1.useState)([]), techSkillChips = _5[0], setTechSkillChips = _5[1];
    // Validation States
    var _6 = (0, react_1.useState)({}), errors = _6[0], setErrors = _6[1];
    var _7 = (0, react_1.useState)(false), showErrorBanner = _7[0], setShowErrorBanner = _7[1];
    var contentRef = (0, react_1.useRef)(null);
    // Formatting toggles (for editor toolbar aesthetic feedback)
    var _8 = (0, react_1.useState)(false), boldActive = _8[0], setBoldActive = _8[1];
    var _9 = (0, react_1.useState)(false), italicActive = _9[0], setItalicActive = _9[1];
    var _10 = (0, react_1.useState)(false), underlineActive = _10[0], setUnderlineActive = _10[1];
    // Clear states when closed
    (0, react_1.useEffect)(function () {
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
        }
    }, [isOpen]);
    var handleSaveCustom = function (englishText, frenchText) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var payload, res, MasterData, ListName, createdItem, newItem_1, err_2;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!customModal.fieldKey || !customModal.category.id)
                        return [2 /*return*/];
                    payload = [{
                            displayText: englishText,
                            displayText_fr: frenchText,
                            category: customModal.category,
                        }];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, ServiceExport_1.CareerPotalServices.UpsertMaster(payload)];
                case 2:
                    res = _a.sent();
                    if (!(res.status === 200 && res.data && res.data.data && res.data.data.length > 0)) return [3 /*break*/, 4];
                    MasterData = void 0;
                    ListName = "";
                    switch (customModal.fieldKey) {
                        case "minQual":
                            ListName = Config_1.ListNames.HRMSQualification;
                            MasterData = {
                                Qualification: res.data.data[0].displayText,
                                QualificationCode: res.data.data[0].value,
                                QualificationFrench: res.data.data[0].displayText_fr,
                            };
                            break;
                        case "prefQual":
                            ListName = Config_1.ListNames.HRMSQualification;
                            MasterData = {
                                Qualification: res.data.data[0].displayText,
                                QualificationCode: res.data.data[0].value,
                                QualificationFrench: res.data.data[0].displayText_fr,
                            };
                            break;
                        case "selectedKnowledge":
                            ListName = Config_1.ListNames.HRMSRoleSpecificKnowlegeMaster;
                            MasterData = {
                                RoleSpecificKnowledge: res.data.data[0].displayText,
                                Code: res.data.data[0].value,
                                RoleSpecificKnowledgeFrench: res.data.data[0].displayText_fr,
                            };
                            break;
                        case "selectedTechSkill":
                            ListName = Config_1.ListNames.HRMSTechnicalSkills;
                            MasterData = {
                                TechnicalSkills: res.data.data[0].displayText,
                                Code: res.data.data[0].value,
                                TechnicalSkillsfrench: res.data.data[0].displayText_fr,
                            };
                            break;
                    }
                    return [4 /*yield*/, ServiceExport_1.RecruitmentServices.UpsertList(MasterData, ListName)];
                case 3:
                    _a.sent();
                    createdItem = res.data.data[0];
                    newItem_1 = {
                        id: createdItem.value || createdItem.ID || createdItem.id || String(Date.now()),
                        value: createdItem.value || createdItem.id || "",
                        displayText: createdItem.displayText || englishText,
                    };
                    // Dynamically add to options list and auto-select
                    switch (customModal.fieldKey) {
                        case "minQual":
                            setLocalQualifications(function (prev) { return tslib_1.__spreadArray(tslib_1.__spreadArray([], prev, true), [newItem_1], false); });
                            setMinQual(function (prev) { return tslib_1.__spreadArray(tslib_1.__spreadArray([], prev, true), [{ key: newItem_1.id, text: newItem_1.displayText }], false); });
                            break;
                        case "prefQual":
                            setLocalQualifications(function (prev) { return tslib_1.__spreadArray(tslib_1.__spreadArray([], prev, true), [newItem_1], false); });
                            setPrefQual(function (prev) { return tslib_1.__spreadArray(tslib_1.__spreadArray([], prev, true), [{ key: newItem_1.id, text: newItem_1.displayText }], false); });
                            break;
                        case "selectedTechSkill":
                            setLocalTechnicalSkills(function (prev) { return tslib_1.__spreadArray(tslib_1.__spreadArray([], prev, true), [newItem_1], false); });
                            setSelectedTechSkill({ key: newItem_1.id, text: newItem_1.displayText });
                            break;
                        case "selectedKnowledge":
                            setLocalRoleSpecificKnowledge(function (prev) { return tslib_1.__spreadArray(tslib_1.__spreadArray([], prev, true), [newItem_1], false); });
                            setSelectedKnowledge({ key: newItem_1.id, text: newItem_1.displayText });
                            break;
                    }
                    insideModelshow({
                        type: "success",
                        title: "Custom Item Created",
                        message: "\"".concat(englishText, "\" was successfully added to ").concat(customModal.category.name, " and selected."),
                        confirmLabel: "OK",
                        onConfirm: insideModalClose,
                    });
                    return [3 /*break*/, 5];
                case 4: throw new Error(res.message || "Failed to save custom master data.");
                case 5: return [3 /*break*/, 7];
                case 6:
                    err_2 = _a.sent();
                    console.error("Error saving custom item:", err_2);
                    insideModelshow({
                        type: "error",
                        title: "Error",
                        message: err_2.message || "An unexpected error occurred while saving custom item.",
                        confirmLabel: "Close",
                        onConfirm: insideModalClose,
                    });
                    throw err_2;
                case 7: return [2 /*return*/];
            }
        });
    }); };
    var getMaxYears = function (text) {
        if (!text)
            return 0;
        var normalized = text.toLowerCase();
        if (normalized.includes("no mining exp") || normalized.includes("no exp")) {
            return 0;
        }
        var plusMatch = normalized.match(/(\d+)\s*\+/);
        if (plusMatch) {
            return Number(plusMatch[1]);
        }
        var rangeMatch = normalized.match(/(\d+)\s*-\s*(\d+)/);
        if (rangeMatch) {
            return Number(rangeMatch[2]);
        }
        var singleMatch = normalized.match(/(\d+)/);
        if (singleMatch) {
            return Number(singleMatch[1]);
        }
        return 0;
    };
    var handleTotalExpChange = function (val) {
        setPrefTotalExp(val);
        if (val) {
            var maxTotal = getMaxYears(val.text);
            if (prefMiningExp) {
                var maxMining = getMaxYears(prefMiningExp.text);
                if (maxMining >= maxTotal) {
                    setPrefMiningExp(null);
                }
            }
        }
        else {
            setPrefMiningExp(null);
        }
    };
    var filteredMiningExperience = (0, react_1.useMemo)(function () {
        if (!prefTotalExp)
            return totalExperience;
        var maxTotal = getMaxYears(prefTotalExp.text);
        return totalExperience.filter(function (opt) {
            var maxMining = getMaxYears(opt.displayText);
            return maxMining < maxTotal;
        });
    }, [prefTotalExp, totalExperience]);
    var filteredMinQualOptions = (0, react_1.useMemo)(function () {
        if (prefQual.length === 0)
            return localQualifications;
        var prefKeys = new Set(prefQual.map(function (q) { return String(q.key); }));
        return localQualifications.filter(function (opt) { return !prefKeys.has(String(opt.id)); });
    }, [prefQual, localQualifications]);
    var filteredPrefQualOptions = (0, react_1.useMemo)(function () {
        if (minQual.length === 0)
            return localQualifications;
        var minKeys = new Set(minQual.map(function (q) { return String(q.key); }));
        return localQualifications.filter(function (opt) { return !minKeys.has(String(opt.id)); });
    }, [minQual, localQualifications]);
    var handleFunctionalJobTitleChange = function (val) {
        setFunctionalMgrJobTitle(val);
        if (val) {
            var matchedManager = managers.find(function (m) { return String(m.id) === String(val.key); });
            if (matchedManager) {
                setFunctionalMgr({ key: matchedManager.id, text: matchedManager.displayText });
            }
        }
        else {
            setFunctionalMgr(null);
        }
    };
    var handleFunctionalMgrChange = function (val) {
        setFunctionalMgr(val);
        if (val) {
            var matchedTitle = jobTitles.find(function (jt) { return String(jt.id) === String(val.key); });
            if (matchedTitle) {
                setFunctionalMgrJobTitle({ key: matchedTitle.id, text: matchedTitle.displayText });
            }
        }
        else {
            setFunctionalMgrJobTitle(null);
        }
    };
    var handleLineJobTitleChange = function (val) {
        setLineMgrJobTitle(val);
        if (val) {
            var matchedManager = managers.find(function (m) { return String(m.id) === String(val.key); });
            if (matchedManager) {
                setLineMgr({ key: matchedManager.id, text: matchedManager.displayText });
            }
        }
        else {
            setLineMgr(null);
        }
    };
    var handleLineMgrChange = function (val) {
        setLineMgr(val);
        if (val) {
            var matchedTitle = jobTitles.find(function (jt) { return String(jt.id) === String(val.key); });
            if (matchedTitle) {
                setLineMgrJobTitle({ key: matchedTitle.id, text: matchedTitle.displayText });
            }
        }
        else {
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
    var handleAddKnowledgeChip = function () {
        var skillObj = selectedKnowledge;
        var skillText = skillObj ? skillObj.text : "";
        // Validation for add button
        if (!skillObj || !knowledgeLevel) {
            setErrors(function (prev) { return (tslib_1.__assign(tslib_1.__assign({}, prev), { knowledgeSelector: "Please select a knowledge area and select a proficiency level before adding." })); });
            return;
        }
        // Check duplicate
        if (roleKnowledgeChips.some(function (item) { return item.skill.text.toLowerCase() === skillText.toLowerCase(); })) {
            setErrors(function (prev) { return (tslib_1.__assign(tslib_1.__assign({}, prev), { knowledgeSelector: "This role specific knowledge has already been added." })); });
            return;
        }
        setRoleKnowledgeChips(tslib_1.__spreadArray(tslib_1.__spreadArray([], roleKnowledgeChips, true), [
            {
                skill: skillObj,
                level: knowledgeLevel
            }
        ], false));
        setSelectedKnowledge(null);
        setKnowledgeLevel(null);
        setErrors(function (prev) {
            var updated = tslib_1.__assign({}, prev);
            delete updated.knowledgeSelector;
            delete updated.roleKnowledgeChips;
            return updated;
        });
    };
    var handleRemoveKnowledgeChip = function (skillToRemove) {
        setRoleKnowledgeChips(roleKnowledgeChips.filter(function (item) { return item.skill.text !== skillToRemove; }));
    };
    // Add tag chips for technical skills
    var handleAddTechSkillChip = function () {
        var skillObj = selectedTechSkill;
        var skillText = skillObj ? skillObj.text : "";
        // Validation for add button
        if (!skillObj || !techSkillLevel) {
            setErrors(function (prev) { return (tslib_1.__assign(tslib_1.__assign({}, prev), { techSkillSelector: "Please select a technical skill and select a proficiency level before adding." })); });
            return;
        }
        // Check duplicate
        if (techSkillChips.some(function (item) { return item.skill.text.toLowerCase() === skillText.toLowerCase(); })) {
            setErrors(function (prev) { return (tslib_1.__assign(tslib_1.__assign({}, prev), { techSkillSelector: "This technical skill has already been added." })); });
            return;
        }
        setTechSkillChips(tslib_1.__spreadArray(tslib_1.__spreadArray([], techSkillChips, true), [
            {
                skill: skillObj,
                level: techSkillLevel
            }
        ], false));
        setSelectedTechSkill(null);
        setTechSkillLevel(null);
        setErrors(function (prev) {
            var updated = tslib_1.__assign({}, prev);
            delete updated.techSkillSelector;
            delete updated.techSkillChips;
            return updated;
        });
    };
    var handleRemoveTechSkillChip = function (skillToRemove) {
        setTechSkillChips(techSkillChips.filter(function (item) { return item.skill.text !== skillToRemove; }));
    };
    // Validate current step fields
    var validateStep = function (step) {
        var stepErrors = {};
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
            if (!rolePurposeEn.trim())
                stepErrors.rolePurposeEn = "Role Purpose (EN) is required.";
            if (!rolePurposeFr.trim())
                stepErrors.rolePurposeFr = "Role Purpose (FR) is required.";
            if (!jobDescEn.trim())
                stepErrors.jobDescEn = "Job Description (EN) is required.";
            if (!jobDescFr.trim())
                stepErrors.jobDescFr = "Job Description (FR) is required.";
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
            if (!prefTotalExp)
                stepErrors.prefTotalExp = "Preferred Total Experience is required.";
            if (!prefMiningExp)
                stepErrors.prefMiningExp = "Preferred Mining Experience is required.";
            var hasMinQual = minQual.length > 0;
            if (!hasMinQual) {
                stepErrors.minQual = "Minimum Qualification is required.";
            }
            var hasPrefQual = prefQual.length > 0;
            if (!hasPrefQual) {
                stepErrors.prefQual = "Preferred Qualification is required.";
            }
            if (hasMinQual && hasPrefQual) {
                var minQualTexts_1 = new Set(minQual.map(function (q) { return q.text.toLowerCase(); }));
                var prefQualTexts = prefQual.map(function (q) { return q.text.toLowerCase(); });
                var hasOverlap = prefQualTexts.some(function (text) { return minQualTexts_1.has(text); });
                if (hasOverlap) {
                    stepErrors.prefQual = "Minimum and Preferred Qualifications cannot contain duplicate entries.";
                }
            }
            if (!functionalMgrJobTitle)
                stepErrors.functionalMgrJobTitle = "Job Title of Functional Manager is required.";
            if (!functionalMgr)
                stepErrors.functionalMgr = "Functional Manager Name is required.";
            if (!lineMgrJobTitle)
                stepErrors.lineMgrJobTitle = "Job Title of Line Manager/Supervisor is required.";
            if (!lineMgr)
                stepErrors.lineMgr = "Line Manager/Supervisor Name is required.";
            if (!jobFunctionalType)
                stepErrors.jobFunctionalType = "Job Functional Type is required.";
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
        var isValid = Object.keys(stepErrors).length === 0;
        if (!isValid) {
            setShowErrorBanner(true);
            // Smart Validation UX: Auto-scroll to first error
            setTimeout(function () {
                var firstErrorEl = document.querySelector(".error");
                if (firstErrorEl) {
                    firstErrorEl.scrollIntoView({ behavior: "smooth", block: "center" });
                }
            }, 100);
        }
        else {
            setShowErrorBanner(false);
        }
        return isValid;
    };
    var handleNextStep = function () {
        if (validateStep(currentStep)) {
            setCurrentStep(function (prev) { return Math.min(prev + 1, 4); });
        }
    };
    var handlePrevStep = function () {
        setShowErrorBanner(false);
        setErrors({});
        setCurrentStep(function (prev) { return Math.max(prev - 1, 1); });
    };
    var handlePublish = function () {
        var isValid = true;
        for (var i = 1; i <= 3; i++) {
            if (!validateStep(i)) {
                setCurrentStep(i);
                isValid = false;
                break;
            }
        }
        if (!isValid)
            return;
        var finalMinQuals = minQual.map(function (q) { return q.text; });
        var finalPrefQuals = prefQual.map(function (q) { return q.text; });
        var publishedAdvert = {
            jobId: String(jobCodeId),
            english: {
                description: jobDescEn,
                responsibilities: [rolePurposeEn],
                qualifications: finalMinQuals,
                PrefeQualification: finalPrefQuals,
                experience: [
                    "Total Experience: ".concat(prefTotalExp ? prefTotalExp.text : ""),
                    "Mining Experience: ".concat(prefMiningExp ? prefMiningExp.text : "")
                ],
                RoleSpecificKnowledge: roleKnowledgeChips.map(function (c) { return c.skill.text; }),
                RequiredLevel: roleKnowledgeChips.map(function (c) { return c.level.text; }),
                TechnicalSkills: techSkillChips.map(function (c) { return c.skill.text; }),
                LevelProficiency: techSkillChips.map(function (c) { return c.level.text; }),
                JobFunctionalType: jobFunctionalType ? [jobFunctionalType.text] : [],
                JobBasedBGVVerification: [],
            },
            french: {
                description: jobDescFr,
                responsibilities: [rolePurposeFr],
                qualifications: finalMinQuals,
                PrefeQualification: finalPrefQuals,
                experience: [
                    "Exp\u00E9rience totale: ".concat(prefTotalExp ? prefTotalExp.text : ""),
                    "Exp\u00E9rience mini\u00E8re: ".concat(prefMiningExp ? prefMiningExp.text : "")
                ],
                RoleSpecificKnowledge: roleKnowledgeChips.map(function (c) { return c.skill.text; }),
                RequiredLevel: roleKnowledgeChips.map(function (c) { return c.level.text; }),
                TechnicalSkills: techSkillChips.map(function (c) { return c.skill.text; }),
                LevelProficiency: techSkillChips.map(function (c) { return c.level.text; }),
                JobFunctionalType: jobFunctionalType ? [jobFunctionalType.text] : [],
                JobBasedBGVVerification: [],
            },
        };
        onPublish(publishedAdvert);
        var QualificatioDetails = minQual.map(function (q) { return ({ MinQualification: String(q.key) }); });
        var PrefeQualification = prefQual.map(function (q) { return ({ PrefeQualification: String(q.key) }); });
        var RoleSpecificKnowledgeJson = roleKnowledgeChips.map(function (item) { return ({
            RoleSpeKnowledge: String(item.skill.key),
            RequiredLevel: String(item.level.key),
        }); });
        var TechnicalSkillsKnowledgeJson = techSkillChips.map(function (item) { return ({
            TechnicalSkills: String(item.skill.key),
            LevelProficiency: String(item.level.key),
        }); });
        var submitAdvert = {
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
    var handleSaveDraft = function () {
        showModal({
            type: "success",
            title: "Draft Saved Successfully",
            message: "The job advertisement draft has been saved. You can complete it later.",
            confirmLabel: "OK",
            onConfirm: function () {
                closeModal();
                onClose();
            },
        });
    };
    if (!isOpen)
        return null;
    return (react_1.default.createElement("div", { className: "createAdvertModal" },
        react_1.default.createElement(framer_motion_1.motion.div, { className: "backdrop", initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, onClick: onClose }),
        react_1.default.createElement(framer_motion_1.motion.div, { className: "panel", initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "100%" }, transition: { type: "tween", ease: "easeInOut", duration: 0.3 } },
            react_1.default.createElement("div", { className: "header" },
                react_1.default.createElement("div", { className: "headerTop" },
                    react_1.default.createElement("div", { className: "titleSection" },
                        react_1.default.createElement("div", { className: "iconWrapper" },
                            react_1.default.createElement(lucide_react_1.Eye, { size: 22 })),
                        react_1.default.createElement("div", null,
                            react_1.default.createElement("h2", null, "Create Job Advertisement"),
                            react_1.default.createElement("p", null, "Complete all required information before publishing."))),
                    react_1.default.createElement("button", { type: "button", className: "closeBtn", onClick: onClose },
                        react_1.default.createElement(lucide_react_1.X, { size: 20 }))),
                react_1.default.createElement("div", { className: "stepper" },
                    react_1.default.createElement("div", { className: "step ".concat(currentStep >= 1 ? "active" : "", " ").concat(currentStep > 1 ? "completed" : "") },
                        react_1.default.createElement("div", { className: "stepNumber" }, currentStep > 1 ? react_1.default.createElement(lucide_react_1.Check, { size: 12 }) : "1"),
                        react_1.default.createElement("span", null, "Job Details")),
                    react_1.default.createElement("div", { className: "step ".concat(currentStep >= 2 ? "active" : "", " ").concat(currentStep > 2 ? "completed" : "") },
                        react_1.default.createElement("div", { className: "stepNumber" }, currentStep > 2 ? react_1.default.createElement(lucide_react_1.Check, { size: 12 }) : "2"),
                        react_1.default.createElement("span", null, "Qualifications")),
                    react_1.default.createElement("div", { className: "step ".concat(currentStep >= 3 ? "active" : "", " ").concat(currentStep > 3 ? "completed" : "") },
                        react_1.default.createElement("div", { className: "stepNumber" }, currentStep > 3 ? react_1.default.createElement(lucide_react_1.Check, { size: 12 }) : "3"),
                        react_1.default.createElement("span", null, "Skills")),
                    react_1.default.createElement("div", { className: "step ".concat(currentStep === 4 ? "active" : "") },
                        react_1.default.createElement("div", { className: "stepNumber" }, "4"),
                        react_1.default.createElement("span", null, "Review & Publish")))),
            react_1.default.createElement("div", { className: "content", ref: contentRef },
                showErrorBanner && (react_1.default.createElement("div", { className: "errorBanner" },
                    react_1.default.createElement(lucide_react_1.AlertTriangle, { size: 18 }),
                    react_1.default.createElement("span", null,
                        "Please complete ",
                        Object.keys(errors).length,
                        " required field(s) before continuing."))),
                currentStep === 1 && (react_1.default.createElement("div", { className: "formSection" },
                    react_1.default.createElement("h3", null, "Step 1: Job Details & Description"),
                    react_1.default.createElement("div", { className: "advert-review-drawer__section advert-review-drawer__section--toggle", style: { margin: "4px 0" } },
                        react_1.default.createElement("div", { className: "advert-review-drawer__toggle-label" }, "Active Form Language"),
                        react_1.default.createElement("div", { className: "advert-review-drawer__toggle" },
                            react_1.default.createElement("button", { type: "button", className: "advert-review-drawer__toggle-button ".concat(advertLang === "EN" ? "is-active" : ""), onClick: function () { return setAdvertLang("EN"); } }, "English"),
                            react_1.default.createElement("button", { type: "button", className: "advert-review-drawer__toggle-button ".concat(advertLang === "FR" ? "is-active" : ""), onClick: function () { return setAdvertLang("FR"); } }, "French"))),
                    advertLang === "EN" ? (react_1.default.createElement(react_1.default.Fragment, null,
                        react_1.default.createElement("div", { className: "formGroup" },
                            react_1.default.createElement("label", { className: "label" },
                                "Role Purpose (English) ",
                                react_1.default.createElement("span", null, "*")),
                            react_1.default.createElement("div", { className: "richTextEditor ".concat(errors.rolePurposeEn ? "error" : "") },
                                react_1.default.createElement("div", { className: "editorToolbar" },
                                    react_1.default.createElement("button", { type: "button", className: "toolbarBtn ".concat(boldActive ? "active" : ""), onClick: function () { return setBoldActive(!boldActive); } },
                                        react_1.default.createElement(lucide_react_1.Bold, { size: 13 })),
                                    react_1.default.createElement("button", { type: "button", className: "toolbarBtn ".concat(italicActive ? "active" : ""), onClick: function () { return setItalicActive(!italicActive); } },
                                        react_1.default.createElement(lucide_react_1.Italic, { size: 13 })),
                                    react_1.default.createElement("button", { type: "button", className: "toolbarBtn ".concat(underlineActive ? "active" : ""), onClick: function () { return setUnderlineActive(!underlineActive); } },
                                        react_1.default.createElement(lucide_react_1.Underline, { size: 13 })),
                                    react_1.default.createElement("button", { type: "button", className: "toolbarBtn" },
                                        react_1.default.createElement(lucide_react_1.List, { size: 13 }))),
                                react_1.default.createElement("textarea", { className: "editorArea", placeholder: "Enter the primary objective of this role...", value: rolePurposeEn, onChange: function (e) { return setRolePurposeEn(e.target.value); }, maxLength: 1000 }),
                                react_1.default.createElement("div", { className: "editorFooter" },
                                    rolePurposeEn.length,
                                    "/1000 characters")),
                            errors.rolePurposeEn && react_1.default.createElement("span", { className: "errorText" },
                                react_1.default.createElement(lucide_react_1.AlertTriangle, { size: 12 }),
                                " ",
                                errors.rolePurposeEn)),
                        react_1.default.createElement("div", { className: "formGroup" },
                            react_1.default.createElement("label", { className: "label" },
                                "Job Description (English) ",
                                react_1.default.createElement("span", null, "*")),
                            react_1.default.createElement("div", { className: "richTextEditor ".concat(errors.jobDescEn ? "error" : "") },
                                react_1.default.createElement("div", { className: "editorToolbar" },
                                    react_1.default.createElement("button", { type: "button", className: "toolbarBtn" },
                                        react_1.default.createElement(lucide_react_1.Bold, { size: 13 })),
                                    react_1.default.createElement("button", { type: "button", className: "toolbarBtn" },
                                        react_1.default.createElement(lucide_react_1.Italic, { size: 13 })),
                                    react_1.default.createElement("button", { type: "button", className: "toolbarBtn" },
                                        react_1.default.createElement(lucide_react_1.Underline, { size: 13 })),
                                    react_1.default.createElement("button", { type: "button", className: "toolbarBtn" },
                                        react_1.default.createElement(lucide_react_1.List, { size: 13 }))),
                                react_1.default.createElement("textarea", { className: "editorArea", placeholder: "Enter the full job description details...", value: jobDescEn, onChange: function (e) { return setJobDescEn(e.target.value); }, maxLength: 2000 }),
                                react_1.default.createElement("div", { className: "editorFooter" },
                                    jobDescEn.length,
                                    "/2000 characters")),
                            errors.jobDescEn && react_1.default.createElement("span", { className: "errorText" },
                                react_1.default.createElement(lucide_react_1.AlertTriangle, { size: 12 }),
                                " ",
                                errors.jobDescEn)))) : (react_1.default.createElement(react_1.default.Fragment, null,
                        react_1.default.createElement("div", { className: "formGroup" },
                            react_1.default.createElement("label", { className: "label" },
                                "Role Purpose (French) ",
                                react_1.default.createElement("span", null, "*")),
                            react_1.default.createElement("div", { className: "richTextEditor ".concat(errors.rolePurposeFr ? "error" : "") },
                                react_1.default.createElement("div", { className: "editorToolbar" },
                                    react_1.default.createElement("button", { type: "button", className: "toolbarBtn" },
                                        react_1.default.createElement(lucide_react_1.Bold, { size: 13 })),
                                    react_1.default.createElement("button", { type: "button", className: "toolbarBtn" },
                                        react_1.default.createElement(lucide_react_1.Italic, { size: 13 })),
                                    react_1.default.createElement("button", { type: "button", className: "toolbarBtn" },
                                        react_1.default.createElement(lucide_react_1.Underline, { size: 13 })),
                                    react_1.default.createElement("button", { type: "button", className: "toolbarBtn" },
                                        react_1.default.createElement(lucide_react_1.List, { size: 13 }))),
                                react_1.default.createElement("textarea", { className: "editorArea", placeholder: "Saisir l'objectif principal du r\u00F4le...", value: rolePurposeFr, onChange: function (e) { return setRolePurposeFr(e.target.value); }, maxLength: 1000 }),
                                react_1.default.createElement("div", { className: "editorFooter" },
                                    rolePurposeFr.length,
                                    "/1000 characters")),
                            errors.rolePurposeFr && react_1.default.createElement("span", { className: "errorText" },
                                react_1.default.createElement(lucide_react_1.AlertTriangle, { size: 12 }),
                                " ",
                                errors.rolePurposeFr)),
                        react_1.default.createElement("div", { className: "formGroup" },
                            react_1.default.createElement("label", { className: "label" },
                                "Job Description (French) ",
                                react_1.default.createElement("span", null, "*")),
                            react_1.default.createElement("div", { className: "richTextEditor ".concat(errors.jobDescFr ? "error" : "") },
                                react_1.default.createElement("div", { className: "editorToolbar" },
                                    react_1.default.createElement("button", { type: "button", className: "toolbarBtn" },
                                        react_1.default.createElement(lucide_react_1.Bold, { size: 13 })),
                                    react_1.default.createElement("button", { type: "button", className: "toolbarBtn" },
                                        react_1.default.createElement(lucide_react_1.Italic, { size: 13 })),
                                    react_1.default.createElement("button", { type: "button", className: "toolbarBtn" },
                                        react_1.default.createElement(lucide_react_1.Underline, { size: 13 })),
                                    react_1.default.createElement("button", { type: "button", className: "toolbarBtn" },
                                        react_1.default.createElement(lucide_react_1.List, { size: 13 }))),
                                react_1.default.createElement("textarea", { className: "editorArea", placeholder: "Saisir les d\u00E9tails de la description du poste...", value: jobDescFr, onChange: function (e) { return setJobDescFr(e.target.value); }, maxLength: 2000 }),
                                react_1.default.createElement("div", { className: "editorFooter" },
                                    jobDescFr.length,
                                    "/2000 characters")),
                            errors.jobDescFr && react_1.default.createElement("span", { className: "errorText" },
                                react_1.default.createElement(lucide_react_1.AlertTriangle, { size: 12 }),
                                " ",
                                errors.jobDescFr)))))),
                currentStep === 2 && (react_1.default.createElement("div", { className: "formSection" },
                    react_1.default.createElement("h3", null, "Step 2: Qualifications & Experience Settings"),
                    react_1.default.createElement("div", { className: "gridTwoCol" },
                        react_1.default.createElement("div", { className: "formGroup" },
                            react_1.default.createElement("label", { className: "label" },
                                "Preferred Total Experience ",
                                react_1.default.createElement("span", null, "*")),
                            react_1.default.createElement(SearchableDropdown, { options: totalExperience, value: prefTotalExp, onChange: handleTotalExpChange, placeholder: "Select Total Experience...", error: !!errors.prefTotalExp }),
                            errors.prefTotalExp && react_1.default.createElement("span", { className: "errorText" },
                                react_1.default.createElement(lucide_react_1.AlertTriangle, { size: 12 }),
                                " ",
                                errors.prefTotalExp)),
                        react_1.default.createElement("div", { className: "formGroup" },
                            react_1.default.createElement("label", { className: "label" },
                                "Preferred Mining Experience ",
                                react_1.default.createElement("span", null, "*")),
                            react_1.default.createElement(SearchableDropdown, { options: filteredMiningExperience, value: prefMiningExp, onChange: setPrefMiningExp, placeholder: "Select Mining Experience...", error: !!errors.prefMiningExp }),
                            errors.prefMiningExp && react_1.default.createElement("span", { className: "errorText" },
                                react_1.default.createElement(lucide_react_1.AlertTriangle, { size: 12 }),
                                " ",
                                errors.prefMiningExp)),
                        react_1.default.createElement("div", { className: "formGroup" },
                            react_1.default.createElement("label", { className: "label" },
                                "Minimum Qualification ",
                                react_1.default.createElement("span", null, "*")),
                            react_1.default.createElement(MultiSelectSearchableDropdown, { options: filteredMinQualOptions, value: minQual, onChange: setMinQual, placeholder: "Select Minimum Qualification...", error: !!errors.minQual, onAddCustom: function () { return setCustomModal({
                                    isOpen: true,
                                    fieldKey: "minQual",
                                    category: { id: ConditionConfig_1.CategoryID.Qualification, name: "Qualification" },
                                    title: "Add Custom Minimum Qualification"
                                }); } }),
                            minQual.length > 0 && (react_1.default.createElement("div", { className: "chipsContainer", style: { marginTop: "8px", display: "flex", flexWrap: "wrap", gap: "6px" } }, minQual.map(function (q) { return (react_1.default.createElement("div", { key: q.key, className: "chip" },
                                react_1.default.createElement("span", null, q.text),
                                react_1.default.createElement("button", { type: "button", className: "removeChipBtn", onClick: function () { return setMinQual(minQual.filter(function (item) { return item.key !== q.key; })); } }, "\u00D7"))); }))),
                            errors.minQual && react_1.default.createElement("span", { className: "errorText" },
                                react_1.default.createElement(lucide_react_1.AlertTriangle, { size: 12 }),
                                " ",
                                errors.minQual)),
                        react_1.default.createElement("div", { className: "formGroup" },
                            react_1.default.createElement("label", { className: "label" },
                                "Preferred Qualification ",
                                react_1.default.createElement("span", null, "*")),
                            react_1.default.createElement(MultiSelectSearchableDropdown, { options: filteredPrefQualOptions, value: prefQual, onChange: setPrefQual, placeholder: "Select Preferred Qualification...", error: !!errors.prefQual, onAddCustom: function () { return setCustomModal({
                                    isOpen: true,
                                    fieldKey: "prefQual",
                                    category: { id: ConditionConfig_1.CategoryID.Qualification, name: "Qualification" },
                                    title: "Add Custom Preferred Qualification"
                                }); } }),
                            prefQual.length > 0 && (react_1.default.createElement("div", { className: "chipsContainer", style: { marginTop: "8px", display: "flex", flexWrap: "wrap", gap: "6px" } }, prefQual.map(function (q) { return (react_1.default.createElement("div", { key: q.key, className: "chip" },
                                react_1.default.createElement("span", null, q.text),
                                react_1.default.createElement("button", { type: "button", className: "removeChipBtn", onClick: function () { return setPrefQual(prefQual.filter(function (item) { return item.key !== q.key; })); } }, "\u00D7"))); }))),
                            errors.prefQual && react_1.default.createElement("span", { className: "errorText" },
                                react_1.default.createElement(lucide_react_1.AlertTriangle, { size: 12 }),
                                " ",
                                errors.prefQual)),
                        react_1.default.createElement("div", { className: "formGroup" },
                            react_1.default.createElement("label", { className: "label" },
                                "Job Title of Functional Manager ",
                                react_1.default.createElement("span", null, "*")),
                            react_1.default.createElement(SearchableDropdown, { options: localJobTitles, value: functionalMgrJobTitle, onChange: handleFunctionalJobTitleChange, placeholder: "Select Job Title of Functional Manager...", error: !!errors.functionalMgrJobTitle }),
                            errors.functionalMgrJobTitle && react_1.default.createElement("span", { className: "errorText" },
                                react_1.default.createElement(lucide_react_1.AlertTriangle, { size: 12 }),
                                " ",
                                errors.functionalMgrJobTitle)),
                        react_1.default.createElement("div", { className: "formGroup" },
                            react_1.default.createElement("label", { className: "label" },
                                "Functional Manager Name ",
                                react_1.default.createElement("span", null, "*")),
                            react_1.default.createElement(SearchableDropdown, { options: managers, value: functionalMgr, onChange: handleFunctionalMgrChange, placeholder: "Select Functional Manager Name...", error: !!errors.functionalMgr }),
                            errors.functionalMgr && react_1.default.createElement("span", { className: "errorText" },
                                react_1.default.createElement(lucide_react_1.AlertTriangle, { size: 12 }),
                                " ",
                                errors.functionalMgr)),
                        react_1.default.createElement("div", { className: "formGroup" },
                            react_1.default.createElement("label", { className: "label" },
                                "Job Title of Line Manager/ Supervisor ",
                                react_1.default.createElement("span", null, "*")),
                            react_1.default.createElement(SearchableDropdown, { options: localJobTitles, value: lineMgrJobTitle, onChange: handleLineJobTitleChange, placeholder: "Select Job Title of Line Manager/ Supervisor...", error: !!errors.lineMgrJobTitle }),
                            errors.lineMgrJobTitle && react_1.default.createElement("span", { className: "errorText" },
                                react_1.default.createElement(lucide_react_1.AlertTriangle, { size: 12 }),
                                " ",
                                errors.lineMgrJobTitle)),
                        react_1.default.createElement("div", { className: "formGroup" },
                            react_1.default.createElement("label", { className: "label" },
                                "Line Manager/ Supervisor Name ",
                                react_1.default.createElement("span", null, "*")),
                            react_1.default.createElement(SearchableDropdown, { options: managers, value: lineMgr, onChange: handleLineMgrChange, placeholder: "Select Line Manager/ Supervisor Name...", error: !!errors.lineMgr }),
                            errors.lineMgr && react_1.default.createElement("span", { className: "errorText" },
                                react_1.default.createElement(lucide_react_1.AlertTriangle, { size: 12 }),
                                " ",
                                errors.lineMgr)),
                        react_1.default.createElement("div", { className: "formGroup" },
                            react_1.default.createElement("label", { className: "label" },
                                "Job Functional Type ",
                                react_1.default.createElement("span", null, "*")),
                            react_1.default.createElement(SearchableDropdown, { options: localFunctionalType, value: jobFunctionalType, onChange: setJobFunctionalType, placeholder: "Select Job Functional Type...", error: !!errors.jobFunctionalType }),
                            errors.jobFunctionalType && react_1.default.createElement("span", { className: "errorText" },
                                react_1.default.createElement(lucide_react_1.AlertTriangle, { size: 12 }),
                                " ",
                                errors.jobFunctionalType))))),
                currentStep === 3 && (react_1.default.createElement("div", { className: "formSection" },
                    react_1.default.createElement("h3", null, "Step 3: Role Skills & Knowledge"),
                    react_1.default.createElement("div", { className: "formGroup" },
                        react_1.default.createElement("label", { className: "label" },
                            "Role Specific Knowledge ",
                            react_1.default.createElement("span", null, "*")),
                        react_1.default.createElement("div", { className: "skillsSelectorGroup" },
                            react_1.default.createElement("div", { className: "selectBox", style: { flex: 1.5 } },
                                react_1.default.createElement(SearchableDropdown, { options: localRoleSpecificKnowledge, value: selectedKnowledge, onChange: setSelectedKnowledge, placeholder: "Select Knowledge Area...", error: !!errors.knowledgeSelector, onAddCustom: function () { return setCustomModal({
                                        isOpen: true,
                                        fieldKey: "selectedKnowledge",
                                        category: { id: ConditionConfig_1.CategoryID.RoleSpecificKnowledge, name: "Role Specific Knowledge" },
                                        title: "Add Custom Role Specific Knowledge"
                                    }); } })),
                            react_1.default.createElement("div", { className: "selectBox" },
                                react_1.default.createElement("select", { className: "select ".concat(errors.knowledgeSelector ? "error" : ""), value: knowledgeLevel ? String(knowledgeLevel.key) : "", onChange: function (e) {
                                        var selectedVal = e.target.value;
                                        var found = dbLevel.find(function (lvl) { return String(lvl.id) === selectedVal; });
                                        setKnowledgeLevel(found ? { key: found.id, text: found.displayText } : null);
                                    } },
                                    react_1.default.createElement("option", { value: "" }, "Required Level..."),
                                    dbLevel.map(function (lvl) { return (react_1.default.createElement("option", { key: lvl.id, value: lvl.id }, lvl.displayText)); }))),
                            react_1.default.createElement("button", { type: "button", className: "addButton", onClick: handleAddKnowledgeChip },
                                react_1.default.createElement(lucide_react_1.Plus, { size: 16 }),
                                " Add")),
                        errors.knowledgeSelector && react_1.default.createElement("span", { className: "errorText" },
                            react_1.default.createElement(lucide_react_1.AlertTriangle, { size: 12 }),
                            " ",
                            errors.knowledgeSelector),
                        errors.roleKnowledgeChips && react_1.default.createElement("span", { className: "errorText" },
                            react_1.default.createElement(lucide_react_1.AlertTriangle, { size: 12 }),
                            " ",
                            errors.roleKnowledgeChips),
                        react_1.default.createElement("div", { className: "chipsContainer", style: { marginTop: "12px" } }, roleKnowledgeChips.length === 0 ? (react_1.default.createElement("span", { style: { fontSize: "12px", color: "#94a3b8" } }, "No knowledge areas added yet.")) : (roleKnowledgeChips.map(function (chip) { return (react_1.default.createElement("div", { key: chip.skill.text, className: "chip" },
                            react_1.default.createElement("span", null, chip.skill.text),
                            react_1.default.createElement("span", { className: "badge" }, chip.level.text),
                            react_1.default.createElement("button", { type: "button", className: "removeChipBtn", onClick: function () { return handleRemoveKnowledgeChip(chip.skill.text); } }, "\u00D7"))); })))),
                    react_1.default.createElement("div", { className: "formGroup", style: { marginTop: "12px" } },
                        react_1.default.createElement("label", { className: "label" },
                            "Technical Skills ",
                            react_1.default.createElement("span", null, "*")),
                        react_1.default.createElement("div", { className: "skillsSelectorGroup" },
                            react_1.default.createElement("div", { className: "selectBox", style: { flex: 1.5 } },
                                react_1.default.createElement(SearchableDropdown, { options: localTechnicalSkills, value: selectedTechSkill, onChange: setSelectedTechSkill, placeholder: "Select Technical Skill...", error: !!errors.techSkillSelector, onAddCustom: function () { return setCustomModal({
                                        isOpen: true,
                                        fieldKey: "selectedTechSkill",
                                        category: { id: ConditionConfig_1.CategoryID.TechnicalSkills, name: "Technical Skill" },
                                        title: "Add Custom Technical Skill"
                                    }); } })),
                            react_1.default.createElement("div", { className: "selectBox" },
                                react_1.default.createElement("select", { className: "select ".concat(errors.techSkillSelector ? "error" : ""), value: techSkillLevel ? String(techSkillLevel.key) : "", onChange: function (e) {
                                        var selectedVal = e.target.value;
                                        var found = dbLevel.find(function (lvl) { return String(lvl.id) === selectedVal; });
                                        setTechSkillLevel(found ? { key: found.id, text: found.displayText } : null);
                                    } },
                                    react_1.default.createElement("option", { value: "" }, "Proficiency Level..."),
                                    dbLevel.map(function (lvl) { return (react_1.default.createElement("option", { key: lvl.id, value: lvl.id }, lvl.displayText)); }))),
                            react_1.default.createElement("button", { type: "button", className: "addButton", onClick: handleAddTechSkillChip },
                                react_1.default.createElement(lucide_react_1.Plus, { size: 16 }),
                                " Add")),
                        errors.techSkillSelector && react_1.default.createElement("span", { className: "errorText" },
                            react_1.default.createElement(lucide_react_1.AlertTriangle, { size: 12 }),
                            " ",
                            errors.techSkillSelector),
                        errors.techSkillChips && react_1.default.createElement("span", { className: "errorText" },
                            react_1.default.createElement(lucide_react_1.AlertTriangle, { size: 12 }),
                            " ",
                            errors.techSkillChips),
                        react_1.default.createElement("div", { className: "chipsContainer", style: { marginTop: "12px" } }, techSkillChips.length === 0 ? (react_1.default.createElement("span", { style: { fontSize: "12px", color: "#94a3b8" } }, "No technical skills added yet.")) : (techSkillChips.map(function (chip) { return (react_1.default.createElement("div", { key: chip.skill.text, className: "chip" },
                            react_1.default.createElement("span", null, chip.skill.text),
                            react_1.default.createElement("span", { className: "badge" }, chip.level.text),
                            react_1.default.createElement("button", { type: "button", className: "removeChipBtn", onClick: function () { return handleRemoveTechSkillChip(chip.skill.text); } }, "\u00D7"))); })))))),
                currentStep === 4 && (react_1.default.createElement("div", { className: "formSection" },
                    react_1.default.createElement("h3", null, "Step 4: Review Advertisement"),
                    react_1.default.createElement("div", { className: "reviewSummary" },
                        react_1.default.createElement("div", { className: "reviewCard" },
                            react_1.default.createElement("h4", null, "Job Description & Purpose"),
                            react_1.default.createElement("p", { style: { fontWeight: 700, fontSize: "14px", marginBottom: "8px" } }, "English Version"),
                            react_1.default.createElement("p", { style: { color: "#475569", marginBottom: "12px" } }, jobDescEn),
                            react_1.default.createElement("p", { style: { fontWeight: 700, fontSize: "14px", marginBottom: "8px" } }, "French Version"),
                            react_1.default.createElement("p", { style: { color: "#475569" } }, jobDescFr)),
                        react_1.default.createElement("div", { className: "reviewGrid" },
                            react_1.default.createElement("div", { className: "reviewCard" },
                                react_1.default.createElement("h4", null, "Experience & Qualifications"),
                                react_1.default.createElement("p", { style: { fontSize: "13px", marginBottom: "6px" } },
                                    react_1.default.createElement("strong", null, "Total Experience:"),
                                    " ",
                                    prefTotalExp ? prefTotalExp.text : ""),
                                react_1.default.createElement("p", { style: { fontSize: "13px", marginBottom: "6px" } },
                                    react_1.default.createElement("strong", null, "Mining Experience:"),
                                    " ",
                                    prefMiningExp ? prefMiningExp.text : ""),
                                react_1.default.createElement("p", { style: { fontSize: "13px", marginBottom: "6px" } },
                                    react_1.default.createElement("strong", null, "Minimum Qualification:"),
                                    " ",
                                    minQual.map(function (q) { return q.text; }).join(", ")),
                                react_1.default.createElement("p", { style: { fontSize: "13px" } },
                                    react_1.default.createElement("strong", null, "Preferred Qualification:"),
                                    " ",
                                    prefQual.map(function (q) { return q.text; }).join(", "))),
                            react_1.default.createElement("div", { className: "reviewCard" },
                                react_1.default.createElement("h4", null, "Technical Skills & Knowledge"),
                                react_1.default.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "4px" } },
                                    techSkillChips.map(function (c) { return (react_1.default.createElement("span", { key: "rev-ts-".concat(c.skill.text), style: { fontSize: "11px", background: "#f1f5f9", padding: "4px 8px", borderRadius: "12px" } },
                                        c.skill.text,
                                        " (",
                                        c.level.text,
                                        ")")); }),
                                    roleKnowledgeChips.map(function (c) { return (react_1.default.createElement("span", { key: "rev-rk-".concat(c.skill.text), style: { fontSize: "11px", background: "#eff6ff", color: "#2563eb", padding: "4px 8px", borderRadius: "12px" } },
                                        c.skill.text,
                                        " (",
                                        c.level.text,
                                        ")")); })))))))),
            react_1.default.createElement("div", { className: "stickyFooter" },
                react_1.default.createElement("div", { className: "footerLeft" },
                    react_1.default.createElement("button", { type: "button", className: "cancelBtn", onClick: onClose }, "Cancel"),
                    react_1.default.createElement("button", { type: "button", className: "draftBtn", onClick: handleSaveDraft }, "Save Draft")),
                react_1.default.createElement("div", { className: "footerRight" },
                    currentStep > 1 && (react_1.default.createElement("button", { type: "button", className: "cancelBtn", onClick: handlePrevStep },
                        react_1.default.createElement(lucide_react_1.ChevronLeft, { size: 16 }),
                        " Back")),
                    currentStep < 4 ? (react_1.default.createElement("button", { type: "button", className: "publishBtn", onClick: handleNextStep },
                        "Continue ",
                        react_1.default.createElement(lucide_react_1.ChevronRight, { size: 16 }))) : (react_1.default.createElement(react_1.default.Fragment, null,
                        react_1.default.createElement("button", { type: "button", className: "publishBtn", onClick: handlePublish },
                            react_1.default.createElement(lucide_react_1.Check, { size: 16 }),
                            " Create Advertisement")))))),
        react_1.default.createElement(ModalPopup_1.default, tslib_1.__assign({}, modalState, { onClose: closeModal })),
        react_1.default.createElement(AddCustomModal, { isOpen: customModal.isOpen, onClose: function () { return setCustomModal(function (prev) { return (tslib_1.__assign(tslib_1.__assign({}, prev), { isOpen: false })); }); }, onSave: handleSaveCustom, title: customModal.title, options: customModal.fieldKey === "minQual" || customModal.fieldKey === "prefQual"
                ? localQualifications.map(function (q) { return ({ id: q.id, value: q.value, displayText: q.displayText }); })
                : customModal.fieldKey === "selectedTechSkill"
                    ? localTechnicalSkills.map(function (s) { return ({ id: s.id, value: s.value, displayText: s.displayText }); })
                    : customModal.fieldKey === "selectedKnowledge"
                        ? localRoleSpecificKnowledge.map(function (k) { return ({ id: k.id, value: k.value, displayText: k.displayText }); })
                        : customModal.fieldKey === "functionalMgrJobTitle" || customModal.fieldKey === "lineMgrJobTitle"
                            ? localJobTitles.map(function (t) { return ({ id: t.id, value: t.value, displayText: t.displayText }); })
                            : customModal.fieldKey === "jobFunctionalType"
                                ? localFunctionalType.map(function (f) { return ({ id: f.id, value: f.value, displayText: f.displayText }); })
                                : [] })));
};
exports.CreateAdvert = CreateAdvert;
//# sourceMappingURL=CreateAdvert.js.map