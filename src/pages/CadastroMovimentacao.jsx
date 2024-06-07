import React, { useEffect, useRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { FaPen } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa6";
import { Button, Input, Space, Table, Modal, Form, Select } from 'antd';
import Highlighter from 'react-highlight-words';
import Axios from 'axios';

const onFinish = (values) => {
    Axios.post("http://localhost:8000/cadastro/movimentacao", {
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

const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
};

const CadastroMovimentacao = () => {
    const [option, setOption] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [usuario, setUsuario] = useState([]);
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

    const onAdd = () => {
        setIsModalOpen(true);
    };

    const conexao = () => {
        Axios.get("http://localhost:8000/consultar/movimentacao")
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


    return (
        <>
            <Modal
                title="Cadastrar Movimentação"
                okText="Salvar"
                visible={isModalOpen}
                onOk={() => {
                    onFinish()
                    setIsModalOpen(false);
                }}
                onCancel={() => {
                    setIsModalOpen(false);
                }}
                footer={null}
            >
                <Form
                    layout="horizontal"
                    size="large"
                    name="basic"
                    labelCol={{
                        span: 10,
                    }}
                    wrapperCol={{
                        span: 18,
                    }}
                    style={{
                        maxWidth: 300,
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Movimentação"
                        name="movimentacao"
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
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}
                    >
                        <Button type="primary" htmlType="submit">
                            Salvar
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            <Button type="primary" onClick={() => onAdd()}>Cadastrar Movimentação</Button>
            <Table columns={columns} dataSource={usuario} pagination={{ pageSize: 8 }} />
        </>
    );
};
export default CadastroMovimentacao;
