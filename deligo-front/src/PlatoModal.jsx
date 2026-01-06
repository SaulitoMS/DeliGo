import { useState } from 'react'

function PlatoModal({ 
    plato, 
    onClose, 
    onAddToCart, 
    initialCantidad = 1, 
    initialOpciones = [],
    isEditing = false // <--- NUEVA PROPIEDAD
}) {
  const [cantidad, setCantidad] = useState(initialCantidad)
  const [opcionesSeleccionadas, setOpcionesSeleccionadas] = useState(initialOpciones)
  
  const grupos = plato.opciones ? Object.groupBy(plato.opciones, (opcion) => opcion.grupo) : {}

  const handleToggleOpcion = (opcion) => {
    if (opcionesSeleccionadas.find(o => o.id === opcion.id)) {
        setOpcionesSeleccionadas(prev => prev.filter(o => o.id !== opcion.id))
    } else {
        setOpcionesSeleccionadas(prev => [...prev, opcion])
    }
  }

  const precioExtras = opcionesSeleccionadas.reduce((acc, opt) => acc + opt.precioExtra, 0)
  const total = (plato.precio + precioExtras) * cantidad

  if (!plato) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm" onClick={onClose}></div>

      <div className="bg-white w-full max-w-4xl h-[85vh] rounded-lg shadow-2xl overflow-hidden relative z-10 flex flex-col md:flex-row animate-fadeIn">
        
        <button onClick={onClose} className="absolute top-4 left-4 z-20 bg-white rounded-full p-2 shadow-md hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-gray-700">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>

        <div className="w-full md:w-1/2 h-64 md:h-full bg-gray-100">
            <img src={plato.imagenUrl || "https://via.placeholder.com/500"} alt={plato.nombre} className="w-full h-full object-cover"/>
        </div>

        <div className="w-full md:w-1/2 flex flex-col h-full">
            <div className="p-8 border-b">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{plato.nombre}</h2>
                <p className="text-gray-500 text-sm leading-relaxed">{plato.descripcion}</p>
                <p className="text-2xl font-bold text-gray-800 mt-4">MX${plato.precio}</p>
            </div>

            <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
                {Object.keys(grupos).length === 0 && <p className="text-gray-400 italic">No hay opciones extra.</p>}

                {Object.entries(grupos).map(([grupoNombre, opciones]) => (
                    <div key={grupoNombre} className="mb-8 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg text-gray-800 capitalize">{grupoNombre.toLowerCase()}s</h3>
                            <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded font-bold">Opcional</span>
                        </div>
                        <div className="space-y-4">
                            {opciones.map(opcion => (
                                <label key={opcion.id} className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded transition">
                                    <div className="flex items-center gap-3">
                                        <input 
                                            type="checkbox" 
                                            className="w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                                            checked={opcionesSeleccionadas.some(o => o.id === opcion.id)}
                                            onChange={() => handleToggleOpcion(opcion)}
                                        />
                                        <span className="text-gray-700 font-medium">{opcion.nombre}</span>
                                    </div>
                                    <span className="text-gray-500 text-sm">+MX${opcion.precioExtra}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
<div className="p-6 bg-white border-t">
                <div className="flex items-center gap-6">
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden h-12">
                        {/* Permitimos bajar a 0 */}
                        <button 
                            onClick={() => setCantidad(c => Math.max(0, c - 1))}
                            className="px-4 h-full hover:bg-gray-100 text-2xl text-gray-500 font-bold"
                        > - </button>
                        <span className="px-4 text-xl font-bold text-gray-800">{cantidad}</span>
                        <button 
                            onClick={() => setCantidad(c => c + 1)}
                            className="px-4 h-full hover:bg-gray-100 text-2xl text-orange-500 font-bold"
                        > + </button>
                    </div>

                    <button 
                        onClick={() => onAddToCart(plato, cantidad, opcionesSeleccionadas)}
                        // CAMBIO 1: Quitamos la condición ternaria de colores. SIEMPRE es naranja.
                        className="flex-1 h-12 rounded-lg font-bold text-lg flex justify-between items-center px-6 transition-all bg-orange-500 hover:bg-orange-600 text-white"
                    >
                        {/* CAMBIO 2: Quitamos la condición que decía "Eliminar". Siempre muestra Actualizar/Agregar */}
                        <span>{isEditing ? 'Actualizar' : 'Agregar'}</span>
                        <span>MX${total.toFixed(2)}</span>
                    </button>
                </div>
            </div>

        </div>
      </div>
    </div>
  )
}

export default PlatoModal