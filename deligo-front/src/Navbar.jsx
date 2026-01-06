import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from './context/CartContext'

// Iconos SVG
const MapPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
  </svg>
)

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
)

// Recibimos props para manejar el buscador desde el padre (si es necesario)
function Navbar({ busqueda, setBusqueda }) {
  const [ubicacion, setUbicacion] = useState('Detectando ubicación...')
  const navigate = useNavigate()
  const { limpiarCarrito } = useCart()

  useEffect(() => {
    // Lógica de GPS
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            () => setUbicacion(`Calle Principal #123, Los Mochis`), // Simulado
            () => setUbicacion('Ingresa tu ubicación manual')
        )
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    limpiarCarrito()
    navigate('/')
  }

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-20 py-3 px-8">
        <div className="container mx-auto flex items-center justify-between gap-8">
            
            {/* 1. LOGO Y UBICACIÓN */}
            <div className="flex items-center gap-8">
                <h1 className="text-2xl font-extrabold text-orange-500 tracking-tight cursor-pointer" onClick={() => navigate('/home')}>
                    DeliGo
                </h1>

                <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 w-80 hover:bg-gray-200 transition-colors">
                    <MapPinIcon />
                    <input 
                        type="text" 
                        value={ubicacion}
                        onChange={(e) => setUbicacion(e.target.value)}
                        className="bg-transparent border-none outline-none text-sm text-gray-700 ml-2 w-full font-medium truncate"
                        placeholder="Ubicación de entrega"
                    />
                </div>
            </div>

            {/* 2. BUSCADOR (Si pasamos la función setBusqueda, se activa) */}
            <div className="flex-1 max-w-2xl hidden md:block">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon />
                    </div>
                    <input 
                        type="text"
                        value={busqueda || ''} // Si es null, usa string vacío
                        onChange={(e) => setBusqueda && setBusqueda(e.target.value)}
                        disabled={!setBusqueda} // Si no hay función de búsqueda, se deshabilita (o lo dejas abierto)
                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-full leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm"
                        placeholder="Buscar en DeliGo..."
                    />
                </div>
            </div>

            {/* 3. BOTÓN SALIR */}
            <div className="flex items-center gap-4">
                <button 
                  onClick={handleLogout}
                  className="text-gray-500 font-bold hover:text-red-500 text-sm transition-colors"
                >
                  Salir
                </button>
            </div>
        </div>
    </nav>
  )
}

export default Navbar