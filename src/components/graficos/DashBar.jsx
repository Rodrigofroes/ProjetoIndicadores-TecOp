import React, {useState, useEffect } from 'react'
import { Bar } from 'react-chartjs-2';
import format from 'date-fns/format';
import Axios from 'axios';

const DashBar = ({dados}) => {
  const [lista, setLista] = useState([]);

  useEffect(() => {
    Axios.get('http://localhost:8000/consultar/grafico', {})
      .then((response) => {
        setLista(response.data);
      })
      .catch((error) => {
        console.error('Erro ao buscar dados da API:', error);
      });
  }, []);

  // Se dados for null, usa lista como dados
  const dadosUsados = dados || lista;

  const labels = dadosUsados.map((data) => format(new Date(data.tabela_data), "dd/MM/yyyy"));
  const atividades = dadosUsados.map((data) => data.ati_nome);
  const quantidades = dadosUsados.map((data) => data.tabela_quantidade);
  const atividadesUnicas = [...new Set(atividades)];

  const atividadesPorDia = {};

  atividades.forEach((atividade, index) => {
    if (!atividadesPorDia[labels[index]]) {
      atividadesPorDia[labels[index]] = {};
    }
    if (!atividadesPorDia[labels[index]][atividade]) {
      atividadesPorDia[labels[index]][atividade] = 0;
    }
    atividadesPorDia[labels[index]][atividade] += quantidades[index];
  });

  const labelsFiltrados = labels.filter((label) => {
    const atividadesDoDia = atividadesPorDia[label];
    return Object.values(atividadesDoDia).some((quantidade) => quantidade !== 0);
  });

  const datasetsAtividadesPorDiaFiltrados = atividadesUnicas.map((atividade) => ({
    label: atividade,
    data: labelsFiltrados.map((dia) => (atividadesPorDia[dia][atividade] || 0))
  }));

  return (
    <div className='border-2 p-4 rounded-md bg-slate-300 w-96 h-72'>
      <Bar
        data={{
          labels: labelsFiltrados,
          datasets: datasetsAtividadesPorDiaFiltrados,
        }}
        options={{
          plugins: {
            title: {
              text: "Atividade por Dia",
            },
          },
        }}
      />
    </div>
  );
};

export default DashBar