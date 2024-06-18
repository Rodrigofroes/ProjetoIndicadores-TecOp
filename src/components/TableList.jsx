import React, { useState, useRef, useEffect } from "react";
import { Table, Modal, Input, Space, Button, Form, Select } from "antd";
import Axios from "axios";
import { FaDownLong } from "react-icons/fa6";
import { FaPen } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa6";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import verifica from "../utils/verifica";
const { decodeToken } = new verifica();
import moment from 'moment';
import * as XLSX from "xlsx";

const onFinishEdit = (data) => {
  console.log(data);
  Axios.post("http://localhost:8000/cadastro/alteracao", data)
    .then((response) => {
      window.location.reload();
    })
    .catch((error) => {
      console.log(error);
    });
};

const TableList = ({ children, dataSource, atividade, movimentacao }) => {

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [edit, setEdit] = useState(false);
  const [listagem, setListagem] = useState([]);

  const tableRef = useRef(null);

  const download = () => {
    const activeColumns = user === 1 ? columns : columnsUser;

    const data = dataSource.map((row) =>
      activeColumns.map((col) => row[col.dataIndex])
    );
    const header = activeColumns.map((col) => col.title);

    const ws = XLSX.utils.aoa_to_sheet([header, ...data]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    XLSX.writeFile(wb, "relatorio.xlsx");
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
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
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
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
            Procurar
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Limpar
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Fechar
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
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
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      key: "tabela_data",
      title: "Data",
      dataIndex: "tabela_data",
      ...getColumnSearchProps("tabela_data"),
      render: (text) => {
        const formatDate = moment(text).format('DD/MM/YYYY');
        return formatDate;
      },
    },
    {
      key: "ati_nome",
      title: "Atividade",
      dataIndex: "ati_nome",
      ...getColumnSearchProps("ati_nome"),
    },
    {
      key: "mov_nome",
      title: "Movimentação",
      dataIndex: "mov_nome",
      ...getColumnSearchProps("mov_nome"),
    },
    {
      key: "tabela_quantidade",
      title: "Quantidade",
      dataIndex: "tabela_quantidade",
    },
    {
      key: "user_nome",
      title: "Usuário",
      dataIndex: "user_nome",
      ...getColumnSearchProps("user_nome"),
    },
    {
      key: "tabela_id",
      title: "Ações",
      render: (record) => (
        <div className="flex items-center gap-4">
          <button onClick={() => alterUser(record.tabela_id)}>
            <FaPen className="hover:text-blue-500 transition" />
          </button>
          <button onClick={() => deleteUser(record.tabela_id)}>
            <FaTrash className="hover:text-red-500 transition" />
          </button>
        </div>
      ),
    },
  ];

  const columnsUser = [
    {
      key: "tabela_data",
      title: "Data",
      dataIndex: "tabela_data",
      ...getColumnSearchProps("tabela_data"),
      render: (text) => {
        const formatDate = moment(text).format('DD/MM/YYYY');
        return formatDate;
      },
    },
    {
      key: "ati_nome",
      title: "Atividade",
      dataIndex: "ati_nome",
      ...getColumnSearchProps("ati_nome"),
    },
    {
      key: "mov_nome",
      title: "Movimentação",
      dataIndex: "mov_nome",
      ...getColumnSearchProps("mov_nome"),
    },
    {
      key: "tabela_quantidade",
      title: "Quantidade",
      dataIndex: "tabela_quantidade",
    },
    {
      key: "user_nome",
      title: "Usuário",
      dataIndex: "user_nome",
      ...getColumnSearchProps("user_nome"),
    },
  ];

  const deleteUser = (id) => {
    Modal.confirm({
      title: "Excluir usuário",
      content: "Deseja realmente excluir este registro?",
      okText: "Sim",
      okType: "danger",
      cancelText: "Não",
      onOk() {
        Axios.post(`http://localhost:8000/cadastro/delete/${id}`)
          .then((response) => {
            window.location.reload();
          })
          .catch((error) => {
            console.log(error);
          });
      },
    });
  };

  const alterUser = (id) => {
    Axios.get(`http://localhost:8000/cadastro/consulta/${id}`)
      .then((response) => {
        setListagem(response.data);
      })
      .catch((error) => {
        console.error("Erro ao carregar a lista:", error);
      });
    setEdit(true);
  };

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

  const user = validar();

  const [form] = Form.useForm();

  useEffect(() => {
    if (listagem && listagem.length > 0) {
      form.setFieldsValue({
        id: listagem[0].tabela_id,
        data: listagem[0].tabela_data,
        atividade: listagem[0].ati_id,
        movimentacao: listagem[0].mov_id, 
        quantidade: listagem[0].tabela_quantidade,
      });
    }
  }, [listagem, form]);

  return (
    <div>
      <div className="flex justify-between mb-2 items-center gap-4">
        {children}
        <Button
          className="hover:text-blue-500  text-xs flex items-center gap-2"
          onClick={() => download()}
        >
          <FaDownLong />
          Exportar dados
        </Button>
      </div>
      <Table
        id="Table"
        ref={tableRef}
        columns={user == 1 ? columns : columnsUser}
        dataSource={dataSource}
        pagination={{ pageSize: 8 }}
      ></Table>
      <Modal
        title="Alterar Atividade"
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
          layout="vertical"
        >
          <Form.Item
            name="id"
            label="Id"
            hidden
            rules={[
              {
                required: true,
                message: "Campo obrigatório",
              },
            ]}
          >
            <Input hidden />
          </Form.Item>
          <Form.Item
            name="data"
            label="Data"
            rules={[
              {
                required: true,
                message: "Campo obrigatório",
              },
              {
                validator: (_, value) => {
                  const today = new Date();
                  const inputDate = new Date(value);
                  if (inputDate <= new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
                    return Promise.resolve();
                  }
                  return Promise.reject("A data não pode ser maior ao dia atual");
                }
              }
            ]}
          >
            <Input type="date" />
          </Form.Item>
          <Form.Item
            name="atividade"
            label="Atividade"
            rules={[
              {
                required: true,
                message: "Campo obrigatório",
              },
            ]}
          >
            <Select>
              {atividade.map((item) => (
                <Select.Option key={item.ati_id} value={item.ati_id}>
                  {item.ati_nome}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="movimentacao"
            label="Movimentação"
            rules={[
              {
                required: true,
                message: "Campo obrigatório",
              },
            ]}
          >
            <Select>
              {movimentacao.map((item) => (
                <Select.Option key={item.mov_id} value={item.mov_id}>
                  {item.mov_nome}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="quantidade"
            label="Quantidade"
            rules={[
              {
                required: true,
                message: "Campo obrigatório",
              },
              {
                validator: (_, value) => {
                  if (value > 0) {
                    return Promise.resolve();
                  }
                  return Promise.reject("A quantidade deve ser maior que 0");
                }
              }
            ]}
          >
            <Input type="number" min={0} />
          </Form.Item>
          <Form.Item className="flex justify-center">
            <Button type="primary" htmlType="submit">
              Alterar
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );

};

export default TableList;
