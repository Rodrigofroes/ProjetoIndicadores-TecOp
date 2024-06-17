import React, { useState, useEffect } from "react";
import TableList from "../components/TableList";
import Axios from "axios";
import { FaPlus } from "react-icons/fa6";
import { Button, Modal } from "antd";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import verifica from "../utils/verifica";
const verificar = new verifica();

const handleSchameCustom = z.object({
  data: z.string()
    .min(1, { message: "*Campo obrigatório" })
    .refine((val) => {
      const today = new Date();
      const inputDate = new Date(val);
      return inputDate <= new Date(today.getFullYear(), today.getMonth(), today.getDate());
    }, { message: "A data não pode ser maior ao dia atual" }),
  atividade: z.string().min(1, { message: "*Campo obrigatório" }),
  movimentacao: z.string().min(1, { message: "*Campo obrigatório" }),
  quantidade: z.string().min(1, { message: "*Campo obrigatório" }),
});

const ListaRouter = () => {
  const [dataSource, setDataSource] = useState([]);
  const [atividade, setAtividade] = useState([]);
  const [movimentacao, setMovimentacao] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    Axios.get("http://localhost:8000/consultar/listagem")
      .then((response) => {
        verificar.verificar(response.status);
        setDataSource(response.data);
      })
      .catch((error) => {
        verificar.verificar(error.response.status);
        console.log(error);
      });

    Axios.get("http://localhost:8000/consultar/atividade")
      .then((response) => {
        verificar.verificar(response.status);
        setAtividade(response.data);
      })
      .catch((error) => {
        verificar.verificar(error.response.status);
        console.log(error);
      });

    Axios.get("http://localhost:8000/consultar/movimentacao")
      .then((response) => {
        verificar.verificar(response.status);
        setMovimentacao(response.data);
      })
      .catch((error) => {
        verificar.verificar(error.response.status);
        console.log(error);
      });
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(handleSchameCustom),
  });

  const handleSubmitCustom = (data) => {
    Axios.post("http://localhost:8000/cadastro/register", {
      data: data.data,
      quantidade: data.quantidade,
      atividade: data.atividade,
      movimentacao: data.movimentacao,
    })
      .then((response) => {
        verificar.verificar(response.status);
        console.log(response);
      })
      .catch((error) => {
        verificar.verificar(error.response.status);
        console.error(error);
      });

    window.location.reload();
  };

  const onAdd = () => {
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="flex items-center"></div>
      <TableList
        children={
          <Button
            type="primary"
            className="flex gap-2 items-center font-medium"
            onClick={() => onAdd()}
          >
            <FaPlus />
            Cadastrar
          </Button>
        }
        dataSource={dataSource}
        atividade={atividade}
        movimentacao={movimentacao}
      />
      <Modal
        title="Cadastrar Atividade"
        okText="Salvar"
        visible={isModalOpen}
        onOk={() => {
          setIsModalOpen(false);
        }}
        onCancel={() => {
          setIsModalOpen(false);
        }}
        footer={null}
      >
        <form key={Math.random() * 10} onSubmit={handleSubmit(handleSubmitCustom)}>
          <div className="flex flex-col gap-4 p-4">
            <div className="flex flex-col">
              <label htmlFor="data">Data:</label>
              <input
                className="border border-gray-300 rounded-md p-2"
                variant="outline"
                id="data"
                placeholder="Data"
                type="date"
                {...register("data")}
              />
              {errors.data && (
                <span className="text-xs text-red-500">
                  {errors.data.message}
                </span>
              )}
            </div>

            <div className="flex gap-5">
              <div className="flex flex-col">
                <label htmlFor="inputAtividade">Atividade:</label>
                <select
                  variant="outline"
                  {...register("atividade")}
                  className="border border-gray-300 rounded-md p-2"
                >
                  {atividade.map((items) => (
                    <option key={items.ati_nome} value={items.ati_id}>
                      {items.ati_nome}
                    </option>
                  ))}
                </select>
                {errors.atividade && (
                  <span className="text-xs text-red-500">
                    {errors.atividade.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col w-full">
                <label htmlFor="inputMovimentacao">Movimentação:</label>
                <select
                  variant="outline"
                  {...register("movimentacao")}
                  className="border border-gray-300 rounded-md p-2"
                >
                  {movimentacao.map((items) => (
                    <option key={items.mov_nome} value={items.mov_id}>
                      {items.mov_nome}
                    </option>
                  ))}
                </select>
                {errors.movimentacao && (
                  <span className="text-xs text-red-500">
                    {errors.movimentacao.message}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col">
              <label htmlFor="quantidade">Quantidade:</label>
              <input
                type="number"
                min={0}
                className="border border-gray-300 rounded-md p-2"
                id="quantidade"
                placeholder="Quantidade"
                {...register("quantidade")}
              />
              {errors.quantidade && (
                <span className="text-xs text-red-500">
                  {errors.quantidade.message}
                </span>
              )}
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded-md"
            >
              Cadastrar
            </button>
          </div>
        </form>
      </Modal>
    </div >
  );
};

export default ListaRouter;
