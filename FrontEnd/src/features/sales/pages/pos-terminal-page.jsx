import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Plus, Trash2 } from 'lucide-react';
import DiscountModal from '../components/discount-modal';
import ReturnManager from '../components/return-manager';

const initialProducts = [
  { id: 1, name: 'Martillo', sku: 'SKU-001', price: 150, stock: 5 },
  { id: 2, name: 'Destornillador', sku: 'SKU-002', price: 90, stock: 0 },
];

export default function PosTerminalPage() {
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [discountOpen, setDiscountOpen] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (!toast) {
      return;
    }
    const timer = window.setTimeout(() => setToast(''), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const filteredProducts = useMemo(() => initialProducts.filter((product) => product.sku.includes(search) || product.name.toLowerCase().includes(search.toLowerCase())), [search]);

  const addToCart = (product) => {
    if (product.stock <= 0) {
      setToast('Producto sin existencia');
      return;
    }

    setCart((current) => {
      const exists = current.find((item) => item.id === product.id);
      if (exists) {
        return current.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
      }
      return [...current, { ...product, quantity: 1 }];
    });
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = subtotal * 0.15;
  const total = subtotal - discountAmount;

  return (
    <div className="pos-page">
      <div className="pos-main">
        <div className="card">
          <h1>Punto de Venta</h1>
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por SKU o nombre" autoFocus />
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <button key={product.id} type="button" className="product-card" onClick={() => addToCart(product)}>
                <strong>{product.name}</strong>
                <span>{product.sku}</span>
                <span>${product.price}</span>
                <span className={product.stock > 0 ? 'stock-ok' : 'stock-low'}>{product.stock > 0 ? `${product.stock} disponibles` : 'Sin stock'}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="card cart-card">
          <h2>Carrito</h2>
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <div>
                <strong>{item.name}</strong>
                <p>{item.quantity} x ${item.price}</p>
              </div>
              <button type="button" onClick={() => setCart((current) => current.filter((entry) => entry.id !== item.id))}>
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <div className="totals">
            <div><span>Subtotal</span><strong>${subtotal.toFixed(2)}</strong></div>
            <div><span>Descuento</span><strong>${discountAmount.toFixed(2)}</strong></div>
            <div><span>Total</span><strong>${total.toFixed(2)}</strong></div>
          </div>
          <div className="actions-row">
            <button type="button" onClick={() => setDiscountOpen(true)}>Aplicar descuento</button>
            <button type="button" className="secondary" onClick={() => setCart([])}>Limpiar</button>
          </div>
        </div>
      </div>

      <div className="pos-secondary">
        <ReturnManager />
      </div>

      {toast ? (
        <div className="toast warning">
          <AlertTriangle size={16} />
          <span>{toast}</span>
        </div>
      ) : null}

      <DiscountModal isOpen={discountOpen} onClose={() => setDiscountOpen(false)} onConfirm={() => setDiscountOpen(false)} />
    </div>
  );
}
