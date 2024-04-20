import React from 'react'
import { Doughnut } from 'react-chartjs-2';

const DashDoughnut = ({dados}) => {
  const atividades = dados.map((data) => data.ati_nome);
  const quantidades = dados.map((data) => data.tabela_quantidade);
  const atividadesUnicas = [...new Set(atividades)];
    const dadosDistribuicaoAtividades = {
      labels: atividadesUnicas,
      datasets: [{
        data: atividadesUnicas.map((atividade) =>
          quantidades.reduce((total, quantidade, index) =>
            atividades[index] === atividade ? total + quantidade : total, 0))
      }],
    };
  return (
    <div className='border-2 p-4 rounded-md bg-slate-300'>
        <Doughnut
          data={dadosDistribuicaoAtividades}
          options={{
            plugins: {
              title: {
                text: "Distribuição de Atividades",
              },
            },
            backgroundColor: [
              "rgba(43, 63, 229, 0.8)",
              "rgba(250, 192, 19, 0.8)",
              "rgba(253, 135, 135, 0.8)",
            ],
            borderColor: [
              "rgba(43, 63, 229, 0.8)",
              "rgba(250, 192, 19, 0.8)",
              "rgba(253, 135, 135, 0.8)",
            ],
          }}
        />
    </div>
  )
}

export default DashDoughnut