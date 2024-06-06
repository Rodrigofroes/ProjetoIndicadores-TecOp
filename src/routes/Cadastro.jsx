import React from 'react';
import {Button, Tabs } from 'antd';
import CadastroUsuario from '../pages/CadastroUsuario.jsx';
const items = [
  {
    key: '1',
    label: 'Usuario',
    children: <CadastroUsuario/>,
  },
  {
    key: '2',
    label: 'Atividade',
    children: 'Content of Tab Pane 2',
  },
  {
    key: '3',
    label: 'Movimentação',
    children: 'Content of Tab Pane 3',
  }
];
const Cadastro = () => {
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
  );
};
export default Cadastro;