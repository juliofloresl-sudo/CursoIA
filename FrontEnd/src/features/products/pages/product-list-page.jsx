import { useEffect, useMemo, useState } from 'react';
import api from '../../../services/api';

export default function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await api.get('/productos', { params: { busqueda: search, categoria: category } });
      setProducts(data.data || []);
    };

    fetchProducts();
  }, [search, category]);

  const filteredProducts = useMemo(() => products, [products]);

  return (
    <div className="page">
      <h1>Catálogo de productos</h1>
      <div className="toolbar">
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por SKU o nombre" />
        <select value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="">Todas las categorías</option>
          <option value="1">Categoría 1</option>
          <option value="2">Categoría 2</option>
        </select>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>SKU</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Stock</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product.id_producto}>
              <td>{product.sku}</td>
              <td>{product.nombre}</td>
              <td>${Number(product.precio_venta).toFixed(2)}</td>
              <td>{product.stock_actual}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
