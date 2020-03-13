"use strict";

import { format, parseISO } from "date-fns";

export function date(date, fmt) {
    if (!date || typeof date === "object") return "";
    if (typeof date === "string") date = parseISO(date);
    if (fmt) {
        return format(date, fmt);
    }
    return format(date, "dd/MM/yyyy");
}

export function toBoolean(string) {
    if (!string || typeof string === "object") return "";
    switch (string.toLowerCase().trim()) {
        case "true":
        case "yes":
        case "1":
            return "Yes";
        case "false":
        case "no":
        case "0":
        case null:
            return "No";
        default:
            return string;
    }
}

export function shortName(string) {
    return string.split("/").pop();
}
