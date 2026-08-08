'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Selamat Datang, {user.user_metadata?.name || user.email}!</h1>
      <div style={styles.card}>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>User ID:</strong> {user.id}</p>
        <p><strong>Terdaftar:</strong> {new Date(user.created_at).toLocaleDateString('id-ID')}</p>
        <button onClick={signOut} style={styles.logoutBtn}>Logout</button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '40px 20px',
  },
  title: {
    color: '#fff',
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '20px',
  },
  card: {
    background: '#1a1a2e',
    padding: '24px',
    borderRadius: '12px',
    border: '1px solid #2a2a2a',
    color: '#ccc',
  },
  logoutBtn: {
    marginTop: '16px',
    padding: '10px 24px',
    background: '#e5484d',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
  },
};
