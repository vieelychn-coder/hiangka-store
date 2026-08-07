import Navbar from '../components/Navbar';
import Link from 'next/link';
import { supabase } from '../lib/supabase';

async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .limit(8);
  if (error) return [];
  return data;
}

function getProductImage(id) {
  return `https://picsum.photos/seed/${id}/300/300`;
}

export default async function Home() {
  const products = await getProducts();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />

      <div className="container" style={{ paddingTop: '24px' }}>
        {/* Hero Banner */}
        <div className="banner" style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #2d1b69 50%, #c9a227 100%)',
          padding: '60px 40px',
          borderRadius: '20px',
          marginBottom: '30px',
          color: '#fff',
          textAlign: 'center',
          boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
        }}>
          <h2 style={{ fontSize: '42px', fontWeight: '800', marginBottom: '8px' }}>
            Flash Sale 50%
          </h2>
          <p style={{ fontSize: '18px', opacity: 0.9, marginBottom: '20px' }}>
            Dapatkan produk favoritmu dengan harga spesial!
          </p>
          <Link href="/products" className="btn-primary">Belanja Sekarang</Link>
        </div>

        {/* Kategori */}
        <div className="category-grid">
          {['Fashion', 'Accessories', 'Footwear', 'Art & Print', 'Lifestyle'].map((cat) => (
            <Link key={cat} href={`/products?category=${cat}`} className="category-item">
              {cat}
            </Link>
          ))}
        </div>

        {/* Produk Unggulan */}
        <div className="section-title">
          <span style={{ color: 'var(--text)' }}>🔥 Produk Unggulan</span>
          <Link href="/products" style={{ color: '#c9a227', fontWeight: '600' }}>Lihat Semua →</Link>
        </div>

        <div className="product-grid">
          {products.map((product) => (
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
          ))}
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
