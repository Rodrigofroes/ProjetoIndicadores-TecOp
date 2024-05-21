import React, { useState, useEffect } from "react";
import { Button, Form, Input, Select, Space } from "antd";
import Axios from "axios";

const onFinish = (values) => {
  Axios.post("http://localhost:8000/cadastro/user", {
    usuario: values.username,
    senha: values.password,
    cargo: values.Cargo,
  })
    .then((response) => {
      console.log(response.data.msg);
    })
    .catch((error) => {
      console.log(error);
    });
};

const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

const Cadastro = () => {
  const [option, setOption] = useState([]);

  const getOption = () => {
    Axios.get("http://localhost:8000/cadastro/options")
      .then((response) => {
        setOption(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar dados da API:", error);
      });
  };

  useEffect(() => {
    getOption();
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="shadow-lg bg-white p-4 rounded-lg flex gap-4 flex-col items-center">
        <h1 className="text-xl font-medium">Cadastro</h1>
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
            label="Usuário"
            name="username"
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
            label="Senha"
            name="password"
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
            label="Cargo"
            name="Cargo"
            rules={[
                {
                required: true,
                message: "Campo obrigatório!",
                },
            ]}
          >
            <Select defaultValue="Escolha" style={{ width: 120 }}>
              {option.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.tipo}
                </option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit">
              Entrar
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
export default Cadastro;
