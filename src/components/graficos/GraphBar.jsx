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
  Legend,
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

const GraphBar = ({data}) => {
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

  const optionsBar = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: "Atividade por Ano",
        font: {
          size: 20,
        },
      },
    },
  };

  const labelsMes = {
    "1": "Janeiro",
    "2": "Fevereiro",
    "3": "Março",
    "4": "Abril",
    "5": "Maio",
    "6": "Junho",
    "7": "Julho",
    "8": "Agosto",
    "9": "Setembro",
    "10": "Outubro",
    "11": "Novembro",
    "12": "Dezembro",
  };


  const somaValue = () => {
    const groupedValues = {};
    data.forEach((item) => {
      const date = new Date(item.tabela_data);
      const monthYearKey = `${date.getFullYear()}-${date.getMonth() + 1}`; 
  
      const value = item.tabela_quantidade;
  
      if (groupedValues[monthYearKey]) {
        groupedValues[monthYearKey] += value;
      } else {
        groupedValues[monthYearKey] = value;
      }
    });
  
    const groupedData = Object.keys(groupedValues).map((monthYearKey) => ({
      data: monthYearKey,
      value: groupedValues[monthYearKey],
    }));
  
    return groupedData;
  };
  
  const BarChartData = {
    labels: somaValue().map((item) => labelsMes[item.data.split("-")[1]]),
    datasets: [
      {
        label: "Atividade por Ano",
        data: somaValue().map((item) => item.value),
        backgroundColor: ["rgb(54,162,235)"],
        borderColor: ["rgb(54,162,235)"],
        borderWidth: 1,
        fill: false,
      },
    ],
  };
  

  return (
    <div>
      <Bar style={{height:"400px", width: "100%"}} ref={barChartRef} data={BarChartData} options={optionsBar} />
    </div>
  );
};

export default GraphBar;
