import React, { useEffect, useRef } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  elements
} from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';

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

const GraphBarSaida = ({ data }) => {
  const barChartRef = useRef(null);

  useEffect(() => {
    return () => {
      if (barChartRef.current && barChartRef.current.chartInstance) {
        barChartRef.current.chartInstance.destroy();
      }
    };
  }, []);

  const barOptions = {
    plugins: {
      datalabels: {
        formatter: (value, context) => {
          let formattedValue = value.toString();
          formattedValue = formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

          return formattedValue;
        },
        color: "black",
        font: {
          weight: "bold",
          size: 10,
        },
      },
      title: {
        display: true,
        text: "Entradas e Saídas de mercadorias",
        font: {
          size: 20,
        }
      },
    }
  };

  const labelsMes = [{
    "01": "Janeiro",
    "02": "Fevereiro",
    "03": "Março",
    "04": "Abril",
    "05": "Maio",
    "06": "Junho",
    "07": "Julho",
    "08": "Agosto",
    "09": "Setembro",
    "10": "Outubro",
    "11": "Novembro",
    "12": "Dezembro",
  }];

  const dataBarCustom = {
    labels: data.map((item) => {
      const data = item.dataCriacao.split("-")[1];
      const value = (item.entrada - item.saida) / item.saida;
      return labelsMes[0][data] + "  " + Math.round(value * 100) + "%" + "(" + (item.entrada - item.saida) + ")";
    }),
    datasets: [
      {
        label: "Entradas",
        data: data.map((item) => item.entrada),
        backgroundColor: "rgba(54, 162, 235)",
        borderColor: "rgba(54, 162, 235)",
        borderWidth: 1,
        barThickness: 40
      },
      {
        label: "Saídas",
        data: data.map((item) => item.saida),
        backgroundColor: "rgba(255, 99, 132)",
        borderColor: "rgba(255, 99, 132)",
        borderWidth: 1,
        barThickness: 40
      }
    ]
  };

  return (
    <div style={{ height: "100%", width: "1000px" }}>
      <Bar data={dataBarCustom} options={barOptions} />

    </div>
  );
};

export default GraphBarSaida;
