'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }
      setUserId(session.user.id);
      fetchCart(session.user.id);
    };
    getUser();
  }, []);

  const fetchCart = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('cart')
        .select('*, products(*)')
        .eq('user_id', userId);
      if (error) throw error;
      setCart(data || []);
    } catch (err) {
      setError('Gagal mengambil keranjang');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    try {
      const { error } = await supabase
        .from('cart')
        .update({ quantity })
        .eq('user_id', userId)
        .eq('product_id', productId);
      if (error) throw error;
      await fetchCart(userId);
    } catch (err) {
      alert('Gagal update keranjang');
    }
  };

  const handleRemoveItem = async (productId) => {
    if (!confirm('Hapus item ini?')) return;
    try {
      const { error } = await supabase
        .from('cart')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', productId);
      if (error) throw error;
      await fetchCart(userId);
    } catch (err) {
      alert('Gagal hapus item');
    }
  };

  const handleClearCart = async () => {
    if (!confirm('Kosongkan keranjang?')) return;
    try {
      const { error } = await supabase
        .from('cart')
        .delete()
        .eq('user_id', userId);
      if (error) throw error;
      await fetchCart(userId);
    } catch (err) {
      alert('Gagal kosongkan keranjang');
    }
  };

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + (item.products.price * item.quantity), 0);
  };

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

  if (cart.length === 0) {
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>Keranjang Kosong</h1>
        <p style={styles.text}>Yuk, belanja produk HIANKA sekarang!</p>
        <Link href="/products" style={styles.button}>Belanja Sekarang</Link>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Keranjang</h1>
      <div style={styles.cartList}>
        {cart.map((item) => (
          <div key={item.id} style={styles.cartItem}>
            <div style={styles.itemInfo}>
              <h3>{item.products.name}</h3>
              <p style={styles.price}>Rp {item.products.price.toLocaleString()}</p>
            </div>
            <div style={styles.quantityControl}>
              <button onClick={() => handleUpdateQuantity(item.product_id, item.quantity - 1)} style={styles.qtyBtn}>-</button>
              <span style={styles.qtyText}>{item.quantity}</span>
              <button onClick={() => handleUpdateQuantity(item.product_id, item.quantity + 1)} style={styles.qtyBtn}>+</button>
            </div>
            <p style={styles.subtotal}>Rp {(item.products.price * item.quantity).toLocaleString()}</p>
            <button onClick={() => handleRemoveItem(item.product_id)} style={styles.removeBtn}>🗑️</button>
          </div>
        ))}
      </div>
      <div style={styles.summary}>
        <h2>Total: Rp {getTotal().toLocaleString()}</h2>
        <button style={styles.checkoutBtn} onClick={() => router.push('/checkout')}>Checkout</button>
        <button style={styles.clearBtn} onClick={handleClearCart}>Kosongkan</button>
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
  title: {
    fontSize: '28px',
    marginBottom: '20px',
    textAlign: 'center',
  },
  cartList: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  cartItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: '#1a1a2e',
    padding: '16px',
    borderRadius: '12px',
    marginBottom: '12px',
    border: '1px solid #2a2a2a',
    flexWrap: 'wrap',
    gap: '12px',
  },
  itemInfo: {
    flex: 2,
    minWidth: '150px',
  },
  price: {
    color: '#c9a227',
    fontWeight: 'bold',
  },
  quantityControl: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flex: 1,
    justifyContent: 'center',
  },
  qtyBtn: {
    background: '#2a2a2a',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    padding: '4px 12px',
    fontSize: '18px',
    cursor: 'pointer',
  },
  qtyText: {
    fontSize: '16px',
    fontWeight: 'bold',
  },
  subtotal: {
    flex: 1,
    textAlign: 'right',
    fontWeight: 'bold',
    color: '#c9a227',
    minWidth: '100px',
  },
  removeBtn: {
    background: 'none',
    border: 'none',
    color: '#e5484d',
    fontSize: '20px',
    cursor: 'pointer',
    marginLeft: '12px',
  },
  summary: {
    maxWidth: '800px',
    margin: '20px auto 0',
    padding: '20px',
    background: '#1a1a2e',
    borderRadius: '12px',
    border: '1px solid #2a2a2a',
    textAlign: 'center',
  },
  checkoutBtn: {
    padding: '12px 40px',
    background: 'linear-gradient(135deg, #c9a227, #e5484d)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '12px',
  },
  clearBtn: {
    padding: '12px 30px',
    background: '#e5484d',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '12px',
    marginLeft: '12px',
  },
  button: {
    display: 'inline-block',
    padding: '12px 30px',
    background: 'linear-gradient(135deg, #c9a227, #e5484d)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    textDecoration: 'none',
    textAlign: 'center',
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
