import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'

import Login from './Login'
import Home from './Home'
import Menu from './Menu'
import AdminPanel from './AdminPanel'
import Checkout from './Checkout'
import RepartidorPanel from './RepartidorPanel' // <--- IMPORTAR

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/menu/:id" element={<Menu />} />
          <Route path="/resumen-pedido" element={<Checkout />} />
          <Route path="/admin-restaurante" element={<AdminPanel />} />
          <Route path="/pedidos-repartidor" element={<RepartidorPanel />} /> {/* <--- AGREGAR */}
        </Routes>
      </BrowserRouter>
    </CartProvider>
  )
}

export default App