import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from "jwt-decode"

// --- 1. Definimos el Icono SVG aquí mismo para no instalar nada extra ---
const BurgerIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className="w-full h-full"
  >
    <path d="M19.006 3.705a.75.75 0 0 0-.512-1.41L6 6.838V3a.75.75 0 0 0-.75-.75h-1.5A.75.75 0 0 0 3 3v4.93l-1.006.365a.75.75 0 0 0 .512 1.41l16.5-6Z" />
    <path fillRule="evenodd" d="M3.019 11.114 18 11.118v-1.02a3.75 3.75 0 0 0-3.75-3.75H6.75A3.75 3.75 0 0 0 3 6.346v4.768Zm12.375-7.495a.75.75 0 0 0 0 1.5h1.125a2.25 2.25 0 0 1 2.25 2.25v2.25h1.876a.75.75 0 0 0 0-1.5H19.5v-2.25a3.75 3.75 0 0 0-3.75-3.75h-1.125ZM3 13.5v6.75a2.25 2.25 0 0 0 2.25 2.25h13.5A2.25 2.25 0 0 0 21 20.25V13.5H3Z" clipRule="evenodd" />
    {/* Forma simplificada de Hamburguesa para que se vea bien */}
    <path d="M2 13h20v2H2z" /> {/* Carne */}
    <path d="M2 16h20v5a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-5z" /> {/* Pan de abajo */}
    <path d="M2 9a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v2H2V9z" /> {/* Pan de arriba */}
  </svg>
)

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    axios.post('http://localhost:8080/api/usuarios/login', { email, password })
      .then(response => {
        const token = response.data 
        localStorage.setItem('token', token)
        const decoded = jwtDecode(token)
        const userRol = decoded.rol 

        // Retraso de 1.5 seg para ver la animación
        setTimeout(() => {
            if (userRol === 'CLIENTE') navigate('/home')
            else if (userRol === 'RESTAURANTE') navigate('/admin-restaurante')
            else if (userRol === 'REPARTIDOR') navigate('/pedidos-repartidor')
            else {
                setError("Rol desconocido")
                setIsLoading(false)
            }
        }, 1500)
      })
      .catch((error) => {
        console.error(error)
        setError("Correo o contraseña incorrectos")
        setIsLoading(false)
      })
  }

  // --- ESCENARIO 1: PANTALLA DE CARGA ---
  // Si está cargando, retornamos ESTO y nada más (fondo blanco total)
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        {/* Icono con animación de rebote y color naranja */}
        <div className="w-24 h-24 text-orange-500 animate-bounce">
            <BurgerIcon />
        </div>
        
        <h2 className="mt-8 text-2xl font-bold text-gray-800 animate-pulse tracking-widest">
            CARGANDO...
        </h2>
      </div>
    )
  }

  // --- ESCENARIO 2: PANTALLA DE LOGIN ---
  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-500">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-96">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">DeliGo Login</h1>
        
        {error && <p className="text-red-500 text-center mb-4 font-bold">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            type="email" 
            placeholder="Correo" 
            className="w-full p-2 border border-gray-300 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="Contraseña" 
            className="w-full p-2 border border-gray-300 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button 
            type="submit" 
            className="w-full bg-gray-800 text-white py-2 rounded font-bold hover:bg-black transition-colors"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login