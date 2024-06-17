import GraphBar from "../components/graficos/GraphBar";
import GraphPie from "../components/graficos/DashDoughnut";
import GraphBarSaida from "../components/graficos/GraphBarSaida";
import { Select } from "antd";
import { useEffect, useState } from "react";
import Axios from "axios";
import verifica from "../utils/verifica";
const verificar = new verifica();

const DashboardIndicadores = () => {
  const [data, setData] = useState([]);
  const [mes, setMes] = useState([]);
  const [valorMes, setValorMes] = useState([]);
  const [deposito, setDeposito] = useState([]);

  const conexao = () => {
    Axios.get('http://localhost:8000/consultar/grafico')
      .then((response) => {
        setData(response.data)
      })
      .catch((error) => {
        verificar.verificar(error.response.status);
      })
  }

  const conexaoDeposito = () => {
    Axios.get('http://localhost:8000/deposito/listar')
      .then((response) => {
        setDeposito(response.data)
      })
      .catch((error) => {
        verificar.verificar(error.response.status);
      })
  }

  useEffect(() => {
    conexao();
    conexaoDeposito();
  }, [])


  const filtroAno = () => {
    const anos = new Set();
    data.forEach((item) => {
      const ano = item.tabela_data.split("-")[0];
      anos.add(ano);
    });
    return Array.from(anos);
  };

  const filtroMes = () => {
    const meses = new Set();
    mes.forEach((item) => {
      const mes = item.tabela_data.split("-")[1];
      meses.add(mes);
    });
    return Array.from(meses);
  };

  const handleChangeAno = (value) => {
    Axios.get(`http://localhost:8000/consultar/grafico/${value}`)
      .then((response) => {
        setMes(response.data)
      })
      .catch((error) => {
        verificar.verificar(error.response.status);
      })
  };

  const handleChangeMes = (value) => {
    Axios.get(`http://localhost:8000/consultar/grafico/mes/${value}`)
      .then((response) => {
        setValorMes(response.data)
      })
      .catch((error) => {
        verificar.verificar(error.response.status);
      })
  };

  const labelsMes = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  return (
    <>
      <div className="flex flex-col bg-white rounded-lg p-4  h-full gap-2">
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
          <div className="flex items-center gap-2 w-42">
            <div>
              <p>Filtros: </p>
            </div>
            <div>
              <Select
                defaultValue="Ano"
                style={{ width: 120 }}
                onChange={handleChangeAno}
                options={filtroAno().map((ano) => ({ label: ano, value: ano }))}
              />
            </div>
            <div>
              <Select
                defaultValue="Mês"
                style={{ width: 120 }}
                onChange={handleChangeMes}
                options={filtroMes().map((mes) => {
                  const index = parseInt(mes, 10) - 1;
                  return {
                    label: labelsMes[index],
                    value: mes,
                  };
                })}
              />
            </div>
          </div>
        </div>
        <div className="flex mt-10 items-center">
          <GraphBar data={mes == "" ? data : mes} />
          <GraphPie data={valorMes == "" ? data : valorMes} />
        </div>
      </div>
    </>
  );
};
export default DashboardIndicadores;
