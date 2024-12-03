export default function IsValid(data: any) {
    if (data == undefined) {
        return false;
    } else if (data == null) {
        return false;
    } else if (data == "") {
        return false;
    } else if (!data) {
        return false;
    } else if (0) {
        return false;
    }
    return true;
}


export function IsInt(obj: any) {
    if (obj == undefined) {
        return false;
    }
    if (obj == null) {
        return false;
    } else if (obj == "") {
        return false;
    } else if (obj == 0) {
        return false;
    } else if (obj == "NaN") {
        return false;
    } else if (obj === "null") {
        return false;
    } else if (Number.isNaN(obj)) {
        return false;
    }
    return true;
}