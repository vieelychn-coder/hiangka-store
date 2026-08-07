'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
    <nav style={styles.navbar}>
      <div style={styles.container}>
        <Link href="/" style={styles.logo}>HIANKA</Link>
        <div style={styles.menu}>
          <Link href="/products" style={styles.link}>Produk</Link>
          <Link href="/cart" style={styles.link}>Cart</Link>
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
    background: '#fff',
    padding: '12px 0',
    borderBottom: '1px solid #e5e5e5',
    position: 'sticky',
    top: 0,
    zIndex: 100,
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
    color: '#1a1a2e',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'color 0.3s',
  },
};
