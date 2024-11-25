import * as React from "react";
import styles from "./SideNavigation.module.scss";
import { MenuResponse } from "../Models/Menu";
import { useLocation, useNavigate } from "react-router-dom";
import { userInfo } from "../utilities/RoleContext";
import { IMenuService } from "../Services/MenuService/IMenu";
import MenuService from "../Services/MenuService/MenuService";

export interface ISideNav {
    ID: number;
    img: string | any;
    Name: string;
    Tab: string[];
}

const SideNavComponent = (props: any) => {

    const [sideNavArr, setSideNavArr] = React.useState<MenuResponse[]>([]);
    const [expandedMenuId, setExpandedMenuId] = React.useState<number | null>(null);
    const [hover, sethover] = React.useState<boolean>(false);

    const navigate = useNavigate();
    const location = useLocation();

    const MenuItemsService: IMenuService = new MenuService();
    const { roleID } = userInfo();

    React.useEffect(() => {
        if (roleID) {
            void fetchRoleAccessData(roleID);
        }
    }, [roleID]);

    async function fetchRoleAccessData(RoleID: number) {
        const dynamicMenu = await MenuItemsService.getMenuDetails(RoleID);

        if (dynamicMenu.status === 200) {
            console.log(dynamicMenu, "roleAccessData");
            // await getMenuItems(roleAccessData.data);
            const defaultMenu = dynamicMenu.data[0];
            if (defaultMenu.Children?.length && defaultMenu.Children?.length > 0) {
                debugger;
                const child = defaultMenu.Children[0];
                navigate(child.Path);
            } else {
                navigate(defaultMenu.Path);
            }
            setSideNavArr(dynamicMenu.data);


        } else {
            console.log("Role Access Message", dynamicMenu.message);
        }
    }

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    const isActiveMenu = (path: string) => {
        return location.pathname.startsWith(path);
    };

    const toggleExpand = (menuId: number, path: string) => {
        setExpandedMenuId((prev) => (prev === menuId ? null : menuId));
        sethover(true)
        handleNavigation(path)
    };

    return (
        <div
            className={styles.sideNav}
            style={{
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
            }}
        >
            <div>
                <div
                    className={styles.imgBox}
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "94px",
                        padding: "3px",
                        backgroundColor: "white"
                    }}
                >
                    <img src={require("../assets/komoa-logo-name.png")} />
                </div>
                <div className={styles.linksContainer}>
                    {sideNavArr?.map((item: MenuResponse) => {
                        const isActive = item.Children?.[0]?.Path && isActiveMenu(item.Children[0].Path);
                        const isExpanded = expandedMenuId === item.Id;

                        return (
                            <div key={item.Id}>
                                <div
                                    className={`${styles.navLine} ${isActive ? styles.active : ""}`}
                                // style={{ margin: "5px 10px" }}
                                >
                                    <div
                                        className={styles.navImg}
                                        onClick={() => {
                                            if (item.Children?.length) {
                                                toggleExpand(item.Id, item.Children[0]?.Path);
                                            } else {
                                                toggleExpand(item.Id, item.Path);
                                            }
                                        }}
                                        style={{ cursor: "pointer", marginLeft: "20%" }}
                                    >
                                        <p>
                                            <img
                                                src={isActive ? item.ActiveIcon : item.Icon}
                                                alt={item.DisplayName}
                                            />
                                        </p>
                                        <div
                                            className={`${styles.navLabel} ${isActive ? "active" : ""}`}
                                        >
                                            <p
                                                style={{
                                                    fontWeight: isActive ? "bold" : "normal",
                                                    color: hover ? "black" : "white",
                                                    marginBottom: "20px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    cursor: "pointer"
                                                }}
                                            >
                                                {item.DisplayName}
                                                <span
                                                    style={{
                                                        marginLeft: "12px",
                                                        fontSize: "12px",
                                                        color: "gray",
                                                        marginTop: "6%"
                                                    }}
                                                >
                                                    {isExpanded ? <img src={require("../assets/down-arrow.png")} /> : <img src={require("../assets/up-arrow.png")} />}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {isExpanded &&
                                    item.Children?.map((child) => (
                                        <div
                                            key={child.Id}
                                            className={styles.navLabelChild}
                                            onClick={() => handleNavigation(child.Path)}
                                        >
                                            <p style={{ textAlign: "center" }}>{child.DisplayName}</p>
                                        </div>
                                    ))}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default SideNavComponent;
