import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useCart } from './context/CartContext'
import Navbar from './Navbar'
import PlatoModal from './PlatoModal'

// --- CONSTANTES & IMÁGENES ---
const DEFAULT_BANNER = "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop"
const DEFAULT_LOGO = "https://cdn-icons-png.flaticon.com/512/3480/3480823.png"
const DEFAULT_PLATO = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=200&auto=format&fit=crop"

// --- ICONO DE BOLSA DE COMPRAS ---
const ShoppingBagIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-9 h-9 text-orange-200">
    <path fillRule="evenodd" d="M7.5 6v.75H5.513c-.96 0-1.764.724-1.865 1.679l-1.263 12A1.875 1.875 0 0 0 4.25 22.5h15.5a1.875 1.875 0 0 0 1.865-2.071l-1.263-12a1.875 1.875 0 0 0-1.865-1.679H16.5V6a4.5 4.5 0 1 0-9 0ZM12 3a3 3 0 0 0-3 3v.75h6V6a3 3 0 0 0-3-3Zm-3 8.25a3 3 0 1 0 6 0v-.75a.75.75 0 0 1 1.5 0v.75a4.5 4.5 0 1 1-9 0v-.75a.75.75 0 0 1 1.5 0v.75Z" clipRule="evenodd" />
  </svg>
)

