import Navbar from '../../components/Navbar';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';

async function getProducts(category) {
  let query = supabase.from('products').select('*');
  if (category && category !== 'all') {
    query = query.eq('category', category);
  }
  const { data, error } = await query;
  if (error) return [];
  return data;
}

function getProductImage(id) {
  return `https://picsum.photos/seed/${id}/300/300`;
}

export default async function ProductsPage({ searchParams }) {
  const category = searchParams?.category || 'all';
  const products = await getProducts(category);

  const categories = ['all', 'Fashion', 'Accessories', 'Footwear', 'Art & Print', 'Lifestyle'];

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Navbar />
      <div className="container" style={{ paddingTop: '24px' }}>
        {/* Kategori Filter */}
        <div className="category-grid">
          {categories.map((cat) => (
            <Link 
              key={cat} 
              href={`/products?category=${cat}`}
              className={`category-item ${category === cat ? 'active' : ''}`}
            >
              {cat === 'all' ? 'Semua' : cat}
            </Link>
          ))}
        </div>

        {/* Produk */}
        <div className="section-title">
          <span>{category === 'all' ? 'Semua Produk' : category}</span>
          <span style={{ fontSize: '14px', color: '#888' }}>{products.length} produk</span>
        </div>

        <div className="product-grid">
          {products.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#888', gridColumn: '1 / -1', padding: '40px' }}>
              Belum ada produk di kategori ini.
            </p>
          ) : (
            products.map((product) => (
              <Link href={`/detail/${product.id}`} key={product.id} className="product-card">
                <img 
                  src={getProductImage(product.id)} 
                  alt={product.name}
                  className="product-image"
                />
                <div className="info">
                  <div className="name">{product.name}</div>
                  <div className="price">Rp {product.price.toLocaleString('id-ID')}</div>
                  <div className="rating">⭐ {product.rating}</div>
                  <div className="sold">{product.sold} terjual</div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="footer">
        <div className="container">
          <div className="brand">HIANKA</div>
          <p>Premium Limited Drop Marketplace</p>
          <p style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
            Designed & Developed by Viee Lychn
          </p>
        </div>
      </div>
    </div>
  );
}
