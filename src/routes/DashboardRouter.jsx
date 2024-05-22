import React, { useEffect, useState } from "react";
import { Input } from "antd";
import DashLine from "../components/graficos/DashLine";
// import DashBar from '../components/graficos/DashBar'
import DashDoughnut from "../components/graficos/DashDoughnut";
import Axios from "axios";
import verifica from "../utils/verifica";

const verificar = new verifica();

const DashboardRouter = () => {
  const [dataInicio, setDataInicio] = useState("");
  const [dataFinal, setDataFinal] = useState("");
  const [dados, setDados] = useState([]);
  const [data, Setdata] = useState([]);

  useEffect(() => {
    Axios.get("http://localhost:8000/consultar/grafico")
      .then((response) => {
        Setdata(response.data);
      })
      .catch((error) => {
        verificar.verificar(error.response.status);
        console.error("Erro ao buscar dados da API:", error);
      });
  }, []);

  const filtroApi = () => {
    Axios.get("http://localhost:8000/consultar/filtro", {
      params: {
        dataInicio: dataInicio,
        dataFinal: dataFinal,
      },
    })
      .then((response) => {
        setDados(response.data);
      })
      .catch((error) => {
        verificar.verificar(error.response.status);
        console.error("Erro ao buscar dados da API:", error);
      });
  };

  const limparApi = () => {
    Axios.get("http://localhost:8000/consultar/grafico")
      .then((response) => {
        setDados(response.data);
      })
      .catch((error) => {
        verificar.verificar(error.response.status);
        console.error("Erro ao buscar dados da API:", error);
      });
  };

  return (
    <>
      <div className="flex items-center justify-between p-4 gap-4">
        <div className="bg-blue-500 w-52 justify-between dark:bg-gray-800 shadow-lg rounded-md flex items-center p-3 border-b-4 border-blue-600 dark:border-gray-600 text-white font-medium group">
          <div className="flex justify-center items-center w-14 h-14 bg-white rounded-full transition-all duration-300 transform group-hover:rotate-12">
            <svg
              width="30"
              height="30"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="stroke-current text-blue-800 dark:text-gray-800 transform transition-transform duration-500 ease-in-out"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              ></path>
            </svg>
          </div>
          <div className="text-right">
            <p className="text-2xl">{data.length}</p>
            <p>Atividades</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row">
          <Input
            type="date"
            placeholder="Data Inicial"
            className="mr-2 mb-2 sm:mb-0"
            onChange={(e) => setDataInicio(e.target.value)}
          />
          <Input
            type="date"
            placeholder="Data Final"
            className="mr-2 mb-2 sm:mb-0"
            onChange={(e) => setDataFinal(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={filtroApi}
            >
              Filtrar
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={limparApi}
            >
              Limpar
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white p-10 rounded-lg">
        <DashLine dados={data} />
      </div>
    </>
  );
};

export default DashboardRouter;
