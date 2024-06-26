import React from 'react'
import { Tabs } from "antd";
import ListaIndicadores from '../pages/ListaIndicadores';
import ListaEntreda from '../pages/ListaEntrada';

const items = [
  {
    key: '1',
    label: 'Indicadores',
    children: <ListaIndicadores/>,
  },
  {
    key: '2',
    label: 'Entrada x Saída',
    children: <ListaEntreda/>,
  }
];

const ListaRouter = () => {
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

export default ListaRouter