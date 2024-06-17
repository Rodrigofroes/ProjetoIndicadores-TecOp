import React, { useRef, useEffect, useState } from 'react';
import { Table, Modal, Form, Select, Input, Space, Button } from 'antd';
import Axios from 'axios';
import { FaPlus } from "react-icons/fa6";
import { FaPen } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa6";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import verificar from "../utils/verifica";
import { render } from 'react-dom';
import { renderToString } from 'react-dom/server';
const { decodeToken } = new verificar();

const onFinished = (values) => {
    Axios.post('http://localhost:8000/deposito/inserir', {
        entrada: values.entrada,
        saida: values.saida,
    })
        .then((response) => {
            if (response.data.ok) {
                window.location.reload();
            }
        })
        .catch((error) => {
            console.error("Erro ao cadastrar:", error);
        });
}

const onFinishedFailed = (errorInfo) => {
    console.log(errorInfo)
}


const ListaEntrada = () => {
    const tableRef = useRef(null)
    const [deposito, setDeposito] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const [listagem, setListagem] = useState([]);
    const [edit, setEdit] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const searchInput = useRef(null);

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

    const columnsUser = [
        {
            title: 'Entrada',
            dataIndex: 'entrada',
            key: 'entrada',
            ...getColumnSearchProps("entrada"),
        },
        {
            title: 'Saída',
            dataIndex: 'saida',
            key: 'saida',
            ...getColumnSearchProps("saida"),
        },
        {
            title: 'User',
            dataIndex: 'user_nome',
            key: 'user_nome',
            ...getColumnSearchProps("user_nome"),
        },
        {
            title: 'Data',
            dataIndex: 'dataCriacao',
            key: 'dataCriacao',
            ...getColumnSearchProps("dataCriacao"),
        }
    ];

    const columns = [
        {
            title: 'Entrada',
            dataIndex: 'entrada',
            key: 'entrada',
            ...getColumnSearchProps("entrada"),
        },
        {
            title: 'Saída',
            dataIndex: 'saida',
            key: 'saida',
            ...getColumnSearchProps("saida"),
        },
        {
            title: 'User',
            dataIndex: 'user_nome',
            key: 'user_nome',
            ...getColumnSearchProps("user_nome"),
        },
        {
            title: 'Data',
            dataIndex: 'dataCriacao',
            key: 'dataCriacao',
            ...getColumnSearchProps("dataCriacao"),
        },
        {
            title: 'Ações',
            key: 'acoes',
            render: (record) => (
                <div className="flex items-center gap-4">
                    <button onClick={() => alterUser(record.id)}>
                        <FaPen className="hover:text-blue-500 transition" />
                    </button>
                    <button onClick={() => deleteUser(record.id)}>
                        <FaTrash className="hover:text-red-500 transition" />
                    </button>
                </div>
            ),
        }
    ];

    const deleteUser = (id) => {
        Modal.confirm({
            title: "Excluir usuário",
            content: "Deseja realmente excluir este registro?",
            okText: "Sim",
            okType: "danger",
            cancelText: "Não",
            onOk() {
                Axios.post("http://localhost:8000/deposito/excluir", {
                    id: id,
                })
                    .then((response) => {
                        if (response.data.ok) {
                            window.location.reload();
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            },
        });
    };

    const alterUser = (id) => {
        Axios.get(`http://localhost:8000/deposito/consultar/${id}`)
            .then((response) => {
                setListagem(response.data);
            })
            .catch((error) => {
                console.error("Erro ao carregar a lista:", error);
            });
        setEdit(true);
    };

    const conexaoDeposito = () => {
        Axios.get('http://localhost:8000/deposito/listar')
            .then((response) => {
                setDeposito(response.data)
            })
            .catch((error) => {
                new verificar().verificar(error.response.status);
            })
    }


    useEffect(() => {
        conexaoDeposito();
    }, [])

    const [form] = Form.useForm();
    useEffect(() => {
        if (listagem && listagem.length > 0) {
            form.setFieldsValue({
                id: listagem[0].id,
                entrada: listagem[0].entrada,
                saida: listagem[0].saida,
            });
        }
    }, [listagem, form]);

    const onAdd = () => {
        setEditModal(true);
    }

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
            <Button
                type="primary"
                className="flex gap-2 items-center font-medium"
                onClick={() => onAdd()}
            >
                <FaPlus />
                Cadastrar
            </Button>
            <Modal
                title="Cadastrar Dados"
                visible={editModal}
                footer={null}
                onOk={() => {
                    setEditModal(false);
                }}
                onCancel={() => {
                    setEditModal(false);
                }}
            >
                <Form
                    name="basic"
                    onFinish={onFinished}
                    onFinishFailed={onFinishedFailed}
                    layout='vertical'
                >
                    <div className='flex justify-around items-center'>
                        <Form.Item
                            label="Entrada"
                            name="entrada"
                            rules={[{ required: true, message: 'Por favor, insira um valor!' }]}
                        >
                            <Input type='number' min={0} />
                        </Form.Item>
                        <Form.Item
                            label="Saída"
                            name="saida"
                            rules={[{ required: true, message: 'Por favor, insira um valor!' }]}
                        >
                            <Input type="number" min={0} />
                        </Form.Item>
                    </div>
                    <Form.Item>
                        <Button htmlType='submit' type="primary">Salvar</Button>
                    </Form.Item>
                </Form>
            </Modal>
            <Table
                id="Table"
                ref={tableRef}
                columns={user == 1 ? columns : columnsUser}
                dataSource={deposito}
                pagination={{ pageSize: 8 }}
            />
            <Modal
                title="Alterar Dados"
                visible={edit}
                footer={null}
                onOk={() => {
                    setEdit(false);
                }}
                onCancel={() => {
                    setEdit(false);
                }}
            >
                <Form
                    form={form}
                    name="basic"
                    onFinish={onFinished}
                    onFinishFailed={onFinishedFailed}
                    layout='vertical'
                >
                    <div className='flex justify-around items-center'>
                        <Form.Item
                            label="Entrada"
                            name="entrada"
                            rules={[{ required: true, message: 'Por favor, insira um valor!' }]}
                        >
                            <Input type='number' min={0} />
                        </Form.Item>
                        <Form.Item
                            label="Saída"
                            name="saida"
                            rules={[{ required: true, message: 'Por favor, insira um valor!' }]}
                        >
                            <Input type="number" min={0} />
                        </Form.Item>
                    </div>
                    <Form.Item>
                        <Button htmlType='submit' type="primary">Salvar</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )

}

export default ListaEntrada