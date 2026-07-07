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
var spservice_1 = tslib_1.__importDefault(require("../../../../../services/SPService/spservice"));
var Config_1 = require("../../../../../utilities/Config");
var AssignHRPopup = react_1.default.lazy(function () {
    return Promise.resolve().then(function () { return tslib_1.__importStar(require("../../../RecruitmentTable/Components/AssignHRPopup/AssignHRPopup")); }).then(function (module) { return ({
        default: module.AssignHRPopup,
    }); });
});
var UpcomingPositionsTable = function (_a) {
    var _b, _c;
    var data = _a.data, onRefresh = _a.onRefresh, loading = _a.loading, onSuccessChangeHR = _a.onSuccessChangeHR;
    var _d = (0, react_1.useState)([]), positions = _d[0], setPositions = _d[1];
    var _e = (0, react_1.useState)(""), searchTerm = _e[0], setSearchTerm = _e[1];
    var _f = (0, react_1.useState)("All"), selectedDept = _f[0], setSelectedDept = _f[1];
    var _g = (0, react_1.useState)("All"), selectedStatus = _g[0], setSelectedStatus = _g[1];
    var _h = (0, react_1.useState)(1), currentPage = _h[0], setCurrentPage = _h[1];
    var _j = (0, react_1.useState)(10), pageSize = _j[0], setPageSize = _j[1];
    var _k = (0, react_1.useState)(false), isLoading = _k[0], setIsLoading = _k[1];
    var _l = (0, react_1.useState)(false), isUpdating = _l[0], setIsUpdating = _l[1];
    react_1.default.useEffect(function () {
        if (data && data.length > 0) {
            var mapped = data.map(function (pos) { return ({
                id: pos.id || 0,
                ItemID: pos.ItemID || 0,
                JobCode: pos.JobCode || "",
                Jobtitle: pos.Jobtitle || "",
                department: pos.department || "",
                dateRequired: pos.dateRequired || "",
                headcount: pos.headcount || "",
                vacant: pos.vacant || "",
                assignHR: pos.assignHR || " ",
                dayaLeft: pos.dayaLeft || "",
                Positionstatus: pos.Positionstatus || "On Track",
                nationality: pos.nationality || "N/A",
                status: pos.status || "N/A",
                statusId: pos.statusId || 0,
            }); });
            setPositions(mapped);
        }
        else {
            setPositions([]);
        }
    }, [data]);
    var handleResetFilters = function () {
        setSearchTerm("");
        setSelectedDept("All");
        setSelectedStatus("All");
        setCurrentPage(1);
    };
    var handleRefresh = function () {
        setIsLoading(true);
        if (onRefresh) {
            onRefresh();
        }
        setTimeout(function () {
            setIsLoading(false);
        }, 600);
    };
    // Change HR Dialog State
    var _m = (0, react_1.useState)(false), isChangeHrOpen = _m[0], setIsChangeHrOpen = _m[1];
    var _o = (0, react_1.useState)(null), selectedPosition = _o[0], setSelectedPosition = _o[1];
    var members = (0, useAssignMembers_1.useAssignMembers)((_c = (_b = data === null || data === void 0 ? void 0 : data[0]) === null || _b === void 0 ? void 0 : _b.nationality) !== null && _c !== void 0 ? _c : "").members;
    var selectedItems = (0, react_1.useMemo)(function () {
        if (!selectedPosition)
            return [];
        return [
            {
                id: String(selectedPosition.id),
                ItemID: selectedPosition.ItemID,
                jobCode: selectedPosition.JobCode,
                title: selectedPosition.Jobtitle,
                department: selectedPosition.department,
                count: Number(selectedPosition.headcount),
                requestType: "Position",
                nationality: selectedPosition.nationality || "N/A",
                status: selectedPosition.Positionstatus,
                statusId: selectedPosition.statusId || 0,
                jobCodeID: 0,
            },
        ];
    }, [selectedPosition]);
    var selectedMember = (0, react_1.useMemo)(function () {
        var _a;
        if (!selectedPosition)
            return null;
        return (_a = members.find(function (m) { return m.name.toLowerCase() === selectedPosition.assignHR.toLowerCase(); })) !== null && _a !== void 0 ? _a : null;
    }, [selectedPosition, members]);
    var handleOpenChangeHR = function (row) {
        setSelectedPosition(row);
        setIsChangeHrOpen(true);
    };
    var handleConfirmChangeHR = function (payload) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var itemId, err_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!selectedPosition || !payload.member)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    setIsUpdating(true);
                    itemId = selectedPosition.ItemID;
                    if (!(itemId > 0)) return [3 /*break*/, 3];
                    return [4 /*yield*/, spservice_1.default.SPUpdateItem({
                            Listname: Config_1.ListNames.HRMSRecruitmentDptDetails,
                            ID: itemId,
                            RequestJSON: {
                                AssignedHR: payload.member.emailid,
                            }
                        })];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    setPositions(function (prev) {
                        return prev.map(function (p) {
                            return p.id === selectedPosition.id
                                ? tslib_1.__assign(tslib_1.__assign({}, p), { assignHR: payload.member.name }) : p;
                        });
                    });
                    if (onRefresh) {
                        onRefresh();
                    }
                    if (onSuccessChangeHR) {
                        onSuccessChangeHR();
                    }
                    return [3 /*break*/, 6];
                case 4:
                    err_1 = _a.sent();
                    console.error("Error reassigning HR:", err_1);
                    return [3 /*break*/, 6];
                case 5:
                    setIsUpdating(false);
                    setIsChangeHrOpen(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    // Unique lists for filters
    var departments = (0, react_1.useMemo)(function () {
        var depts = new Set(positions.map(function (p) { return p.department; }).filter(Boolean));
        return tslib_1.__spreadArray(["All"], Array.from(depts), true);
    }, [positions]);
    var statuses = ["All", "On Track", "At Risk", "Overdue"];
    // Filter items
    var filteredItems = (0, react_1.useMemo)(function () {
        return positions.filter(function (p) {
            var matchesSearch = p.Jobtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.assignHR.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.JobCode.toLowerCase().includes(searchTerm.toLowerCase());
            var matchesDept = selectedDept === "All" || p.department === selectedDept;
            var matchesStatus = selectedStatus === "All" || p.Positionstatus === selectedStatus;
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
            render: function (row) { return (react_1.default.createElement("div", { className: "data-table__job-title" },
                react_1.default.createElement("span", null, row.Jobtitle),
                react_1.default.createElement("span", { className: "data-table__job-dept" }, row.JobCode))); },
            sortable: true
        },
        {
            id: "department",
            header: "Department",
            render: function (item) { return (react_1.default.createElement("div", { className: "data-table__job-title" },
                react_1.default.createElement("span", null, item.department))); },
            sortable: true
        },
        {
            id: "dateRequired",
            header: "Date Required",
            accessor: "dateRequired",
            cellClassName: "data-table__cell--muted",
            hideOnMobile: true,
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
            accessor: "assignHR",
            sortable: true
        },
        {
            id: "daysLeft",
            header: "Days Left",
            render: function (row) { return react_1.default.createElement("span", null,
                row.dayaLeft,
                " days"); },
            sortable: true,
            cellClassName: UpcomingPositionsTable_module_scss_1.default.weight600
        },
        {
            id: "status",
            header: "Status",
            render: function (row) {
                var statusClass = UpcomingPositionsTable_module_scss_1.default.statusOnTrack;
                if (row.Positionstatus === "Overdue")
                    statusClass = UpcomingPositionsTable_module_scss_1.default.statusOverdue;
                else if (row.Positionstatus === "At Risk")
                    statusClass = UpcomingPositionsTable_module_scss_1.default.statusAtRisk;
                return (react_1.default.createElement("span", { className: "".concat(UpcomingPositionsTable_module_scss_1.default.statusBadge, " ").concat(statusClass) }, row.Positionstatus));
            },
            sortable: true
        },
        {
            id: "actions",
            header: "Action",
            //  align: "left",
            // cellClassName: "data-table__cell--actions",
            render: function (row) { return (react_1.default.createElement("button", { type: "button", className: UpcomingPositionsTable_module_scss_1.default.changeHrBtn, onClick: function () { return handleOpenChangeHR(row); } }, "Change HR")); }
        }
    ]; }, [members]);
    var getRowId = function (row) { return String(row.id); };
    if (loading) {
        return (react_1.default.createElement("div", { className: UpcomingPositionsTable_module_scss_1.default.tableCard, "aria-label": "Positions Table Loading" },
            react_1.default.createElement("div", { className: UpcomingPositionsTable_module_scss_1.default.tableCard__header },
                react_1.default.createElement("div", { className: UpcomingPositionsTable_module_scss_1.default.tableCard__titleRow },
                    react_1.default.createElement(Lucide.AlertTriangle, { size: 18, className: UpcomingPositionsTable_module_scss_1.default.warningIcon, style: { opacity: 0.5 } }),
                    react_1.default.createElement("div", { className: "dashboard-skeleton__bar", style: { width: "220px", height: "16px" } })),
                react_1.default.createElement("div", { className: UpcomingPositionsTable_module_scss_1.default.toolbar, style: { opacity: 0.6 } },
                    react_1.default.createElement("div", { className: UpcomingPositionsTable_module_scss_1.default.filtersGroup },
                        react_1.default.createElement("div", { className: "dashboard-skeleton__bar", style: { width: "180px", height: "35px", borderRadius: "8px" } }),
                        react_1.default.createElement("div", { className: "dashboard-skeleton__bar", style: { width: "150px", height: "35px", borderRadius: "8px" } }),
                        react_1.default.createElement("div", { className: "dashboard-skeleton__bar", style: { width: "150px", height: "35px", borderRadius: "8px" } })),
                    react_1.default.createElement("div", { className: UpcomingPositionsTable_module_scss_1.default.actionsGroup },
                        react_1.default.createElement("div", { className: "dashboard-skeleton__bar", style: { width: "80px", height: "35px", borderRadius: "8px" } }),
                        react_1.default.createElement("div", { className: "dashboard-skeleton__bar", style: { width: "80px", height: "35px", borderRadius: "8px" } })))),
            react_1.default.createElement("div", { className: UpcomingPositionsTable_module_scss_1.default.tableWrapper },
                react_1.default.createElement("div", { className: "dashboard-skeleton__table", style: { padding: "10px 0" } }, Array.from({ length: 5 }).map(function (_, idx) { return (react_1.default.createElement("div", { key: "row-skel-".concat(idx), className: "dashboard-skeleton__row", style: { display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr", gap: "20px", padding: "16px 0", borderBottom: "1px solid #f1f5f9" } },
                    react_1.default.createElement("div", { className: "dashboard-skeleton__line", style: { height: "12px", borderRadius: "4px" } }),
                    react_1.default.createElement("div", { className: "dashboard-skeleton__line", style: { height: "12px", borderRadius: "4px" } }),
                    react_1.default.createElement("div", { className: "dashboard-skeleton__line", style: { height: "12px", borderRadius: "4px" } }),
                    react_1.default.createElement("div", { className: "dashboard-skeleton__line", style: { height: "12px", borderRadius: "4px" } }),
                    react_1.default.createElement("div", { className: "dashboard-skeleton__line", style: { height: "12px", borderRadius: "4px" } }),
                    react_1.default.createElement("div", { className: "dashboard-skeleton__line", style: { height: "12px", borderRadius: "4px" } }))); })))));
    }
    return (react_1.default.createElement("div", { className: UpcomingPositionsTable_module_scss_1.default.tableCard, "aria-label": "Positions Table" },
        react_1.default.createElement("div", { className: UpcomingPositionsTable_module_scss_1.default.tableCard__header },
            react_1.default.createElement("div", { className: UpcomingPositionsTable_module_scss_1.default.tableCard__titleRow },
                react_1.default.createElement(Lucide.Briefcase, { size: 16, className: UpcomingPositionsTable_module_scss_1.default.iconBlue }),
                react_1.default.createElement("h3", { className: UpcomingPositionsTable_module_scss_1.default.tableCard__title }, " Positions Details")),
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
                    react_1.default.createElement("button", { type: "button", className: UpcomingPositionsTable_module_scss_1.default.actionBtnPrimary, onClick: handleRefresh, disabled: isLoading || loading, title: "Refresh Data" },
                        react_1.default.createElement(Lucide.RefreshCw, { size: 14, className: (isLoading || loading) ? UpcomingPositionsTable_module_scss_1.default.spin : "" }),
                        react_1.default.createElement("span", null, "Refresh"))))),
        react_1.default.createElement("div", { className: UpcomingPositionsTable_module_scss_1.default.tableWrapper },
            react_1.default.createElement(DataTable_1.DataTable, { columns: columns, data: paginatedItems, getRowId: getRowId, pageSize: pageSize, currentPage: currentPage, totalCount: filteredItems.length, onPageChange: setCurrentPage, onPageSizeChange: function (size) {
                    setPageSize(size);
                    setCurrentPage(1);
                }, loading: isLoading || loading })),
        isChangeHrOpen && selectedPosition && (react_1.default.createElement(react_1.Suspense, { fallback: null },
            react_1.default.createElement(AssignHRPopup, { isOpen: isChangeHrOpen, selectedItems: selectedItems, assignedMember: selectedMember, onClose: function () { return setIsChangeHrOpen(false); }, oncancel: function () { return setIsChangeHrOpen(false); }, onConfirm: handleConfirmChangeHR, changeHR: true, members: members })))));
};
exports.UpcomingPositionsTable = UpcomingPositionsTable;
exports.default = exports.UpcomingPositionsTable;
//# sourceMappingURL=UpcomingPositionsTable.js.map