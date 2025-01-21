import * as React from "react";
import styles from "./SideNavigation.module.scss";
import { MenuResponse } from "../Models/Menu";
import { useLocation, useNavigate } from "react-router-dom";
import { IMenuService } from "../Services/MenuService/IMenu";
import MenuService from "../Services/MenuService/MenuService";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

type sideNavProps = {
    roleID: number | undefined;
    IsExpanded: boolean;
};

const SideNavComponent = (props: sideNavProps) => {
    const [sideNavArr, setSideNavArr] = React.useState<MenuResponse[]>([]);
    const [expandedMenuId, setExpandedMenuId] = React.useState<number | null>(null);
    const navigate = useNavigate();
    const location = useLocation();

    const MenuItemsService: IMenuService = new MenuService();

    React.useEffect(() => {
        if (props.roleID) {
            void fetchRoleAccessData(props.roleID);
        }
    }, [props.roleID]);

    async function fetchRoleAccessData(RoleID: number) {
        const dynamicMenu = await MenuItemsService.getMenuDetails(RoleID);

        if (dynamicMenu.status === 200) {
            const defaultMenu = dynamicMenu.data[0];
            if (defaultMenu.Children?.length && defaultMenu.Children[0]) {
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

    const isActiveMenu = (item: MenuResponse) => {
        if (location.pathname.startsWith(item.Path)) {
            return true;
        }
        if (item.Children && item.Children.length > 0) {
            return item.Children.some((subItem) =>
                location.pathname.startsWith(subItem.Path)
            );
        }
        return false;
    };

    const toggleExpand = (menuId: number, path: string) => {
        setExpandedMenuId((prev) => (prev === menuId ? null : menuId));
        handleNavigation(path);
    };

    const renderMenu = (items: MenuResponse[], menuType: string): React.ReactNode => {
        return (
            <>
                {items?.map((item: MenuResponse) => {
                    const isActive = isActiveMenu(item);
                    // const isActive = item.Children?.[0]?.Path && isActiveMenu(item.Children[0].Path);
                    const isExpanded = expandedMenuId === item.Id
                    const isMainMenu = menuType === 'menu';
                    console.log(item, "MenuResponse");

                    return (
                        <div key={item.Id}>
                            {props.IsExpanded ? (
                                <>
                                    <div
                                        className={`${styles.navLine} ${isActive ? (!isMainMenu ? styles.activeSub : styles.active) : ''}`}
                                        style={{ marginTop: "5%" }}
                                    >
                                        <div
                                            className={styles.navImg}
                                            onClick={() => {
                                                if (item.Children && item.Children.length > 0) {
                                                    toggleExpand(item.Id, item.Path);
                                                } else {
                                                    handleNavigation(item.Path);
                                                }
                                            }}
                                            style={{ cursor: "pointer", marginLeft: "20%", }}
                                        >
                                            {isMainMenu && (
                                                <p>
                                                    <img
                                                        src={isActive ? item.ActiveIcon : item.Icon}
                                                        alt={item.DisplayName}
                                                    />
                                                </p>
                                            )}

                                            <div className={`${styles.navLabel} ${isActive ? "active" : ""}`}>
                                                <p
                                                    style={{
                                                        fontWeight: isActive ? "bold" : "normal",
                                                        color: isActive ? "black" : "none",
                                                        marginBottom: "20px",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        cursor: "pointer",
                                                        marginLeft: "1%"
                                                    }}
                                                >
                                                    {item.DisplayName}
                                                    {isMainMenu && (
                                                        <span
                                                            style={{
                                                                marginLeft: "12px",
                                                                fontSize: "12px",
                                                                color: "gray",
                                                                marginTop: "6%",
                                                            }}
                                                        >
                                                            {isExpanded ? (
                                                                <KeyboardArrowDownIcon />

                                                            ) : (
                                                                <ExpandLessIcon />
                                                            )}
                                                        </span>
                                                    )}

                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {isExpanded && item.Children && item.Children.length > 0 && (
                                        <div style={{ marginLeft: "30px", marginTop: "5%" }}>
                                            {renderMenu(item.Children, 'submenu')}
                                        </div>
                                    )}

                                </>
                            ) : (
                                <>
                                    <div
                                        className={styles.expandnavImg}
                                        onClick={() => toggleExpand(item.Id, item.Path)}
                                        style={{ cursor: "pointer", marginLeft: "26%" }}
                                    >
                                        <p>
                                            <img
                                                src={isActive ? item.ActiveIcon : item.Icon}
                                                alt={item.DisplayName}
                                            />
                                        </p>
                                    </div>

                                </>
                            )}
                        </div>
                    );
                })}
            </>
        );
    };

    return (
        <div
            className={styles.sideNav}
            style={{
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                borderRadius: "0px 30px 30px 0px ",
                transition: "width 1s",
            }}
        >
            <div>
                <div
                    className={styles.imgBox}
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: props.IsExpanded ? "68px" : "68px",
                        padding: props.IsExpanded ? "3px" : "0px",
                        backgroundColor: "white",
                    }}
                >
                    {props.IsExpanded ? (
                        <img src={require("../assets/komoa-logo-name.png")} />
                    ) : (
                        <img src={require("../assets/komoa-logo.png")} />
                    )}
                </div>
                <div className={styles.linksContainer}>{renderMenu(sideNavArr, 'menu')}</div>
            </div>
            {props.IsExpanded ? (
                <>
                    <div
                        style={{
                            color: "white",
                            fontSize: "15px",

                            alignSelf: "center",
                            marginBottom: "10px",
                        }}
                    >
                        Version-1.0
                    </div>
                </>
            ) : (
                <>
                    <div
                        style={{
                            color: "white",
                            fontSize: "15px",

                            alignSelf: "center",
                            marginBottom: "10px",
                        }}
                    >
                        V-1.0
                    </div>
                </>
            )}

        </div>
    );
};

export default SideNavComponent;
