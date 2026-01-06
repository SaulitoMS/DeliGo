import { createContext, useState, useContext, useEffect } from 'react'

const CartContext = createContext()

export const useCart = () => useContext(CartContext)

export const CartProvider = ({ children }) => {
  const [carrito, setCarrito] = useState(() => {
    const saved = localStorage.getItem('carrito')
    return saved ? JSON.parse(saved) : []
  })
  
  const [isCartOpen, setIsCartOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito))
  }, [carrito])

  const agregarAlCarrito = (plato, cantidad = 1, opcionesSeleccionadas = []) => {
    const precioExtras = opcionesSeleccionadas.reduce((acc, opt) => acc + opt.precioExtra, 0)
    const precioFinalUnitario = plato.precio + precioExtras
    // Creamos ID único basado en ID del plato + IDs de las opciones
    const comboId = `${plato.id}-${opcionesSeleccionadas.map(o => o.id).sort().join('-')}`

    setCarrito((prev) => {
      const existe = prev.find((item) => item.comboId === comboId)
      if (existe) {
        return prev.map((item) =>
          item.comboId === comboId ? { ...item, cantidad: item.cantidad + cantidad } : item
        )
      } else {
        return [...prev, { 
            ...plato, 
            comboId, 
            cantidad, 
            precio: precioFinalUnitario, 
            opciones: opcionesSeleccionadas 
        }]
      }
    })
    setIsCartOpen(true)
  }

  // --- NUEVA FUNCIÓN: ELIMINAR ITEM ESPECÍFICO ---
  const eliminarItem = (comboId) => {
    setCarrito((prev) => prev.filter(item => item.comboId !== comboId))
  }

  const limpiarCarrito = () => setCarrito([])
  const toggleCart = () => setIsCartOpen(!isCartOpen)

  // Calcular total global
  const total = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0)

  return (
    <CartContext.Provider value={{ 
        carrito, 
        total, 
        isCartOpen, 
        agregarAlCarrito, 
        eliminarItem, // <--- EXPORTAR AQUÍ
        limpiarCarrito, 
        toggleCart 
    }}>
      {children}
    </CartContext.Provider>
  )
}