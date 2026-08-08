import Link from 'next/link';
import { supabase } from '../lib/supabase';

async function getProducts(category) {
  let query = supabase.from('products').select('*');
  if (category && category !== 'all') {
    query = query.eq('category', category);
  }
  const { data, error } = await query;
  if (error) return [];
  return data;
}

export default async function ProductsPage({ searchParams }) {
  const category = searchParams?.category || 'all';
  const products = await getProducts(category);

  const categories = ['all', 'Fashion', 'Accessories', 'Footwear', 'Art & Print', 'Lifestyle'];

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Semua Produk</h1>

      <div style={styles.categoryWrapper}>
        {categories.map((cat) => (
          <Link
            key={cat}
            href={`/products?category=${cat}`}
            style={{
              ...styles.categoryChip,
              ...(cat === category ? styles.categoryActive : {}),
            }}
          >
            {cat === 'all' ? 'Semua' : cat}
          </Link>
        ))}
      </div>

      <div style={styles.productGrid}>
        {products.length === 0 ? (
          <p style={styles.empty}>Belum ada produk di kategori ini.</p>
        ) : (
          products.map((product) => {
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
          })
        )}
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
  title: {
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '20px',
  },
  categoryWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '24px',
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
    textDecoration: 'none',
    transition: 'all 0.2s',
  },
  categoryActive: {
    background: '#c9a227',
    color: '#000',
    borderColor: '#c9a227',
  },
  productGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
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
  empty: {
    textAlign: 'center',
    color: '#888',
    padding: '40px 0',
  },
};
