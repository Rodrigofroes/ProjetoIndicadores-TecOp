import { Menu } from 'antd'
import { FaList } from "react-icons/fa6";
import { FaChartSimple } from "react-icons/fa6";
import { FaPaste } from "react-icons/fa6";
import { Link } from 'react-router-dom'

const MenuList = () => {
  return (
    <Menu theme='dark' mode='inline' className='h-screen flex flex-col text-base relative mt-8'>
        <Menu.SubMenu title="Inventário" icon={<FaPaste/>}>
            <Menu.Item key={"house"} icon={<FaChartSimple/>}>
              <Link to="/dashboard">Dashboard</Link>
            </Menu.Item>
            <Menu.Item key={"list"} icon={<FaList/>}>
              <Link to="/lista">Listagem</Link>
            </Menu.Item>
        </Menu.SubMenu>
    </Menu>
   
  )
}

export default MenuList