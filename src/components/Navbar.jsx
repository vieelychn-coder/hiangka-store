'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
        {/* LEFT: Logo */}
        <Link href="/" style={styles.logo}>HIANKA</Link>

        {/* MIDDLE: Desktop Menu */}
        <div style={styles.desktopMenu}>
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

        {/* RIGHT: Mobile Hamburger */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
          style={styles.hamburger}
          aria-label="Toggle menu"
        >
          <span style={styles.hamburgerLine}></span>
          <span style={styles.hamburgerLine}></span>
          <span style={styles.hamburgerLine}></span>
        </button>
      </div>

      {/* MOBILE MENU (overlay) */}
      {isMenuOpen && (
        <div style={styles.mobileMenu}>
          <Link href="/products" style={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>Produk</Link>
          <Link href="/cart" style={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>Cart</Link>
          <button onClick={() => { toggleTheme(); setIsMenuOpen(false); }} style={styles.mobileThemeToggle}>
            {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </button>
          {isLoggedIn ? (
            <Link href="/dashboard" style={styles.mobileBtnLogin} onClick={() => setIsMenuOpen(false)}>Akun</Link>
          ) : (
            <Link href="/login" style={styles.mobileBtnLogin} onClick={() => setIsMenuOpen(false)}>Masuk</Link>
          )}
        </div>
      )}
    </nav>
  );
}

const styles = {
  navbar: {
    background: 'var(--card)',
    borderBottom: '1px solid var(--border)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    transition: 'background 0.3s ease',
    padding: '12px 0',
    minHeight: '64px',
    display: 'flex',
    flexDirection: 'column',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontSize: '24px',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #c9a227, #e5484d)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '-0.5px',
    flexShrink: 0,
  },
  desktopMenu: {
    display: 'flex',
    alignItems: 'center',
    gap: '28px',
  },
  link: {
    color: 'var(--text)',
    fontSize: '15px',
    fontWeight: '500',
    transition: 'color 0.3s',
  },
  themeToggle: {
    background: 'var(--card)',
    border: '1px solid var(--border)',
    padding: '4px 10px',
    borderRadius: '30px',
    fontSize: '18px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    color: 'var(--text)',
    lineHeight: 1,
  },
  btnLogin: {
    padding: '8px 24px',
    background: 'linear-gradient(135deg, #c9a227, #e5484d)',
    color: '#fff',
    border: 'none',
    borderRadius: '999px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'all 0.3s',
  },
  hamburger: {
    display: 'none',
    flexDirection: 'column',
    gap: '5px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
  },
  hamburgerLine: {
    width: '26px',
    height: '2.5px',
    background: 'var(--text)',
    borderRadius: '2px',
    transition: 'all 0.3s ease',
  },
  mobileMenu: {
    display: 'none',
    flexDirection: 'column',
    gap: '16px',
    padding: '20px 24px',
    background: 'var(--card)',
    borderTop: '1px solid var(--border)',
    width: '100%',
  },
  mobileLink: {
    color: 'var(--text)',
    fontSize: '16px',
    fontWeight: '500',
    textDecoration: 'none',
    padding: '8px 0',
  },
  mobileThemeToggle: {
    background: 'var(--card)',
    border: '1px solid var(--border)',
    padding: '10px',
    borderRadius: '8px',
    fontSize: '15px',
    cursor: 'pointer',
    color: 'var(--text)',
    width: '100%',
    textAlign: 'left',
  },
  mobileBtnLogin: {
    padding: '12px',
    background: 'linear-gradient(135deg, #c9a227, #e5484d)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'none',
    textAlign: 'center',
  },
};

// Responsive styles via CSS-in-JS (but we'll add media queries in globals.css)
