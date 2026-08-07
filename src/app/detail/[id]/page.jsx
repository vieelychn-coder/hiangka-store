'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '../../../lib/supabase';
import Navbar from '../../../components/Navbar';

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

    // Ambil user ID dari session
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setUserId(data.session.user.id);
        console.log('User ID:', data.session.user.id);
      } else {
        console.log('User not logged in');
      }
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
      console.error('Error adding to cart:', err);
      alert('Gagal menambahkan ke keranjang: ' + err.message);
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
        <Navbar />
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text)' }}>Loading...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
        <Navbar />
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text)' }}>
          <p style={{ color: '#e5484d' }}>{error || 'Produk tidak ditemukan'}</p>
          <Link href="/products" style={{ color: '#c9a227', textDecoration: 'none' }}>← Kembali ke Produk</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <div style={styles.container}>
        <Link href="/products" style={styles.backButton}>← Kembali</Link>
        
        <div style={styles.card}>
          {/* Gambar */}
          <div style={styles.imageWrapper}>
            <Image 
              src={getProductImage(product.id)} 
              alt={product.name}
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>

          {/* Info Produk */}
          <div style={styles.info}>
            <h1 style={styles.name}>{product.name}</h1>
            <p style={styles.code}>{product.code}</p>
            <p style={styles.price}>Rp {product.price.toLocaleString('id-ID')}</p>
            
            <div style={styles.meta}>
              <span style={styles.category}>Kategori: {product.category}</span>
              <span style={styles.stock}>Stok: {product.stock}</span>
              <span style={styles.rating}>★ {product.rating} ({product.sold} terjual)</span>
            </div>

            <p style={styles.description}>{product.description}</p>

            {/* Quantity & Add to Cart */}
            <div style={styles.action}>
              <div style={styles.quantity}>
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                  style={styles.qtyBtn}
                >
                  −
                </button>
                <span style={styles.qtyText}>{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)} 
                  style={styles.qtyBtn}
                >
                  +
                </button>
              </div>
              <button 
                onClick={handleAddToCart} 
                style={{
                  ...styles.addBtn,
                  opacity: adding ? 0.7 : 1,
                  cursor: adding ? 'default' : 'pointer',
                }}
                disabled={adding}
              >
                {adding ? 'Menambahkan...' : 'Tambah ke Keranjang'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '24px 16px',
  },
  backButton: {
    display: 'inline-block',
    color: '#c9a227',
    textDecoration: 'none',
    marginBottom: '20px',
    fontSize: '15px',
    fontWeight: '500',
  },
  card: {
    background: 'var(--card)',
    borderRadius: '16px',
    border: '1px solid var(--border)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'row',
    gap: '0',
  },
  imageWrapper: {
    position: 'relative',
    width: '50%',
    aspectRatio: '1',
    background: 'var(--bg)',
    flexShrink: 0,
  },
  info: {
    padding: '32px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  name: {
    fontSize: '28px',
    fontWeight: '700',
    color: 'var(--text)',
    margin: 0,
  },
  code: {
    fontSize: '14px',
    color: '#888',
    margin: 0,
  },
  price: {
    fontSize: '32px',
    fontWeight: '800',
    color: '#e5484d',
    margin: 0,
  },
  meta: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
    fontSize: '14px',
    color: 'var(--text)',
    marginTop: '4px',
  },
  category: {
    color: '#888',
  },
  stock: {
    color: '#22c55e',
  },
  rating: {
    color: '#f59e0b',
  },
  description: {
    fontSize: '15px',
    lineHeight: '1.7',
    color: 'var(--text)',
    opacity: 0.8,
    marginTop: '4px',
  },
  action: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    marginTop: '16px',
    flexWrap: 'wrap',
  },
  quantity: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: 'var(--bg)',
    borderRadius: '12px',
    padding: '4px',
  },
  qtyBtn: {
    width: '40px',
    height: '40px',
    border: 'none',
    borderRadius: '8px',
    background: 'transparent',
    color: 'var(--text)',
    fontSize: '22px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    fontSize: '18px',
    fontWeight: '600',
    color: 'var(--text)',
    minWidth: '32px',
    textAlign: 'center',
  },
  addBtn: {
    padding: '14px 40px',
    background: 'linear-gradient(135deg, #c9a227, #e5484d)',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
    flex: 1,
    minWidth: '200px',
  },
};
