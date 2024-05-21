import React, { useState } from "react";
import { Button, Layout, theme } from "antd";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import Logo from "./Logo";
import MenuList from "./MenuList";

const { Header, Sider } = Layout;
export const CompMenu = () => {
  const [collapsed, setCollapsed] = useState(false);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <>
      <Layout>
        <Sider
          className="text-white"
          collapsed={collapsed}
          collapsible
          trigger={null}
        >
          <Logo />
          <MenuList />
        </Sider>
        <Layout>
          <Header
            style={{ padding: 0, background: colorBgContainer }}
            className=""
            onClick={() => setCollapsed(!collapsed)}
          >
            <Button
              type="text"
              icon={collapsed ? <FaAngleRight /> : <FaAngleLeft />}
            ></Button>
          </Header>
        </Layout>
      </Layout>
    </>
  );
};
