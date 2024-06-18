import GraphBarSaida from "../components/graficos/GraphBarSaida";
import { Select } from "antd";
import { useEffect, useState } from "react";
import Axios from "axios";
import verificar from "../utils/verifica";
import { de } from "date-fns/locale";
const verifica = new verificar();

const DashboardEntrada = () => {
    const [deposito, setDeposito] = useState([]);
    const [pesquisa, setPesquisa] = useState([]);

    const conexaoDeposito = () => {
        Axios.get('http://localhost:8000/deposito/listar')
            .then((response) => {
                setDeposito(response.data)
            })
            .catch((error) => {
                verifica.verificar(error.response.status);
            })
    }

    const filtroAno = () => {
        const anos = new Set();
        deposito.forEach((item) => {
            const ano = item.dataCriacao.split("-")[0];
            anos.add(ano);
        });
        return Array.from(anos);
    };


    useEffect(() => {
        conexaoDeposito();
        filtroAno();
    }, []);



    const handleChangeAno = (value) => {
        Axios.get(`http://localhost:8000/deposito/consultarAno/${value}`)
            .then((response) => {
                setPesquisa(response.data)
            })
            .catch((error) => {
                verifica.verificar(error.response.status);
            })
    };

    const somaValoresTotais = () => {
        let totalEntrada = 0;
        let totalSaida = 0;
        pesquisa.forEach((item) => {
            totalEntrada += item.entrada;
            totalSaida += item.saida;
        });

        totalEntrada = totalEntrada.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        totalSaida = totalSaida.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

        let diferenca = totalEntrada - totalSaida;
        let porcentagem = (diferenca / totalSaida) * 100;

        diferenca = `${diferenca.toFixed(3)} (${porcentagem.toFixed(2)}%)`;

        return { totalEntrada, totalSaida, diferenca };
    }

    return (
        <>
            <div className="flex flex-col bg-white rounded-lg p-4  h-full ">
                <div className="flex items-center justify-between  ">
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
                    </div>
                </div>
                <div className="flex flex-col w-full justify-between items-center">
                    <div className="flex items-center">
                        <GraphBarSaida data={pesquisa == "" ? deposito : pesquisa} />
                    </div>
                    <div className="flex gap-2 mt-2">
                        <p>Entradas: {somaValoresTotais().totalEntrada}</p>
                        <p>Saídas: {somaValoresTotais().totalSaida}</p>
                        <p>Diferença: {somaValoresTotais().diferenca}</p>
                    </div>
                </div>
            </div>
        </>
    );
};
export default DashboardEntrada;
