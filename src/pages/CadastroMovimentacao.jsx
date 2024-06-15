import React, { useEffect, useRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { FaPen } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa6";
import { Button, Input, Space, Table, Modal, Form, Select } from 'antd';
import Highlighter from 'react-highlight-words';
import Axios from 'axios';

const onFinishEdit = (values) => {
    Axios.post("http://localhost:8000/movimentacao/alterar", {
        id: values.id,
        movimentacao: values.movimentacao,
    })
        .then((response) => {
            if (response.data) {
                window.location.reload();
            }
        })
        .catch((error) => {
            console.log(error);
        });
};

const onFinishFailedEdit = (errorInfo) => {
    console.log("Failed:", errorInfo);
};

const onFinish = (values) => {
    Axios.post("http://localhost:8000/movimentacao/cadastrar", {
        movimentacao: values.movimentacao,
    })
        .then((response) => {
            if (response.data.ok) {
                window.location.reload();
            }
        })
        .catch((error) => {
            console.log(error);
        });
};

const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
};

const CadastroMovimentacao = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [usuario, setUsuario] = useState([]);
    const [edit, setEdit] = useState(false);
    const [movimentacao, setMovimentacao] = useState([]);
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
            dataIndex: 'mov_id',
            key: 'mov_id',
            width: '5%',
        },
        {
            title: 'Movimentação',
            dataIndex: 'mov_nome',
            key: 'mov_nome',
            width: '90%',
            ...getColumnSearchProps('mov_nome'),
        },
        {
            key: "tabela_id",
            title: "Ações",
            render: (record) => (
                <div className="flex items-center gap-4">
                    <button onClick={() => alterAtividade(record.mov_id)}>
                        <FaPen className="hover:text-blue-500 transition" />
                    </button>
                    <button onClick={() => deleteAtividade(record.mov_id)}>
                        <FaTrash className="hover:text-red-500 transition" />
                    </button>
                </div>
            ),
        },
    ];

    const deleteAtividade = (id) => {
        Modal.confirm({
            title: "Excluir Movimentação",
            content: "Deseja realmente excluir este registro?",
            okText: "Sim",
            okType: "danger",
            cancelText: "Não",
            onOk() {
                Axios.get(`http://localhost:8000/movimentacao/deletar/${id}`)
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

    const alterAtividade = (id) => {
        Axios.get(`http://localhost:8000/movimentacao/listar/${id}`)
            .then((response) => {
                setMovimentacao(response.data);
            })
            .catch((error) => {
                console.error("Erro ao carregar a lista:", error);
            });
        setEdit(true);
    };

    const onAdd = () => {
        setIsModalOpen(true);
    };

    const conexao = () => {
        Axios.get("http://localhost:8000/movimentacao/listar")
            .then((response) => {
                setUsuario(response.data);
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
        if (movimentacao && movimentacao.length > 0) {
            form.setFieldsValue({
                id: movimentacao[0].mov_id,
                movimentacao: movimentacao[0].mov_nome
            });
        }
    }, [movimentacao, form]);

    return (
        <>
            <Modal
                title="Cadastrar Movimentação"
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
                                name="movimentacao"
                                label="Movimentação"
                                rules={[
                                    {
                                        required: true,
                                        message: "Campo obrigatório!",
                                    },
                                ]}
                            >
                                <Input />
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
            <Button type="primary" onClick={() => onAdd()}>Cadastrar Movimentação</Button>
            <Table columns={columns} dataSource={usuario} />
            <Modal
                title="Alterar Movimentação"
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
                                name="movimentacao"
                                label="Movimentação"
                                rules={[
                                    {
                                        required: true,
                                        message: "Campo obrigatório!",
                                    },
                                ]}
                            >
                                <Input />
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
export default CadastroMovimentacao;
