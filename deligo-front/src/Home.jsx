import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Navbar from './Navbar' // <--- IMPORTAMOS LA NAVBAR

function Home() {
  const [restaurantes, setRestaurantes] = useState([])
  const [busqueda, setBusqueda] = useState('') // El estado vive aquí
  const navigate = useNavigate()
  
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { navigate('/'); return }

    axios.get('http://localhost:8080/api/restaurantes', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(response => setRestaurantes(response.data))
      .catch(error => {
        if (error.response?.status === 403) navigate('/')
      })
  }, [navigate])

  // Filtrado
  const restaurantesFiltrados = restaurantes.filter(restaurante => 
    restaurante.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    restaurante.descripcion.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* USAMOS EL COMPONENTE NAVBAR */}
      <Navbar busqueda={busqueda} setBusqueda={setBusqueda} />

      <div className="container mx-auto p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {busqueda ? `Resultados para "${busqueda}"` : 'Restaurantes cerca de ti'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {restaurantesFiltrados.length > 0 ? (
             restaurantesFiltrados.map((restaurante) => (
                <div 
                    key={restaurante.id} 
                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                    onClick={() => navigate(`/menu/${restaurante.id}`)}
                >
                  <div className="h-48 overflow-hidden relative">
                      <img 
                        src={restaurante.imagenUrl || "https://via.placeholder.com/400x200"} 
                        alt={restaurante.nombre} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => e.target.src = "https://via.placeholder.com/400x200"} // <--- AGREGA ESTO
                      />
                      <div className="absolute bottom-2 right-2 bg-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                        20-30 min
                      </div>
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-start">
                        <h2 className="text-xl font-bold text-gray-800 mb-1">{restaurante.nombre}</h2>
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold">4.8 ★</span>
                    </div>
                    <p className="text-gray-500 text-sm line-clamp-2 mb-4">{restaurante.descripcion}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1">📍 {restaurante.direccion}</p>
                  </div>
                </div>
              ))
          ) : (
              <div className="col-span-3 text-center py-20">
                  <p className="text-4xl mb-4">🔍</p>
                  <p className="text-gray-500 text-lg">No encontramos resultados.</p>
              </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home