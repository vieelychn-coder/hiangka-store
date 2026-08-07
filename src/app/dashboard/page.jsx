'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }
      setUser(session.user);
      setLoading(false);
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <p style={styles.text}>Loading...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Welcome, {user?.email}!</h1>
        <p style={styles.subtitle}>Anda berhasil login ke HIANKA Store</p>
        <div style={styles.userInfo}>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>User ID:</strong> {user?.id}</p>
          <p><strong>Role:</strong> {user?.role}</p>
        </div>
        <button onClick={handleLogout} style={styles.button}>Logout</button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0a0a0a',
    padding: '20px',
  },
  card: {
    background: '#1a1a2e',
    padding: '40px',
    borderRadius: '16px',
    maxWidth: '450px',
    width: '100%',
    textAlign: 'center',
    border: '1px solid #2a2a2a',
  },
  title: {
    color: '#c9a227',
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '8px',
  },
  subtitle: {
    color: '#888',
    fontSize: '16px',
    marginBottom: '24px',
  },
  userInfo: {
    textAlign: 'left',
    background: '#0a0a0a',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px',
    color: '#ccc',
  },
  button: {
    padding: '12px',
    background: '#e5484d',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    width: '100%',
  },
  text: {
    textAlign: 'center',
    color: '#888',
  },
};
