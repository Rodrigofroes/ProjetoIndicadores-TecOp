import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Dashboard from './routes/Dashboard.jsx'
import ListaRouter from './routes/ListaRouter.jsx'
import Login from './routes/Login.jsx'
import Axios from 'axios'
import Cadastro from './routes/Cadastro.jsx'


Axios.defaults.withCredentials = true; 

const router = createBrowserRouter([
  { path: '/', 
    element: <App/>, 
    children:[
      { path: '/', element: <Dashboard/> },
      { path: 'lista', element: <ListaRouter/> },
      {path: 'cadastro', element: <Cadastro/> },
    ],
  },
  {
    path: 'login', element: <Login/>
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
)
