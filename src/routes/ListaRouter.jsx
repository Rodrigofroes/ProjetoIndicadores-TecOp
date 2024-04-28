import React, { useRef, useState, useEffect } from "react";
import TableList from "../components/TableList";
import Axios from "axios";
import { FaPlus } from "react-icons/fa6";
import { Button, Input, Modal } from "antd";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const handleSchameCustom = z.object({
  data: z.string().min(1, { message: "*Campo obrigatório" }),
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
        setDataSource(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    Axios.get("http://localhost:8000/consultar/atividade")
      .then((response) => {
        setAtividade(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    Axios.get("http://localhost:8000/consultar/movimentacao")
      .then((response) => {
        setMovimentacao(response.data);
      })
      .catch((error) => {
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
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });

    window.location.reload();
  };

  const onAdd = () => {
    setIsModalOpen(true);
  };

  return (
    <div>
      <Button
        type="primary"
        className="flex items-center gap-2 font-medium"
        onClick={() => onAdd()}
      >
        <FaPlus />
        Cadastrar
      </Button>

      <TableList
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
        <form onSubmit={handleSubmit(handleSubmitCustom)}>
          <div className="flex flex-col w-96 gap-4 p-4">
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

            <div className="flex gap-5">
              <div className="w-80 flex flex-col">
                <label htmlFor="inputAtividade">Atividade:</label>
                <select variant="outline" {...register("atividade")}
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

              <div className="w-80 flex flex-col">
                <label htmlFor="inputMovimentacao">Movimentação:</label>
                <select variant="outline" {...register("movimentacao")} 
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

            <label htmlFor="quantidade">Quantidade:</label>
            <input
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
            <button 
              type="submit"
              className="bg-blue-500 text-white p-2 rounded-md"
            >
              Cadastrar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ListaRouter;
