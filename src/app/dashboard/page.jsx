'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '../../lib/supabase';
import Navbar from '../../components/Navbar';
import useWindowSize from '../../hooks/useWindowSize';

export default function DashboardPage() {
  const router = useRouter();
  const { width } = useWindowSize();
  const isMobile = width < 768;

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
      try {
        await Promise.all([
          fetchOrders(session.user.id),
          fetchWishlist(session.user.id),
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, []);

  const fetchOrders = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setOrders(data || []);
      setStats(prev => ({ ...prev, orders: data?.length || 0 }));
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    }
  };

  const fetchWishlist = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('wishlist')
        .select('*, products(*)')
        .eq('user_id', userId);
      if (error) throw error;
      setWishlist(data || []);
      setStats(prev => ({ ...prev, wishlist: data?.length || 0 }));
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      setWishlist([]);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
        <Navbar />
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text)' }}>Loading...</div>
      </div>
    );
  }

  // ===== STYLES RESPONSIVE =====
  const styles = {
    page: {
      minHeight: '100vh',
      background: 'var(--bg)',
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: isMobile ? '16px' : '24px 16px',
      display: isMobile ? 'flex' : 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      gap: isMobile ? '16px' : '24px',
      alignItems: 'flex-start',
    },
    sidebar: {
      width: isMobile ? '100%' : '260px',
      flexShrink: 0,
      background: 'var(--card)',
      borderRadius: '16px',
      border: '1px solid var(--border)',
      padding: isMobile ? '16px' : '24px',
      position: isMobile ? 'relative' : 'sticky',
      top: isMobile ? '0' : '80px',
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
      wordBreak: 'break-all',
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
      transition: 'all 0.2s',
      width: '100%',
    },
    navItemActive: {
      background: 'linear-gradient(135deg, #c9a227, #e5484d)',
      color: '#fff',
    },
    logoutBtn: {
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
      transition: 'all 0.2s',
    },
    main: {
      flex: 1,
      width: isMobile ? '100%' : 'auto',
      minWidth: 0,
    },
    title: {
      color: 'var(--text)',
      fontSize: isMobile ? '20px' : '24px',
      fontWeight: '700',
      marginBottom: '20px',
    },
    card: {
      background: 'var(--card)',
      padding: '24px',
      borderRadius: '12px',
      border: '1px solid var(--border)',
    },
    userId: {
      wordBreak: 'break-all',
      overflowWrap: 'anywhere',
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
    pending: {
      background: '#fef3c7',
      color: '#b45309',
    },
    delivered: {
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
      gridTemplateColumns: isMobile ? 'repeat(auto-fill, minmax(140px, 1fr))' : 'repeat(auto-fill, minmax(160px, 1fr))',
      gap: isMobile ? '12px' : '16px',
    },
    wishlistCard: {
      background: 'var(--card)',
      borderRadius: '12px',
      border: '1px solid var(--border)',
      overflow: 'hidden',
    },
    wishlistImageWrapper: {
      position: 'relative',
      width: '100%',
      aspectRatio: '1',
      background: 'var(--bg)',
    },
    wishlistImage: {
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
    empty: {
      textAlign: 'center',
      padding: '40px',
      color: '#888',
      background: 'var(--card)',
      borderRadius: '12px',
      border: '1px solid var(--border)',
    },
  };

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        {/* Sidebar */}
        <aside style={styles.sidebar}>
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
            <button onClick={handleLogout} style={styles.logoutBtn}>
              Logout
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main style={styles.main}>
          {activeTab === 'profile' && (
            <section>
              <h2 style={styles.title}>My Profile</h2>
              <div style={styles.card}>
                <p style={{ color: 'var(--text)' }}><strong>Email:</strong> {user?.email}</p>
                <p style={styles.userId}><strong>User ID:</strong> {user?.id}</p>
                <p style={{ color: 'var(--text)' }}><strong>Joined:</strong> {new Date(user?.created_at).toLocaleDateString('en-US')}</p>
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
            </section>
          )}

          {activeTab === 'orders' && (
            <section>
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
                        ...(order.status === 'delivered' ? styles.delivered : styles.pending)
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
            </section>
          )}

          {activeTab === 'wishlist' && (
            <section>
              <h2 style={styles.title}>My Wishlist</h2>
              {wishlist.length === 0 ? (
                <div style={styles.empty}>Wishlist is empty.</div>
              ) : (
                <div style={styles.wishlistGrid}>
                  {wishlist.map((item) => {
                    const imageUrl = item.products?.images?.[0] || 
                                    item.products?.image_url || 
                                    `https://picsum.photos/seed/${item.product_id}/200/200`;
                    return (
                      <div key={item.id} style={styles.wishlistCard}>
                        <div style={styles.wishlistImageWrapper}>
                          <Image 
                            src={imageUrl}
                            alt={item.products?.name || 'Product'}
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                        <div style={styles.wishlistInfo}>
                          <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>
                            {item.products?.name || 'Product'}
                          </h4>
                          <p style={styles.price}>Rp {item.products?.price?.toLocaleString('id-ID') || '0'}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
