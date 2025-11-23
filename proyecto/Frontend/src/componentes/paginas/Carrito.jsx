import { useEffect, useState } from "react";
import Titulo from "../atomos/Titulo";
import Boton from "../atomos/Boton";
import { API_BASE_URL } from "../config"; 

export default function Carrito() {
  const [carrito, setCarrito] = useState([]);
  const [cargando, setCargando] = useState(false);

  // Obtener carrito desde la BD
  const obtenerCarrito = async () => {
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
    
    if (!usuarioActivo) {
      // Usuario no logueado - usar carrito local
      const carritoLocal = JSON.parse(localStorage.getItem("carrito_anonimo") || "[]");
      setCarrito(carritoLocal);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/carrito`, { 
        headers: {
          'usuario-id': usuarioActivo.id.toString()
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCarrito(data.items || []);
      }
    } catch (error) {
      console.error("Error obteniendo carrito:", error);
    }
  };

  useEffect(() => {
    obtenerCarrito();
  }, []);

  //  Eliminar item del carrito
  const eliminarItem = async (itemId) => {
    setCargando(true);
    
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
    
    if (!usuarioActivo) {
      // Usuario no logueado - eliminar del localStorage
      const nuevoCarrito = carrito.filter((item) => item.item_id !== itemId);
      setCarrito(nuevoCarrito);
      localStorage.setItem("carrito_anonimo", JSON.stringify(nuevoCarrito));
      setCargando(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/carrito/${itemId}`, { 
        method: 'DELETE',
        headers: {
          'usuario-id': usuarioActivo.id.toString()
        }
      });

      if (response.ok) {
        await obtenerCarrito(); // Recargar carrito
      }
    } catch (error) {
      console.error("Error eliminando item:", error);
      alert("❌ Error al eliminar el producto");
    } finally {
      setCargando(false);
    }
  };

  const vaciarCarrito = async () => {
    if (!confirm("¿Vaciar todo el carrito?")) return;
    
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
    
    if (!usuarioActivo) {
      // Usuario no logueado - vaciar localStorage
      setCarrito([]);
      localStorage.setItem("carrito_anonimo", "[]");
      return;
    }

    try {
      // Eliminar cada item individualmente 
      for (const item of carrito) {
        await fetch(`${API_BASE_URL}/api/carrito/${item.item_id}`, { 
          method: 'DELETE',
          headers: {
            'usuario-id': usuarioActivo.id.toString()
          }
        });
      }
      
      await obtenerCarrito(); // Recargar carrito vacío
      alert(" Carrito vaciado");
    } catch (error) {
      console.error("Error vaciando carrito:", error);
      alert("❌ Error al vaciar el carrito");
    }
  };

  const total = carrito.reduce((acc, item) => acc + (parseFloat(item.precio) * (item.cantidad || 1)), 0);

  // Pagar compra - Crear pedido en BD
  const pagarCompra = async () => {
    if (carrito.length === 0) return alert("Tu carrito está vacío.");

    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
    if (!usuarioActivo) return alert("⚠️ Debes iniciar sesión para pagar.");

    setCargando(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/pedidos`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'usuario-id': usuarioActivo.id.toString()
        }
      });

      if (response.ok) {
        alert("✅ Compra realizada correctamente.");
        await obtenerCarrito(); // Recargar carrito vacío
      } else {
        const error = await response.json();
        throw new Error(error.error);
      }
    } catch (error) {
      alert(`❌ Error al procesar la compra: ${error.message}`);
    } finally {
      setCargando(false);
    }
  };

  return (
    <section className="carrito">
      <Titulo texto="🛒 Carrito de compras" />

      {carrito.length === 0 ? (
        <p>No tienes productos en el carrito.</p>
      ) : (
        <>
          <div className="lista-carrito">
            {carrito.map((item) => (
              <article key={item.item_id} className="tarjeta-carrito">
                <img src={item.imagen} alt={item.nombre} />
                <div className="info">
                  <h4>{item.nombre}</h4>
                  <p>
                    ${parseFloat(item.precio).toLocaleString("es-CL")} × {item.cantidad || 1}
                  </p>
                  <p><strong>Subtotal: ${(parseFloat(item.precio) * (item.cantidad || 1)).toLocaleString("es-CL")}</strong></p>
                  <Boton 
                    texto={cargando ? "Eliminando..." : "Eliminar"} 
                    onClick={() => eliminarItem(item.item_id)} 
                    disabled={cargando}
                  />
                </div>
              </article>
            ))}
          </div>

          <div className="resumen-carrito">
            <h3>Total: ${total.toLocaleString("es-CL")}</h3>
            <Boton texto="Vaciar carrito" onClick={vaciarCarrito} disabled={cargando} />
            <Boton texto={cargando ? "Procesando..." : "Pagar"} onClick={pagarCompra} disabled={cargando} />
          </div>
        </>
      )}
    </section>
  );
}