import React, { Children } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import DashboardRouter from './routes/DashboardRouter.jsx'
import ListaRouter from './routes/ListaRouter.jsx'
import HomeRouter from './routes/HomeRouter.jsx'

const router = createBrowserRouter([
  { path: '/', 
    element: <App />, 
    children:[
      { path: '/', element: <HomeRouter/> },
      { path: 'dashboard', element: <DashboardRouter/> },
      { path: 'lista', element: <ListaRouter/> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
)