function Menu() {
  const { id } = useParams() 
  const [platos, setPlatos] = useState([])
  const [restaurante, setRestaurante] = useState(null)
  const [platoSeleccionado, setPlatoSeleccionado] = useState(null)

  const navigate = useNavigate()
  const { agregarAlCarrito, carrito, toggleCart } = useCart()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { navigate('/'); return }

    axios.get(`http://localhost:8080/api/platos/restaurante/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => {
        setPlatos(res.data)
        if (res.data.length > 0 && res.data[0].restaurante) {
            setRestaurante(res.data[0].restaurante)
        } else {
            setRestaurante({
                nombre: "Restaurante DeliGo",
                descripcion: "Comida deliciosa",
                calificacion: 4.5,
                tiempoEntrega: "20-30 min",
                imagenUrl: null
            })
        }
    })
    .catch(err => console.error(err))
  }, [id, navigate])

  const handleImageError = (e, fallback) => {
    e.target.src = fallback
    e.target.onerror = null
  }

  const handleAddToCartFromModal = (plato, cantidad, opciones) => {
    agregarAlCarrito(plato, cantidad, opciones)
    setPlatoSeleccionado(null)
  }

  const totalPrecio = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0)
  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0)

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />

      {/* --- BANNER --- */}
      <div className="bg-white">
        <div className="h-48 md:h-80 w-full relative bg-gray-900">
            <img 
                src={restaurante?.imagenUrl || DEFAULT_BANNER} 
                alt="Banner" 
                className="w-full h-full object-cover opacity-90"
                onError={(e) => handleImageError(e, DEFAULT_BANNER)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative">
            <div className="bg-white rounded-xl shadow-xl p-6 -mt-20 relative z-10 flex flex-col md:flex-row gap-6 items-center border border-gray-100">
                <div className="w-24 h-24 bg-white p-1 rounded-lg shadow-md overflow-hidden flex-shrink-0 border border-gray-100">
                    <img 
                        src={restaurante?.imagenUrl || DEFAULT_LOGO} 
                        alt="Logo" 
                        className="w-full h-full object-cover rounded-md"
                        onError={(e) => handleImageError(e, DEFAULT_LOGO)}
                    />
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
                        {restaurante?.nombre || "Cargando..."}
                    </h1>
                    <div className="flex flex-wrap justify-center md:justify-start gap-3 text-sm text-gray-500 mb-4">
                        <span>{restaurante?.descripcion || "Especialidades"}</span>
                        <span>•</span>
                        <span className="bg-yellow-100 text-yellow-800 px-2 rounded font-bold">★ {restaurante?.calificacion || 4.5}</span>
                        <span>(500+ Calif.)</span>
                    </div>
                    <div className="flex justify-center md:justify-start gap-3">
                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold border border-gray-200">
                            🕒 {restaurante?.tiempoEntrega || "30 min"}
                        </span>
                        <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-100">
                            Envío Gratis
                        </span>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* --- MENU PRINCIPAL --- */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-40 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="hidden md:block col-span-1">
                <div className="sticky top-24">
                    <h3 className="font-bold text-gray-800 text-lg mb-4 pl-2 border-l-4 border-orange-500">Categorías</h3>
                    <ul className="space-y-1 text-sm text-gray-600 font-medium">
                        <li className="bg-orange-50 text-orange-600 px-4 py-3 rounded-r-xl cursor-pointer border-l-2 border-orange-500">Populares</li>
                        <li className="hover:bg-gray-50 px-4 py-3 rounded-r-xl cursor-pointer transition">Entradas</li>
                        <li className="hover:bg-gray-50 px-4 py-3 rounded-r-xl cursor-pointer transition">Platos Fuertes</li>
                        <li className="hover:bg-gray-50 px-4 py-3 rounded-r-xl cursor-pointer transition">Bebidas</li>
                    </ul>
                </div>
            </div>

            <div className="col-span-1 md:col-span-3">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Populares</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {platos.map((plato) => (
                        <div 
                            key={plato.id} 
                            onClick={() => setPlatoSeleccionado(plato)}
                            className="group flex bg-white p-4 rounded-xl border border-gray-100 hover:shadow-lg hover:border-orange-200 transition-all duration-300 h-44 cursor-pointer"
                        >
                            <div className="flex-1 pr-4 flex flex-col justify-between py-1">
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1 group-hover:text-orange-600 transition-colors">
                                        {plato.nombre}
                                    </h3>
                                    <p className="text-gray-500 text-xs line-clamp-2 mb-2 leading-relaxed">
                                        {plato.descripcion || "Platillo fresco preparado al momento."}
                                    </p>
                                    <span className="font-bold text-gray-800 text-lg">MX${plato.precio}</span>
                                </div>
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setPlatoSeleccionado(plato)
                                    }}
                                    className="self-start border-2 border-orange-50 text-orange-500 hover:bg-orange-500 hover:text-white px-5 py-1.5 rounded-full font-bold text-xs transition-colors"
                                >
                                    Agregar
                                </button>
                            </div>
                            <div className="w-36 h-36 flex-shrink-0 rounded-lg overflow-hidden bg-gray-50 relative">
                                <img 
                                    src={plato.imagenUrl || DEFAULT_PLATO} 
                                    alt={plato.nombre} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    onError={(e) => handleImageError(e, DEFAULT_PLATO)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>

        {platoSeleccionado && (
            <PlatoModal 
                plato={platoSeleccionado}
                onClose={() => setPlatoSeleccionado(null)}
                onAddToCart={handleAddToCartFromModal}
                isEditing={false} // <--- ESTO ASEGURA QUE DIGA "AGREGAR"
            />
        )}

{/* --- CARRITO FLOTANTE --- */}
      {carrito.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50 animate-fadeInUp"> 
          
          <div 
            // CAMBIO: Al dar click en la tarjeta completa, nos vamos al checkout
            onClick={() => navigate('/resumen-pedido')} 
            className="bg-white min-w-[340px] shadow-[0_10px_40px_rgba(0,0,0,0.2)] rounded-2xl p-4 flex items-center justify-between border border-gray-100 hover:scale-[1.02] transition-transform cursor-pointer"
          >
            
            <div className="flex items-center gap-4">
                <div className="relative pt-1">
                    <ShoppingBagIcon />
                    <span className="absolute top-0 -right-1 bg-red-500 text-white text-[11px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                        {totalItems}
                    </span>
                </div>
                
                <div className="flex flex-col">
                    <span className="text-xl font-extrabold text-gray-800 leading-none">
                        MX${totalPrecio.toFixed(2)}
                    </span>
                    <span className="text-gray-400 text-xs line-through font-medium mt-0.5">
                        MX${(totalPrecio * 1.15).toFixed(2)}
                    </span>
                </div>
            </div>

            <button 
                // El botón también navega (por propagación o directo)
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-6 rounded-xl transition-colors shadow-lg active:scale-95 text-sm"
            >
                Ver pedido
            </button>
            
          </div>
        </div>
      )}
    </div>
  )
}

export default Menu