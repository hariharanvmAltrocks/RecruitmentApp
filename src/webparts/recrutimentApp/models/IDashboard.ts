

import { LucideIcon } from "lucide-react";
import { IFilter } from "../services/SPService/Ispservice";

export interface MetricConfig {
    id: number;
    label: string;
    status: string;
    icon: LucideIcon;
    color: string;
    bgColor: string;
    statusColor: string,
    statusBg: string,
    showArrow: boolean;
    externalApi?: {
        workflowStatuses: string[];
    };
    iconType?: string;
    path: string;
    menuId: number;
    TabValue: string;
    TabName: string;
}

export interface Metric extends MetricConfig {
    value: number;
}

export interface BatchQuery {
    StateValue: string;
    ListName: string;
    Filter: IFilter[];
    select: string[];
}

export interface ExternalApiCountItem {
    jobCode: string;
    count: number;
    workflowStatus: string[];
}

export interface ExternalApiParams {
    jobCodes: string[];
    workflowStatus: string[];
}