import React from 'react'
import { Tabs } from "antd";
import DashboardIndicadores from '../pages/DashboardIndicadores';
import DashboardEntrada from '../pages/DashboardEntrada';

const items = [
  {
    key: '1',
    label: 'Indicadores',
    children: <DashboardIndicadores/>,
  },
  {
    key: '2',
    label: 'Entrada x Saída',
    children: <DashboardEntrada/>,
  }
];

const Dashboard = () => {
    return (
    <div className='flex flex-col bg-white rounded-lg p-4  h-full gap-2'>
      <Tabs
        defaultActiveKey="1"
        items={items}
        indicator={{
          size: (origin) => origin - 20,
        }}
      />
    </div>
  )
}

export default Dashboard