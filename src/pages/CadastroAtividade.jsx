import React, { useEffect, useRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { FaPen } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa6";
import { Button, Input, Space, Table, Modal, Form, Select } from 'antd';
import Highlighter from 'react-highlight-words';
import Axios from 'axios';

const onFinish = (values) => {
    console.log(values);
};


const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
};

const CadastroAtividade = () => {
    const [lista, setListagem] = useState([]);
    const [atividade, setAtividade] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
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
            dataIndex: 'ati_id',
            key: 'ati_id',
            width: '5%',
        },
        {
            title: 'Atividade',
            dataIndex: 'ati_nome',
            key: 'ati_nome',
            width: '90%',
            ...getColumnSearchProps('ati_nome'),
        },
        {
            key: "tabela_id",
            title: "Ações",
            render: (record) => (
                <div className="flex items-center gap-4">
                    <button onClick={() => alterAtividade(record.ati_id)}>
                        <FaPen className="hover:text-blue-500 transition" />
                    </button>
                    <button onClick={() => deleteAtividade(record.ati_id)}>
                        <FaTrash className="hover:text-red-500 transition" />
                    </button>
                </div>
            ),
        },
    ];

    const deleteAtividade = (id) => {
        Modal.confirm({
            title: "Excluir usuário",
            content: "Deseja realmente excluir este registro?",
            okText: "Sim",
            okType: "danger",
            cancelText: "Não",
            onOk() {
                Axios.get(`http://localhost:8000/cadastro/delete/${id}`)
                    .then((response) => {
                        if(response.data.ok){
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
        Axios.get(`http://localhost:8000/cadastro/atividade/consulta/${id}`)
            .then((response) => {
                setListagem(response.data);
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
        Axios.get("http://localhost:8000/consultar/atividade")
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

    const saveUser = (data) => {
        console.log(atividade);
        console.log(data);
    };


    return (
        <>
            <Modal
                title="Cadastrar Atividade"
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
                        span: 8,
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
                        label="Atividade"
                        name="atividade"
                        rules={[
                            {
                                required: true,
                                message: "Campo obrigatório!",
                            },
                        ]}
                    >
                        <Input
                        />
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
            <Button type="primary" onClick={() => onAdd()}>Cadastrar Atividade</Button>
            <Table columns={columns} dataSource={usuario} pagination={{ pageSize: 8 }} />
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
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <div className="flex flex-col w-96 gap-4 p-4">
                        <div className='flex items-center gap-4'>
                            <Form.Item
                                name="atividade"
                                label="Atividade"
                                rules={[
                                    {
                                        required: true,
                                        message: "Campo obrigatório!",
                                    },
                                ]}
                            >
                                <Input placeholder={lista.map((item) => item.ati_nome)} />
                            </Form.Item>
                        </div>
                        <Button
                            htmlType="submit"
                            type='primary'
                        >
                            Alterar
                        </Button>
                    </div>
                </Form>
            </Modal>
        </>
    );
};
export default CadastroAtividade;
