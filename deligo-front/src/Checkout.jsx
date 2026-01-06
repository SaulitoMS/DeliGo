import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from './context/CartContext'
import Navbar from './Navbar'
import PlatoModal from './PlatoModal' // Asegúrate de tener actualizado este componente como vimos antes

// --- MODAL DE PEDIDO EXITOSO ---
function PedidoExitosoModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-[100] flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center transform animate-scaleIn">
        
        {/* Icono Check Animado */}
        <div className="w-20 h-20 bg-green-500 rounded-full mx-auto flex items-center justify-center mb-6 animate-bounce">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="white" className="w-12 h-12">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">¡Pedido Realizado!</h2>
        <p className="text-gray-600 mb-6">
          Tu pedido está en camino. Recibirás una notificación cuando el repartidor esté cerca.
        </p>

        <button 
          onClick={onClose}
          className="w-full bg-orange-500 text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition"
        >
          Entendido
        </button>
      </div>
    </div>
  )
}


// --- ICONOS SVG (Estilo Neutro/Gris) ---
const IconMapPin = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
  </svg>
)

const IconCheckCircle = ({ active }) => (
    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${active ? 'border-orange-500' : 'border-gray-300'}`}>
        {active && <div className="w-3 h-3 bg-orange-500 rounded-full"></div>}
    </div>
)

const IconCard = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-500">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
  </svg>
)

const IconCash = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-500">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
)

// --- MODAL DE DIRECCIONES (AGENDA) ---
function AddressModal({ savedAddresses, selectedId, onClose, onSelect, onAddNew }) {
    const [view, setView] = useState('LIST') // 'LIST' o 'ADD'
    const [newAddress, setNewAddress] = useState({ calle: '', ciudad: '', alias: 'Casa' })

    const handleSaveNew = () => {
        if (!newAddress.calle || !newAddress.ciudad) return alert("Completa los campos")
        const addressWithId = { ...newAddress, id: Date.now() }
        onAddNew(addressWithId)
        setView('LIST')
    }

    const handleGPS = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                () => setNewAddress(prev => ({ ...prev, calle: 'Blvd. Rosendo G. Castro #555', ciudad: 'Los Mochis, Sinaloa' })),
                () => alert("Error al obtener ubicación")
            )
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-lg shadow-xl overflow-hidden flex flex-col min-h-[400px]">
                <div className="p-4 border-b flex justify-between items-center">
                    {view === 'ADD' ? (
                        <button onClick={() => setView('LIST')} className="text-gray-500 font-bold text-sm">‹ Volver</button>
                    ) : (
                        <h3 className="font-bold text-gray-800">Mis Direcciones</h3>
                    )}
                    <button onClick={onClose} className="text-gray-400 font-bold hover:text-gray-600">✕</button>
                </div>

                {view === 'LIST' && (
                    <div className="p-6 space-y-4 flex-1 flex flex-col">
                        {savedAddresses.map(addr => (
                            <div key={addr.id} onClick={() => onSelect(addr)} className="flex items-start justify-between p-4 border rounded-lg cursor-pointer hover:border-gray-400 transition">
                                <div className="flex gap-3">
                                    <div className="mt-0.5"><IconMapPin /></div>
                                    <div>
                                        <p className="font-bold text-gray-800 text-sm">{addr.alias}</p>
                                        <p className="text-gray-600 text-sm mt-0.5">{addr.calle}</p>
                                        <p className="text-xs text-gray-400">{addr.ciudad}</p>
                                    </div>
                                </div>
                                <IconCheckCircle active={selectedId === addr.id} />
                            </div>
                        ))}
                        <button onClick={() => setView('ADD')} className="mt-auto w-full flex items-center justify-between p-3 text-orange-600 font-bold hover:bg-orange-50 rounded-lg transition text-sm">
                            <span>+ Agregar nueva dirección</span>
                            <span className="text-xl">›</span>
                        </button>
                    </div>
                )}

                {view === 'ADD' && (
                    <div className="p-6 space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-gray-800">Nueva Dirección</h3>
                            <button onClick={handleGPS} className="text-xs text-blue-600 font-bold hover:underline">Usar GPS actual</button>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 mb-1 block">Calle y Número</label>
                            <input type="text" value={newAddress.calle} onChange={(e) => setNewAddress({...newAddress, calle: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:border-gray-500" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 mb-1 block">Ciudad</label>
                            <input type="text" value={newAddress.ciudad} onChange={(e) => setNewAddress({...newAddress, ciudad: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:border-gray-500" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 mb-2 block">Guardar como</label>
                            <div className="flex gap-2">
                                {['Casa', 'Trabajo', 'Pareja', 'Otro'].map(alias => (
                                    <button key={alias} onClick={() => setNewAddress({...newAddress, alias})} className={`px-4 py-2 rounded-md text-xs font-bold border transition ${newAddress.alias === alias ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-600 border-gray-300'}`}>
                                        {alias}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <button onClick={handleSaveNew} className="w-full bg-orange-500 text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition mt-4">Guardar Dirección</button>
                    </div>
                )}
            </div>
        </div>
    )
}

