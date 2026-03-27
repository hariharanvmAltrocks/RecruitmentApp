"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var axios_1 = tslib_1.__importDefault(require("axios"));
var ApiConfig_1 = require("../../utilities/ApiConfig");
var MeetingUrl = (_a = localStorage.getItem("MeetingUrl")) !== null && _a !== void 0 ? _a : "";
var MeetingCode = (_b = localStorage.getItem("MeetingCode")) !== null && _b !== void 0 ? _b : "";
var MeetingsAxiosInstance = axios_1.default.create({
    baseURL: MeetingUrl,
    timeout: 60000,
    headers: {
        Accept: "application/json",
    },
});
var MeetingSchdule = /** @class */ (function () {
    function MeetingSchdule() {
    }
    MeetingSchdule.prototype.fetchRooms = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var data, response, res, availableRoom, error_1;
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        data = [];
                        return [4 /*yield*/, MeetingsAxiosInstance.get("api/GetRooms", {
                                params: {
                                    code: MeetingCode,
                                },
                                headers: {
                                    Accept: "application/json",
                                },
                            })];
                    case 1:
                        response = _b.sent();
                        if (response.status === ApiConfig_1.ResponeStatus.SUCCESS) {
                            res = (_a = response.data) === null || _a === void 0 ? void 0 : _a.value;
                            availableRoom = res.map(function (item) {
                                return {
                                    id: item.id,
                                    RoomName: item.displayName,
                                    RoomEmailId: item.emailAddress,
                                    bookingType: item.bookingType
                                };
                            });
                            data = availableRoom;
                        }
                        return [2 /*return*/, {
                                data: data,
                                status: response.status,
                                message: "GetRoom fetched successfully",
                            }];
                    case 2:
                        error_1 = _b.sent();
                        console.error("Error Get Candidate details:", error_1);
                        return [2 /*return*/, { data: [], status: 500, message: "Error Get Candidate details" }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    MeetingSchdule.prototype.fetchMeetings = function (data) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var responses, AvailableMeeting, error_2;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, Promise.all(data.Email.map(function (item) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                return tslib_1.__generator(this, function (_a) {
                                    return [2 /*return*/, MeetingsAxiosInstance.get("/api/GetMeetings", {
                                            params: {
                                                code: MeetingCode,
                                                user: item,
                                                start: data.startDate,
                                                end: data.endDate,
                                            },
                                            headers: {
                                                Accept: "application/json",
                                            },
                                        })];
                                });
                            }); }))];
                    case 1:
                        responses = _a.sent();
                        AvailableMeeting = responses.map(function (res) { return res.data; });
                        return [2 /*return*/, {
                                data: AvailableMeeting,
                                status: 200,
                                message: "GetMeeting fetched successfully",
                            }];
                    case 2:
                        error_2 = _a.sent();
                        console.error("Failed to fetch meetings", error_2);
                        return [2 /*return*/, {
                                data: [],
                                status: 500,
                                message: "Error fetching data from GetRoom",
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    MeetingSchdule.prototype.createMeeting = function (data) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var apiUrl, response, _a, error_3;
            var _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 5, , 6]);
                        apiUrl = "".concat(MeetingUrl, "/api/CreateMeeting?code=").concat(MeetingCode);
                        return [4 /*yield*/, fetch(apiUrl, {
                                method: "POST",
                                headers: {
                                    "Accept": "application/json",
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify(data)
                            })];
                    case 1:
                        response = _c.sent();
                        console.log(response, "CreateMeetingResponse");
                        _b = {};
                        if (!response.ok) return [3 /*break*/, 3];
                        return [4 /*yield*/, response.json()];
                    case 2:
                        _a = _c.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        _a = "";
                        _c.label = 4;
                    case 4: return [2 /*return*/, (_b.data = _a,
                            _b.status = response.status,
                            _b.message = "Meeting created successfully",
                            _b)];
                    case 5:
                        error_3 = _c.sent();
                        console.error("Failed to create meeting", error_3);
                        return [2 /*return*/, {
                                data: "",
                                status: 500,
                                message: "Error creating meeting",
                            }];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    return MeetingSchdule;
}());
exports.default = MeetingSchdule;
//# sourceMappingURL=MeetingSchedule.js.map