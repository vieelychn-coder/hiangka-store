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

      <div className="container" style={{ paddingTop: '32px' }}>
        {/* HERO SECTION */}
        <div style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #2d1b69 50%, #c9a227 100%)',
          padding: '60px 40px',
          borderRadius: '20px',
          marginBottom: '32px',
          color: '#fff',
          textAlign: 'center',
          boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
        }}>
          <p style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '4px', opacity: 0.8 }}>
            Limited Drop
          </p>
          <h2 style={{ fontSize: '44px', fontWeight: '800', margin: '8px 0 12px' }}>
            Premium Streetwear Collection
          </h2>
          <p style={{ fontSize: '18px', opacity: 0.9, marginBottom: '24px' }}>
            Koleksi eksklusif dengan jumlah terbatas. Dapatkan sebelum habis.
          </p>
          <Link href="/products" className="btn-primary" style={{ padding: '14px 40px', fontSize: '16px' }}>
            Belanja Sekarang
          </Link>
        </div>

        {/* KATEGORI (CHIP) */}
        <div style={styles.chipContainer}>
          <Link href="/products?category=all" style={styles.chip}>Semua</Link>
          <Link href="/products?category=Fashion" style={styles.chip}>Fashion</Link>
          <Link href="/products?category=Accessories" style={styles.chip}>Accessories</Link>
          <Link href="/products?category=Footwear" style={styles.chip}>Shoes</Link>
          <Link href="/products?category=Art & Print" style={styles.chip}>Art</Link>
          <Link href="/products?category=Lifestyle" style={styles.chip}>Lifestyle</Link>
        </div>

        {/* PRODUK UNGGULAN */}
        <div className="section-title">
          <span style={{ color: 'var(--text)', fontSize: '24px', fontWeight: '700' }}>
            Best Seller
          </span>
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
                <div className="rating">★ {product.rating}</div>
                <div className="sold">{product.sold} sold</div>
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

const styles = {
  chipContainer: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    marginBottom: '32px',
  },
  chip: {
    padding: '8px 18px',
    background: 'var(--card)',
    borderRadius: '30px',
    fontSize: '13px',
    fontWeight: '500',
    color: 'var(--text)',
    border: '1px solid var(--border)',
    transition: 'all 0.3s',
    cursor: 'pointer',
    textDecoration: 'none',
  },
};
