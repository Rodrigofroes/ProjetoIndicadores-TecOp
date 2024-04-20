import React from "react";
import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Line } from "react-chartjs-2";
import format from 'date-fns/format';


const DashLine = ({dados}) => {
  const labels = dados.map((data) => data.tabela_data).map((data) => format(new Date(data), "dd/MM/yyyy"));
  const quantidades = dados.map((data) => data.tabela_quantidade);

  return (
    <div className="border-2 p-4 rounded-md bg-slate-300 ">
      <Line
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
        }}
      />
    </div>
  );
  
};

export default DashLine;
