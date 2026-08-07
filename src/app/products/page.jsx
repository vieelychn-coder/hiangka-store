'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { productAPI } from '../../lib/api';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productAPI.getAll();
        setProducts(response.data.data || []);
      } catch (err) {
        setError('Gagal mengambil produk');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div style={styles.container}>
        <p style={styles.text}>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <p style={styles.error}>{error}</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🛍️ Semua Produk</h1>
      <div style={styles.grid}>
        {products.map((product) => (
          <Link href={`/detail/${product.id}`} key={product.id} style={styles.card}>
            <div style={styles.imagePlaceholder}>📸</div>
            <h3 style={styles.productName}>{product.name}</h3>
            <p style={styles.price}>Rp {product.price.toLocaleString()}</p>
            <p style={styles.category}>{product.category}</p>
            <p style={styles.stock}>Stok: {product.stock}</p>
          </Link>
        ))}
      </div>
      {products.length === 0 && (
        <p style={styles.text}>Belum ada produk.</p>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    padding: '20px',
    background: '#0a0a0a',
    color: '#fff',
  },
  title: {
    fontSize: '28px',
    marginBottom: '20px',
    textAlign: 'center',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  card: {
    background: '#1a1a2e',
    padding: '16px',
    borderRadius: '12px',
    textDecoration: 'none',
    color: '#fff',
    border: '1px solid #2a2a2a',
    transition: 'transform 0.2s',
  },
  imagePlaceholder: {
    height: '150px',
    background: '#2a2a2a',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '48px',
    marginBottom: '12px',
  },
  productName: {
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '4px',
  },
  price: {
    color: '#c9a227',
    fontWeight: 'bold',
    fontSize: '18px',
  },
  category: {
    color: '#888',
    fontSize: '14px',
  },
  stock: {
    color: '#22c55e',
    fontSize: '14px',
  },
  text: {
    textAlign: 'center',
    color: '#888',
  },
  error: {
    color: '#e5484d',
    textAlign: 'center',
  },
};
