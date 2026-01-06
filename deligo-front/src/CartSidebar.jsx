import { useCart } from './context/CartContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from "jwt-decode"

function CartSidebar() {
  const { 
    carrito, 
    eliminarDelCarrito, 
    total, 
    limpiarCarrito, 
    isCartOpen, 
    toggleCart 
  } = useCart()
  
  const navigate = useNavigate()

  const handlePagar = () => {
    const token = localStorage.getItem('token')
    if(!token) {
        toggleCart() // Cerramos el carrito
        navigate('/') // Mandamos al login
        return
    }

    const decoded = jwtDecode(token)
    const emailCliente = decoded.sub 

    const pedidoData = {
      cliente: emailCliente,
      detalles: carrito.map(item => ({
        cantidad: item.cantidad,
        plato: { id: item.id, precio: item.precio }
      }))
    }

    axios.post('http://localhost:8080/api/pedidos', pedidoData, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(() => {
      alert("¡Pedido realizado con éxito! 🍔🚀")
      limpiarCarrito()
      toggleCart() // Cerramos el sidebar al terminar
    })
    .catch(error => {
      console.error(error)
      alert("Error al procesar el pedido")
    })
  }

  return (
    <>
      {/* 1. EL FONDO OSCURO (Backdrop) */}
      {/* Si está abierto, mostramos el fondo oscuro. Si no, lo ocultamos (invisible) */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
            isCartOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={toggleCart} // Si das clic afuera, se cierra
      />

      {/* 2. EL SIDEBAR (Cajón lateral) */}
      <div 
        className={`fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
            isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
            
            {/* CABECERA */}
            <div className="p-4 bg-orange-500 text-white flex justify-between items-center shadow-md">
                <h2 className="text-xl font-bold">🛒 Tu Pedido</h2>
                <button onClick={toggleCart} className="text-2xl font-bold hover:text-gray-200">✕</button>
            </div>

            {/* CONTENIDO SCROLLEABLE */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {carrito.length === 0 ? (
                    <div className="text-center text-gray-500 mt-10">
                        <p className="text-4xl mb-2">🍽️</p>
                        <p>Tu carrito está vacío.</p>
                        <button onClick={toggleCart} className="mt-4 text-orange-500 font-bold underline">
                            Volver al menú
                        </button>
                    </div>
                ) : (
                    carrito.map((item) => (
                        <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded border">
                            <div>
                                <h4 className="font-bold text-gray-800 text-sm">{item.nombre}</h4>
                                <p className="text-xs text-gray-500">${item.precio} x {item.cantidad}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="font-bold text-orange-600">${item.precio * item.cantidad}</span>
                                <button 
                                    onClick={() => eliminarDelCarrito(item.id)}
                                    className="text-red-400 hover:text-red-600 font-bold"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* FOOTER (Total y Botón) */}
            {carrito.length > 0 && (
                <div className="p-4 border-t bg-gray-50">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-bold text-gray-600">Total:</span>
                        <span className="text-2xl font-bold text-green-600">${total}</span>
                    </div>
                    <button 
                        onClick={handlePagar}
                        className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-colors shadow-lg"
                    >
                        Confirmar Pedido ✅
                    </button>
                </div>
            )}
        </div>
      </div>
    </>
  )
}

export default CartSidebar