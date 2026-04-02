import React from "react";
import { TabBar } from "antd-mobile";
import { useNavigate, useLocation } from "react-router-dom";
import { UserOutline, AppOutline } from "antd-mobile-icons";
import { useLanguage } from "@/hooks/useLanguage";

const BottomTabBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const { pathname } = location;

  const setRouteActive = (value: string) => {
    navigate(value);
  };

  const tabs = [
    {
      key: "/",
      title: t("navigation.home"),
      icon: <AppOutline />,
    },
    {
      key: "/profile",
      title: t("navigation.profile"),
      icon: <UserOutline />,
    },
  ];

  return (
    <div
      className="bg-white w-full"
      style={{
        paddingBottom: "env(safe-area-inset-bottom)",
        minHeight: "60px",
        backgroundColor: "#ffffff",
      }}
    >
      <TabBar
        activeKey={pathname}
        onChange={setRouteActive}
        style={
          {
            width: "100%",
            height: "60px",
            "--adm-tabbar-height": "60px",
          } as React.CSSProperties
        }
      >
        {tabs.map((item) => (
          <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
        ))}
      </TabBar>
    </div>
  );
};

export default BottomTabBar;
