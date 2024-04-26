import React, { useRef, useState, useEffect } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table, Modal, Form, notification } from 'antd';
import Highlighter from 'react-highlight-words';
import { FaPlus } from "react-icons/fa6";
import InputCustom from '../components/InputCustom';
import SelectCustom from '../components/SelectCustom';
import SelectCustomMovi from '../components/SelectCustomMovi';

const ListaRouter = () => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [dataSource, setDataSource] = useState([]);
  const [atividade, setAtividade] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const searchInput = useRef(null);

  const fetchDataFromAPI = () => {
    fetch('http://localhost:8000/consultar/listagem', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(response => response.json())
      .then(data => setDataSource(data))
      .catch(error => console.error('Erro ao buscar dados da API:', error));
  };

  useEffect(() => {
    fetchDataFromAPI();
  }, []);

  const handleAddItem = () => {
    setModalVisible(true);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
  };

  const handleAddNewItem = (values) => {
    console.log('Novo item:', values);
    notification.success({
      message: 'Novo item adicionado com sucesso!',
    });
    setModalVisible(false);
    fetchDataFromAPI();
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: 'Data',
      dataIndex: 'tabela_data',
      key: 'tabela_data',
      width: '30%',
      ...getColumnSearchProps('tabela_data'),
    },
    {
      title: 'Atividade',
      dataIndex: 'ati_nome',
      key: 'ati_nome',
      width: '20%',
      ...getColumnSearchProps('ati_nome'),
      sorter: (a, b) => a.ati_nome.length - b.ati_nome.length,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Movimentação',
      dataIndex: 'mov_nome',
      key: 'mov_nome',
      ...getColumnSearchProps('mov_nome'),
      sorter: (a, b) => a.mov_nome.length - b.mov_nome.length,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Quantidade',
      dataIndex: 'tabela_quantidade',
      key: 'tabela_quantidade',
      width: '20%',
      ...getColumnSearchProps('tabela_quantidade'),
    },
  ];

  return (
    <div className='flex items-center justify-center flex-col h-screen'>
      <Button onClick={handleAddItem} type="primary" icon={<FaPlus />}>Adicionar Item</Button>
      <div style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto', width: '100%' }}>
        <Table columns={columns} dataSource={dataSource} />
      </div>
      {/* Modal para adicionar novo item */}
      <Modal
        title="Adicionar Atividade"
        visible={modalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        <AddItemForm onAdd={handleAddNewItem} onCancel={handleModalCancel} />
      </Modal>
    </div>
  );
};

const AddItemForm = ({ onAdd, onCancel }) => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    onAdd(values);
    form.resetFields();
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item
        name="tabela_data"
        label="Data"
        rules={[{ required: true, message: 'Por favor, insira a data!' }]}
      >
        <InputCustom tipo="date" placeholder="Data" />
      </Form.Item>
      <Form.Item
        name="ati_nome"
        label="Atividade"
        rules={[{ required: true, message: 'Por favor, insira a atividade!' }]}
      >
        <SelectCustom />
      </Form.Item>
      <Form.Item
        name="mov_nome"
        label="Movimentação"
        rules={[{ required: true, message: 'Por favor, insira a movimentação!' }]}
      >
        <SelectCustomMovi />
      </Form.Item>
      <Form.Item
        name="tabela_quantidade"
        label="Quantidade"
        rules={[{ required: true, message: 'Por favor, insira a quantidade!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Adicionar
        </Button>
        <Button onClick={onCancel} style={{ marginLeft: 8 }}>
          Cancelar
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ListaRouter;
