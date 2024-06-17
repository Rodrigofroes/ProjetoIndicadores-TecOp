import React, { useEffect, useRef, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
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
          return value;
        },
        color: "#fff",
        font: {
          weight: "bold",
          size: 12,
        },
      },
    },
  };

  const dataBarCustom = {
    labels: data.map((item) => {
      const value = (item.entrada - item.saida) / item.saida;
      return item.mes + "  " + Math.round(value * 100) + "%";
    }),
    datasets: [
      {
        label: "Entradas",
        data: data.map((item) => item.entrada),
        backgroundColor: "rgba(54, 162, 235)",
        borderColor: "rgba(54, 162, 235)",
        borderWidth: 1,
      },
      {
        label: "Saídas",
        data: data.map((item) => item.saida),
        backgroundColor: "rgba(255, 99, 132)",
        borderColor: "rgba(255, 99, 132)",
        borderWidth: 1,
      }
    ]
  };

  return (
    <div>
      <Bar style={{ height: "400px", width: "100%" }} data={dataBarCustom} options={barOptions} />
    </div>
  );
};

export default GraphBarSaida;
