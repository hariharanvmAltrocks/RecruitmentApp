"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildOptions = void 0;
var buildOptions = function (data, keyField, textField) {
    return data
        .map(function (item) { return ({
        key: item[keyField],
        text: item[textField],
    }); })
        .sort(function (a, b) { return String(a.text).localeCompare(String(b.text)); });
};
exports.buildOptions = buildOptions;
//# sourceMappingURL=IMasterService.js.map