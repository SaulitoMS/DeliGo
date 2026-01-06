import { useState, useEffect } from 'react'
import axios from 'axios'
import { jwtDecode } from "jwt-decode"
import { useNavigate } from 'react-router-dom'

// --- COMPONENTE MODAL PARA GESTIONAR EXTRAS (INTERNO) ---
function ExtrasModal({ plato, onClose }) {
  const [opciones, setOpciones] = useState([])
  const [nuevoExtra, setNuevoExtra] = useState({ nombre: '', precioExtra: '', grupo: 'BEBIDA' })

  // Cargar extras existentes al abrir
  useEffect(() => {
    cargarOpciones()
  }, [plato])

  const cargarOpciones = () => {
    const token = localStorage.getItem('token')
    axios.get(`http://localhost:8080/api/opciones/plato/${plato.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => setOpciones(res.data))
    .catch(err => console.error(err))
  }

  const handleGuardarExtra = (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    
    const data = {
        nombre: nuevoExtra.nombre,
        precioExtra: parseFloat(nuevoExtra.precioExtra),
        grupo: nuevoExtra.grupo, // "BEBIDA" o "COMPLEMENTO"
        esObligatorio: false
    }

    axios.post(`http://localhost:8080/api/opciones/crear/${plato.id}`, data, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(() => {
        setNuevoExtra({ nombre: '', precioExtra: '', grupo: 'BEBIDA' }) // Limpiar form
        cargarOpciones() // Recargar lista
    })
  }

  const eliminarExtra = (id) => {
    const token = localStorage.getItem('token')
    axios.delete(`http://localhost:8080/api/opciones/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    }).then(() => cargarOpciones())
  }

  // Filtramos visualmente para mostrar ordenado
  const bebidas = opciones.filter(o => o.grupo === 'BEBIDA')
  const complementos = opciones.filter(o => o.grupo === 'COMPLEMENTO')

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header Modal */}
            <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
                <h3 className="font-bold text-lg">⚙️ Extras para: {plato.nombre}</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">✕</button>
            </div>

            {/* Body Scrollable */}
            <div className="p-6 overflow-y-auto flex-1">
                
                {/* Formulario Agregar */}
                <form onSubmit={handleGuardarExtra} className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
                    <h4 className="font-bold text-gray-700 mb-3 text-sm uppercase">Nuevo Extra</h4>
                    <div className="flex flex-col md:flex-row gap-3">
                        <select 
                            className="p-2 border rounded font-bold text-gray-700"
                            value={nuevoExtra.grupo}
                            onChange={e => setNuevoExtra({...nuevoExtra, grupo: e.target.value})}
                        >
                            <option value="BEBIDA">🥤 Bebida</option>
                            <option value="COMPLEMENTO">🍟 Complemento</option>
                        </select>
                        <input 
                            type="text" placeholder="Nombre (Ej. Coca Cola)" 
                            className="flex-1 p-2 border rounded"
                            value={nuevoExtra.nombre}
                            onChange={e => setNuevoExtra({...nuevoExtra, nombre: e.target.value})}
                            required
                        />
                        <input 
                            type="number" placeholder="$ Precio" 
                            className="w-24 p-2 border rounded"
                            value={nuevoExtra.precioExtra}
                            onChange={e => setNuevoExtra({...nuevoExtra, precioExtra: e.target.value})}
                            required
                        />
                        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded font-bold hover:bg-green-700">
                            + Añadir
                        </button>
                    </div>
                </form>

                {/* Lista BEBIDAS */}
                <div className="mb-6">
                    <h4 className="font-bold text-orange-600 border-b border-orange-200 pb-1 mb-3">🥤 Bebidas</h4>
                    {bebidas.length === 0 ? <p className="text-gray-400 text-sm italic">No hay bebidas registradas.</p> : (
                        <div className="space-y-2">
                            {bebidas.map(op => (
                                <div key={op.id} className="flex justify-between items-center bg-white p-2 border rounded shadow-sm">
                                    <span className="font-medium text-gray-700">{op.nombre}</span>
                                    <div className="flex items-center gap-4">
                                        <span className="text-green-600 font-bold text-sm">+${op.precioExtra}</span>
                                        <button onClick={() => eliminarExtra(op.id)} className="text-red-400 hover:text-red-600">🗑️</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Lista COMPLEMENTOS */}
                <div>
                    <h4 className="font-bold text-blue-600 border-b border-blue-200 pb-1 mb-3">🍟 Complementos</h4>
                    {complementos.length === 0 ? <p className="text-gray-400 text-sm italic">No hay complementos registrados.</p> : (
                        <div className="space-y-2">
                            {complementos.map(op => (
                                <div key={op.id} className="flex justify-between items-center bg-white p-2 border rounded shadow-sm">
                                    <span className="font-medium text-gray-700">{op.nombre}</span>
                                    <div className="flex items-center gap-4">
                                        <span className="text-green-600 font-bold text-sm">+${op.precioExtra}</span>
                                        <button onClick={() => eliminarExtra(op.id)} className="text-red-400 hover:text-red-600">🗑️</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
            
            <div className="bg-gray-100 p-4 flex justify-end">
                <button onClick={onClose} className="bg-gray-500 text-white px-6 py-2 rounded font-bold hover:bg-gray-600">Cerrar</button>
            </div>
        </div>
    </div>
  )
}


// --- COMPONENTE PRINCIPAL DEL PANEL ---
function AdminPanel() {
  const [platos, setPlatos] = useState([])
  const [restauranteId, setRestauranteId] = useState(null)
  const navigate = useNavigate()

  // Estados para CRUD Platos
  const [modoEdicion, setModoEdicion] = useState(false)
  const [idPlatoEditar, setIdPlatoEditar] = useState(null)
  const [form, setForm] = useState({ nombre: '', descripcion: '', precio: '', imagenUrl: '' })

  // Estado para el Modal de Extras
  const [platoParaExtras, setPlatoParaExtras] = useState(null) // Si no es null, se abre el modal

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { navigate('/'); return }
    try {
      const decoded = jwtDecode(token)
      if (decoded.rol !== 'RESTAURANTE') { navigate('/home'); return }
      if (!decoded.restauranteId) { alert("Usuario sin restaurante asignado."); navigate('/'); return }

      setRestauranteId(decoded.restauranteId)
      cargarPlatos(decoded.restauranteId, token)
    } catch (e) {
      navigate('/')
    }
  }, [navigate])

  const cargarPlatos = (id, token) => {
    axios.get(`http://localhost:8080/api/platos/restaurante/${id}`, { headers: { 'Authorization': `Bearer ${token}` } })
    .then(res => setPlatos(res.data))
    .catch(err => console.error(err))
  }

  // --- LÓGICA DE PLATOS (Igual que antes) ---
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  
  const activarEdicion = (plato) => {
    setModoEdicion(true)
    setIdPlatoEditar(plato.id)
    setForm({ nombre: plato.nombre, descripcion: plato.descripcion, precio: plato.precio, imagenUrl: plato.imagenUrl || '' })
  }

  const cancelarEdicion = () => {
    setModoEdicion(false)
    setIdPlatoEditar(null)
    setForm({ nombre: '', descripcion: '', precio: '', imagenUrl: '' })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    const platoData = { ...form, precio: parseFloat(form.precio), restaurante: { id: restauranteId } }
    const config = { headers: { 'Authorization': `Bearer ${token}` } }

    if (modoEdicion) {
        axios.put(`http://localhost:8080/api/platos/actualizar/${idPlatoEditar}`, platoData, config)
        .then(() => { cargarPlatos(restauranteId, token); cancelarEdicion(); })
    } else {
        axios.post('http://localhost:8080/api/platos/crear', platoData, config)
        .then(() => { cargarPlatos(restauranteId, token); cancelarEdicion(); })
    }
  }

  const eliminarPlato = (id) => {
    if(!confirm("¿Borrar plato?")) return;
    const token = localStorage.getItem('token')
    axios.delete(`http://localhost:8080/api/platos/${id}`, { headers: { 'Authorization': `Bearer ${token}` } })
    .then(() => cargarPlatos(restauranteId, token))
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">👨‍🍳 Panel de Administración</h1>
        <button onClick={() => {localStorage.removeItem('token'); navigate('/')}} className="bg-red-500 text-white px-4 py-2 rounded font-bold">Salir</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUMNA IZQUIERDA: FORMULARIO PLATOS */}
        <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-lg sticky top-8">
                <h2 className="text-xl font-bold mb-4">{modoEdicion ? '✏️ Editar Plato' : '➕ Nuevo Plato'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" className="w-full p-2 border rounded" required />
                    <textarea name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Descripción" className="w-full p-2 border rounded" required />
                    <input type="number" name="precio" value={form.precio} onChange={handleChange} placeholder="Precio" className="w-full p-2 border rounded" required />
                    <input type="text" name="imagenUrl" value={form.imagenUrl} onChange={handleChange} placeholder="URL Imagen" className="w-full p-2 border rounded" />
                    
                    <button type="submit" className={`w-full py-2 text-white font-bold rounded ${modoEdicion ? 'bg-blue-600' : 'bg-orange-600'}`}>
                        {modoEdicion ? 'Actualizar' : 'Publicar'}
                    </button>
                    {modoEdicion && <button type="button" onClick={cancelarEdicion} className="w-full py-2 bg-gray-300 rounded font-bold mt-2">Cancelar</button>}
                </form>
            </div>
        </div>

        {/* COLUMNA DERECHA: LISTA DE PLATOS */}
        <div className="lg:col-span-2 space-y-4">
            {platos.map(plato => (
                <div key={plato.id} className="bg-white p-4 rounded-lg shadow flex flex-col md:flex-row gap-4 items-center">
                    <img src={plato.imagenUrl || "https://via.placeholder.com/80"} className="w-24 h-24 object-cover rounded bg-gray-100" alt="" />
                    
                    <div className="flex-1 text-center md:text-left">
                        <h3 className="font-bold text-lg">{plato.nombre}</h3>
                        <p className="text-sm text-gray-500 line-clamp-1">{plato.descripcion}</p>
                        <p className="font-bold text-orange-600">${plato.precio}</p>
                    </div>

                    <div className="flex flex-col gap-2 w-full md:w-auto">
                        {/* BOTÓN GESTIONAR EXTRAS (NUEVO) */}
                        <button 
                            onClick={() => setPlatoParaExtras(plato)}
                            className="bg-purple-100 text-purple-700 px-4 py-2 rounded font-bold hover:bg-purple-200 text-sm transition"
                        >
                            ⚙️ Extras / Bebidas
                        </button>

                        <div className="flex gap-2">
                            <button onClick={() => activarEdicion(plato)} className="flex-1 bg-blue-50 text-blue-600 px-4 py-2 rounded font-bold hover:bg-blue-100 text-sm">Editar</button>
                            <button onClick={() => eliminarPlato(plato.id)} className="flex-1 bg-red-50 text-red-600 px-4 py-2 rounded font-bold hover:bg-red-100 text-sm">Borrar</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* RENDERIZADO DEL MODAL DE EXTRAS (Si hay plato seleccionado) */}
      {platoParaExtras && (
        <ExtrasModal 
            plato={platoParaExtras} 
            onClose={() => setPlatoParaExtras(null)} 
        />
      )}
    </div>
  )
}

export default AdminPanel