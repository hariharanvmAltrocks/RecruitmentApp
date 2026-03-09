
import { LayoutDashboard, Users, FileText, Settings, Briefcase, FileSearch, Circle } from 'lucide-react';

export const IconMap: Record<string, any> = {
    dashboard: LayoutDashboard,
    users: Users,
    recruitment: Briefcase,
    reports: FileText,
    settings: Settings,
    search: FileSearch,
    default: Circle
};

export const getIcon = (iconName: string) => IconMap[iconName?.toLowerCase()] || IconMap.default;


export const findBreadcrumbPath = (menu: any[], path: string): any[] => {
    for (const item of menu) {
        if (item.Path === path) return [item];
        if (item.Children) {
            const childPath = findBreadcrumbPath(item.Children, path);
            if (childPath.length > 0) return [item, ...childPath];
        }
    }
    return [];
};