import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from "jwt-decode"
import axios from 'axios'

function PedidoDetalleModal({ pedido, onClose, onAceptar }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-2xl overflow-hidden">
        
        <div className="bg-gray-800 text-white p-5 flex justify-between items-center">
          <h3 className="font-bold text-xl">Pedido #{pedido.id}</h3>
          <button onClick={onClose} className="text-white hover:text-gray-300 text-2xl font-bold">×</button>
        </div>

        <div className="p-6 max-h-[75vh] overflow-y-auto">
          
          {/* Información General */}
          <div className="bg-gray-50 p-5 rounded-lg mb-6 border border-gray-200">
            <h4 className="font-bold text-gray-800 text-lg mb-4 border-b pb-2">Información del Pedido</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 font-semibold mb-1">Cliente</p>
                <p className="text-gray-900 font-medium">{pedido.cliente}</p>
              </div>
              <div>
                <p className="text-gray-500 font-semibold mb-1">Estado</p>
                <p className="text-gray-900 font-bold">{pedido.estado}</p>
              </div>
              <div>
                <p className="text-gray-500 font-semibold mb-1">Fecha</p>
                <p className="text-gray-900">{new Date(pedido.fecha).toLocaleString('es-MX')}</p>
              </div>
              <div>
                <p className="text-gray-500 font-semibold mb-1">Método de Pago</p>
                <p className="text-gray-900 font-medium">{pedido.metodoPago || 'Efectivo'}</p>
              </div>
            </div>
          </div>

          {/* Dirección de Entrega */}
          <div className="mb-6">
            <h4 className="font-bold text-gray-800 text-lg mb-3 border-b pb-2">Dirección de Entrega</h4>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-gray-800 font-medium">{pedido.direccionEntrega}</p>
            </div>
          </div>

          {/* Detalles de Productos */}
          <div className="mb-6">
            <h4 className="font-bold text-gray-800 text-lg mb-3 border-b pb-2">Productos Ordenados</h4>
            <div className="space-y-4">
              {pedido.detalles && pedido.detalles.length > 0 ? (
                pedido.detalles.map((detalle, idx) => (
                  <div key={idx} className="bg-white p-4 border-2 border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 text-lg">{detalle.plato?.nombre || 'Producto'}</p>
                        <p className="text-sm text-gray-600 mt-1">{detalle.plato?.descripcion || ''}</p>
                      </div>
                      <p className="font-bold text-gray-900 text-lg ml-4">MX${detalle.subtotal?.toFixed(2)}</p>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-gray-500 font-semibold">Cantidad</p>
                          <p className="text-gray-900 font-bold">{detalle.cantidad} unidad(es)</p>
                        </div>
                        <div>
                          <p className="text-gray-500 font-semibold">Precio Unitario</p>
                          <p className="text-gray-900">MX${detalle.plato?.precio?.toFixed(2)}</p>
                        </div>
                      </div>
                      
                      {/* Opciones/Extras del plato */}
                      {detalle.notas && detalle.notas.trim() !== '' && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-gray-500 font-semibold mb-1 text-sm">Extras seleccionados:</p>
                          <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                            <p className="text-gray-800 text-sm font-medium">{detalle.notas}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No hay productos en este pedido</p>
              )}
            </div>
          </div>

          {/* Resumen de Costos */}
          <div className="bg-gray-100 p-5 rounded-lg border-2 border-gray-300">
            <h4 className="font-bold text-gray-800 text-lg mb-3">Resumen de Pago</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total de productos:</span>
                <span className="font-semibold text-gray-900">MX${pedido.total?.toFixed(2)}</span>
              </div>
              <div className="border-t-2 border-gray-300 my-2"></div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-gray-800 font-bold text-lg">Total a cobrar:</span>
                <span className="text-gray-900 font-bold text-2xl">MX${pedido.total?.toFixed(2)}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Botones de Acción */}
        <div className="p-5 bg-gray-50 border-t-2 flex gap-3">
          <button 
            onClick={() => onAceptar(pedido.id)}
            className="flex-1 bg-gray-800 text-white font-bold py-4 rounded-lg hover:bg-gray-900 transition text-lg"
          >
            Aceptar Pedido
          </button>

          <button 
            onClick={onClose}
            className="flex-1 bg-gray-300 text-gray-800 font-bold py-4 rounded-lg hover:bg-gray-400 transition text-lg"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  )
}

function RepartidorPanel() {
  const navigate = useNavigate()
  const [pedidosPendientes, setPedidosPendientes] = useState([])
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null)
  const [nombreRepartidor, setNombreRepartidor] = useState('')

  const cargarPedidosPendientes = () => {
    const token = localStorage.getItem('token')
    if (!token) return

    axios.get('http://localhost:8080/api/pedidos/pendientes', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => {
      console.log('Pedidos recibidos:', res.data)
      setPedidosPendientes(res.data)
    })
    .catch(err => console.error('Error cargando pedidos:', err))
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { 
      navigate('/')
      return 
    }

    try {
      const decoded = jwtDecode(token)
      if (decoded.rol !== 'REPARTIDOR') { 
        navigate('/home')
        return 
      }
      
      setNombreRepartidor(decoded.sub)
      cargarPedidosPendientes()
      
      const interval = setInterval(() => {
        cargarPedidosPendientes()
      }, 5000)

      return () => clearInterval(interval)
    } catch (e) {
      navigate('/')
    }
  }, [navigate])

  const handleAceptarPedido = (pedidoId) => {
    const token = localStorage.getItem('token')
    
    axios.put(`http://localhost:8080/api/pedidos/${pedidoId}/aceptar`, 1, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(() => {
      alert('Pedido aceptado exitosamente')
      setPedidoSeleccionado(null)
      cargarPedidosPendientes()
    })
    .catch(err => {
      console.error(err)
      alert('Error al aceptar el pedido')
    })
  }

  return (
    <div className="min-h-screen bg-gray-100">
      
      {/* Header */}
      <div className="bg-gray-800 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Panel de Repartidor</h1>
            <p className="text-gray-300 mt-1">Usuario: {nombreRepartidor}</p>
          </div>
          <button 
            onClick={() => {localStorage.removeItem('token'); navigate('/')}} 
            className="bg-white text-gray-800 px-6 py-2 rounded-lg font-bold hover:bg-gray-200 transition"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Pedidos Disponibles ({pedidosPendientes.length})
          </h2>
          <div className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold border border-gray-300">
            Actualización automática cada 5 segundos
          </div>
        </div>

        {/* Lista de Pedidos */}
        <div className="space-y-4">
          {pedidosPendientes.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-lg border-2 border-gray-200">
              <p className="text-gray-400 text-lg font-medium mb-2">No hay pedidos disponibles</p>
              <p className="text-gray-500 text-sm">Los nuevos pedidos aparecerán aquí automáticamente</p>
            </div>
          ) : (
            pedidosPendientes.map(pedido => (
              <div 
                key={pedido.id}
                className="bg-white p-6 rounded-lg shadow-md border-2 border-gray-300 hover:shadow-lg hover:border-gray-400 transition-all"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="bg-gray-800 text-white px-4 py-1 rounded text-sm font-bold">
                        NUEVO
                      </span>
                      <span className="text-gray-600 text-sm font-mono">Pedido #{pedido.id}</span>
                    </div>
                    
                    <p className="font-bold text-gray-900 text-xl mb-3">
                      Cliente: {pedido.cliente}
                    </p>
                    
                    <div className="bg-gray-50 p-4 rounded-lg mb-3 border border-gray-200">
                      <p className="text-sm text-gray-600 font-semibold mb-1">Dirección:</p>
                      <p className="text-gray-800 font-medium">{pedido.direccionEntrega || 'Sin dirección especificada'}</p>
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div>
                        <span className="font-semibold">Productos:</span> {pedido.detalles?.length || 0}
                      </div>
                      <div>
                        <span className="font-semibold">Pago:</span> {pedido.metodoPago || 'Efectivo'}
                      </div>
                      <div>
                        <span className="font-semibold">Fecha:</span> {new Date(pedido.fecha).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right ml-6">
                    <p className="text-gray-500 text-sm mb-1">Total</p>
                    <p className="text-4xl font-bold text-gray-900 mb-4">
                      MX${pedido.total?.toFixed(2)}
                    </p>
                    <button 
                      onClick={() => setPedidoSeleccionado(pedido)}
                      className="bg-gray-800 text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-900 transition"
                    >
                      Ver Detalles
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal de Detalles */}
      {pedidoSeleccionado && (
        <PedidoDetalleModal 
          pedido={pedidoSeleccionado}
          onClose={() => setPedidoSeleccionado(null)}
          onAceptar={handleAceptarPedido}
        />
      )}

    </div>
  )
}

export default RepartidorPanel