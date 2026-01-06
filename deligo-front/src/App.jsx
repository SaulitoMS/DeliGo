import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'

// --- TUS COMPONENTES ---
import Login from './Login'
import Home from './Home'
import Menu from './Menu'
// import CartSidebar from './CartSidebar' <--- ELIMINADO
import AdminPanel from './AdminPanel'
import Checkout from './Checkout'

// Componente temporal para Repartidor
function RepartidorPanel() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800">🛵 Panel de Repartidor</h1>
      <p className="mt-4">Aquí te caerán las notificaciones de entregas.</p>
    </div>
  )
}

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        
        {/* <CartSidebar />  <--- ELIMINADO */}

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/menu/:id" element={<Menu />} />
          <Route path="/resumen-pedido" element={<Checkout />} />
          
          <Route path="/admin-restaurante" element={<AdminPanel />} />
          <Route path="/pedidos-repartidor" element={<RepartidorPanel />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  )
}

export default App