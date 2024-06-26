import React, { useEffect, useRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { FaPen } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa6";
import { Button, Input, Space, Table, Modal, Form, Select } from 'antd';
import Highlighter from 'react-highlight-words';
import Axios from 'axios';

const onFinishEdit = (values) => {
  Axios.post("http://localhost:8000/usuario/alterar", {
    id: values.id,
    usuario: values.username,
    senha: values.password,
    cargo: values.cargo,
  })
    .then((response) => {
      if (response.data.ok) {
        window.location.reload();
      } else {
        Modal.error({
          title: "Erro",
          content: response.data.msg,
        })
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

const onFinishFailedEdit = (errorInfo) => {
  Modal.error({
    title: "Erro",
    content: errorInfo,
  })
};

const onFinish = (values) => {
  Axios.post("http://localhost:8000/usuario/cadastrar", {
    usuario: values.username,
    senha: values.password,
    cargo: values.cargo,
  })
    .then((response) => {
      if (response.data.ok) {
        window.location.reload();
      } else {
        Modal.error({
          title: "Erro",
          content: response.data.msg,
        })
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

const CadastroUsuario = () => {
  const [option, setOption] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [listaUsuario, setListaUsuario] = useState([]);
  const [usuario, setUsuario] = useState([]);
  const [edit, setEdit] = useState(false);
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
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
      title: 'Codigo',
      dataIndex: 'id_user',
      key: 'codigo',
      width: '5%',
    },
    {
      title: 'Usuario',
      dataIndex: 'user_nome',
      key: 'user_nome',
      width: '80%',
      ...getColumnSearchProps('user_nome'),
    },
    {
      title: 'Tipo',
      dataIndex: 'tipo_nome',
      key: 'tipo_nome',
      width: '50%',
      ...getColumnSearchProps('tipo_nome'),
    },
    {
      key: "tabela_id",
      title: "Ações",
      render: (record) => (
        <div className="flex items-center gap-4">
          <button onClick={() => alterUser(record.id_user)}>
            <FaPen className="hover:text-blue-500 transition" />
          </button>
          <button onClick={() => deleteUser(record.id_user)}>
            <FaTrash className="hover:text-red-500 transition" />
          </button>
        </div>
      ),
    },
  ];

  const deleteUser = (id) => {
    Modal.confirm({
      title: "Excluir usuário",
      content: "Deseja realmente excluir este usuário?",
      okText: "Sim",
      okType: "danger",
      cancelText: "Não",
      onOk() {
        Axios.get(`http://localhost:8000/usuario/excluir/${id}`)
          .then((response) => {
            if (response.data.ok) {
              window.location.reload();
            } else {
              Modal.error({
                title: "Erro",
                content: response.data.msg,
              })
            }
          })
          .catch((error) => {
            console.log(error);
          });
      },
    });
  }

  const alterUser = (id) => {
    Axios.get(`http://localhost:8000/usuario/listar/${id}`)
      .then((response) => {
        setEdit(true);
        setListaUsuario(response.data);
      })
      .catch((error) => {
        console.error("Erro ao carregar a lista:", error);
      });
  };

  const onAdd = () => {
    setIsModalOpen(true);
  };

  const conexao = () => {
    Axios.get("http://localhost:8000/auth/listar")
      .then((response) => {
        setUsuario(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    Axios.get("http://localhost:8000/consultar/options")
      .then((response) => {
        setOption(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    conexao();
  }, []);

  const [form] = Form.useForm();
  useEffect(() => {
    if (listaUsuario && listaUsuario.length > 0) {
      form.setFieldsValue({
        id: listaUsuario[0].id_user,
        username: listaUsuario[0].user_nome,
        password: listaUsuario[0].user_senha,
        cargo: listaUsuario[0].tipo_user,
      });
    }
  }, [listaUsuario, form]);

  return (
    <>
      <Modal
        title="Cadastrar Usuário"
        okText="Salvar"
        visible={isModalOpen}
        onOk={() => {
          onFinish();
          setIsModalOpen(false);
        }}
        onCancel={() => {
          setIsModalOpen(false);
        }}
        footer={null}
      >
        <Form
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <div className="flex flex-col w-full gap-6 p-6">
            <div className='flex flex-col'>
              <Form.Item
                name="username"
                label="Usuário"
                rules={[
                  {
                    required: true,
                    message: "Campo obrigatório!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="password"
                label="Senha"
                rules={[
                  {
                    required: true,
                    message: "Campo obrigatório!",
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                name="cargo"
                label="Cargo"
                rules={[
                  {
                    required: true,
                    message: "Campo obrigatório!",
                  },
                ]}
              >
                <Select placeholder="Escolha" style={{ width: '100%' }}>
                  {option.map((item) => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.tipo_nome}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            <Button
              htmlType="submit"
              type="primary"
              block
            >
              Cadastrar
            </Button>
          </div>
        </Form>
      </Modal>
      <Button type="primary" onClick={() => onAdd()}>Cadastrar usuario</Button>
      <Table columns={columns} dataSource={usuario} />
      <Modal
        title="Alterar Usuário"
        visible={edit}
        okText="Alterar"
        onOk={() => {
          setEdit(false);
        }}
        onCancel={() => {
          setEdit(false);
        }}
        footer={null}
      >
        <Form
          form={form}
          onFinish={onFinishEdit}
          onFinishFailed={onFinishFailedEdit}
        >
          <div className="flex flex-col w-full gap-6 p-6">
            <div className='flex flex-col'>
              <Form.Item
                hidden
                name="id"
                rules={[
                  {
                    required: true,
                    message: "Campo obrigatório!",
                  },
                ]}
              >
                <Input disabled hidden />
              </Form.Item>
              <Form.Item
                name="username"
                label="Usuário"
                rules={[
                  {
                    required: true,
                    message: "Campo obrigatório!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="password"
                label="Senha"
                rules={[
                  {
                    required: true,
                    message: "Campo obrigatório!",
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                name="cargo"
                label="Cargo"
                rules={[
                  {
                    required: true,
                    message: "Campo obrigatório!",
                  },
                ]}
              >
                <Select placeholder="Escolha" style={{ width: '100%' }}>
                  {option.map((item) => (
                    <Option key={item.id} value={item.id}>
                      {item.tipo_nome}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            <Button
              htmlType="submit"
              type="primary"
              block
            >
              Alterar
            </Button>
          </div>
        </Form>
      </Modal>

    </>
  );
};
export default CadastroUsuario;
