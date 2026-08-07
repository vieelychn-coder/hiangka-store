'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import Navbar from '../../components/Navbar';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      alert('Login berhasil!');
      router.push('/dashboard');
    }
    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>Masuk</h1>
          <p style={styles.subtitle}>Selamat datang kembali di HIANKA</p>
          {error && <p style={styles.error}>{error}</p>}
          <form onSubmit={handleLogin} style={styles.form}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />
            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? 'Loading...' : 'Masuk'}
            </button>
          </form>
          <p style={styles.link}>
            Belum punya akun? <Link href="/register">Daftar</Link>
          </p>
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
  },
  card: {
    background: 'var(--card)',
    padding: '40px',
    borderRadius: '16px',
    maxWidth: '420px',
    width: '100%',
    border: '1px solid var(--border)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
  },
  title: {
    color: 'var(--text)',
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '4px',
    textAlign: 'center',
  },
  subtitle: {
    color: '#888',
    textAlign: 'center',
    marginBottom: '24px',
    fontSize: '14px',
  },
  error: {
    color: '#e5484d',
    background: '#fde8e8',
    padding: '10px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '14px',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  input: {
    padding: '12px 16px',
    background: 'var(--bg)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    color: 'var(--text)',
    fontSize: '16px',
    outline: 'none',
    transition: 'border-color 0.3s',
  },
  inputFocus: {
    borderColor: '#c9a227',
  },
  button: {
    padding: '12px',
    background: 'linear-gradient(135deg, #c9a227, #e5484d)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '8px',
    transition: 'transform 0.2s',
  },
  link: {
    color: '#888',
    textAlign: 'center',
    marginTop: '16px',
    fontSize: '14px',
  },
};
