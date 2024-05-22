import React from "react";
import { Doughnut } from "react-chartjs-2";

const DashDoughnut = ({ dados }) => {
  const atividades = dados.map((data) => data.ati_nome);
  const quantidades = dados.map((data) => data.tabela_quantidade);
  const atividadesUnicas = [...new Set(atividades)];
  const dadosDistribuicaoAtividades = {
    labels: atividadesUnicas,
    datasets: [
      {
        data: atividadesUnicas.map((atividade) =>
          quantidades.reduce(
            (total, quantidade, index) =>
              atividades[index] === atividade ? total + quantidade : total,
            0
          )
        ),
      },
    ],
  };
  return (
    <div>
      <h1 className="font-medium mb-2">Atividades por Quantidade</h1>
      <Doughnut
        key={Math.random()}
        height={10} // height={60}
        data={dadosDistribuicaoAtividades}
        options={{
          plugins: {
            title: {
              text: "Distribuição de Atividades por Quantidade",
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
  );
};

export default DashDoughnut;
