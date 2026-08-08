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
  const categories = ['Semua', 'Fashion', 'Accessories', 'Footwear', 'Art & Print', 'Lifestyle'];

  return (
    <div style={styles.container}>
      {/* HERO */}
      <div style={styles.hero}>
        <p style={styles.heroTag}>Limited Drop</p>
        <h1 style={styles.heroTitle}>Premium Streetwear</h1>
        <p style={styles.heroDesc}>Koleksi eksklusif dengan jumlah terbatas.</p>
        <Link href="/products" style={styles.heroBtn}>Belanja Sekarang</Link>
      </div>

      {/* KATEGORI */}
      <div style={styles.categoryWrapper}>
        {categories.map((cat) => (
          <Link
            key={cat}
            href={`/products?category=${cat === 'Semua' ? 'all' : cat}`}
            style={{
              ...styles.categoryChip,
              ...(cat === 'Semua' ? styles.categoryActive : {}),
            }}
          >
            {cat}
          </Link>
        ))}
      </div>

      {/* PRODUK */}
      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>Best Seller</h2>
        <Link href="/products" style={styles.sectionLink}>Lihat Semua →</Link>
      </div>

      <div style={styles.productGrid}>
        {products.map((product) => {
          const imageUrl = product.images?.[0] || product.image_url || product.thumbnail || '';
          return (
            <Link href={`/detail/${product.id}`} key={product.id} style={styles.productCard}>
              <div style={styles.imageWrapper}>
                {imageUrl ? (
                  <img src={imageUrl} alt={product.name} style={styles.productImage} />
                ) : (
                  <div style={styles.noImage}>No Image</div>
                )}
              </div>
              <div style={styles.productInfo}>
                <div style={styles.productName}>{product.name}</div>
                <div style={styles.productPrice}>Rp {product.price.toLocaleString('id-ID')}</div>
                <div style={styles.productRating}>★ {product.rating}</div>
                <div style={styles.productSold}>{product.sold} sold</div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '24px 16px',
    minHeight: '100vh',
    background: '#0a0a0a',
    color: '#fff',
  },
  hero: {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #2d1b69 50%, #c9a227 100%)',
    padding: '40px 24px',
    borderRadius: '16px',
    marginBottom: '24px',
    textAlign: 'center',
    color: '#fff',
  },
  heroTag: {
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '3px',
    opacity: 0.7,
  },
  heroTitle: {
    fontSize: '32px',
    fontWeight: '800',
    margin: '4px 0 8px',
  },
  heroDesc: {
    fontSize: '16px',
    opacity: 0.85,
    marginBottom: '16px',
  },
  heroBtn: {
    display: 'inline-block',
    padding: '10px 32px',
    background: 'linear-gradient(135deg, #c9a227, #e5484d)',
    color: '#fff',
    borderRadius: '999px',
    fontWeight: '600',
    fontSize: '14px',
    textDecoration: 'none',
  },
  categoryWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    padding: '8px 0 20px',
    overflowX: 'auto',
  },
  categoryChip: {
    padding: '8px 16px',
    borderRadius: '20px',
    border: '1px solid #333',
    background: 'transparent',
    color: '#ccc',
    fontSize: '13px',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'all 0.2s',
  },
  categoryActive: {
    background: '#c9a227',
    color: '#000',
    borderColor: '#c9a227',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#fff',
  },
  sectionLink: {
    color: '#c9a227',
    fontSize: '14px',
    fontWeight: '600',
    textDecoration: 'none',
  },
  productGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: '16px',
  },
  productCard: {
    background: '#1a1a2e',
    borderRadius: '12px',
    border: '1px solid #2a2a2a',
    overflow: 'hidden',
    textDecoration: 'none',
    color: 'inherit',
    transition: 'transform 0.2s',
  },
  imageWrapper: {
    width: '100%',
    aspectRatio: '1',
    background: '#111',
  },
  productImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  noImage: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#666',
    fontSize: '14px',
  },
  productInfo: {
    padding: '12px',
  },
  productName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#fff',
    marginBottom: '2px',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  productPrice: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#e5484d',
  },
  productRating: {
    fontSize: '13px',
    color: '#f59e0b',
  },
  productSold: {
    fontSize: '12px',
    color: '#888',
  },
};