// --- MODAL DE PAGO (VALIDADO Y FORMATEADO) ---
function PaymentModal({ currentMethod, savedCards, onClose, onSelect, onAddCard }) {
    const [step, setStep] = useState(1)
    const [cardForm, setCardForm] = useState({ number: '', expiry: '', cvv: '' })
    const [errors, setErrors] = useState({})

    const validate = () => {
        const newErrors = {}
        const cleanNumber = cardForm.number.replace(/\s/g, '')

        if (!/^\d{16}$/.test(cleanNumber)) newErrors.number = "El número debe tener 16 dígitos"
        if (!/^\d{3,4}$/.test(cardForm.cvv)) newErrors.cvv = "Inválido"
        if (!/^\d{2}\/\d{2}$/.test(cardForm.expiry)) {
            newErrors.expiry = "Formato inválido"
        } else {
            const [mm, yy] = cardForm.expiry.split('/').map(Number)
            const now = new Date()
            const currentYear = parseInt(now.getFullYear().toString().substr(-2))
            const currentMonth = now.getMonth() + 1
            if (mm < 1 || mm > 12) newErrors.expiry = "Mes inválido"
            else if (yy < currentYear || (yy === currentYear && mm < currentMonth)) newErrors.expiry = "Tarjeta vencida"
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSaveCard = () => {
        if (validate()) {
            const cleanNumber = cardForm.number.replace(/\s/g, '')
            const last4 = cleanNumber.slice(-4)
            const brand = cleanNumber.startsWith('4') ? 'Visa' : 'Mastercard'
            onAddCard({ id: Date.now(), brand, last4, number: cleanNumber })
        }
    }

    const handleNumberChange = (e) => {
        let val = e.target.value.replace(/\D/g, '').slice(0, 16)
        val = val.replace(/(\d{4})(?=\d)/g, '$1 ')
        setCardForm({ ...cardForm, number: val })
        if(errors.number) setErrors({...errors, number: null})
    }

    const handleExpiryChange = (e) => {
        let val = e.target.value.replace(/\D/g, '').slice(0, 4)
        if (val.length >= 3) val = `${val.slice(0, 2)}/${val.slice(2)}`
        setCardForm({ ...cardForm, expiry: val })
        if(errors.expiry) setErrors({...errors, expiry: null})
    }

    const handleCvvChange = (e) => {
        setCardForm({ ...cardForm, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })
        if(errors.cvv) setErrors({...errors, cvv: null})
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-lg shadow-xl overflow-hidden min-h-[400px] flex flex-col">
                <div className="p-4 border-b flex items-center justify-between">
                    {step === 2 ? <button onClick={() => setStep(1)} className="text-gray-500 font-bold text-sm">‹ Volver</button> : <h3 className="font-bold text-gray-800">Método de pago</h3>}
                    <button onClick={onClose} className="text-gray-400 font-bold hover:text-gray-600">✕</button>
                </div>

                {step === 1 && (
                    <div className="p-6 space-y-4">
                        <div onClick={() => onSelect('Efectivo')} className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:border-gray-400 transition">
                            <div className="flex items-center gap-4"><IconCash /><span className="font-bold text-gray-700 text-sm">Efectivo</span></div>
                            <IconCheckCircle active={currentMethod === 'Efectivo'} />
                        </div>
                        {savedCards.map(card => (
                            <div key={card.id} onClick={() => onSelect(card)} className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:border-gray-400 transition">
                                <div className="flex items-center gap-4">
                                    <IconCard />
                                    <div className="flex flex-col"><span className="font-bold text-gray-700 text-sm">{card.brand} •••• {card.last4}</span><span className="text-xs text-gray-400">Tarjeta</span></div>
                                </div>
                                <IconCheckCircle active={currentMethod.id === card.id} />
                            </div>
                        ))}
                        <button onClick={() => setStep(2)} className="w-full flex items-center justify-between p-3 text-orange-600 font-bold mt-4 hover:bg-orange-50 rounded-lg transition text-sm"><span>+ Agregar tarjeta</span><span className="text-xl">›</span></button>
                    </div>
                )}

                {step === 2 && (
                    <div className="p-6 space-y-5">
                        <div>
                            <label className="text-xs font-bold text-gray-500 mb-1 block">Número de tarjeta</label>
                            <input type="text" value={cardForm.number} onChange={handleNumberChange} placeholder="0000 0000 0000 0000" className={`w-full border ${errors.number ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 text-sm outline-none focus:border-gray-500 font-mono`} />
                            {errors.number && <p className="text-red-500 text-xs mt-1 font-medium">{errors.number}</p>}
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="text-xs font-bold text-gray-500 mb-1 block">Vencimiento</label>
                                <input type="text" placeholder="MM/YY" value={cardForm.expiry} onChange={handleExpiryChange} className={`w-full border ${errors.expiry ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 text-sm outline-none focus:border-gray-500 text-center`} />
                                {errors.expiry && <p className="text-red-500 text-xs mt-1 font-medium">{errors.expiry}</p>}
                            </div>
                            <div className="flex-1">
                                <label className="text-xs font-bold text-gray-500 mb-1 block">CVV</label>
                                <input type="password" placeholder="123" value={cardForm.cvv} onChange={handleCvvChange} className={`w-full border ${errors.cvv ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 text-sm outline-none focus:border-gray-500 text-center`} />
                                {errors.cvv && <p className="text-red-500 text-xs mt-1 font-medium">{errors.cvv}</p>}
                            </div>
                        </div>
                        <button onClick={handleSaveCard} className="w-full bg-orange-500 text-white font-bold py-3.5 rounded-lg hover:bg-orange-600 transition mt-2">Guardar Tarjeta</button>
                    </div>
                )}
            </div>
        </div>
    )
}

// --- CHECKOUT PRINCIPAL ---
function Checkout() {
  const { carrito, total, limpiarCarrito, agregarAlCarrito, eliminarItem } = useCart()
  const navigate = useNavigate()
  const [isProcessing, setIsProcessing] = useState(false)
  const [comentarios, setComentarios] = useState('')
  const [mostrarExito, setMostrarExito] = useState(false)

  // Datos Simulados
  const [savedAddresses, setSavedAddresses] = useState([
    { id: 1, calle: 'Calle Principal #123', ciudad: 'Los Mochis, Sinaloa', alias: 'Casa' },
    { id: 2, calle: 'Av. Independencia #890', ciudad: 'Los Mochis, Sinaloa', alias: 'Trabajo' }
  ])
  const [selectedAddress, setSelectedAddress] = useState(savedAddresses[0])
  const [showAddressModal, setShowAddressModal] = useState(false)

  const [metodoPago, setMetodoPago] = useState('Efectivo')
  const [tarjetasGuardadas, setTarjetasGuardadas] = useState([])
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  // Estado para editar platillo (abre PlatoModal)
  const [editingItem, setEditingItem] = useState(null)

  // Totales
  const costoEnvio = 21.00; const tarifaServicio = 6.00; const propina = 5.00; const subtotal = total
  const granTotal = subtotal + costoEnvio + tarifaServicio + propina; const ahorro = 45.00

useEffect(() => { 
  if (carrito.length === 0 && !mostrarExito) navigate('/home') 
}, [carrito, navigate, mostrarExito])

const handleRealizarPedido = () => {
  setIsProcessing(true)
  
  // Simular un pequeño delay para que se vea el "Procesando..."
  setTimeout(() => {
    setIsProcessing(false)
    setMostrarExito(true)
  }, 1000)
}

const handleCerrarModalExito = () => {
  setMostrarExito(false)
  limpiarCarrito()
  navigate('/home')
}

  // Lógica de Edición desde el Modal
  const handleUpdateOrder = (plato, nuevaCantidad, nuevasOpciones) => {
    if (editingItem) eliminarItem(editingItem.comboId) // Borrar versión vieja
    if (nuevaCantidad > 0) agregarAlCarrito(plato, nuevaCantidad, nuevasOpciones) // Agregar nueva (si no es 0)
    setEditingItem(null)
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-sans pb-20">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        
        <div className="flex items-center gap-2 mb-6 text-gray-600 cursor-pointer w-fit" onClick={() => navigate(-1)}>
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
             <span className="text-sm font-bold">Volver</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
                
                {/* 1. Dirección */}
                <div onClick={() => setShowAddressModal(true)} className="bg-white p-5 rounded-lg shadow-sm cursor-pointer border border-transparent hover:border-gray-300 transition flex justify-between items-center group">
                    <div className="flex items-start gap-4">
                        <div className="mt-1"><IconMapPin /></div>
                        <div>
                            <h3 className="font-bold text-gray-800 text-sm">Dirección de entrega</h3>
                            <p className="text-gray-800 font-medium mt-1">{selectedAddress.calle}</p>
                            <p className="text-gray-500 text-xs mt-0.5">{selectedAddress.ciudad} • {selectedAddress.alias}</p>
                        </div>
                    </div>
                    <div className="text-gray-400 group-hover:text-gray-600">›</div>
                </div>

                {/* 2. Pago */}
                <div onClick={() => setShowPaymentModal(true)} className="bg-white p-5 rounded-lg shadow-sm cursor-pointer border border-transparent hover:border-gray-300 transition flex justify-between items-center group">
                    <div className="flex items-center gap-4">
                        <div><IconCard /></div>
                        <div>
                            <h3 className="font-bold text-gray-800 text-sm">Método de pago</h3>
                            {typeof metodoPago === 'string' ? <p className="text-gray-700 font-bold mt-1">Efectivo</p> : <p className="text-gray-700 font-bold mt-1">{metodoPago.brand} •••• {metodoPago.last4}</p>}
                        </div>
                    </div>
                    <div className="text-gray-400 group-hover:text-gray-600">›</div>
                </div>

                {/* 3. Resumen (Con Edición) */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="font-bold text-gray-800 mb-4 text-sm">Resumen (Toca para editar)</h2>
                    <div className="divide-y divide-gray-100 mb-6">
                        {carrito.map((item, idx) => (
                            <div key={idx} onClick={() => setEditingItem(item)} className="py-4 flex gap-4 cursor-pointer hover:bg-gray-50 transition rounded-lg px-2 -mx-2 group">
                                <img src={item.imagenUrl} className="w-12 h-12 rounded bg-gray-100 object-cover" alt="" />
                                <div className="flex-1">
                                    <div className="flex justify-between">
                                        <h3 className="font-bold text-gray-800 text-sm group-hover:text-orange-600 transition">{item.nombre}</h3>
                                        <span className="font-medium text-gray-800 text-sm">MX${(item.precio * item.cantidad).toFixed(2)}</span>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">{item.opciones && item.opciones.length > 0 ? item.opciones.map(o => o.nombre).join(', ') : "Sin extras"}</div>
                                    <div className="text-xs text-gray-400 mt-1">Cant: {item.cantidad}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <textarea value={comentarios} onChange={(e) => setComentarios(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:border-gray-500 outline-none resize-none bg-gray-50" placeholder="Nota para el restaurante..." rows="2" />
                </div>
            </div>

            {/* Ticket */}
            <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-lg shadow-sm sticky top-24 space-y-3 text-sm text-gray-600">
                    <div className="flex justify-between"><span>Subtotal</span><span className="font-medium text-gray-800">MX${subtotal.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span>Envío</span><span className="font-medium text-gray-800">MX${costoEnvio.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span>Servicio</span><span className="font-medium text-gray-800">MX${tarifaServicio.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span>Propina</span><span className="font-medium text-gray-800">MX${propina.toFixed(2)}</span></div>
                    <div className="border-t border-dashed border-gray-300 my-4"></div>
                    <div className="flex justify-between items-end">
                        <span className="font-bold text-lg text-gray-900">Total</span>
                        <div className="text-right"><span className="block text-2xl font-bold text-gray-900">MX${granTotal.toFixed(2)}</span><span className="text-xs text-orange-600 font-bold">Ahorraste MX${ahorro.toFixed(2)}</span></div>
                    </div>
                    <button onClick={handleRealizarPedido} disabled={isProcessing} className="w-full bg-orange-500 text-white font-bold py-3.5 rounded-lg mt-6 shadow-sm hover:bg-orange-600 transition disabled:opacity-50">
                        {isProcessing ? 'Procesando...' : 'Hacer Pedido'}
                    </button>
                </div>
            </div>
        </div>
      </div>

      {showAddressModal && (
        <AddressModal 
            savedAddresses={savedAddresses}
            selectedId={selectedAddress.id}
            onClose={() => setShowAddressModal(false)}
            onSelect={(addr) => { setSelectedAddress(addr); setShowAddressModal(false) }}
            onAddNew={(newAddr) => { 
                setSavedAddresses([...savedAddresses, newAddr])
                setSelectedAddress(newAddr)
                setShowAddressModal(false)
            }}
        />
      )}
      
      {showPaymentModal && (
        <PaymentModal 
            currentMethod={metodoPago} 
            savedCards={tarjetasGuardadas} 
            onClose={() => setShowPaymentModal(false)} 
            onSelect={(method) => { setMetodoPago(method); setShowPaymentModal(false) }} 
            onAddCard={(newCard) => { setTarjetasGuardadas([...tarjetasGuardadas, newCard]); setMetodoPago(newCard); setShowPaymentModal(false) }} 
        />
      )}

      {/* MODAL DE EDICIÓN DE PLATILLO (Si editingItem existe, se abre) */}
        {editingItem && (
            <PlatoModal 
                plato={editingItem}
                initialCantidad={editingItem.cantidad}
                initialOpciones={editingItem.opciones}
                onClose={() => setEditingItem(null)}
                onAddToCart={handleUpdateOrder}
                isEditing={true}
            />
        )}

        {/* MODAL DE ÉXITO */}
        {mostrarExito && <PedidoExitosoModal onClose={handleCerrarModalExito} />}
    </div>
  )
}

export default Checkout