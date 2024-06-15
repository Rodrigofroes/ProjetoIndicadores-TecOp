import React from 'react';
import {Button, Tabs } from 'antd';
import CadastroUsuario from '../pages/CadastroUsuario.jsx';
import CadastroAtividade from '../pages/CadastroAtividade.jsx';
import CadastroMovimentacao from '../pages/CadastroMovimentacao.jsx';
const items = [
  {
    key: '1',
    label: 'Usuário',
    children: <CadastroUsuario/>,
  },
  {
    key: '2',
    label: 'Atividade',
    children: <CadastroAtividade/>,
  },
  {
    key: '3',
    label: 'Movimentação',
    children: <CadastroMovimentacao/>,
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