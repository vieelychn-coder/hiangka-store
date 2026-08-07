'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import Navbar from '../../components/Navbar';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [stats, setStats] = useState({ orders: 0, wishlist: 0 });

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }
      setUser(session.user);
      await Promise.all([
        fetchOrders(session.user.id),
        fetchWishlist(session.user.id),
      ]);
      setLoading(false);
    };
    getUser();
  }, []);

  const fetchOrders = async (userId) => {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    setOrders(data || []);
    setStats(prev => ({ ...prev, orders: data?.length || 0 }));
  };

  const fetchWishlist = async (userId) => {
    const { data } = await supabase
      .from('wishlist')
      .select('*, products(*)')
      .eq('user_id', userId);
    setWishlist(data || []);
    setStats(prev => ({ ...prev, wishlist: data?.length || 0 }));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const handleRemoveWishlist = async (productId) => {
    if (!confirm('Hapus dari wishlist?')) return;
    const { error } = await supabase
      .from('wishlist')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId);
    if (!error) {
      await fetchWishlist(user.id);
    }
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <Navbar />
        <div style={styles.loading}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        {/* Sidebar */}
        <div style={styles.sidebar}>
          <div style={styles.profileCard}>
            <div style={styles.avatar}>
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <h3 style={styles.userName}>{user?.email?.split('@')[0]}</h3>
            <p style={styles.userEmail}>{user?.email}</p>
          </div>
          <nav style={styles.nav}>
            <button 
              onClick={() => setActiveTab('profile')} 
              style={{
                ...styles.navItem,
                ...(activeTab === 'profile' ? styles.navItemActive : {})
              }}
            >
              Profile
            </button>
            <button 
              onClick={() => setActiveTab('orders')} 
              style={{
                ...styles.navItem,
                ...(activeTab === 'orders' ? styles.navItemActive : {})
              }}
            >
              Orders ({stats.orders})
            </button>
            <button 
              onClick={() => setActiveTab('wishlist')} 
              style={{
                ...styles.navItem,
                ...(activeTab === 'wishlist' ? styles.navItemActive : {})
              }}
            >
              Wishlist ({stats.wishlist})
            </button>
            <button onClick={handleLogout} style={styles.navLogout}>
              Logout
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div style={styles.main}>
          {activeTab === 'profile' && (
            <div>
              <h2 style={styles.title}>My Profile</h2>
              <div style={styles.card}>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>User ID:</strong> {user?.id}</p>
                <p><strong>Joined:</strong> {new Date(user?.created_at).toLocaleDateString('en-US')}</p>
                <div style={styles.statsGrid}>
                  <div style={styles.statCard}>
                    <div style={styles.statNumber}>{stats.orders}</div>
                    <div style={styles.statLabel}>Orders</div>
                  </div>
                  <div style={styles.statCard}>
                    <div style={styles.statNumber}>{stats.wishlist}</div>
                    <div style={styles.statLabel}>Wishlist</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <h2 style={styles.title}>Order History</h2>
              {orders.length === 0 ? (
                <div style={styles.empty}>No orders yet. Start shopping!</div>
              ) : (
                orders.map((order) => (
                  <div key={order.id} style={styles.orderCard}>
                    <div style={styles.orderHeader}>
                      <span style={styles.orderId}>#{order.id.slice(0,8)}</span>
                      <span style={{
                        ...styles.orderStatus,
                        ...(order.status === 'delivered' ? styles.statusDelivered : styles.statusPending)
                      }}>
                        {order.status}
                      </span>
                    </div>
                    <div style={styles.orderBody}>
                      <p>Total: Rp {order.total.toLocaleString('id-ID')}</p>
                      <p style={styles.orderDate}>{new Date(order.created_at).toLocaleDateString('en-US')}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'wishlist' && (
            <div>
              <h2 style={styles.title}>My Wishlist</h2>
              {wishlist.length === 0 ? (
                <div style={styles.empty}>Wishlist is empty.</div>
              ) : (
                <div style={styles.wishlistGrid}>
                  {wishlist.map((item) => (
                    <div key={item.id} style={styles.wishlistCard}>
                      <img 
                        src={`https://picsum.photos/seed/${item.product_id}/200/200`}
                        alt={item.products.name}
                        style={styles.wishlistImage}
                      />
                      <div style={styles.wishlistInfo}>
                        <h4>{item.products.name}</h4>
                        <p style={styles.price}>Rp {item.products.price.toLocaleString('id-ID')}</p>
                        <button 
                          onClick={() => handleRemoveWishlist(item.product_id)}
                          style={styles.removeWishlist}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'var(--bg)',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '24px 16px',
    display: 'flex',
    gap: '24px',
    alignItems: 'flex-start',
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    color: 'var(--text)',
  },
  sidebar: {
    width: '280px',
    flexShrink: 0,
    background: 'var(--card)',
    borderRadius: '16px',
    border: '1px solid var(--border)',
    padding: '24px',
    position: 'sticky',
    top: '80px',
  },
  profileCard: {
    textAlign: 'center',
    paddingBottom: '20px',
    borderBottom: '1px solid var(--border)',
    marginBottom: '20px',
  },
  avatar: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #c9a227, #e5484d)',
    color: '#fff',
    fontSize: '28px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 12px',
  },
  userName: {
    color: 'var(--text)',
    fontSize: '18px',
    fontWeight: '700',
  },
  userEmail: {
    color: '#888',
    fontSize: '14px',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  navItem: {
    padding: '10px 16px',
    borderRadius: '8px',
    color: 'var(--text)',
    background: 'transparent',
    border: 'none',
    textAlign: 'left',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '500',
    transition: 'background 0.2s',
    width: '100%',
  },
  navItemActive: {
    background: 'linear-gradient(135deg, #c9a227, #e5484d)',
    color: '#fff',
  },
  navLogout: {
    padding: '10px 16px',
    borderRadius: '8px',
    color: '#e5484d',
    background: 'transparent',
    border: '1px solid #e5484d',
    textAlign: 'left',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '500',
    marginTop: '12px',
    width: '100%',
  },
  main: {
    flex: 1,
  },
  title: {
    color: 'var(--text)',
    fontSize: '24px',
    fontWeight: '700',
    marginBottom: '20px',
  },
  card: {
    background: 'var(--card)',
    padding: '24px',
    borderRadius: '12px',
    border: '1px solid var(--border)',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginTop: '16px',
  },
  statCard: {
    background: 'var(--bg)',
    padding: '16px',
    borderRadius: '8px',
    textAlign: 'center',
  },
  statNumber: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#c9a227',
  },
  statLabel: {
    fontSize: '14px',
    color: '#888',
  },
  empty: {
    textAlign: 'center',
    padding: '40px',
    color: '#888',
    background: 'var(--card)',
    borderRadius: '12px',
    border: '1px solid var(--border)',
  },
  orderCard: {
    background: 'var(--card)',
    padding: '16px',
    borderRadius: '12px',
    border: '1px solid var(--border)',
    marginBottom: '12px',
  },
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  orderId: {
    fontWeight: '600',
    color: 'var(--text)',
  },
  orderStatus: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
  },
  statusPending: {
    background: '#fef3c7',
    color: '#b45309',
  },
  statusDelivered: {
    background: '#d1fae5',
    color: '#065f46',
  },
  orderBody: {
    display: 'flex',
    justifyContent: 'space-between',
    color: '#888',
    fontSize: '14px',
  },
  orderDate: {
    color: '#888',
  },
  wishlistGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: '16px',
  },
  wishlistCard: {
    background: 'var(--card)',
    borderRadius: '12px',
    border: '1px solid var(--border)',
    overflow: 'hidden',
  },
  wishlistImage: {
    width: '100%',
    height: '150px',
    objectFit: 'cover',
  },
  wishlistInfo: {
    padding: '12px',
  },
  price: {
    color: '#e5484d',
    fontWeight: '700',
    fontSize: '16px',
  },
  removeWishlist: {
    marginTop: '8px',
    padding: '4px 12px',
    background: '#e5484d',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
  },
};
