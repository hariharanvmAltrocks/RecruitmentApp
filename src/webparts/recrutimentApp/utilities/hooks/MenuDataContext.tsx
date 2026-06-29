
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MenuResponse } from '../../models/menu';
import { userInfo } from './RoleContext';
import { menuService } from '../../services/ServiceExport';


interface MenuContextType {
    menuData: MenuResponse[];
    isLoading: boolean;
    error: string | null;
    refreshMenu: () => void;
}

const MenuDataContext = createContext<MenuContextType | undefined>(undefined);

export const MenuDataProvider = ({ children }: { children: ReactNode }) => {
    const [menuData, setMenuData] = useState<MenuResponse[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { roleIDs } = userInfo();

    const fetchMenu = async () => {
        if (!roleIDs) return; // Don't fetch if not logged in

        setIsLoading(true);
        try {
            // Replace with your actual API endpoint
            const response = await menuService.getSwitchUserMatrix(roleIDs);

            if (response.status === 200) {
                setMenuData(response.data);
            } else {
                throw new Error('Failed to fetch menu');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        void fetchMenu();
    }, [roleIDs]);

    return (
        <MenuDataContext.Provider value={{ menuData, isLoading, error, refreshMenu: fetchMenu }}>
            {children}
        </MenuDataContext.Provider>
    );
};

export const useMenuData = () => {
    const context = useContext(MenuDataContext);
    if (!context) throw new Error('useMenuData must be used within a MenuDataProvider');
    return context;
};