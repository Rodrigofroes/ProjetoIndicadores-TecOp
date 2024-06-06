import { Menu } from "antd";
import { FaList } from "react-icons/fa6";
import { FaChartSimple } from "react-icons/fa6";
import { FaPaste } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { FaUser } from "react-icons/fa6";
import { FaFileSignature } from "react-icons/fa6";
import { FaRightFromBracket } from "react-icons/fa6";

import { FaPlus } from "react-icons/fa6";
import verifica from "../utils/verifica";
const { decodeToken } = new verifica();

const validar = () => {
  if (document.cookie != "") {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      .split("=")[1];
    const tipo = decodeToken(token);
    return tipo.tipo;
  }
};

const sair = () => {
  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
  window.location.href = "/login";
}



const user = validar();

const MenuList = () => {
  return (
    <Menu
      theme="dark"
      mode="inline"
      className="h-screen flex flex-col text-base relative mt-8"
    >
      <Menu.SubMenu title="Inventário" icon={<FaPaste />} key={"inventario"}>
        <Menu.Item key={"house"} icon={<FaChartSimple />}>
          <Link to="/">Dashboard</Link>
        </Menu.Item>
        <Menu.Item key={"list"} icon={<FaList />}>
          <Link to="/lista">Listagem</Link>
        </Menu.Item>
      </Menu.SubMenu>
      {user == 1 && (
        <Menu.Item icon={<FaPlus />} key={"Cadastrar"}>
            <Link to="/cadastro">Cadastrar</Link>
        </Menu.Item>
      )}
      {user && (
        <Menu.Item key={"sair"} icon={<FaRightFromBracket />}>
          <button onClick={sair}>Sair</button>
        </Menu.Item>
      )}
    </Menu>
  );
};

export default MenuList;
