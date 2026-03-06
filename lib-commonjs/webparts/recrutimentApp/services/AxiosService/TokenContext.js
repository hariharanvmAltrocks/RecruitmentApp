"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useToken = exports.clearToken = exports.setToken = exports.getToken = void 0;
var react_1 = require("react");
var _token = null;
var _subscribers = new Set();
var getToken = function () { return _token; };
exports.getToken = getToken;
var setToken = function (token) {
    _token = token;
    _subscribers.forEach(function (notify) { return notify(token); });
};
exports.setToken = setToken;
var clearToken = function () { return (0, exports.setToken)(null); };
exports.clearToken = clearToken;
var useToken = function () {
    var _a = (0, react_1.useState)(_token), token = _a[0], setLocalState = _a[1];
    (0, react_1.useEffect)(function () {
        _subscribers.add(setLocalState);
        if (_token !== token) {
            setLocalState(_token);
        }
        return function () {
            _subscribers.delete(setLocalState);
        };
    }, []);
    return { token: token, setToken: exports.setToken };
};
exports.useToken = useToken;
//# sourceMappingURL=TokenContext.js.map