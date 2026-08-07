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
          <button onClick={toggleTheme} className="theme-toggle">
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
          {isLoggedIn ? (
            <Link href="/dashboard" style={styles.link}>Akun</Link>
          ) : (
            <Link href="/login" style={styles.link}>Masuk</Link>
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
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontSize: '22px',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #c9a227, #e5484d)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '-0.5px',
  },
  menu: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
  },
  link: {
    color: 'var(--text)',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'color 0.3s',
  },
};
