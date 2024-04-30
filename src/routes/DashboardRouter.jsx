import React, { useEffect, useState } from 'react'
import { Input } from 'antd';
import DashLine from '../components/graficos/DashLine'
import DashBar from '../components/graficos/DashBar'
import DashDoughnut from '../components/graficos/DashDoughnut'
import Axios from 'axios';

const DashboardRouter = () => {
  const [dataInicio, setDataInicio] = useState('')
  const [dataFinal, setDataFinal] = useState('')
  const [dados, setDados] = useState([]);
  const [data, Setdata] = useState([]);

  useEffect(() => {
    Axios.get('http://localhost:8000/consultar/grafico')
      .then((response) => {
        Setdata(response.data)
      }).catch((error) => {
        console.error('Erro ao buscar dados da API:', error)
      })
  }, []);

  const filtroApi = () => {
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

  const limparApi = () => {
    Axios.get('http://localhost:8000/consultar/grafico')
      .then((response) => {
        setDados(response.data)
      }).catch((error) => {
        console.error('Erro ao buscar dados da API:', error)
      })
  }

  return (
      <div className='flex flex-col items-center justify-center'>
        <div className='text-2xl font-bold text-center mb-4'>
          <h2>Dashboard</h2>
        </div>
        <div className='flex items-center justify-center gap-2 mb-4'>
          <div>
            <label htmlFor="dateInicio">Data Início:</label>
            <Input type='date' id='dateInicio' value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
          </div>
          <div>
            <label htmlFor="dateFinal">Data Final:</label>
            <Input type='date' id='dateFinal' value={dataFinal} onChange={(e) => setDataFinal(e.target.value)} />
          </div>
          <div className='flex gap-2'>
            <button className='bg-blue-500  p-2 rounded-lg text-white font-medium' onClick={() => filtroApi()}>Filtrar</button>
            <button className='bg-blue-500  p-2 rounded-lg text-white font-medium' onClick={() => limparApi()}>Limpar</button>
          </div>
        </div>
        <div>
            <div className='flex gap-2'>
              <div className='bg-white p-6 rounded-md w-600'>
                <DashLine dados={dados.length > 0 ? dados : data} />
              </div>
              <div className='bg-white p-6 w-80  rounded-md flex items-center gap-4'>
                <DashDoughnut dados={dados.length > 0 ? dados : data} />
              </div>
            </div>
        </div>
      </div>

  );
}

export default DashboardRouter