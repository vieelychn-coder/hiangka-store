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

export default async function Home() {
  const products = await getProducts();

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Navbar />

      <div className="container" style={{ paddingTop: '24px' }}>
        {/* Banner */}
        <div className="banner">
          <h2>Flash Sale 50%</h2>
          <p>Dapatkan produk favoritmu dengan harga spesial!</p>
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
          <span>Produk Unggulan</span>
          <Link href="/products">Lihat Semua</Link>
        </div>

        <div className="product-grid">
          {products.map((product) => (
            <Link href={`/detail/${product.id}`} key={product.id} className="product-card">
              <div className="image">Logo</div>
              <div className="info">
                <div className="name">{product.name}</div>
                <div className="price">Rp {product.price.toLocaleString()}</div>
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
