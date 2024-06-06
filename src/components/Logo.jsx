import React from "react";
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Space } from "antd";

const Logo = () => {
  return (
    <div className="flex items-center justify-center p-2">
      <div className="w-10 h-10 mt-10 flex items-center justify-center text-2xl">
        <Space direction="vertical" size={16}>
          <Space wrap size={16}>
            <img src="icons/iconTecOp.png" alt="" />
          </Space>
        </Space>
      </div>
    </div>
  );
};

export default Logo;
