import './assets/main.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import Nav from './components/nav'
import AddScript from './pages/AddScript'
import App from './App'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  },
  {
    path: '/add',
    element: <AddScript />
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Nav />
    <RouterProvider router={router} />
  </React.StrictMode>
)
