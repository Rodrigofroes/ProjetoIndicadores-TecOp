import React, { useEffect, useState } from 'react'
import {Input } from 'antd';
import  DashLine  from '../components/graficos/DashLine'
import  DashBar  from '../components/graficos/DashBar'
import  DashDoughnut  from '../components/graficos/DashDoughnut'
import  Axios  from 'axios';

const DashboardRouter = () => {
  const [dataInicio, setDataInicio] = useState('')
  const [dataFinal, setDataFinal] = useState('')
  const [dados, setDados] = useState([]);

  const filtroApi = () => {

    console.log(dataInicio, dataFinal);

    Axios.get('http://localhost:8000/consultar/filtro', {
      params: {
        dataInicio: dataInicio,
        dataFinal: dataFinal
      }
    }).then((response) => {
      setDados(response.data)
    }).catch((error) => {
      console.error('Erro ao buscar dados da API:', error)
    })
  }

  return (
    <div className='flex flex-col p-4 items-center justify-center h-screen w-80'>
      <h1 className='text-2xl font-bold'>Dashboard</h1>
      <div className='w-full rounded-md flex flex-col'>
        <div className='flex gap-2 items-center '>
          <div>
            <label htmlFor="dateInicio">Data Incio:</label>
            <Input type='date' id='dateInicio' value={dataInicio} onChange={(e) => setDataInicio(e.target.value)}/>
          </div>
          <div>
            <label htmlFor="dateFinal">Data Final:</label>
            <Input type='date' id='dateFinal' value={dataFinal} onChange={(e) => setDataFinal(e.target.value)}/>
          </div>
          <button className='bg-blue-500 p-2 rounded-lg text-white font-medium' onClick={() => filtroApi()}>Filtrar</button>
        </div>
        <div className='flex'>
          <DashLine dados={dados}/>
          <DashBar dados={dados}/>
        </div>
        <div>
          <DashDoughnut dados={dados}/>
        </div>
      </div>
    </div>
  )
}

export default DashboardRouter