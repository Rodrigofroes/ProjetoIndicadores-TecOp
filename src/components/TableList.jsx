import React, { useState, useRef, Children } from "react";
import { Table, Modal, Input, Space, Button } from "antd";
import Axios from "axios";
import { FaDownLong } from "react-icons/fa6";
import { FaPen } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa6";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import moment from "moment-timezone";
import verifica from "../utils/verifica";
const { decodeToken } = new verifica();
import * as XLSX from "xlsx";

const TableList = ({ children,dataSource, atividade, movimentacao }) => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const [edit, setEdit] = useState(false);
  const [mov, setMove] = useState("");
  const [ati, setAti] = useState("");

  const [listagem, setListagem] = useState([]);
  const [dataNova, setDataNova] = useState(null);
  const [quantidade, setQuantidade] = useState(null);

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

    XLSX.writeFile(wb, "relatorio-usuarios.xlsx");
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
      render: (text) => moment(text, "YYYY-MM-DD").format("DD/MM/YYYY"),
      ...getColumnSearchProps("tabela_data"),
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
      key: "user_usuario",
      title: "Usuário",
      dataIndex: "user_usuario",
      ...getColumnSearchProps("user_usuario"),
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
      render: (text) => moment(text, "YYYY-MM-DD").format("DD/MM/YYYY"),
      ...getColumnSearchProps("tabela_data"),
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
      key: "user_usuario",
      title: "Usuário",
      dataIndex: "user_usuario",
      ...getColumnSearchProps("user_usuario"),
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

  const saveUser = (data) => {
    const id = data.map((item) => item.tabela_id);
    Axios.post(`http://localhost:8000/cadastro/alteracao/${id}`, {
      data: dataNova,
      atividade: ati,
      movimentacao: mov,
      quantidade: quantidade,
    })
      .then((response) => {
        alert(response.data.msg);
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
    setEdit(false);
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
        <form>
          <div className="flex flex-col w-96 gap-4 p-4">
            {listagem.map((item) => (
              <div
                key={item.tabela_id}
                className="flex flex-col w-96 gap-4 p-4"
              >
                <div>
                  <label htmlFor="inputData">Data:</label>
                  <Input
                    className="border border-gray-300 rounded-md p-2"
                    variant="outline"
                    type="date"
                    value={dataNova == null ? item.tabela_data : dataNova}
                    onChange={(e) => setDataNova(e.target.value)}
                  />
                </div>

                <div className="flex gap-5">
                  <div className="w-80 flex flex-col">
                    <label htmlFor="inputAtividade">Atividade:</label>
                    <select
                      className="border border-gray-300 rounded-md p-2"
                      variant="outline"
                      onChange={(e) => setAti(e.target.value)}
                    >
                      {atividade.map((items) => (
                        <option
                          key={items.ati_nome}
                          value={items.ati_id}
                          selected={items.ati_nome === item.ati_nome}
                        >
                          {items.ati_nome}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-80 flex flex-col">
                    <label htmlFor="inputMovimentacao">Movimentação:</label>
                    <select
                      className="border border-gray-300 rounded-md p-2"
                      variant="outline"
                      onChange={(e) => setMove(e.target.value)}
                    >
                      {movimentacao.map((items) => (
                        <option
                          key={items.mov_nome}
                          value={items.mov_id}
                          selected={items.mov_nome === item.mov_nome}
                        >
                          {items.mov_nome}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col">
                  <label htmlFor="inputQuantidade">Quantidade:</label>
                  <Input
                    className="border border-gray-300 rounded-md p-2"
                    variant="outline"
                    type="text"
                    value={
                      quantidade == null ? item.tabela_quantidade : quantidade
                    }
                    onChange={(e) => setQuantidade(e.target.value)}
                  />
                </div>
              </div>
            ))}
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded-md"
              onClick={() => saveUser(listagem)}
            >
              Alterar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TableList;
