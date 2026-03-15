"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAdvertismentDetails = void 0;
var tslib_1 = require("tslib");
var react_1 = require("react");
var buildEnglish = function () { return ({
    description: "Lead the mining division to deliver safe, efficient, and sustainable operations aligned with annual production goals.",
    responsibilities: [
        "Own safety compliance and drive a zero-incident culture.",
        "Coordinate production plans with maintenance and geology teams.",
        "Manage contractor performance and cost controls.",
    ],
    qualifications: [
        "Bachelor's degree in Mining Engineering or related field.",
        "Leadership certification in operational safety.",
    ],
    experience: [
        "10+ years in mining operations leadership.",
        "Proven record of managing multidisciplinary teams.",
    ],
}); };
var buildFrench = function () { return ({
    description: "Diriger la division mini�re afin d'assurer des op�rations s�res, efficaces et durables align�es sur les objectifs annuels.",
    responsibilities: [
        "Garantir la conformit� en mati�re de s�curit� et promouvoir une culture z�ro incident.",
        "Coordonner les plans de production avec la maintenance et la g�ologie.",
        "Suivre la performance des sous-traitants et les co�ts.",
    ],
    qualifications: [
        "Licence en ing�nierie mini�re ou domaine connexe.",
        "Certification de leadership en s�curit� op�rationnelle.",
    ],
    experience: [
        "10+ ans d'exp�rience en direction des op�rations mini�res.",
        "Exp�rience confirm�e en gestion d'�quipes pluridisciplinaires.",
    ],
}); };
var useAdvertismentDetails = function (jobId) {
    var _a = (0, react_1.useState)(null), data = _a[0], setData = _a[1];
    var _b = (0, react_1.useState)(false), loading = _b[0], setLoading = _b[1];
    var mockMap = (0, react_1.useMemo)(function () { return ({
        "JOB-001": {
            jobId: "JOB-001",
            english: buildEnglish(),
            french: buildFrench(),
        },
        "JOB-002": {
            jobId: "JOB-002",
            english: tslib_1.__assign(tslib_1.__assign({}, buildEnglish()), { description: "Drive exploration programs and interpret geological data for strategic drilling decisions." }),
            french: tslib_1.__assign(tslib_1.__assign({}, buildFrench()), { description: "Piloter les programmes d'exploration et interpr�ter les donn�es g�ologiques pour orienter les forages." }),
        },
    }); }, []);
    (0, react_1.useEffect)(function () {
        if (!jobId) {
            setData(null);
            setLoading(false);
            return;
        }
        setLoading(true);
        var timer = setTimeout(function () {
            var _a;
            setData((_a = mockMap[jobId]) !== null && _a !== void 0 ? _a : {
                jobId: jobId,
                english: buildEnglish(),
                french: buildFrench(),
            });
            setLoading(false);
        }, 700);
        return function () { return clearTimeout(timer); };
    }, [jobId, mockMap]);
    return { data: data, loading: loading };
};
exports.useAdvertismentDetails = useAdvertismentDetails;
//# sourceMappingURL=getAdvertismentDetails.js.map