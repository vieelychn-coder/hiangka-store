'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../../lib/supabase';

function getProductImage(id) {
  return `https://picsum.photos/seed/${id}/600/600`;
}

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
      const { data: existing } = await supabase
        .from('cart')
        .select('*')
        .eq('user_id', userId)
        .eq('product_id', product.id)
        .single();

      if (existing) {
        const { error } = await supabase
          .from('cart')
          .update({ quantity: existing.quantity + quantity })
          .eq('id', existing.id);
        if (error) throw error;
      } else {
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
        <img
          src={getProductImage(product.id)}
          alt={product.name}
          style={styles.detailImage}
        />
        <h1 style={styles.name}>{product.name}</h1>
        <p style={styles.code}>{product.code}</p>
        <p style={styles.price}>Rp {product.price.toLocaleString('id-ID')}</p>
        <p style={styles.category}>Kategori: {product.category}</p>
        <p style={styles.stock}>Stok: {product.stock}</p>
        <p style={styles.rating}>★ {product.rating} ({product.sold} terjual)</p>
        <p style={styles.description}>{product.description}</p>
        <div style={styles.quantityControl}>
          <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={styles.qtyBtn}>−</button>
          <span style={styles.qtyText}>{quantity}</span>
          <button onClick={() => setQuantity(quantity + 1)} style={styles.qtyBtn}>+</button>
        </div>
        <button
          onClick={handleAddToCart}
          style={styles.addBtn}
          disabled={adding}
        >
          {adding ? 'Menambahkan...' : 'Tambah ke Keranjang'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '24px 16px',
    minHeight: '100vh',
    background: '#0a0a0a',
    color: '#fff',
  },
  backButton: {
    display: 'inline-block',
    color: '#c9a227',
    textDecoration: 'none',
    marginBottom: '20px',
    fontSize: '15px',
  },
  card: {
    background: '#1a1a2e',
    padding: '24px',
    borderRadius: '16px',
    border: '1px solid #2a2a2a',
  },
  detailImage: {
    width: '100%',
    height: '300px',
    objectFit: 'cover',
    borderRadius: '12px',
    marginBottom: '16px',
    background: '#111',
  },
  name: {
    fontSize: '24px',
    fontWeight: '700',
    marginBottom: '4px',
  },
  code: {
    color: '#888',
    fontSize: '14px',
    marginBottom: '12px',
  },
  price: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#e5484d',
    marginBottom: '12px',
  },
  category: {
    color: '#888',
    fontSize: '15px',
    marginBottom: '6px',
  },
  stock: {
    color: '#22c55e',
    fontSize: '15px',
    marginBottom: '6px',
  },
  rating: {
    color: '#f59e0b',
    fontSize: '15px',
    marginBottom: '12px',
  },
  description: {
    color: '#aaa',
    fontSize: '15px',
    lineHeight: '1.7',
    marginTop: '8px',
  },
  quantityControl: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginTop: '16px',
    justifyContent: 'center',
  },
  qtyBtn: {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    border: '1px solid #333',
    background: 'transparent',
    color: '#fff',
    fontSize: '22px',
    cursor: 'pointer',
  },
  qtyText: {
    fontSize: '20px',
    fontWeight: '600',
    minWidth: '40px',
    textAlign: 'center',
  },
  addBtn: {
    padding: '14px 24px',
    width: '100%',
    background: 'linear-gradient(135deg, #c9a227, #e5484d)',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '16px',
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
