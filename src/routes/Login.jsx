import React, { useEffect, useState } from "react";
import { Button, Form, Input, Modal } from "antd";
import Axios from "axios";
import verifica from "../utils/verifica";

const onFinish = (values) => {
  Axios.post("http://localhost:8000/auth/login", {
    usuario: values.username,
    senha: values.password,
  })
    .then((response) => {
      if (response.status == 201) {
        window.location.href = "/";  
      } else {
        Modal.error({
          visible: true,
          title: "Erro",
          content: response.data.msg,
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

const Login = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="shadow-lg bg-white p-4 rounded-lg flex gap-4 flex-col items-center">
        <h1 className="text-xl font-medium">Login</h1>
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
export default Login;
