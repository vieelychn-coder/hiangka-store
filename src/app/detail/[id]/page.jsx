'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { productAPI } from '../../../lib/api';

export default function DetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productAPI.getById(params.id);
        setProduct(response.data.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setError('Produk tidak ditemukan');
        } else {
          setError('Gagal mengambil produk');
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

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
        <Link href="/products" style={styles.backButton}>Kembali ke Produk</Link>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Link href="/products" style={styles.backButton}>← Kembali</Link>
      <div style={styles.card}>
        <div style={styles.imagePlaceholder}>📸</div>
        <h1 style={styles.name}>{product.name}</h1>
        <p style={styles.code}>{product.code}</p>
        <p style={styles.price}>Rp {product.price.toLocaleString()}</p>
        <p style={styles.category}>Kategori: {product.category}</p>
        <p style={styles.stock}>Stok: {product.stock}</p>
        <p style={styles.rating}>⭐ {product.rating} ({product.sold} terjual)</p>
        <p style={styles.description}>{product.description}</p>
      </div>
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
  card: {
    background: '#1a1a2e',
    padding: '24px',
    borderRadius: '16px',
    maxWidth: '600px',
    margin: '0 auto',
    border: '1px solid #2a2a2a',
  },
  imagePlaceholder: {
    height: '200px',
    background: '#2a2a2a',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '64px',
    marginBottom: '16px',
  },
  name: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '4px',
  },
  code: {
    color: '#888',
    fontSize: '14px',
    marginBottom: '12px',
  },
  price: {
    color: '#c9a227',
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '12px',
  },
  category: {
    color: '#aaa',
    fontSize: '16px',
    marginBottom: '8px',
  },
  stock: {
    color: '#22c55e',
    fontSize: '16px',
    marginBottom: '8px',
  },
  rating: {
    color: '#f59e0b',
    fontSize: '16px',
    marginBottom: '12px',
  },
  description: {
    color: '#ccc',
    fontSize: '16px',
    lineHeight: '1.6',
    marginTop: '12px',
  },
  backButton: {
    display: 'inline-block',
    color: '#c9a227',
    textDecoration: 'none',
    marginBottom: '20px',
    fontSize: '16px',
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
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../../lib/supabase';

export default function DetailPage() {
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [userId, setUserId] = useState(null);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', params.id)
          .single();
        if (error) throw error;
        setProduct(data);
      } catch (err) {
        setError('Gagal mengambil produk');
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchProduct();

    // Cek user login
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setUserId(data.session.user.id);
    });
  }, [params.id]);

  const handleAddToCart = async () => {
    if (!userId) {
      alert('Silakan login dulu!');
      return;
    }
    setAdding(true);
    try {
      // Cek apakah produk sudah ada di cart
      const { data: existing } = await supabase
        .from('cart')
        .select('*')
        .eq('user_id', userId)
        .eq('product_id', product.id)
        .single();

      if (existing) {
        // Update quantity
        const { error } = await supabase
          .from('cart')
          .update({ quantity: existing.quantity + quantity })
          .eq('id', existing.id);
        if (error) throw error;
      } else {
        // Insert baru
        const { error } = await supabase
          .from('cart')
          .insert([{ user_id: userId, product_id: product.id, quantity }]);
        if (error) throw error;
      }
      alert('Berhasil ditambahkan ke keranjang!');
    } catch (err) {
      alert('Gagal menambahkan ke keranjang');
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <p style={styles.text}>Loading...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={styles.container}>
        <p style={styles.error}>{error || 'Produk tidak ditemukan'}</p>
        <Link href="/products" style={styles.backButton}>← Kembali ke Produk</Link>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Link href="/products" style={styles.backButton}>← Kembali</Link>
      <div style={styles.card}>
        <div style={styles.imagePlaceholder}>📸</div>
        <h1 style={styles.name}>{product.name}</h1>
        <p style={styles.code}>{product.code}</p>
        <p style={styles.price}>Rp {product.price.toLocaleString()}</p>
        <p style={styles.category}>Kategori: {product.category}</p>
        <p style={styles.stock}>Stok: {product.stock}</p>
        <p style={styles.rating}>⭐ {product.rating} ({product.sold} terjual)</p>
        <p style={styles.description}>{product.description}</p>
        <div style={styles.quantityControl}>
          <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={styles.qtyBtn}>-</button>
          <span style={styles.qtyText}>{quantity}</span>
          <button onClick={() => setQuantity(quantity + 1)} style={styles.qtyBtn}>+</button>
        </div>
        <button 
          onClick={handleAddToCart} 
          style={styles.addToCartBtn} 
          disabled={adding}
        >
          {adding ? 'Menambahkan...' : '🛒 Tambah ke Keranjang'}
        </button>
      </div>
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
  card: {
    background: '#1a1a2e',
    padding: '24px',
    borderRadius: '16px',
    maxWidth: '600px',
    margin: '0 auto',
    border: '1px solid #2a2a2a',
  },
  imagePlaceholder: {
    height: '200px',
    background: '#2a2a2a',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '64px',
    marginBottom: '16px',
  },
  name: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '4px',
  },
  code: {
    color: '#888',
    fontSize: '14px',
    marginBottom: '12px',
  },
  price: {
    color: '#c9a227',
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '12px',
  },
  category: {
    color: '#aaa',
    fontSize: '16px',
    marginBottom: '8px',
  },
  stock: {
    color: '#22c55e',
    fontSize: '16px',
    marginBottom: '8px',
  },
  rating: {
    color: '#f59e0b',
    fontSize: '16px',
    marginBottom: '12px',
  },
  description: {
    color: '#ccc',
    fontSize: '16px',
    lineHeight: '1.6',
    marginTop: '12px',
  },
  quantityControl: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginTop: '16px',
    justifyContent: 'center',
  },
  qtyBtn: {
    background: '#2a2a2a',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 16px',
    fontSize: '20px',
    cursor: 'pointer',
  },
  qtyText: {
    fontSize: '20px',
    fontWeight: 'bold',
    minWidth: '40px',
    textAlign: 'center',
  },
  addToCartBtn: {
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #c9a227, #e5484d)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '16px',
    width: '100%',
  },
  backButton: {
    display: 'inline-block',
    color: '#c9a227',
    textDecoration: 'none',
    marginBottom: '20px',
    fontSize: '16px',
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
