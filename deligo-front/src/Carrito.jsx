import { useCart } from './context/CartContext'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { jwtDecode } from "jwt-decode"

function Carrito() {
  const { carrito, eliminarDelCarrito, total, limpiarCarrito } = useCart()
  const navigate = useNavigate()

  const handlePagar = () => {
    const token = localStorage.getItem('token')
    if(!token) return navigate('/')

    // 1. Obtener el nombre del cliente del token
    const decoded = jwtDecode(token)
    const emailCliente = decoded.sub // En el token el email suele venir en 'sub'

    // 2. Construir el JSON tal cual lo pide Java
    const pedidoData = {
      cliente: emailCliente, // Usamos el email como identificador
      detalles: carrito.map(item => ({
        cantidad: item.cantidad,
        plato: {
          id: item.id,
          precio: item.precio // Importante mandar el precio actual
        }
      }))
    }

    // 3. Enviar al Backend
    axios.post('http://localhost:8080/api/pedidos', pedidoData, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(() => {
      alert("¡Pedido realizado con éxito! 🍔🚀")
      limpiarCarrito()
      navigate('/home')
    })
    .catch(error => {
      console.error(error)
      alert("Hubo un error al procesar tu pedido")
    })
  }

  if (carrito.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <h2 className="text-2xl text-gray-500 mb-4">Tu carrito está vacío 😢</h2>
        <Link to="/home" className="bg-orange-500 text-white px-6 py-2 rounded font-bold">Ir a comer</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h1 className="text-3xl font-bold text-gray-800">Tu Pedido</h1>
          <Link to="/home" className="text-orange-500 font-bold hover:underline">Seguir pidiendo</Link>
        </div>

        {/* Lista de Items */}
        <div className="space-y-4 mb-6">
          {carrito.map((item) => (
            <div key={item.id} className="flex justify-between items-center bg-gray-50 p-4 rounded">
              <div className="flex items-center gap-4">
                <span className="bg-orange-100 text-orange-800 font-bold px-3 py-1 rounded-full">
                  x{item.cantidad}
                </span>
                <div>
                  <h3 className="font-bold text-gray-800">{item.nombre}</h3>
                  <p className="text-sm text-gray-500">${item.precio} c/u</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold text-gray-800">${item.precio * item.cantidad}</span>
                <button 
                  onClick={() => eliminarDelCarrito(item.id)}
                  className="text-red-500 hover:text-red-700 font-bold"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Total y Botón Pagar */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-6">
            <span className="text-2xl font-bold text-gray-600">Total:</span>
            <span className="text-3xl font-bold text-green-600">${total}</span>
          </div>
          
          <button 
            onClick={handlePagar}
            className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-xl hover:bg-green-700 transition-colors shadow-lg"
          >
            Confirmar y Pagar 💸
          </button>
        </div>
      </div>
    </div>
  )
}

export default Carrito