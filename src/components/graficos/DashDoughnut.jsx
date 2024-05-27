import React, { useEffect, useRef } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  ChartDataLabels,
  Title,
  Tooltip,
  Legend
);

const GraphPie = ({ data }) => {
  const barChartRef = useRef(null);
  const pieChartRef = useRef(null);

  useEffect(() => {
    // Limpar os gráficos quando o componente for desmontado
    return () => {
      if (barChartRef.current && barChartRef.current.chartInstance) {
        barChartRef.current.chartInstance.destroy();
      }
      if (pieChartRef.current && pieChartRef.current.chartInstance) {
        pieChartRef.current.chartInstance.destroy();
      }
    };
  }, []);

  const optionsPie = {
    plugins: {
      datalabels: {
        formatter: (value, context) => {
          const dataArray = context.chart.data.datasets[0].data;
          const total = dataArray.reduce((sum, val) => sum + val, 0);
          const percentage = ((value * 100) / total).toFixed(2) + "%";
          return percentage;
        },
        color: "#fff",
        font: {
          weight: "bold",
          size: 12,
        },
      },
    },
  };

  console.log(data)

  const somaAtividade = () => {
    const atividades = data.map((data) => data.ati_nome);
    const quantidades = data.map((data) => data.tabela_quantidade);
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
    return dadosDistribuicaoAtividades;
  };

  const PieChartData = {
    labels: somaAtividade().labels,
    datasets: [
      {
        label: "Atividade por mês",
        data: somaAtividade().datasets[0].data,
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(255, 159, 64)",
          "rgb(255, 205, 86)",
          "rgb(75, 192, 192)",
          "rgb(54, 162, 235)",
          "rgb(153, 102, 255)",
          "rgb(201, 203, 207)",
        ],
        borderColor: [
          "rgb(255, 99, 132)",
          "rgb(255, 159, 64)",
          "rgb(255, 205, 86)",
          "rgb(75, 192, 192)",
          "rgb(54, 162, 235)",
          "rgb(153, 102, 255)",
          "rgb(201, 203, 207)",
        ],
        borderWidth: 1,
        fill: false,
      },
    ],
  };

  return (
    <div>
      <Pie
        style={{ width: "350px" }}
        ref={pieChartRef}
        data={PieChartData}
        options={optionsPie}
      />
    </div>
  );
};

export default GraphPie;
