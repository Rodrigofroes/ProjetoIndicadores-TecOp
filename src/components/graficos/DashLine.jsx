import React from "react";
import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Line } from "react-chartjs-2";
import format from 'date-fns/format';


const DashLine = ({dados}) => {
  const labels = dados.map((data) => data.tabela_data).map((data) => format(new Date(data), "dd/MM/yyyy"));
  const quantidades = dados.map((data) => data.tabela_quantidade);

  return (
    <div className="chart-container" style={{ width: '100%', maxWidth: '800px', height: '400px', margin: '0 auto' }}>
      <h1 className="font-medium text-1xl mb-2">Atividade ao longo do tempo</h1>
      <Line
        key={Math.random()}
        type="line"
        inputMode="search"
        data={{
          labels: labels,
          datasets: [
            {
              label: "Atividade ao longo do Tempo",
              data: quantidades,
              backgroundColor: "#064FF0",
              borderColor: "#064FF0",
            },
          ],
        }}
        options={{
          elements: {
            line: {
              tension: 0.5,
            },
          },
          plugins: {
            title: {
              text: "Atividade ao longo do Tempo",
            },
          },
          maintainAspectRatio: false,  // Adicione esta linha para controlar o aspecto
        }}
      />
    </div>
  );
};
  

export default DashLine;
