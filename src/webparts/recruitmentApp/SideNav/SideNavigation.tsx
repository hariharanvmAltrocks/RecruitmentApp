import * as React from "react";
import styles from "./SideNavigation.module.scss";
import { MenuResponse } from "../Models/Menu";
import { useLocation, useNavigate } from "react-router-dom";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { userInfo } from "../utilities/RoleContext";
import { TabDetails } from "../Models/Master";

type sideNavProps = {
  roleID: number[] | undefined;
  IsExpanded: boolean;
  // setMenuID: React.Dispatch<React.SetStateAction<number>>;
};

const SideNavComponent = (props: sideNavProps) => {
  const { masterData } = userInfo();

  const [sideNavArr, setSideNavArr] = React.useState<MenuResponse[]>([]);
  // const [expandedMenuId, setExpandedMenuId] = React.useState<number | null>(
  //   null
  // );
  const [isHovered, setIsHovered] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // const MenuItemsService: IMenuService = new MenuService();

  React.useEffect(() => {
    if (props.roleID) {
      setSideNavArr(masterData?.menuMartixData ?? []);
      // void fetchRoleAccessData(props.roleID);
      // props.menuID(
      //   props.SideMenuData[0]?.Children
      //     ? props.SideMenuData[0]?.Children[0]?.Id
      //     : props.SideMenuData[0]?.Id
      // ); // Set initial menu ID to the first item
    }
  }, [props.roleID]);

  React.useEffect(() => {
    if (sideNavArr.length > 0 && sideNavArr[0]) {
      const firstItem = sideNavArr[0];
      if (
        Array.isArray(firstItem.Children) &&
        firstItem.Children.length > 0 &&
        firstItem.Children[0]
      ) {
        navigate(firstItem.Children[0].Path);
      } else if (firstItem.Path) {
        navigate(firstItem.Path);
      }
    }
  }, [sideNavArr]);

  const handleNavigation = (path: string, Id: number) => {
    navigate(path);
    if (masterData) {
      masterData.CurrentMenuID = Id;
    }
  };

  const TabDetailsData = (menuID: number) => {
    const selectedTabDetails: TabDetails[] =
      masterData?.menuMartixData?.reduce((acc: TabDetails[], menu: any) => {
        if (!menu.SubMenu) {
          const match = menu.TabDetails?.find(
            (tab: { Id: number }) => tab?.Id === menuID
          );
          let TabDetails = match?.TabDetails.map((item: any, index: number) => {
            return {
              ...item,
              Value: "tab" + (index + 1),
            };
          });
          if (match) acc.push(TabDetails);
        } else {
          const childMatches = menu.Children?.find(
            (child: any) => child?.Id === menuID
          );
          let TabDetails = childMatches?.TabDetails.map(
            (item: any, index: number) => {
              return {
                ...item,
                Value: "tab" + (index + 1),
              };
            }
          );
          if (childMatches) acc.push(TabDetails);
        }
        return acc;
      }, []) ?? [];

    if (masterData) {
      // Empty TabDetails before adding new data
      masterData.TabDetails.length = 0; // Reset the array to empty
      masterData.TabDetails.push(...selectedTabDetails);
      // masterData.CurrentMenuID = menuID; // Push the new data
    }
  };
  const isActiveMenu = (item: MenuResponse) => {
    if (item.Children && item.Children.length > 0) {
      const activeChild = item.Children.find((subItem) =>
        location.pathname.startsWith(subItem.Path)
      );
      if (activeChild) {
        if (masterData) {
          masterData.CurrentMenuID = activeChild.Id;
          TabDetailsData(activeChild.Id);
        }
        return true;
      }
    }
    if (location.pathname.startsWith(item.Path)) {
      if (masterData) {
        masterData.CurrentMenuID = item.Id;
        TabDetailsData(item.Id);
      }
      return true;
    }
    return false;
  };

  const toggleExpand = (menuId: number, path: string) => {
    // setExpandedMenuId((prev) => (prev === menuId ? null : menuId));
    handleNavigation(path, menuId);
  };

  const renderMenu = (
    items: MenuResponse[],
    menuType: string
  ): React.ReactNode => {
    return (
      <>
        {items?.map((item: MenuResponse) => {
          const isActive = isActiveMenu(item);
          // const isActive = item.Children?.[0]?.Path && isActiveMenu(item.Children[0].Path);
          // let expandID = expandedMenuId
          //   ? expandedMenuId
          //   : masterData?.menuMartixData[0].Id;
          // let selectedmenuID = sideNavArr.filter(
          //   (items) => items.Id === expandID
          // );
          // let menuIDExpend = selectedmenuID[0]?.Children ? true : false;
          // const isExpanded = expandedMenuId === item.Id;

          const isChildIshere = item.Children?.[0]?.Path;
          const isMainMenu = menuType === "menu";
          return (
            <div key={item.Id}>
              {props.IsExpanded ? (
                <>
                  <div
                    className={`${styles.navLine} ${
                      isActive
                        ? !isMainMenu
                          ? styles.activeSub
                          : styles.active
                        : ""
                    }`}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    style={{ marginTop: "5%" }}
                  >
                    <div
                      className={styles.navImg}
                      onClick={() => {
                        if (item.Children && item.Children.length > 0) {
                          toggleExpand(item.Id, item.Path);
                        } else {
                          handleNavigation(item.Path, item.Id);
                        }
                      }}
                      style={{ cursor: "pointer", marginLeft: "20%" }}
                    >
                      {isMainMenu && (
                        <p>
                          <img
                            src={isActive ? item.ActiveIcon : item.Icon}
                            alt={item.DisplayName}
                          />
                        </p>
                      )}

                      <div
                        className={`${styles.navLabel} ${
                          isActive ? "active" : ""
                        }`}
                      >
                        <p
                          style={{
                            fontWeight: isActive ? "bold" : "normal",
                            color: isHovered || isActive ? "black" : "white",
                            marginBottom: "20px",
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer",
                            marginLeft: "1%",
                          }}
                        >
                          {item.DisplayName}
                          {isChildIshere && isMainMenu && (
                            <span
                              style={{
                                marginLeft: "12px",
                                fontSize: "12px",
                                color: "gray",
                                marginTop: "6%",
                              }}
                            >
                              {isActive ? (
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

                  {isActive && item.Children && item.Children.length > 0 && (
                    <div style={{ marginLeft: "30px", marginTop: "5%" }}>
                      {renderMenu(item.Children, "submenu")}
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
        <div className={styles.linksContainer}>
          {renderMenu(sideNavArr, "menu")}
        </div>
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
            Version-1.4
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
            V-1.4
          </div>
        </>
      )}
    </div>
  );
};

export default SideNavComponent;
