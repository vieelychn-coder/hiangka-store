'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <nav className="navbar" style={styles.navbar}>
      <div style={styles.container}>
        <Link href="/" style={styles.logo}>HIANKA</Link>
        <div style={styles.menu}>
          <Link href="/products" style={styles.link}>Produk</Link>
          <Link href="/cart" style={styles.link}>Cart</Link>
          <button onClick={toggleTheme} style={styles.themeToggle}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          {isLoggedIn ? (
            <Link href="/dashboard" style={styles.link}>Akun</Link>
          ) : (
            <Link href="/login" style={styles.btnLogin}>Masuk</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    background: 'var(--card)',
    padding: '12px 0',
    borderBottom: '1px solid var(--border)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    transition: 'background 0.3s ease',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 24px',
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontSize: '28px',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #c9a227, #e5484d)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '-0.5px',
  },
  menu: {
    display: 'flex',
    gap: '28px',
    alignItems: 'center',
  },
  link: {
    color: 'var(--text)',
    fontSize: '15px',
    fontWeight: '500',
    transition: 'color 0.3s',
    padding: '4px 0',
  },
  themeToggle: {
    background: 'var(--card)',
    border: '1px solid var(--border)',
    padding: '6px 12px',
    borderRadius: '30px',
    fontSize: '18px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    color: 'var(--text)',
  },
  btnLogin: {
    padding: '8px 24px',
    background: 'linear-gradient(135deg, #c9a227, #e5484d)',
    color: '#fff',
    border: 'none',
    borderRadius: '30px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'all 0.3s',
  },
};
