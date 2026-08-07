'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useTheme } from '../context/ThemeContext';
import styles from '../styles/Navbar.module.css';

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
    <nav className={styles.navbar}>
      <div className={styles.container}>
        {/* BARIS 1: LOGO + THEME TOGGLE */}
        <div className={styles.topRow}>
          <Link href="/" className={styles.logo}>HIANKA</Link>
          <button onClick={toggleTheme} className={styles.themeToggle}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>

        {/* BARIS 2: MENU + LOGIN */}
        <div className={styles.bottomRow}>
          <Link href="/products" className={styles.link}>Produk</Link>
          <Link href="/cart" className={styles.link}>Cart</Link>
          {isLoggedIn ? (
            <Link href="/dashboard" className={styles.link}>Akun</Link>
          ) : (
            <Link href="/login" className={styles.btnLogin}>Masuk</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
