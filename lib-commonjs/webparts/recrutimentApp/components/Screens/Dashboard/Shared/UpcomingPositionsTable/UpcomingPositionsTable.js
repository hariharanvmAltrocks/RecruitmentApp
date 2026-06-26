"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpcomingPositionsTable = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var Lucide = tslib_1.__importStar(require("lucide-react"));
var UpcomingPositionsTable_module_scss_1 = tslib_1.__importDefault(require("./UpcomingPositionsTable.module.scss"));
var DataTable_1 = require("../../../../Comman/DataTable/DataTable");
var useAssignMembers_1 = require("../../../RecruitmentTable/Hooks/useAssignMembers");
var SearchableDropdown_1 = require("../../../../Comman/SearchableDropdown/SearchableDropdown");
var INITIAL_POSITIONS = [
    {
        id: "POS-001",
        jobCode: "1013-CT-14-010",
        jobTitle: "Cyber Security Analyst",
        department: "SENIOR MANAGEMENT",
        dateRequired: "25-05-2026",
        headcount: 5,
        vacant: 3,
        assignedHR: "Altkamoa01",
        daysLeft: 5,
        status: "Overdue"
    },
    {
        id: "POS-002",
        jobCode: "1013-CT-14-011",
        jobTitle: "ERP Functional Consultant",
        department: "MINING OPERATIONS",
        dateRequired: "25-06-2026",
        headcount: 4,
        vacant: 2,
        assignedHR: "Altkamoa01",
        daysLeft: 5,
        status: "Overdue"
    },
    {
        id: "POS-003",
        jobCode: "1013-CT-14-006",
        jobTitle: "Network Engineer",
        department: "TECH & INNOVATION",
        dateRequired: "02-06-2026",
        headcount: 6,
        vacant: 4,
        assignedHR: "Altkamoa02",
        daysLeft: 13,
        status: "At Risk"
    },
    {
        id: "POS-004",
        jobCode: "1013-CT-14-016",
        jobTitle: "Mobile Developer",
        department: "TECH & INNOVATION",
        dateRequired: "14-06-2026",
        headcount: 4,
        vacant: 1,
        assignedHR: "Altkamoa02",
        daysLeft: 25,
        status: "At Risk"
    },
    {
        id: "POS-005",
        jobCode: "1013-CT-14-017",
        jobTitle: "Data Analyst",
        department: "FINANCE",
        dateRequired: "30-07-2026",
        headcount: 3,
        vacant: 2,
        assignedHR: "Altkamoa03",
        daysLeft: 71,
        status: "On Track"
    },
    {
        id: "POS-006",
        jobCode: "1013-CT-14-018",
        jobTitle: "HR Business Partner",
        department: "HUMAN RESOURCES",
        dateRequired: "10-06-2026",
        headcount: 2,
        vacant: 1,
        assignedHR: "Altkamoa04",
        daysLeft: 16,
        status: "At Risk"
    }
];
var UpcomingPositionsTable = function () {
    var _a = (0, react_1.useState)(INITIAL_POSITIONS), positions = _a[0], setPositions = _a[1];
    var _b = (0, react_1.useState)(""), searchTerm = _b[0], setSearchTerm = _b[1];
    var _c = (0, react_1.useState)("All"), selectedDept = _c[0], setSelectedDept = _c[1];
    var _d = (0, react_1.useState)("All"), selectedStatus = _d[0], setSelectedStatus = _d[1];
    var _e = (0, react_1.useState)(1), currentPage = _e[0], setCurrentPage = _e[1];
    var _f = (0, react_1.useState)(6), pageSize = _f[0], setPageSize = _f[1];
    var _g = (0, react_1.useState)(false), isLoading = _g[0], setIsLoading = _g[1];
    var handleResetFilters = function () {
        setSearchTerm("");
        setSelectedDept("All");
        setSelectedStatus("All");
        setCurrentPage(1);
    };
    var handleRefresh = function () {
        setIsLoading(true);
        setTimeout(function () {
            setPositions(INITIAL_POSITIONS);
            setIsLoading(false);
        }, 600);
    };
    // Change HR Dialog State
    var _h = (0, react_1.useState)(false), isChangeHrOpen = _h[0], setIsChangeHrOpen = _h[1];
    var _j = (0, react_1.useState)(null), selectedPosition = _j[0], setSelectedPosition = _j[1];
    var _k = (0, react_1.useState)(0), selectedHrId = _k[0], setSelectedHrId = _k[1];
    var _l = (0, react_1.useState)(""), comments = _l[0], setComments = _l[1];
    // Fetch HR Members list
    var members = (0, useAssignMembers_1.useAssignMembers)("Congolese").members;
    var handleOpenChangeHR = function (row) {
        setSelectedPosition(row);
        // Find pre-selected HR member ID if any
        var existingHr = members.find(function (m) { return m.name.toLowerCase() === row.assignedHR.toLowerCase(); });
        setSelectedHrId(existingHr ? existingHr.id : 0);
        setComments("");
        setIsChangeHrOpen(true);
    };
    var handleConfirmChangeHR = function () {
        if (!selectedPosition || !selectedHrId)
            return;
        var selectedHr = members.find(function (m) { return m.id === selectedHrId; });
        if (!selectedHr)
            return;
        setPositions(function (prev) {
            return prev.map(function (p) {
                return p.id === selectedPosition.id
                    ? tslib_1.__assign(tslib_1.__assign({}, p), { assignedHR: selectedHr.name }) : p;
            });
        });
        setIsChangeHrOpen(false);
    };
    // Unique lists for filters
    var departments = (0, react_1.useMemo)(function () {
        var depts = new Set(INITIAL_POSITIONS.map(function (p) { return p.department; }));
        return tslib_1.__spreadArray(["All"], Array.from(depts), true);
    }, []);
    var statuses = ["All", "On Track", "At Risk", "Overdue"];
    // Filter items
    var filteredItems = (0, react_1.useMemo)(function () {
        return positions.filter(function (p) {
            var matchesSearch = p.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.assignedHR.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.jobCode.toLowerCase().includes(searchTerm.toLowerCase());
            var matchesDept = selectedDept === "All" || p.department === selectedDept;
            var matchesStatus = selectedStatus === "All" || p.status === selectedStatus;
            return matchesSearch && matchesDept && matchesStatus;
        });
    }, [positions, searchTerm, selectedDept, selectedStatus]);
    // Paginate items
    var paginatedItems = (0, react_1.useMemo)(function () {
        var startIndex = (currentPage - 1) * pageSize;
        return filteredItems.slice(startIndex, startIndex + pageSize);
    }, [filteredItems, currentPage, pageSize]);
    var departmentOptions = (0, react_1.useMemo)(function () {
        return departments.map(function (d) { return ({
            id: d,
            value: d,
            displayText: d === "All" ? "All Departments" : d
        }); });
    }, [departments]);
    var statusOptions = (0, react_1.useMemo)(function () {
        return statuses.map(function (s) { return ({
            id: s,
            value: s,
            displayText: s === "All" ? "All Statuses" : s
        }); });
    }, [statuses]);
    var selectedDeptValue = (0, react_1.useMemo)(function () {
        return {
            key: selectedDept,
            text: selectedDept === "All" ? "All Departments" : selectedDept
        };
    }, [selectedDept]);
    var selectedStatusValue = (0, react_1.useMemo)(function () {
        return {
            key: selectedStatus,
            text: selectedStatus === "All" ? "All Statuses" : selectedStatus
        };
    }, [selectedStatus]);
    // Define DataTable Columns
    var columns = (0, react_1.useMemo)(function () { return [
        {
            id: "jobTitle",
            header: "Job Title",
            render: function (row) { return (react_1.default.createElement("div", { className: UpcomingPositionsTable_module_scss_1.default.jobTitleCell },
                react_1.default.createElement("span", { className: UpcomingPositionsTable_module_scss_1.default.jobTitleCell__name }, row.jobTitle),
                react_1.default.createElement("span", { className: UpcomingPositionsTable_module_scss_1.default.jobTitleCell__id }, row.jobCode))); },
            sortable: true
        },
        {
            id: "department",
            header: "Department",
            accessor: "department",
            sortable: true,
            cellClassName: UpcomingPositionsTable_module_scss_1.default.deptCell
        },
        {
            id: "dateRequired",
            header: "Date Required",
            accessor: "dateRequired",
            sortable: true
        },
        {
            id: "headcount",
            header: "Headcount (Req)",
            accessor: "headcount",
            sortable: true,
            align: "center"
        },
        {
            id: "vacant",
            header: "Vacant (Bal)",
            accessor: "vacant",
            sortable: true,
            align: "center",
            cellClassName: UpcomingPositionsTable_module_scss_1.default.weight600
        },
        {
            id: "assignedHR",
            header: "Assign HR",
            accessor: "assignedHR",
            sortable: true
        },
        {
            id: "daysLeft",
            header: "Days Left",
            render: function (row) { return react_1.default.createElement("span", null,
                row.daysLeft,
                " days"); },
            sortable: true,
            cellClassName: UpcomingPositionsTable_module_scss_1.default.weight600
        },
        {
            id: "status",
            header: "Status",
            render: function (row) {
                var statusClass = UpcomingPositionsTable_module_scss_1.default.statusOnTrack;
                if (row.status === "Overdue")
                    statusClass = UpcomingPositionsTable_module_scss_1.default.statusOverdue;
                else if (row.status === "At Risk")
                    statusClass = UpcomingPositionsTable_module_scss_1.default.statusAtRisk;
                return (react_1.default.createElement("span", { className: "".concat(UpcomingPositionsTable_module_scss_1.default.statusBadge, " ").concat(statusClass) }, row.status));
            },
            sortable: true
        },
        {
            id: "actions",
            header: "Action",
            render: function (row) { return (react_1.default.createElement("button", { type: "button", className: UpcomingPositionsTable_module_scss_1.default.changeHrBtn, onClick: function () { return handleOpenChangeHR(row); } }, "Change HR")); }
        }
    ]; }, [members]);
    var getRowId = function (row) { return row.id; };
    return (react_1.default.createElement("div", { className: UpcomingPositionsTable_module_scss_1.default.tableCard, "aria-label": "Positions Table" },
        react_1.default.createElement("div", { className: UpcomingPositionsTable_module_scss_1.default.tableCard__header },
            react_1.default.createElement("div", { className: UpcomingPositionsTable_module_scss_1.default.tableCard__titleRow },
                react_1.default.createElement(Lucide.AlertTriangle, { size: 18, className: UpcomingPositionsTable_module_scss_1.default.warningIcon }),
                react_1.default.createElement("h2", { className: UpcomingPositionsTable_module_scss_1.default.tableCard__title }, "POSITIONG & OVERDUE POSITIONS")),
            react_1.default.createElement("div", { className: UpcomingPositionsTable_module_scss_1.default.toolbar },
                react_1.default.createElement("div", { className: UpcomingPositionsTable_module_scss_1.default.filtersGroup },
                    react_1.default.createElement("div", { className: UpcomingPositionsTable_module_scss_1.default.searchWrap },
                        react_1.default.createElement("span", { className: UpcomingPositionsTable_module_scss_1.default.label }, "Search"),
                        react_1.default.createElement("div", { className: UpcomingPositionsTable_module_scss_1.default.inputInnerWrap },
                            react_1.default.createElement("input", { type: "text", placeholder: "Search positions...", value: searchTerm, onChange: function (e) {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }, className: UpcomingPositionsTable_module_scss_1.default.searchInput, "aria-label": "Search positions" }),
                            react_1.default.createElement(Lucide.Search, { className: UpcomingPositionsTable_module_scss_1.default.searchIcon, size: 14 }))),
                    react_1.default.createElement("div", { className: UpcomingPositionsTable_module_scss_1.default.selectWrap },
                        react_1.default.createElement("span", { className: UpcomingPositionsTable_module_scss_1.default.label }, "All Departments"),
                        react_1.default.createElement(SearchableDropdown_1.SearchableDropdown, { options: departmentOptions, value: selectedDeptValue, onChange: function (val) {
                                setSelectedDept(val ? String(val.key) : "All");
                                setCurrentPage(1);
                            }, placeholder: "Filter by department..." })),
                    react_1.default.createElement("div", { className: UpcomingPositionsTable_module_scss_1.default.selectWrap },
                        react_1.default.createElement("span", { className: UpcomingPositionsTable_module_scss_1.default.label }, "All Statuses"),
                        react_1.default.createElement(SearchableDropdown_1.SearchableDropdown, { options: statusOptions, value: selectedStatusValue, onChange: function (val) {
                                setSelectedStatus(val ? String(val.key) : "All");
                                setCurrentPage(1);
                            }, placeholder: "Filter by Status..." }))),
                react_1.default.createElement("div", { className: UpcomingPositionsTable_module_scss_1.default.actionsGroup },
                    react_1.default.createElement("button", { type: "button", className: UpcomingPositionsTable_module_scss_1.default.actionBtn, onClick: handleResetFilters, title: "Reset Filters" },
                        react_1.default.createElement(Lucide.RotateCcw, { size: 14 }),
                        react_1.default.createElement("span", null, "Reset")),
                    react_1.default.createElement("button", { type: "button", className: UpcomingPositionsTable_module_scss_1.default.actionBtnPrimary, onClick: handleRefresh, disabled: isLoading, title: "Refresh Data" },
                        react_1.default.createElement(Lucide.RefreshCw, { size: 14, className: isLoading ? UpcomingPositionsTable_module_scss_1.default.spin : "" }),
                        react_1.default.createElement("span", null, "Refresh"))))),
        react_1.default.createElement("div", { className: UpcomingPositionsTable_module_scss_1.default.tableWrapper },
            react_1.default.createElement(DataTable_1.DataTable, { columns: columns, data: paginatedItems, getRowId: getRowId, pageSize: pageSize, currentPage: currentPage, totalCount: filteredItems.length, onPageChange: setCurrentPage, onPageSizeChange: function (size) {
                    setPageSize(size);
                    setCurrentPage(1);
                }, loading: isLoading })),
        isChangeHrOpen && selectedPosition && (react_1.default.createElement("div", { className: UpcomingPositionsTable_module_scss_1.default.modalOverlay, role: "dialog", "aria-modal": "true" },
            react_1.default.createElement("div", { className: UpcomingPositionsTable_module_scss_1.default.modalCard },
                react_1.default.createElement("div", { className: UpcomingPositionsTable_module_scss_1.default.modalHeader },
                    react_1.default.createElement("span", { className: UpcomingPositionsTable_module_scss_1.default.modalHeaderTitle }, "Change HR Assignee"),
                    react_1.default.createElement("button", { type: "button", onClick: function () { return setIsChangeHrOpen(false); }, className: UpcomingPositionsTable_module_scss_1.default.modalCloseBtn, "aria-label": "Close dialog" },
                        react_1.default.createElement(Lucide.X, { size: 18 }))),
                react_1.default.createElement("div", { className: UpcomingPositionsTable_module_scss_1.default.modalBody },
                    react_1.default.createElement("div", { className: UpcomingPositionsTable_module_scss_1.default.detailRow },
                        react_1.default.createElement("span", { className: UpcomingPositionsTable_module_scss_1.default.detailRowLabel }, "Selected Position:"),
                        react_1.default.createElement("span", { className: UpcomingPositionsTable_module_scss_1.default.detailRowValue }, selectedPosition.jobTitle)),
                    react_1.default.createElement("div", { className: UpcomingPositionsTable_module_scss_1.default.detailRow },
                        react_1.default.createElement("span", { className: UpcomingPositionsTable_module_scss_1.default.detailRowLabel }, "Current HR:"),
                        react_1.default.createElement("span", { className: UpcomingPositionsTable_module_scss_1.default.detailRowValue }, selectedPosition.assignedHR)),
                    react_1.default.createElement("div", { className: UpcomingPositionsTable_module_scss_1.default.formField },
                        react_1.default.createElement("label", { className: UpcomingPositionsTable_module_scss_1.default.formFieldLabel }, "Select HR Member"),
                        react_1.default.createElement("select", { value: selectedHrId, onChange: function (e) { return setSelectedHrId(Number(e.target.value)); }, className: UpcomingPositionsTable_module_scss_1.default.formSelect },
                            react_1.default.createElement("option", { value: 0 }, "Select HR Member"),
                            members.map(function (m) { return (react_1.default.createElement("option", { key: m.id, value: m.id }, m.name)); }))),
                    react_1.default.createElement("div", { className: UpcomingPositionsTable_module_scss_1.default.formField },
                        react_1.default.createElement("label", { className: UpcomingPositionsTable_module_scss_1.default.formFieldLabel }, "Instructions / Comments"),
                        react_1.default.createElement("textarea", { placeholder: "Enter comments or instructions for the recruiter...", value: comments, onChange: function (e) { return setComments(e.target.value); }, className: UpcomingPositionsTable_module_scss_1.default.formTextarea }))),
                react_1.default.createElement("div", { className: UpcomingPositionsTable_module_scss_1.default.modalFooter },
                    react_1.default.createElement("button", { type: "button", onClick: function () { return setIsChangeHrOpen(false); }, className: UpcomingPositionsTable_module_scss_1.default.modalBtnCancel }, "Cancel"),
                    react_1.default.createElement("button", { type: "button", onClick: handleConfirmChangeHR, disabled: !selectedHrId, className: UpcomingPositionsTable_module_scss_1.default.modalBtnConfirm }, "Confirm & Save")))))));
};
exports.UpcomingPositionsTable = UpcomingPositionsTable;
exports.default = exports.UpcomingPositionsTable;
//# sourceMappingURL=UpcomingPositionsTable.js.map