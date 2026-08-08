'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, signOut } = useAuth();

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link href="/" style={styles.logo}>HIANKA</Link>

        <div style={styles.menu}>
          <Link href="/products" style={styles.link}>Produk</Link>
          <Link href="/cart" style={styles.link}>Cart</Link>

          {user ? (
            <>
              <Link href="/dashboard" style={styles.link}>Akun</Link>
              <button onClick={signOut} style={styles.logoutBtn}>
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" style={styles.loginBtn}>
              Masuk
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    background: '#111',
    borderBottom: '1px solid #2a2a2a',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    color: '#c9a227',
    fontWeight: '800',
    fontSize: '22px',
    textDecoration: 'none',
    letterSpacing: '1px',
  },
  menu: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  link: {
    color: '#ccc',
    textDecoration: 'none',
    fontSize: '15px',
    transition: 'color 0.2s',
  },
  loginBtn: {
    background: 'linear-gradient(135deg, #c9a227, #e5484d)',
    color: '#fff',
    padding: '8px 18px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '14px',
  },
  logoutBtn: {
    background: 'transparent',
    border: '1px solid #e5484d',
    color: '#e5484d',
    padding: '6px 14px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.2s',
  },
};
